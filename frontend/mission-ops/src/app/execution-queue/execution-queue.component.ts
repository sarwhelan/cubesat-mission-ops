import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import { Pass } from 'src/classes/pass';
import { QueuedTelecommand } from 'src/classes/queuedTelecommand';
import { QueuedTelecommandService } from 'src/app/services/queuedTelecommand/queued-telecommand.service';
import { Telecommand } from 'src/classes/telecommand';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/classes/user';

/**
 * The component housing the execution queue.
 * 
 * @class ExecutionQueueComponent
 */
@Component({
  selector: 'app-execution-queue',
  templateUrl: './execution-queue.component.html',
  styleUrls: ['./execution-queue.component.scss']
})
export class ExecutionQueueComponent implements OnInit {

  /**
   * The collection of queued telecommands for the specified pass.
   * 
   * @memberof ExecutionQueueComponent
   */
  private passQueuedTelecommands: QueuedTelecommand[];

  /**
   * The telecommands to pass through to the queued telecommand component.
   * 
   * @memberof ExecutionQueueComponent
   */
  @Input() telecommands: Telecommand[];

  /**
   * The selected pass for which to display the queue.
   * 
   * @memberof ExecutionQueueComponent
   */
  @Input() selectedPass: Pass;

  /**
   * The collection of users.
   * 
   * @memberof ExecutionQueueComponent
   */
  users: User[]
  
  constructor(private userService: UsersService, private queuedTelecommandService: QueuedTelecommandService) { }

  ngOnInit() {
    // Retrieves all users.
    this.userService.getUsers(Number.MAX_SAFE_INTEGER - 1)
    .subscribe(users => {
      this.users = users.items
      this.reloadQueuedTelecommands();
    });
  }

  ngOnChanges(changes: SimpleChanges) : void
  {
    // If the pass selection changes after the initial load, reload
    // queued telecommands.
    if (changes.selectedPass && !changes.selectedPass.firstChange)
    {
      this.reloadQueuedTelecommands();
    }
  }

  /**
   * Reloads queued telecommands based on the execution pass ID given.
   * 
   * @memberof ExecutionQueueComponent
   */
  reloadQueuedTelecommands(){
    this.queuedTelecommandService.getQueuedTelecommandsExecution(this.selectedPass)
      .subscribe(qtc => this.passQueuedTelecommands = qtc);
  }
}
