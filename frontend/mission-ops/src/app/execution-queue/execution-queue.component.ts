import { Component, OnInit, Input } from '@angular/core';
import { Pass } from '../../classes/pass';

@Component({
  selector: 'app-execution-queue',
  templateUrl: './execution-queue.component.html',
  styleUrls: ['./execution-queue.component.scss']
})
export class ExecutionQueueComponent implements OnInit {
  
  /**
   * The passes of the CubeSat. Contains information about the commands to be executed
   *
   * @type {Pass[]}
   * @memberof ExecutionQueueComponent
   */
  @Input() passes: Pass[];
  constructor() { }

  ngOnInit() {
  }

}
