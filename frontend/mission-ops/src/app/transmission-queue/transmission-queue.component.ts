import { Component, OnInit, Input } from '@angular/core';
import { Pass } from '../../classes/pass';
import { PassService } from '../services/pass/pass.service';
import { QueuedTelecommandService } from '../services/queuedTelecommand/queued-telecommand.service';
import { QueuedTelecommand } from 'src/classes/queuedTelecommand';
import { Observable } from 'rxjs';
import { Telecommand } from 'src/classes/telecommand';
import { User } from '../../classes/user';
import { UsersService } from '../services/users/users.service';

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
  events: Observable<Pass>;
  private selectedPass: Pass;
  private newPassEstimatedPassDateTime: Date;
  private passQueuedTelecommands: QueuedTelecommand[];
  private users: User[]
  @Input() telecommands: Telecommand[];

  private reloadPassSubscription: any;

  constructor(private userService: UsersService, private queuedTelecommandService: QueuedTelecommandService) { }

  ngOnInit() {
    this.userService.getUsers(Number.MAX_SAFE_INTEGER - 1)
      .subscribe(users => {
        this.users = users.items
      });
    this.reloadPassSubscription = this.events.subscribe(pass => this.onSelect(pass));
  }

  onSelect(pass: Pass) : void
  {
    if (!pass) return;
    this.selectedPass = pass;
    this.reloadQueuedTelecommands();
  }

  reloadQueuedTelecommands(){
    this.queuedTelecommandService.getQueuedTelecommandsTransmission(this.selectedPass)
      .subscribe(qtc => this.passQueuedTelecommands = qtc);
  }

  ngOnDestroy() {
    this.reloadPassSubscription.unsubscribe();
  }
}
