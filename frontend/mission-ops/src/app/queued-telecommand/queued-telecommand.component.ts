import { Component, OnInit, Input } from '@angular/core';
import { QueuedTelecommand } from '../../classes/queuedTelecommand';

@Component({
  selector: 'app-queued-telecommand',
  templateUrl: './queued-telecommand.component.html',
  styleUrls: ['./queued-telecommand.component.scss']
})
export class QueuedTelecommandComponent implements OnInit {

  constructor() { }

  @Input() queuedTelecommand: QueuedTelecommand;
  ngOnInit() {
    console.log(this.queuedTelecommand);
  }

}
