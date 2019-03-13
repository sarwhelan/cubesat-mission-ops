import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Pass } from 'src/classes/pass';
import { PassService } from 'src/app/services/pass/pass.service';
import { QueuedTelecommandService } from 'src/app/services/queuedTelecommand/queued-telecommand.service';
import { QueuedTelecommand } from 'src/classes/queuedTelecommand';
import { Observable } from 'rxjs';
import { Telecommand } from 'src/classes/telecommand';
import { User } from 'src/classes/user';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-transmission-queue',
  templateUrl: './transmission-queue.component.html',
  styleUrls: ['./transmission-queue.component.scss']
})
export class TransmissionQueueComponent implements OnInit {

  @Input() selectedPass: Pass;
  @Input() telecommands: Telecommand[];
  
  private passQueuedTelecommands: QueuedTelecommand[];
  users: User[]

  constructor(private userService: UsersService, private queuedTelecommandService: QueuedTelecommandService) { }

  ngOnInit() {
    this.userService.getUsers(Number.MAX_SAFE_INTEGER - 1)
      .subscribe(users => {
        this.users = users.items
        this.reloadQueuedTelecommands();
      });
  }

  ngOnChanges(changes: SimpleChanges) : void
  {
    if (changes.selectedPass && !changes.selectedPass.firstChange)
    {
      this.reloadQueuedTelecommands();
    }
  }

  reloadQueuedTelecommands(){
    this.queuedTelecommandService.getQueuedTelecommandsTransmission(this.selectedPass)
      .subscribe(qtc => this.passQueuedTelecommands = qtc);
  }
}
