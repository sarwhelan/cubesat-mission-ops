import { Component, OnInit } from '@angular/core';
import { Pass } from '../../classes/pass';
import { PassService } from '../services/pass/pass.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateQueuedTelecommandComponent } from '../create-queued-telecommand/create-queued-telecommand.component';
import { TelecommandService } from '../services/telecommand/telecommand.service';
import { Telecommand } from 'src/classes/telecommand';
import { QueuedTelecommandService } from '../services/queuedTelecommand/queued-telecommand.service';
import { AuthService } from '../services/auth/auth.service';
import { QueuedTelecommand } from 'src/classes/queuedTelecommand';
import { Subject, Observable, Subscription, forkJoin } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { ExecutionQueueComponent } from '../execution-queue/execution-queue.component';
import { PassLimitService } from '../services/pass-limit/pass-limit.service';
import { PassLimit } from 'src/classes/pass-limit';
import { TelecommandBatchService } from '../services/telecommandBatch/telecommand-batch.service';
import { TelecommandBatch } from 'src/classes/telecommandBatch';
import { PresetTelecommandService } from '../services/presetTelecommand/preset-telecommand.service';
import { PassSum } from 'src/classes/pass-sum';

@Component({
  selector: 'app-queues',
  templateUrl: './queues.component.html',
  styleUrls: ['./queues.component.scss']
})
export class QueuesComponent implements OnInit {

  executionQueue: boolean;
  transmissionQueue: boolean;
  passes: Pass[];
  telecommands: Telecommand[];
  telecommandBatches: TelecommandBatch[];
  passLimits: PassLimit[];
  selectedPass: Pass;
  calculatedTransmissionID: number;
  calculatedExecutionID: number;

  sumTransmissionResults : PassSum[];
  sumExecutionResults : PassSum[];

  private reloadPass: Subject<Pass> = new Subject<Pass>();

  constructor(private passService: PassService,
    private modalService: NgbModal,
    private telecommandService: TelecommandService,
    private telecommandBatchService: TelecommandBatchService,
    private presetTelecommandService: PresetTelecommandService,
    private queuedTelecommandService: QueuedTelecommandService,
    private passLimitService: PassLimitService,
    private auth: AuthService) { }

  ngOnInit() {
    this.executionQueue = true;
    this.transmissionQueue = false;
    this.getPasses();
    this.getTelecommands();
    this.getPassLimits();
    this.getTelecommandBatches();
  }

  addPass() : void{
    var newPass = new Pass(new Date());
    this.passService.createPass(newPass)
      .subscribe(pass => {
        this.getPasses();
        this.reloadPass.next(newPass);
      });
  }

  toggleActiveQueue() : void
  {
    this.executionQueue = !this.executionQueue;
    this.reloadPass.next(this.selectedPass);
  }

  selectExecution(): void{  
    console.log('exec');
    this.executionQueue = true;
    this.transmissionQueue = false;
  }

  selectTransmission(): void{  
    console.log('trans');
    this.executionQueue = false;
    this.transmissionQueue = true;
  }

  onSelect(pass: Pass) : void
  {
    this.selectedPass = pass;
    this.reloadPass.next(pass);
  }

  getPasses(pass?: Pass) : void{    
    this.passService.getPasses()
      .subscribe(passes => {
        this.passes = passes;
        if (pass) {
          this.reloadPass.next(pass);
        }
      });
  }

  getTelecommands() : void
  {
    this.telecommandService.getTelecommands()
      .subscribe(tcs => this.telecommands = tcs);
  }

  getTelecommandBatches() : void
  {
    this.telecommandBatchService.getTelecommandBatches()
      .subscribe(tbs => this.telecommandBatches = tbs);
  }

  getPassLimits() : void
  {
    this.passLimitService.getPassLimits()
      .subscribe(pls => this.passLimits = pls);
  }

  promptAddQueuedTelecommand() : void
  {
    const modalRef = this.modalService.open(CreateQueuedTelecommandComponent);
    modalRef.componentInstance.isBatch = false;
    modalRef.componentInstance.telecommands = this.telecommands;
    modalRef.result.then((result) => {
      var user = this.auth.getCurrentUser();
      var userID = user ? user.id : "456";
      var executionTime = new Date(Date.UTC(
        result.executionDate.year,
        result.executionDate.month-1,
        result.executionDate.day,
        result.executionTime.hour,
        result.executionTime.minute,
        result.executionTime.second
      ));
      var createQtc = (self, maxBandwidth, maxPower, activePasses) => {
        var activeTelecommand = this.telecommands.find(x => x.telecommandID == result.telecommandID);
        var [transID, execID] = self.calculatePassIDs(activePasses, activeTelecommand, executionTime, maxBandwidth, maxPower)
        var newQtc = new QueuedTelecommand(
          execID,
          transID,
          parseInt(userID),
          result.telecommandID,
          result.priorityLevel,
          executionTime,
          result.commandParams,
        );
        return self.queuedTelecommandService.createBatchQueuedTelecommands(
          [Object.values(newQtc)]
        );
      }
      this.createQueuedTelecommands(createQtc);
    }).catch((error) => {
      // Modal closed without submission
      console.log(error);
    });
  }

  promptAddQueuedTelecommandBatch() : void
  {
    const modalRef = this.modalService.open(CreateQueuedTelecommandComponent);
    modalRef.componentInstance.isBatch = true;
    modalRef.componentInstance.telecommandBatches = this.telecommandBatches;
    modalRef.result.then((result) => {
      var user = this.auth.getCurrentUser();
      var userID = user ? user.id : "456";
      console.log(result.executionDate, result.executionTime);
      var executionTime = new Date(Date.UTC(
        result.executionDate.year,
        result.executionDate.month-1, // Indexed from 0. Why. WHY.
        result.executionDate.day,
        result.executionTime.hour,
        result.executionTime.minute,
        result.executionTime.second
      ));

      this.presetTelecommandService.getPresetTelecommands(result.telecommandBatchID)
        .subscribe(ptcs => {
          var createQtc = (self, maxBandwidth, maxPower, activePasses) => {
            var pQtcBatch = [];
            ptcs.forEach(ptc => {
              var telecommandExecutionTime = new Date(executionTime.getTime());
              telecommandExecutionTime.setUTCDate(executionTime.getUTCDate() + ptc.dayDelay);
              telecommandExecutionTime.setUTCHours(executionTime.getUTCHours() + ptc.hourDelay);
              telecommandExecutionTime.setUTCMinutes(executionTime.getUTCMinutes() + ptc.minuteDelay);
              telecommandExecutionTime.setUTCSeconds(executionTime.getUTCSeconds() + ptc.secondDelay);
              var activeTelecommand = this.telecommands.find(x => x.telecommandID == ptc.telecommandID);
              var [transID, execID] = self.calculatePassIDs(activePasses, activeTelecommand, telecommandExecutionTime, maxBandwidth, maxPower);
              pQtcBatch.push(Object.values(new QueuedTelecommand(
                execID,
                transID,
                parseInt(userID),
                ptc.telecommandID,
                ptc.priorityLevel,
                telecommandExecutionTime,
                ptc.commandParameters,
              )));
            });
            return self.queuedTelecommandService.createBatchQueuedTelecommands(
              pQtcBatch
            );
          }
          this.createQueuedTelecommands(createQtc);
        });
    }).catch((error) => {
      // Modal closed without submission
      console.log(error);
    });
  }

  /**
   * Must have at least one active pass and pass limits must exist.
   */
  createQueuedTelecommands(qtcCreation: (self, maxB: number, maxP: number, activeP: Pass[]) => Observable<any>) : void
  {
    var maxBandwidth = this.passLimits.find(x => x.name == "bandwidthUsage").maxValue;
    var maxPower = this.passLimits.find(x => x.name == "powerConsumption").maxValue;
    var activePasses = this.passes.filter(x => !x.passHasOccurred);

    let passTransmissionSums = this.passService.getPassTransmissionSums();
    let passExecutionSums = this.passService.getPassExecutionSums();
    forkJoin([passTransmissionSums, passExecutionSums])
      .pipe(mergeMap(results => {
        this.sumTransmissionResults = results[0];
        this.sumExecutionResults = results[1];
        return qtcCreation(this, maxBandwidth, maxPower, activePasses);
      }))
      .subscribe(() => {
        this.getPasses();
      });
  }

  calculatePassIDs(activePasses: Pass[], activeTelecommand: Telecommand, executionTime: Date, maxBandwidth: number, maxPower: number) : [number, number]
  {
    var calcTransID, calcExecID;
    // Transmission sum
    if (!this.sumTransmissionResults) {
      calcTransID = activePasses[0].passID;
    } 
    else {
      for (var i = 0; i < activePasses.length; i++) {
        var passSum = this.sumTransmissionResults.find(x => x.passID == activePasses[i].passID);

        if (!passSum || (passSum.sumBandwidth + activeTelecommand.bandwidthUsage <= maxBandwidth 
          && passSum.sumPower + activeTelecommand.powerConsumption <= maxPower))
        {
          calcTransID = activePasses[i].passID;
          if (!passSum) {
            console.log('pushed', activeTelecommand);
            this.sumTransmissionResults.push({passID: calcTransID, sumBandwidth: activeTelecommand.bandwidthUsage, sumPower: activeTelecommand.powerConsumption});
          }
          break;
        }
      }
    }
    if (!calcTransID) {
      // TODO: if it fits in no existing passes, create a new pass and plop this telecommand in there.
      calcTransID = 1;
    }

    // TODO: Execution queuing
    calcExecID = 1;
    console.log(this.sumTransmissionResults, calcTransID);
    this.sumTransmissionResults.find(x => x.passID == calcTransID).sumBandwidth += activeTelecommand.bandwidthUsage;
    this.sumTransmissionResults.find(x => x.passID == calcTransID).sumPower += activeTelecommand.powerConsumption;
    if (calcTransID != calcExecID) {
      this.sumExecutionResults.find(x => x.passID == calcExecID).sumBandwidth += activeTelecommand.bandwidthUsage;
      this.sumExecutionResults.find(x => x.passID == calcExecID).sumPower += activeTelecommand.powerConsumption;
    }
    return [calcTransID, calcExecID];
  }
}
