import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TelemetryType } from 'src/classes/telemetry-type';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-telemetry-type',
  templateUrl: './create-telemetry-type.component.html',
  styleUrls: ['./create-telemetry-type.component.scss']
})
export class CreateTelemetryTypeComponent implements OnInit {

  @Input() createTelemetryTypeForm: FormGroup;
  isEditing: boolean;
  selectedTelemetryType: TelemetryType;
  modalTitle: string;
  modalSubmit: string;
  newTelemetryTypeErrorMsgs: string[];

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    if (!this.isEditing){
      this.modalTitle = "Add New Telemetry Type";
      this.modalSubmit = "Add New Telemetry Type";
    } else {
      this.modalTitle = "Modify Telemetry Type";
      this.modalSubmit = "Save Changes";
    }
    this.createForm();
  }

  private createForm() : void
  {
    this.createTelemetryTypeForm = this.formBuilder.group({
      name: this.isEditing ? this.selectedTelemetryType.name : "",
      telemetryUnit: this.isEditing ? this.selectedTelemetryType.telemetryUnit : ""
    });
  }

  private isFormValid(newTelemetryType: TelemetryType) : boolean
  {
    var errorMessages: string[];
    errorMessages = ["Error: "];
    if (newTelemetryType.name.trim() == "")
    {
      errorMessages.push("Telemetry type must have a name.");
    }

    if (newTelemetryType.telemetryUnit.trim() == "")
    {
      errorMessages.push("Telemetry type must specify a unit.");
    }

    if (errorMessages.length > 1)
    {
      this.newTelemetryTypeErrorMsgs = errorMessages;
      return false;
    } else {
      this.newTelemetryTypeErrorMsgs = [];
      return true;
    }
  }

  submitNewTelemetryType() : void
  {
    if (!this.isEditing){
      var newTT = new TelemetryType(this.createTelemetryTypeForm.value.telemetryUnit, this.createTelemetryTypeForm.value.name)
      if (!this.isFormValid(newTT)) return;
      this.newTelemetryTypeErrorMsgs = [];
      this.activeModal.close(newTT);
    } else {
      this.selectedTelemetryType.name = this.createTelemetryTypeForm.value.name;
      this.selectedTelemetryType.telemetryUnit = this.createTelemetryTypeForm.value.telemetryUnit;
      if (!this.isFormValid(this.selectedTelemetryType)) return;
      this.newTelemetryTypeErrorMsgs = [];
      this.activeModal.close(this.selectedTelemetryType);
    }
  }

  closeModal() : void
  {
    this.activeModal.close('closed');
  }

}
