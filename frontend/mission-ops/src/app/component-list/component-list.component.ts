import { Component, OnInit, Input } from '@angular/core';
import { Component as CubeSatComp } from 'src/classes/component';
import { ComponentService } from 'src/app/services/component/component.service';
import { SystemService } from 'src/app/services/system/system.service';
import { System } from 'src/classes/system';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TelemetryTypesService } from 'src/app/services/telemetry-types/telemetry-types.service';
import { TelemetryType } from 'src/classes/telemetry-type';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.scss']
})
export class ComponentListComponent implements OnInit {
  components: CubeSatComp[];
  systems: System[];
  telemetryTypes: TelemetryType[];
  selectedSystem: System;
  selectedComponent: CubeSatComp;
  @Input() chooseDataRangeForm: FormGroup;
  dateRangeObj : any;

  constructor(private systemService: SystemService, 
    private componentService: ComponentService, 
    private formBuilder: FormBuilder,
    private telemetryTypeService : TelemetryTypesService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.getSystems();
    this.getTelemetryTypes();
    this.createForm();
  }

  private createForm() : void
  {
    var today = new Date();
    var endDate = { 
      year: today.getUTCFullYear(), 
      month: today.getUTCMonth()+1, // UTC is zero-indexed. Why.
      day: today.getUTCDate()
    }
    var startDate = { 
      year: today.getUTCFullYear(), 
      month: today.getUTCMonth(),
      day: today.getUTCDate()
    }
    var defaultTime = {
      hour: 0, 
      minute: 0, 
      second: 0
    };

    this.dateRangeObj = {
      startDate: startDate,
      startTime: defaultTime,
      endDate: endDate,
      endTime: defaultTime,
    }

    this.chooseDataRangeForm = this.formBuilder.group(this.dateRangeObj);
  }

  private isDateRangeValid() : boolean
  {
    var startDate = new Date(Date.UTC(
      this.chooseDataRangeForm.value.startDate.year,
      this.chooseDataRangeForm.value.startDate.month-1,
      this.chooseDataRangeForm.value.startDate.day,
      this.chooseDataRangeForm.value.startTime.hour,
      this.chooseDataRangeForm.value.startTime.minute,
      this.chooseDataRangeForm.value.startTime.second,
      ));
    var endDate = new Date(Date.UTC(
      this.chooseDataRangeForm.value.endDate.year,
      this.chooseDataRangeForm.value.endDate.month-1,
      this.chooseDataRangeForm.value.endDate.day,
      this.chooseDataRangeForm.value.endTime.hour,
      this.chooseDataRangeForm.value.endTime.minute,
      this.chooseDataRangeForm.value.endTime.second,
      ));
    
    if (startDate.getTime() > endDate.getTime()){
      this.toastr.error('The From datetime cannot exceed the To datetime. Please try again.', "Oops!");
      return false;
    }
    return true;
  }

  submitDataRange() {
    if (!this.isDateRangeValid()) return;
    this.dateRangeObj = this.chooseDataRangeForm.value;
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

  getTelemetryTypes() : void {
    this.telemetryTypeService.getTelemetryTypes()
      .subscribe(tts => this.telemetryTypes = tts);
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
