import { Component, OnInit, Input } from '@angular/core';
import { Component as CubeSatComp } from 'src/classes/component';
import { ComponentService } from 'src/app/services/component/component.service';
import { SystemService } from 'src/app/services/system/system.service';
import { System } from 'src/classes/system';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TelemetryTypesService } from 'src/app/services/telemetry-types/telemetry-types.service';
import { TelemetryType } from 'src/classes/telemetry-type';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

/**
 * The poorly-named telemetry dashboard component.
 * 
 * @class ComponentListComponent
 */
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

  /**
   * Constructs a new ComponentListComponent object.
   * @param systemService 
   * @param componentService 
   * @param formBuilder 
   * @param telemetryTypeService 
   * @param toastr 
   */
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

  /**
   * Creates a form to input the date range visible to the user.
   * 
   * @memberof ComponentListComponent
   */
  private createForm() : void
  {
    // Set the initial date range from one month ago at midnight to today at midnight.
    this.dateRangeObj = {
      startDate: moment().utc(false).subtract(1, 'months').hours(0).minutes(0).seconds(0),
      endDate: moment().utc(false).hours(0).minutes(0).seconds(0),
    }

    this.chooseDataRangeForm = this.formBuilder.group(this.dateRangeObj);
  }

  /**
   * Checks if the date range is valid and shows an error if not.
   * 
   * @memberof ComponentListComponent
   */
  private isDateRangeValid() : boolean
  {
    var startDate = moment(this.chooseDataRangeForm.value.startDate).utc(true);
    var endDate = moment(this.chooseDataRangeForm.value.endDate).utc(true);
    if (!endDate.isAfter(startDate)){
      this.toastr.error('The From datetime cannot exceed the To datetime. Please try again.', "Oops!");
      return false;
    }
    return true;
  }

  /**
   * Submits the date range by repopulating the date range object, which
   * triggers events further downstream.
   */
  submitDataRange() {
    if (!this.isDateRangeValid()) return;
    var startDate = moment(this.chooseDataRangeForm.value.startDate).utc(true);
    var endDate = moment(this.chooseDataRangeForm.value.endDate).utc(true);
    this.dateRangeObj = {
      startDate: startDate,
      endDate: endDate,
    }
  }

  /**
   * The on-click event when a System is selected.
   * @param system The specified System.
   */
  onSelect(system: System) : void {
    if (system === this.selectedSystem) return;
    this.components = null;
    this.selectedComponent = null;
    this.selectedSystem = system;
    this.getComponents();
  }

  /**
   * The on-click event when a Component is selected.
   * @param component The specified Component.
   */
  onSelectComp(component: CubeSatComp): void {
    this.selectedComponent = component;
  }

  /**
   * Retrieves the current TelemetryTypes and assigns them
   * to the used object asynchronously.
   */
  getTelemetryTypes() : void {
    this.telemetryTypeService.getTelemetryTypes()
      .subscribe(tts => this.telemetryTypes = tts);
  }

  /**
   * Retrieves the current Systems and assigns them
   * to the used object asynchronously.
   */
  getSystems() : void {
    this.systemService.getSystems()
      .subscribe(sys => this.systems = sys);
  }

  /**
   * Retrieves the current Components with the given System and 
   * assigns them to the used object asynchronously.
   */
  getComponents(): void {
    this.componentService.getComponentsFromSystem(this.selectedSystem.systemID)
      .subscribe(components => this.components = components);
  }

}
