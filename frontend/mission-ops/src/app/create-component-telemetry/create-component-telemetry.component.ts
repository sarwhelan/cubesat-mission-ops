import { Component, OnInit, Input } from '@angular/core';
import { System } from 'src/classes/system';
import { Component as CubeSatComp } from 'src/classes/component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TelemetryType } from 'src/classes/telemetry-type';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-component-telemetry',
  templateUrl: './create-component-telemetry.component.html',
  styleUrls: ['./create-component-telemetry.component.scss']
})
export class CreateComponentTelemetryComponent implements OnInit {

  @Input()
  createCompTelemForm: FormGroup;
  public system: System;
  public component: CubeSatComp;
  public telemetryTypes: TelemetryType[];

  selectedTelemetryType: TelemetryType;

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder) 
    { }

  ngOnInit() {
    this.updateTelemetryType(this.telemetryTypes[0].telemetryTypeID);
    this.createForm();
  }

  private createForm() : void
  {
    this.createCompTelemForm = this.formBuilder.group({
      system: '',
      component: '',
      name: '',
      telemetryTypeID: this.telemetryTypes[0].telemetryTypeID,
      upperBound: 0,
      lowerBound: 0,
    })
  }

  updateTelemetryType(id: number) : void
  {
    this.selectedTelemetryType = this.telemetryTypes.find(x => x.telemetryTypeID == id);
  }

  submitNewCompTelem() : void
  {
    this.activeModal.close(this.createCompTelemForm.value);
  }

  closeModal() : void
  {
    this.activeModal.close('closed');
  }

}
