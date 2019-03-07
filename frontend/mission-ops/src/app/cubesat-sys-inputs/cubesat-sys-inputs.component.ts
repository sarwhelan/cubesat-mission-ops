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
import { CreateComponentComponent } from '../create-component/create-component.component';
import { CreateComponentTelemetryComponent } from '../create-component-telemetry/create-component-telemetry.component';
import { ModalComponent } from '../modal/modal.component';


@Component({
  selector: 'app-cubesat-sys-inputs',
  templateUrl: './cubesat-sys-inputs.component.html',
  styleUrls: ['./cubesat-sys-inputs.component.scss']
})
export class CubesatSysInputsComponent implements OnInit {
  @ViewChild('deleteSystemModal')
  private deleteSystemModal: ModalComponent;
  @ViewChild('deleteComponentModal')
  private deleteComponentModal: ModalComponent;
  @ViewChild('deleteCompTelemModal')
  private deleteCompTelemModal: ModalComponent;

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
     modalRef.componentInstance.isEditing = false;
     modalRef.result.then((result) => {
       this.systemService.createSystem(new System(result.systemName))
        .subscribe(sys => {
          this.getSystems();
        });
     }).catch((error) => {
       // Modal closed without submission
       console.log(error);
     });
   }

   promptEditSystem() : void
   {
     const modalRef = this.modalService.open(CreateSystemComponent);
     modalRef.componentInstance.isEditing = true;
     modalRef.componentInstance.selectedSystem = this.selectedSystem;
     modalRef.result.then((result) => {
       this.selectedSystem.systemName = result.systemName;
       this.systemService.updateSystem(this.selectedSystem)
        .subscribe(sys => { });
     }).catch((error) => {
       // Modal closed without submission
       console.log(error);
     })
   }

   promptAddComponent() : void
   {
     const modalRef = this.modalService.open(CreateComponentComponent);
     modalRef.componentInstance.system = this.selectedSystem;
     modalRef.componentInstance.isEditing = false;
     modalRef.result.then((result) => {
       this.componentService.createComponent(new CubeSatComp(this.selectedSystem.systemID, result.name))
        .subscribe(comp => {
          this.getComponents(this.selectedComponent.systemID);
        })
     }).catch((error) => {
      // Modal closed without submission
      console.log(error);
    });
   }

   promptEditComponent() : void
   {
     const modalRef = this.modalService.open(CreateComponentComponent);
     modalRef.componentInstance.system = this.selectedSystem;
     modalRef.componentInstance.isEditing = true;
     modalRef.componentInstance.selectedComponent = this.selectedComponent;
     modalRef.result.then((result) => {
       this.selectedComponent.name = result.name;
       this.componentService.updateComponent(this.selectedComponent)
        .subscribe(sys => { });
     }).catch((error) => {
       // Modal closed without submission
       console.log(error);
     })
   }

   promptAddCompTelem() : void
   {
     const modalRef = this.modalService.open(CreateComponentTelemetryComponent);
     modalRef.componentInstance.system = this.selectedSystem;
     modalRef.componentInstance.component = this.selectedComponent;
     modalRef.componentInstance.telemetryTypes = this.telemetryTypes;
     modalRef.componentInstance.isEditing = false;
     modalRef.result.then((result) => {
       this.compTelemetriesService.createComponentTelemetry(new ComponentTelemetry(result.telemetryTypeID, this.selectedComponent.componentID, result.name, result.upperBound, result.lowerBound))
        .subscribe(compTelem => { 
          this.getCompTelemetries(this.selectedCompTelem.componentID);
        })
     }).catch((error) => {
       // Modal closed without submission
       console.log(error);
     });
   }

   promptEditCompTelem() : void
   {
     const modalRef = this.modalService.open(CreateComponentTelemetryComponent);
     modalRef.componentInstance.system = this.selectedSystem;
     modalRef.componentInstance.component = this.selectedComponent;
     modalRef.componentInstance.telemetryTypes = this.telemetryTypes;
     modalRef.componentInstance.isEditing = true;
     modalRef.componentInstance.selectedCompTelem = this.selectedCompTelem;
     modalRef.result.then((result) => {
       this.selectedCompTelem.telemetryTypeID = result.telemetryTypeID;
       this.selectedCompTelem.name = result.name;
       this.selectedCompTelem.upperBound = result.upperBound;
       this.selectedCompTelem.lowerBound = result.lowerBound;
       this.compTelemetriesService.updateComponentTelemetry(this.selectedCompTelem)
        .subscribe(compTelem => { })
     }).catch((error) => {
       // Modal closed without submission
       console.log(error);
     });
   }

  promptDeleteSystem(): void {
    this.deleteSystemModal.open();
  }

  promptDeleteComponent(): void {
    this.deleteComponentModal.open();
  }

  promptDeleteCompTelem(): void {
    this.deleteCompTelemModal.open();
  }

  /**
   * ON SELECT Methods
   */

  onSelectSys(system: System) : void
  {
    this.selectedSystem = system;
    this.selectedComponent = null;
    this.selectedCompTelem = null;
    this.getComponents(this.selectedSystem.systemID);
  }

  onSelectComp(component: CubeSatComp) : void
  {
    this.selectedComponent = component;
    this.selectedCompTelem = null;
    this.getCompTelemetries(this.selectedComponent.componentID);
  }

  onSelectCompTelem(compTelem: ComponentTelemetry): void
  {
    this.selectedCompTelem = compTelem;
  }

  /**
   * GET Methods
   */

  getSystems(): void {
    this.systemService.getSystems()
      .subscribe(systems => {
        this.systems = systems;
        this.selectedSystem = null;
        this.selectedComponent = null;
        this.selectedCompTelem = null;
      });
  }

  getComponents(systemId: number): void {
    this.componentService.getComponentsFromSystem(systemId)
      .subscribe(components => {
        this.components = components;
        this.selectedComponent = null;
        this.selectedCompTelem = null;
      });
  }

  getCompTelemetries(componentId: number): void
  {
    this.compTelemetriesService.getComponentTelemetries(componentId)
      .subscribe(compTelems => {
        this.compTelemetries = compTelems;
        this.selectedCompTelem = null;
      });
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
        this.deleteSystemModal.close();
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
        this.deleteComponentModal.close();
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
        this.deleteCompTelemModal.close();
      });
   }
}
