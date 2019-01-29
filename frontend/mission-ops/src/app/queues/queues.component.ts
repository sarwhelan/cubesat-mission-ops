import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-queues',
  templateUrl: './queues.component.html',
  styleUrls: ['./queues.component.scss']
})
export class QueuesComponent implements OnInit {

  executionQueue: boolean;
  transmissionQueue: boolean;

  constructor() { }

  ngOnInit() {
    this.executionQueue = true;
    this.transmissionQueue = false;
  }

  selectExecution(): void{    
    this.executionQueue = true;
    this.transmissionQueue = false;
  }

  selectTransmission(): void{    
    this.executionQueue = false;
    this.transmissionQueue = true;
  }

}
