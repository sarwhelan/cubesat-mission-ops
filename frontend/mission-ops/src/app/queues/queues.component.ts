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
        result.executionDate.month,
        result.executionDate.day,
        result.executionTime.hour,
        result.executionTime.minute,
        result.executionTime.second
      ));
      var createQtc = (self, transID, execID) => {
        var newQtc = new QueuedTelecommand(
          parseInt(userID),
          execID,
          transID,
          result.telecommandID,
          result.priorityLevel,
          executionTime,
          result.commandParams,
        );
        return self.queuedTelecommandService.createQueuedTelecommand(
          newQtc
        );
      }
      this.calculatePassIDs(result.telecommandID, executionTime, createQtc);
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
      var executionTime = new Date(Date.UTC(
        result.executionDate.year,
        result.executionDate.month,
        result.executionDate.day,
        result.executionTime.hour,
        result.executionTime.minute,
        result.executionTime.second
      ));

      this.presetTelecommandService.getPresetTelecommands(result.telecommandBatchID)
        .subscribe(ptcs => {
          var createQtc = (self, transID, execID) => {
            var pQtcBatch = [];
            ptcs.forEach(ptc => {
              pQtcBatch.push(new QueuedTelecommand(
                parseInt(userID),
                execID,
                transID,
                ptc.telecommandID,
                ptc.priorityLevel,
                executionTime,
                ptc.commandParameters,
              ));
            });
            return self.queuedTelecommandService.createBatchQueuedTelecommands(
              pQtcBatch
            );
          }
          this.calculatePassIDs(result.telecommandID, executionTime, createQtc);
        });
    }).catch((error) => {
      // Modal closed without submission
      console.log(error);
    });
  }

  /**
   * Must have at least one active pass and pass limits must exist.
   */
  calculatePassIDs(telecommandID: number, executionTime: Date, qtcCreation: (self, transID, execID) => Observable<any>) : void
  {
    var maxBandwidth = this.passLimits.find(x => x.name == "bandwidthUsage").maxValue;
    var maxPower = this.passLimits.find(x => x.name == "powerConsumption").maxValue;
    var activeTelecommand = this.telecommands.find(x => x.telecommandID == telecommandID);
    var activePasses = this.passes.filter(x => !x.passHasOccurred);

    let passTransmissionSums = this.passService.getPassTransmissionSums();
    let passExecutionSums = this.passService.getPassExecutionSums();
    forkJoin([passTransmissionSums, passExecutionSums])
      .pipe(mergeMap(results => {
        var calcTransID, calcExecID;
        // Transmission sum
        if (!results[0]) {
          calcTransID = activePasses[0].passID;
        }
        for (var i = 0; i < activePasses.length; i++) {
          var passSum = results[0].find(x => x.passID == activePasses[i].passID);

          if (!passSum || (parseInt(passSum.sumBandwidth) + activeTelecommand.bandwidthUsage <= maxBandwidth 
            && parseInt(passSum.sumPower) + activeTelecommand.powerConsumption <= maxPower))
          {
            calcTransID = activePasses[i].passID;
            break;
          }
        }
        if (!calcTransID) {
          // TODO: if it fits in no existing passes, create a new pass and plop this telecommand in there.
          calcTransID = 1;
        }

        // TODO: Execution queuing
        calcExecID = 1;
        return qtcCreation(this, calcTransID, calcExecID).pipe(
          map(_ => [calcExecID, calcTransID])
        );
      }))
      .subscribe(([execID, transID]) => {
        if (this.transmissionQueue) {
          this.getPasses(this.passes.find(x => x.passID == transID));
        } else {
          this.getPasses(this.passes.find(x => x.passID == execID));
        }
      });
  }
}
