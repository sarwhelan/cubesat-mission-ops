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
import { Subject } from 'rxjs';

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

  private reloadPass: Subject<void> = new Subject<void>();

  constructor(private passService: PassService,
    private modalService: NgbModal,
    private telecommandService: TelecommandService,
    private queuedTelecommandService: QueuedTelecommandService,
    private auth: AuthService) { }

  ngOnInit() {
    this.executionQueue = true;
    this.transmissionQueue = false;
    this.getPasses();
    this.getTelecommands();
  }

  addPass() : void{
    this.passService.createPass(new Pass(new Date()))
      .subscribe(pass => this.getPasses());
  }

  selectExecution(): void{    
    this.executionQueue = true;
    this.transmissionQueue = false;
  }

  selectTransmission(): void{    
    this.executionQueue = false;
    this.transmissionQueue = true;
  }

  getPasses() : void{    
    this.passService.getPasses()
      .subscribe(passes => {
        this.passes = passes;
        this.reloadPass.next();
      });
  }

  getTelecommands() : void
  {
    this.telecommandService.getTelecommands()
      .subscribe(tcs => this.telecommands = tcs);
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
      var executionPassID = this.calculateExecutionPassID(executionTime);
      var transmissionPassID = this.calculateTransmissionPassID();
      console.log(`${userID} ${executionTime} ${executionPassID} ${transmissionPassID}`)
      this.queuedTelecommandService.createQueuedTelecommands(
        new QueuedTelecommand(
          parseInt(userID),
          executionPassID,
          transmissionPassID,
          result.telecommandID,
          result.priorityLevel,
          executionTime
        )
      ).subscribe(qtc => this.getPasses());
    }).catch((error) => {
      // Modal closed without submission
      console.log(error);
    });
    
  }

  /**
   * Must have at least one active pass.
   */
  calculateTransmissionPassID() : number
  {
    var activePasses = this.passes.filter(x => !x.passHasOccurred);
    // TODO: Need more information in Pass - has it reached capacity?
    return activePasses[0].passID;
  }

  calculateExecutionPassID(executionTime : Date) : number
  {
    // TODO: Calculate ID based on given execution time.
    return 1;
  }
}
