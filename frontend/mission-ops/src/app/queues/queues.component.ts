import { Component, OnInit } from '@angular/core';
import { Pass } from '../../classes/pass';
import { PassService } from '../services/pass/pass.service';

@Component({
  selector: 'app-queues',
  templateUrl: './queues.component.html',
  styleUrls: ['./queues.component.scss']
})
export class QueuesComponent implements OnInit {

  executionQueue: boolean;
  transmissionQueue: boolean;
  passes: Pass[];

  constructor(private passService: PassService) { }

  ngOnInit() {
    this.executionQueue = true;
    this.transmissionQueue = false;
    this.getPasses();
  }

  selectExecution(): void{    
    this.executionQueue = true;
    this.transmissionQueue = false;
  }

  selectTransmission(): void{    
    this.executionQueue = false;
    this.transmissionQueue = true;
  }

  getPasses() : void{    
    this.passService.getPasses()
      .subscribe(passes => this.passes = passes);
  }
}
