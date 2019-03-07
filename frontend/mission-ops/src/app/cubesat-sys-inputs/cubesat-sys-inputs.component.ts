import { Component, OnInit, ViewChild } from '@angular/core';
import { SystemService } from '../services/system/system.service';
import { System } from 'src/classes/system';
import { Component as CubeSatComp } from 'src/classes/component';
import { ComponentService } from '../services/component/component.service';
import { ComponentTelemetryService } from '../services/component-telemetry/component-telemetry.service';
import { ComponentTelemetry } from 'src/classes/component-telemetry';
import { TelemetryType } from 'src/classes/telemetry-type';
import { TelemetryTypesService } from '../services/telemetry-types/telemetry-types.service';
import { CreateSystemComponent } from '../create-system/create-system.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


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
  telemetryTypes: TelemetryType[];

  constructor(private systemService: SystemService, 
              private componentService: ComponentService,
              private compTelemetriesService: ComponentTelemetryService,
              private telemetryTypesService: TelemetryTypesService,
              private modalService: NgbModal) 
              { }

  ngOnInit() {
    this.getSystems();
    this.getTelemetryTypes();
  }

  /**
   * Modal stuff
   */

   promptAddSystem(): void 
   {
     const modalRef = this.modalService.open(CreateSystemComponent);
     modalRef.result.then((result) => {
       this.systemService.createSystem(new System(result.systemName))
        .subscribe(sys => {
          this.getSystems();
        });
     }).catch((error) => {
       console.log(error);
     });
   }

  /**
   * ON SELECT Methods
   */

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

  /**
   * ADD Methods
   */

  addComponent(name: string) : void
  {
    if (name.trim() === "") return;
    this.componentService.createComponent(new CubeSatComp(this.selectedSystem.systemID, name))
      .subscribe(newComp => {
        this.getComponents(this.selectedSystem.systemID);
      });
  }

  addCompTelem(telemetryTypeId: number, name: string, upperBound: number = null, lowerBound: number = null) : void
  {
    if (telemetryTypeId < 1 || name.trim() === "") return;
    this.compTelemetriesService.createComponentTelemetry(new ComponentTelemetry(telemetryTypeId, this.selectedComponent.componentID, name, upperBound, lowerBound))
      .subscribe(newCompTelem => {
        this.getCompTelemetries(this.selectedComponent.componentID);
      })
  }

  /**
   * GET Methods
   */

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

  getTelemetryTypes(): void
  {
    this.telemetryTypesService.getTelemetryTypes()
      .subscribe(telemTypes => this.telemetryTypes = telemTypes);
  }

  getTelemetryType(telemetryTypeId: number) : TelemetryType
  {
    return this.telemetryTypes.find(x => x.telemetryTypeID == telemetryTypeId);
  }

  /**
   * DELETE Methods
   */

   deleteSystem() : void
   {
     if (!this.selectedSystem) {
       console.log('no selected sys');
       return;
     }
     this.systemService.removeSystem(this.selectedSystem)
      .subscribe(sys => {
        this.getSystems();
        this.selectedSystem = null;
        this.selectedComponent = null;
        this.selectedCompTelem = null;
      });
   } 

   deleteComponent() : void
   {
     if(!this.selectedComponent){
       console.log('no selected comp');
       return;
     }
     this.componentService.removeComponent(this.selectedComponent)
      .subscribe(comp => {
        this.getComponents(this.selectedSystem.systemID);
        this.selectedComponent = null;
        this.selectedCompTelem = null;
      });
   }

   deleteCompTelem() : void
   {
     if (!this.selectedCompTelem) {
       console.log('no selected comp telem');
       return;
     }
     this.compTelemetriesService.removeComponentTelemetry(this.selectedCompTelem)
      .subscribe(compTelem => {
        this.getCompTelemetries(this.selectedComponent.componentID);
        this.selectedCompTelem = null;
      });
   }
}
