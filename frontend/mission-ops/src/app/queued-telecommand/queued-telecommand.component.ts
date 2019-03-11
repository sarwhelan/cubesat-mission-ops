import { Component, OnInit, Input } from '@angular/core';
import { QueuedTelecommand } from '../../classes/queuedTelecommand';
import { Telecommand } from 'src/classes/telecommand';
import { UsersService } from '../services/users/users.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-queued-telecommand',
  templateUrl: './queued-telecommand.component.html',
  styleUrls: ['./queued-telecommand.component.scss']
})
export class QueuedTelecommandComponent implements OnInit {

  @Input() queuedTelecommand: QueuedTelecommand;
  @Input() telecommands: Telecommand[];
  private telecommandDetails: Telecommand; 
  private userID : string;
  isCollapsed: boolean = true;

  constructor(private userService: UsersService) {}

  ngOnInit() {
    this.userService.getUser(this.queuedTelecommand.userID.toString())
      .subscribe(user => {
        this.userID = user.id;
      });
  }

  ngOnChanges() {
    this.telecommandDetails = this.telecommands.find(x => x.telecommandID == this.queuedTelecommand.telecommandID);
  }
}
