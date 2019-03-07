import { Component, OnInit } from '@angular/core';
import { SystemService } from '../services/system/system.service';
import { System } from 'src/classes/system';
import { Component as CubeSatComp } from 'src/classes/component';
import { ComponentService } from '../services/component/component.service';
import { ComponentTelemetryService } from '../services/component-telemetry/component-telemetry.service';
import { ComponentTelemetry } from 'src/classes/component-telemetry';


@Component({
  selector: 'app-cubesat-sys-inputs',
  templateUrl: './cubesat-sys-inputs.component.html',
  styleUrls: ['./cubesat-sys-inputs.component.scss']
})
export class CubesatSysInputsComponent implements OnInit {
  systems: System[];
  components: CubeSatComp[];
  selectedSystem: System;
  selectedComponent: CubeSatComp;
  compTelemetries: ComponentTelemetry[];
  selectedCompTelem: ComponentTelemetry;

  constructor(private systemService: SystemService, 
              private componentService: ComponentService,
              private compTelemetriesService: ComponentTelemetryService) 
              { }

  ngOnInit() {
    this.getSystems();
  }

  onSelectSys(system: System) : void
  {
    this.selectedSystem = system;
    this.selectedComponent = null;
    this.getComponents(this.selectedSystem.systemID);
  }

  onSelectComp(component: CubeSatComp) : void
  {
    this.selectedComponent = component;
    this.getCompTelemetries(this.selectedComponent.componentID);
  }

  onSelectCompTelem(compTelem: ComponentTelemetry): void
  {
    this.selectedCompTelem = compTelem;
  }

  addSystem(name: string) : void 
  {
    if (name.trim() === "") return;
    this.systemService.createSystem(new System(name))
      .subscribe(newSys => {
        this.getSystems();
      });
  }

  getSystems(): void {
    this.systemService.getSystems()
      .subscribe(systems => this.systems = systems);
  }

  getComponents(systemId: number): void {
    this.componentService.getComponentsFromSystem(systemId)
      .subscribe(components => this.components = components);
  }

  getCompTelemetries(componentId: number): void
  {
    this.compTelemetriesService.getComponentTelemetries(componentId)
      .subscribe(compTelems => this.compTelemetries = compTelems);
  }
}
