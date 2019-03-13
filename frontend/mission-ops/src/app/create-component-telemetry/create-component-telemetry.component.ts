import { Component, OnInit, Input } from '@angular/core';
import { System } from 'src/classes/system';
import { Component as CubeSatComp } from 'src/classes/component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TelemetryType } from 'src/classes/telemetry-type';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ComponentTelemetry } from 'src/classes/component-telemetry';

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
  isEditing: boolean;
  selectedCompTelem: ComponentTelemetry;
  modalTitle: string;
  modalSubmit: string;
  selectedTelemetryType: TelemetryType;
  newCompTelemErrorMsgs: string[];

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder) 
    { }

  ngOnInit() {
    if (!this.isEditing) {
      this.modalTitle = "Add New Component Telemetry";
      this.modalSubmit = "Add New Component Telemetry";
    } else {
      this.modalTitle = "Modify Component Telemetry";
      this.modalSubmit = "Save Changes";
    }

    this.updateTelemetryType(this.isEditing ? this.selectedCompTelem.telemetryTypeID : this.telemetryTypes[0].telemetryTypeID);
    this.createForm();
  }

  private createForm() : void
  {
    this.createCompTelemForm = this.formBuilder.group({
      name: this.isEditing ? this.selectedCompTelem.name : '',
      telemetryTypeID: this.selectedTelemetryType.telemetryTypeID,
      upperBound: this.isEditing ? this.selectedCompTelem.upperBound : 0,
      lowerBound: this.isEditing ? this.selectedCompTelem.lowerBound : 0,
    })
  }

  private isFormValid(newCompTelem: ComponentTelemetry) : boolean
  {
    var errorMessages: string[];
    errorMessages = ["Error: "];
    if (newCompTelem.name.trim() == "")
    {
      errorMessages.push("Component telemetry must have a name.");
    }

    if (!newCompTelem.telemetryTypeID)
    {
      errorMessages.push("Component telemetry must have an associated telemetry type.");
    }

    if (newCompTelem.upperBound < newCompTelem.lowerBound)
    {
      errorMessages.push("Lower bound must not exceed upper bound.");
    }

    if (errorMessages.length > 1)
    {
      this.newCompTelemErrorMsgs = errorMessages;
      return false;
    } else {
      this.newCompTelemErrorMsgs = [];
      return true;
    }
  }

  updateTelemetryType(id: number) : void
  {
    this.selectedTelemetryType = this.telemetryTypes.find(x => x.telemetryTypeID == id);
    var boundReset = 0;
    // If the selected telemetry type doesn't have bounds, null out bounds.
    if (this.createCompTelemForm && !this.selectedTelemetryType.hasBounds) {
      boundReset = null;
    }
    if (this.createCompTelemForm) {
      this.createCompTelemForm.setValue({
        upperBound: boundReset, 
        lowerBound: boundReset,
        telemetryTypeID: this.createCompTelemForm.get('telemetryTypeID').value,
        name: this.createCompTelemForm.get('name').value
      });
    }
  }

  submitNewCompTelem() : void
  {
    if (!this.isEditing){
      var newCT = new ComponentTelemetry(this.createCompTelemForm.value.telemetryTypeID, 
        this.component.componentID,
        this.createCompTelemForm.value.name, 
        this.createCompTelemForm.value.upperBound, 
        this.createCompTelemForm.value.lowerBound);
      if (!this.isFormValid(newCT)) return;
      this.newCompTelemErrorMsgs = [];
      this.activeModal.close(newCT);
    } else {
      this.selectedCompTelem.name = this.createCompTelemForm.value.name;
      this.selectedCompTelem.telemetryTypeID = this.createCompTelemForm.value.telemetryTypeID;
      this.selectedCompTelem.upperBound = this.createCompTelemForm.value.upperBound;
      this.selectedCompTelem.lowerBound = this.createCompTelemForm.value.lowerBound;
      if (!this.isFormValid(this.selectedCompTelem)) return;
      this.newCompTelemErrorMsgs = [];
      this.activeModal.close(this.selectedCompTelem);
    }
    this.activeModal.close(this.createCompTelemForm.value);
  }

  closeModal() : void
  {
    this.activeModal.close('closed');
  }

}
