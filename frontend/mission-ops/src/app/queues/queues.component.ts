import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
=======
import { Pass } from '../../classes/pass';
import { PassService } from '../services/pass/pass.service';
>>>>>>> master

@Component({
  selector: 'app-queues',
  templateUrl: './queues.component.html',
  styleUrls: ['./queues.component.scss']
})
export class QueuesComponent implements OnInit {

  executionQueue: boolean;
  transmissionQueue: boolean;
<<<<<<< HEAD

  constructor() { }
=======
  passes: Pass[];

  constructor(private passService: PassService) { }
>>>>>>> master

  ngOnInit() {
    this.executionQueue = true;
    this.transmissionQueue = false;
<<<<<<< HEAD
=======
    this.getPasses();
>>>>>>> master
  }

  selectExecution(): void{    
    this.executionQueue = true;
    this.transmissionQueue = false;
  }

  selectTransmission(): void{    
    this.executionQueue = false;
    this.transmissionQueue = true;
  }

<<<<<<< HEAD
=======
  getPasses() : void{    
    this.passService.getPasses()
      .subscribe(passes => this.passes = passes);
  }

>>>>>>> master
}
