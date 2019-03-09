import { Component, OnInit, Input } from '@angular/core';
import { Pass } from '../../classes/pass';
import { PassService } from '../services/pass/pass.service';
import { QueuedTelecommandService } from '../services/queuedTelecommand/queued-telecommand.service';
import { QueuedTelecommand } from 'src/classes/queuedTelecommand';
import { Observable } from 'rxjs';

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

  @Input()
  events: Observable<void>;
  private selectedPass: Pass;
  private newPassEstimatedPassDateTime: Date;
  private passQueuedTelecommands: QueuedTelecommand[];

  private reloadPassSubscription: any;

  constructor(private passService: PassService, private queuedTelecommandService: QueuedTelecommandService) { }

  ngOnInit() {
    this.reloadPassSubscription = this.events.subscribe(() => this.onPassReload());
  }

  onPassReload() : void
  {
    this.selectedPass = null;
  }

  onSelect(pass: Pass) : void
  {
    this.selectedPass = pass;
    this.queuedTelecommandService.getQueuedTelecommandsTransmission(this.selectedPass)
      .subscribe(qtc => this.passQueuedTelecommands = qtc);
  }

  ngOnDestroy() {
    this.reloadPassSubscription.unsubscribe();
  }
}
