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

  submitNewTelemetryType() : void
  {
    this.activeModal.close(this.createTelemetryTypeForm.value);
  }

  closeModal() : void
  {
    this.activeModal.close('closed');
  }

}
