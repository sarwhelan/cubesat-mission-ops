import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { QueuedTelecommand } from '../../classes/queuedTelecommand';
import { Telecommand } from 'src/classes/telecommand';
import { UsersService } from '../services/users/users.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QueuedTelecommandService } from '../services/queuedTelecommand/queued-telecommand.service';
import { User } from '../../classes/user';

@Component({
  selector: 'app-queued-telecommand',
  templateUrl: './queued-telecommand.component.html',
  styleUrls: ['./queued-telecommand.component.scss', '../../../node_modules/font-awesome/scss/font-awesome.scss']
})
export class QueuedTelecommandComponent implements OnInit {

  @Input() queuedTelecommand: QueuedTelecommand;
  @Input() telecommands: Telecommand[];
  @Input() users: User[];

  @Output() reloadQueuedTelecommands = new EventEmitter<number>();
  private telecommandDetails: Telecommand; 
  user : User;
  isCollapsed: boolean = true;

  constructor(private userService: UsersService, private queuedTelecommandService: QueuedTelecommandService) {}

  ngOnInit() {
    this.user = this.users.find(x => x.id == this.queuedTelecommand.userID.toString());
  }

  ngOnChanges() {
    this.telecommandDetails = this.telecommands.find(x => x.telecommandID == this.queuedTelecommand.telecommandID);
  }

  deleteQueuedTelecommand() : void
  {
    this.queuedTelecommandService.deleteQueuedTelecommand(this.queuedTelecommand)
      .subscribe(results => {
        this.reloadQueuedTelecommands.emit();
      })
  }
}
