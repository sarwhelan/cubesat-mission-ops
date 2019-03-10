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
import { concatMap } from 'rxjs/operators';
import { ExecutionQueueComponent } from '../execution-queue/execution-queue.component';
import { PassLimitService } from '../services/pass-limit/pass-limit.service';
import { PassLimit } from 'src/classes/pass-limit';

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
  passLimits: PassLimit[];
  selectedPass: Pass;
  calculatedTransmissionID: number;
  calculatedExecutionID: number;

  private reloadPass: Subject<Pass> = new Subject<Pass>();

  constructor(private passService: PassService,
    private modalService: NgbModal,
    private telecommandService: TelecommandService,
    private queuedTelecommandService: QueuedTelecommandService,
    private passLimitService: PassLimitService,
    private auth: AuthService) { }

  ngOnInit() {
    this.executionQueue = true;
    this.transmissionQueue = false;
    this.getPasses();
    this.getTelecommands();
    this.getPassLimits();
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

  getPassLimits() : void
  {
    this.passLimitService.getPassLimits()
      .subscribe(pls => this.passLimits = pls);
  }

  promptAddQueuedTelecommand() : void
  {
    const modalRef = this.modalService.open(CreateQueuedTelecommandComponent);
    modalRef.componentInstance.isEditing = false;
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
      var createQtc = (self) => {
        var newQtc = new QueuedTelecommand(
          parseInt(userID),
          self.calculatedExecutionID,
          self.calculatedTransmissionID,
          result.telecommandID,
          result.priorityLevel,
          executionTime
        );
        console.log(newQtc);
        return self.queuedTelecommandService.createQueuedTelecommands(
          newQtc
        );
      }
      this.calculatePassIDs(result.telecommandID, executionTime, createQtc);
    }).catch((error) => {
      // Modal closed without submission
      console.log(error);
    });
  }

  /**
   * Must have at least one active pass and pass limits must exist.
   */
  calculatePassIDs(telecommandID: number, executionTime: Date, qtcCreation: (self) => Observable<any>) : void
  {
    var maxBandwidth = this.passLimits.find(x => x.name == "bandwidthUsage").maxValue;
    var maxPower = this.passLimits.find(x => x.name == "powerConsumption").maxValue;
    var activeTelecommand = this.telecommands.find(x => x.telecommandID == telecommandID);
    var activePasses = this.passes.filter(x => !x.passHasOccurred);

    let passTransmissionSums = this.passService.getPassTransmissionSums();
    let passExecutionSums = this.passService.getPassExecutionSums();
    forkJoin([passTransmissionSums, passExecutionSums])
      .pipe(concatMap(results => {
        // Transmission sum
        if (!results[0]) {
          this.calculatedTransmissionID = activePasses[0].passID;
        }
        for (var i = 0; i < activePasses.length; i++) {
          var passSum = results[0].find(x => x.passID == activePasses[i].passID);
          //console.log(" pass sum is " + passSum.bandwidthUsage + "for" + pass.passID);
          if (passSum) {
            console.log(activeTelecommand.bandwidthUsage + " + " + passSum.sumBandwidth + " < " + maxBandwidth);
            console.log(activeTelecommand.powerConsumption + " + " + passSum.sumPower + " < " + maxPower);
          } else {
            console.log('boo ' + activePasses[i].passID);
          }
          if (passSum && parseInt(passSum.sumBandwidth) + activeTelecommand.bandwidthUsage <= maxBandwidth 
            && parseInt(passSum.sumPower) + activeTelecommand.powerConsumption <= maxPower)
          {
            this.calculatedTransmissionID = activePasses[i].passID;
            break;
          }
        }
        if (!this.calculatedTransmissionID) {
          // TODO: if it fits in no existing passes, create a new pass and plop this telecommand in there.
          this.calculatedTransmissionID = 1;
        }
        console.log(this.calculatedTransmissionID);
        // TODO: Execution queuing
        this.calculatedExecutionID = 1;
        return qtcCreation(this);
      }))
      .subscribe(results => {
        
        if (this.transmissionQueue) {
          this.getPasses(this.passes.find(x => x.passID == this.calculatedTransmissionID));
        } else {
          this.getPasses(this.passes.find(x => x.passID == this.calculatedExecutionID));
        }
      });
  }
}
