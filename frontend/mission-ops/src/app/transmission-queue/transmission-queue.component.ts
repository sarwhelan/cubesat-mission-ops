import { Component, OnInit, Input } from '@angular/core';
import { Pass } from '../../classes/pass';
import { PassService } from '../services/pass/pass.service';
import { QueuedTelecommandService } from '../services/queuedTelecommand/queued-telecommand.service';
import { QueuedTelecommand } from 'src/classes/queuedTelecommand';

@Component({
  selector: 'app-transmission-queue',
  templateUrl: './transmission-queue.component.html',
  styleUrls: ['./transmission-queue.component.scss']
})
export class TransmissionQueueComponent implements OnInit {

  /**
   * The passes of the CubeSat. Contains information about the commands to be transmitted.
   * 
   * @type {Pass[]}
   * @memberof TransmissionQueueComponent
   */
  @Input() 
  passes: Pass[];
  private selectedPass: Pass;
  private newPassEstimatedPassDateTime: Date;
  private passQueuedTelecommands: QueuedTelecommand[];

  constructor(private passService: PassService, private queuedTelecommandService: QueuedTelecommandService) { }

  ngOnInit() {
  }

  onSelect(pass: Pass) : void
  {
    this.selectedPass = pass;
    this.queuedTelecommandService.getQueuedTelecommandsTransmission(this.selectedPass)
      .subscribe(qtc => this.passQueuedTelecommands = qtc);
  }
}
