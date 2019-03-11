import { Component, OnInit, Input } from '@angular/core';
import { Pass } from '../../classes/pass';
import { PassService } from '../services/pass/pass.service';
import { QueuedTelecommand } from '../../classes/queuedTelecommand';
import { QueuedTelecommandService } from '../services/queuedTelecommand/queued-telecommand.service';
import { Observable } from 'rxjs';
import { Telecommand } from 'src/classes/telecommand';

@Component({
  selector: 'app-execution-queue',
  templateUrl: './execution-queue.component.html',
  styleUrls: ['./execution-queue.component.scss']
})
export class ExecutionQueueComponent implements OnInit {
  
  /**
   * The passes of the CubeSat. Contains information about the commands to be executed
   *
   * @type {Pass[]}
   * @memberof ExecutionQueueComponent
   */
  @Input()
  events: Observable<Pass>;
  private selectedPass: Pass;
  private passQueuedTelecommands: QueuedTelecommand[];
  @Input() telecommands: Telecommand[];

  private reloadPassSubscription: any;
  
  constructor(private queuedTelecommandService: QueuedTelecommandService) { }

  ngOnInit() {
    this.reloadPassSubscription = this.events.subscribe(pass => this.onSelect(pass));
  }

  onSelect(pass: Pass): void {
    if (!pass) return;
    this.selectedPass = pass;
    this.queuedTelecommandService.getQueuedTelecommandsExecution(this.selectedPass).subscribe(queuedTelecommands => {
      this.passQueuedTelecommands = queuedTelecommands;
    });
  }

  reloadQueuedTelecommands(){
    this.queuedTelecommandService.getQueuedTelecommandsExecution(this.selectedPass)
      .subscribe(qtc => this.passQueuedTelecommands = qtc);
  }

  ngOnDestroy() {
    this.reloadPassSubscription.unsubscribe();
  }
}
