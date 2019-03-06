import { Component, OnInit } from '@angular/core';
import { SystemService } from '../services/system/system.service';
import { System } from 'src/classes/system';

@Component({
  selector: 'app-cubesat-sys-inputs',
  templateUrl: './cubesat-sys-inputs.component.html',
  styleUrls: ['./cubesat-sys-inputs.component.scss']
})
export class CubesatSysInputsComponent implements OnInit {
  systems: System[];
  selectedSystem: System;

  constructor(private systemService: SystemService) { }

  ngOnInit() {
    this.getSystems();
  }

  onSelect(system: System) : void
  {
    this.selectedSystem = system;
  }

  getSystems(): void {
    this.systemService.getSystems()
      .subscribe(systems => this.systems = systems);
  }

}
