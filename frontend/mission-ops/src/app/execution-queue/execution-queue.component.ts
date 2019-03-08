import { Component, OnInit, Input } from '@angular/core';
import { Pass } from '../../classes/pass';
import { PassService } from '../services/pass/pass.service';
import { QueuedTelecommand } from '../../classes/queuedTelecommand';
import { QueuedTelecommandService } from '../services/queuedTelecommand/queued-telecommand.service';

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
  @Input() passes: Pass[];
  private selectedPass: Pass;
  private newPassEstimatedPassDateTime: Date;
  private passQueuedTelecommands: QueuedTelecommand[];
  
  constructor(private passService: PassService, private queuedTelecommandService: QueuedTelecommandService) { }

  ngOnInit() {
  }

  onSelect(pass: Pass): void {
    this.selectedPass = pass;
    this.queuedTelecommandService.getQueuedTelecommands().subscribe(queuedTelecommands => {
      this.passQueuedTelecommands = queuedTelecommands;
      //this.passQueuedTelecommands.push(new QueuedTelecommand(1, 1))
    });
  }

  addPass() :void{
    this.passService.createPass(new Pass(new Date()));
  }
}
