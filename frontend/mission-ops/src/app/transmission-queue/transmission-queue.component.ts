import { Component, OnInit, Input } from '@angular/core';
import { Pass } from '../../classes/pass';

@Component({
  selector: 'app-transmission-queue',
  templateUrl: './transmission-queue.component.html',
  styleUrls: ['./transmission-queue.component.scss']
})
export class TransmissionQueueComponent implements OnInit {

  @Input() passes: Pass[];
  constructor() { }

  ngOnInit() {
  }

}
