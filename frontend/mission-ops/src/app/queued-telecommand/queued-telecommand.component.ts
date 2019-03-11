import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { QueuedTelecommand } from '../../classes/queuedTelecommand';
import { Telecommand } from 'src/classes/telecommand';
import { UsersService } from '../services/users/users.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { QueuedTelecommandService } from '../services/queuedTelecommand/queued-telecommand.service';

@Component({
  selector: 'app-queued-telecommand',
  templateUrl: './queued-telecommand.component.html',
  styleUrls: ['./queued-telecommand.component.scss']
})
export class QueuedTelecommandComponent implements OnInit {

  @Input() queuedTelecommand: QueuedTelecommand;
  @Input() telecommands: Telecommand[];
  @Output() reloadQueuedTelecommands = new EventEmitter<number>();
  private telecommandDetails: Telecommand; 
  private userID : string;
  isCollapsed: boolean = true;

  constructor(private userService: UsersService, private queuedTelecommandService: QueuedTelecommandService) {}

  ngOnInit() {
    // the catch here doesn't work, need to fix
    this.userService.getUser(this.queuedTelecommand.userID.toString())
    .pipe(catchError(err => of(err)))
    .subscribe(user => {
      this.userID = user.id;
    }, err => this.userID = "No user found.");
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
