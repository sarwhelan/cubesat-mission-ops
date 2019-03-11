import { Component, OnInit } from '@angular/core';
import { Component as CubeSatComp } from '../../classes/component';
import { ComponentService } from '../services/component/component.service';
import { SystemService } from '../services/system/system.service';
import { System } from 'src/classes/system';

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.scss']
})
export class ComponentListComponent implements OnInit {
  components: CubeSatComp[];
  systems: System[];
  selectedSystem: System;
  selectedComponent: CubeSatComp;

  constructor(private systemService: SystemService, private componentService: ComponentService) { }

  ngOnInit() {
    this.getSystems();
  }

  onSelect(system: System) : void {
    if (system === this.selectedSystem) return;
    this.components = null;
    this.selectedComponent = null;
    this.selectedSystem = system;
    this.getComponents();
  }

  onSelectComp(component: CubeSatComp): void {
    this.selectedComponent = component;
  }

  getSystems() : void {
    this.systemService.getSystems()
      .subscribe(sys => this.systems = sys);
  }

  getComponents(): void {
    this.componentService.getComponentsFromSystem(this.selectedSystem.systemID)
      .subscribe(components => this.components = components);
  }

}
