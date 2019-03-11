import { Component, OnInit, Input } from '@angular/core';
import { Component as CubeSatComp } from '../../classes/component';
import { ComponentService } from '../services/component/component.service';
import { SystemService } from '../services/system/system.service';
import { System } from 'src/classes/system';
import { FormGroup, FormBuilder } from '@angular/forms';

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
  @Input() chooseDataRangeForm: FormGroup;
  dateRangeObj : any;

  constructor(private systemService: SystemService, private componentService: ComponentService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getSystems();
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

    this.chooseDataRangeForm = this.formBuilder.group({
      startDate: startDate,
      startTime: defaultTime,
      endDate: endDate,
      endTime: defaultTime,
    });
  }

  submitDataRange() {
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

  getSystems() : void {
    this.systemService.getSystems()
      .subscribe(sys => this.systems = sys);
  }

  getComponents(): void {
    this.componentService.getComponentsFromSystem(this.selectedSystem.systemID)
      .subscribe(components => this.components = components);
  }

}
