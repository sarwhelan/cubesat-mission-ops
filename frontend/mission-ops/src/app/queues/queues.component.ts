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
import { CreatePassComponent } from '../create-pass/create-pass.component';
const dateFormat = require('dateformat');

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

  constructor(private passService: PassService,
    private modalService: NgbModal,
    private telecommandService: TelecommandService,
    private telecommandBatchService: TelecommandBatchService,
    private presetTelecommandService: PresetTelecommandService,
    private queuedTelecommandService: QueuedTelecommandService,
    private passLimitService: PassLimitService,
    private auth: AuthService) { }

  ngOnInit() {
    this.executionQueue = false;
    this.transmissionQueue = true;
    this.getPasses();
    this.getTelecommands();
    this.getPassLimits();
    this.getTelecommandBatches();
  }

  getFormatedDate(unformatedDate: Date)
  {
    return dateFormat(unformatedDate, "dddd, mmmm dS, yyyy, HH:MM:ss");
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
  }

  getPasses() : void{   
    this.selectedPass = null; 
    this.passService.getPasses()
      .subscribe(passes => {
        this.passes = passes;
      });
  }

  getTelecommands() : void
  {
    this.telecommandService.getTelecommands()
      .subscribe(tcs => {
        this.telecommands = tcs;
      });
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

  promptAddPass() : void{
    const modalRef = this.modalService.open(CreatePassComponent);
    modalRef.result.then((result) => {
      var newPassDate = new Date(Date.UTC(
        result.passDate.year,
        result.passDate.month-1,
        result.passDate.day,
        result.passTime.hour,
        result.passTime.minute,
        result.passTime.second,
      ));
      var newPass = new Pass(newPassDate);
      this.passService.createPass(newPass)
        .subscribe(pass => {
          this.getPasses();
        });
    }).catch((error) => {
      // Modal closed without submission
      console.log(error);
    });
  }

  promptAddQueuedTelecommand() : void
  {
    const modalRef = this.modalService.open(CreateQueuedTelecommandComponent);
    modalRef.componentInstance.isBatch = false;
    modalRef.componentInstance.telecommands = this.telecommands;
    modalRef.result.then((result) => {
      var user = this.auth.getCurrentUser();
      var userID;
      if (!user) {
        // Not logged in; should not be able to add to the queue.
        console.log('User not logged in, cannot add to queue');
        userID = "456";
      } else {
        userID = user.id;
        console.log(user.id);
      }
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
          userID,
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
      var userID;
      if (!user) {
        // Not logged in; should not be able to add to the queue.
        console.log('User not logged in, cannot add to queue');
        userID = "e6edfc52-b80d-4163-8e0b-b306715270f9";
      } else {
        userID = user.id;
        console.log(user.id);
      }
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
                userID,
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
    
    // Execution
    if (!this.sumExecutionResults) {
      calcExecID = activePasses[0].passID;
    } 
    else {
      //var sortedActivePassByTime = [...activePasses].sort((a,b) => (a.estimatedPassDateTime.getTime() > b.estimatedPassDateTime.getTime()) ? 1 : -1);
      for (var i = 0; i < activePasses.length; i++) {
        if (executionTime.getTime() > new Date(activePasses[i].estimatedPassDateTime).getTime()) continue;
        if (i == 0) {
          console.log('no pass exists to execute this command');
          break;
        }
        var passSum = this.sumExecutionResults.find(x => x.passID == activePasses[i-1].passID);

        // Limit passes on power.
        if (!passSum || passSum.sumPower + activeTelecommand.powerConsumption <= maxPower)
        {
          calcExecID = activePasses[i].passID;
          if (!passSum) {
            console.log('pushed from exec', activeTelecommand);
            this.sumExecutionResults.push({passID: calcExecID, sumBandwidth: activeTelecommand.bandwidthUsage, sumPower: activeTelecommand.powerConsumption});
          }
          break;
        } else {
          console.log('THROW ERROR: pass capacity reached');
          break;
        }
      }
    }
    if (!calcExecID) {
      // TODO: if it fits in no existing passes, create a new pass and plop this telecommand in there.
      calcExecID = 1;
    }

    // Transmission
    if (!this.sumExecutionResults) {
      calcTransID = activePasses[0].passID;
    }
    else {
      for (var i = 0; i < activePasses.length; i++) {
        var passSum = this.sumTransmissionResults.find(x => x.passID == activePasses[i].passID);

        // Limit passes on bandwidth.
        if (!passSum || passSum.sumBandwidth + activeTelecommand.bandwidthUsage <= maxBandwidth)
        {
          calcTransID = activePasses[i].passID;
          if (!passSum) {
            console.log('pushed from trans', activeTelecommand);
            this.sumTransmissionResults.push({passID: calcTransID, sumBandwidth: activeTelecommand.bandwidthUsage, sumPower: activeTelecommand.powerConsumption});
          }
          break;
        }
      }
      if (!calcTransID) {
        // TODO: if it fits in no existing passes, create a new pass and plop this telecommand in there.
        calcTransID = 1;
      }
    }

    console.log(calcTransID, calcExecID);
    this.sumTransmissionResults.find(x => x.passID == calcTransID).sumBandwidth += activeTelecommand.bandwidthUsage;
    this.sumTransmissionResults.find(x => x.passID == calcTransID).sumPower += activeTelecommand.powerConsumption;
    this.sumExecutionResults.find(x => x.passID == calcExecID).sumBandwidth += activeTelecommand.bandwidthUsage;
    this.sumExecutionResults.find(x => x.passID == calcExecID).sumPower += activeTelecommand.powerConsumption;

    return [calcTransID, calcExecID];
  }
}
