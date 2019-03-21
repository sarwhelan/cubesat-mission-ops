import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
const dateFormat = require('dateformat');

import { QueuedTelecommand } from 'src/classes/queuedTelecommand';
import { Telecommand } from 'src/classes/telecommand';
import { UsersService } from 'src/app/services/users/users.service';
import { QueuedTelecommandService } from 'src/app/services/queuedTelecommand/queued-telecommand.service';
import { User } from 'src/classes/user';

/**
 * A component defining a telecommand that has been queued.
 * 
 * @class QueuedTelecommandComponent
 */
@Component({
  selector: 'app-queued-telecommand',
  templateUrl: './queued-telecommand.component.html',
  styleUrls: ['./queued-telecommand.component.scss']
})
export class QueuedTelecommandComponent implements OnInit {

  /**
   * The current QueuedTelecommand.
   * 
   * @memberof QueuedTelecommandComponent
   */
  @Input() queuedTelecommand: QueuedTelecommand;

  /**
   * The available telecommands.
   * 
   * @member QueuedTelecommandComponent
   */
  @Input() telecommands: Telecommand[];

  /**
   * The available users.
   * 
   * @memberof QueuedTelecommandComponent
   */
  @Input() users: User[];

  /**
   * The rank of the queued telecommand in the 
   * current queue.
   * 
   * @memberof QueuedTelecommandComponent
   */
  @Input() orderRank: number;

  /**
   * If the queued telecommand has already been executed
   * on the CubeSat.
   * 
   * @memberof QueuedTelecommandComponent
   */
  @Input() isInPast: boolean;

  /**
   * An event fired when the queued telecommand has been modified
   * or removed.
   * 
   * @memberof QueuedTelecommandComponent
   */
  @Output() reloadQueuedTelecommands = new EventEmitter<number>();

  /**
   * The telecommand details of the queued telecommand.
   * 
   * @memberof QueuedTelecommandComponent
   */
  private telecommandDetails: Telecommand; 

  /**
   * The user that queued the telecommand.
   * 
   * @memberof QueuedTelecommandComponent
   */
  user : User;

  /**
   * If the current queued telecommand details are not visible.
   * 
   * @memberof QueuedTelecommandComponent
   */
  isCollapsed: boolean = true;

  /**
   * Constructs a new instance of a QueuedTelecommand component.
   * @param userService 
   * @param queuedTelecommandService 
   */
  constructor(private userService: UsersService, private queuedTelecommandService: QueuedTelecommandService) {}

  ngOnInit() {
    // Assigns the user.
    this.user = this.users.find(x => x.id == this.queuedTelecommand.userID.toString());
  }

  ngOnChanges() {
    // Assigns the telecommand details.
    this.telecommandDetails = this.telecommands.find(x => x.telecommandID == this.queuedTelecommand.telecommandID);
  }

  /**
   * Formats the date nicely for the UI.
   * 
   * @memberof QueuedTelecommandComponent
   */
  getFormatedDate()
  {
    return dateFormat(this.queuedTelecommand.executionTimeUTC, "dddd, mmmm dS, yyyy, HH:MM:ss");
  }

  /**
   * Removes the current queued telecommand from the queue.
   * 
   * @memberof QueuedTelecommandComponent
   */
  deleteQueuedTelecommand() : void
  {
    this.queuedTelecommandService.deleteQueuedTelecommand(this.queuedTelecommand)
      .subscribe(results => {
        this.reloadQueuedTelecommands.emit();
      })
  }
}
