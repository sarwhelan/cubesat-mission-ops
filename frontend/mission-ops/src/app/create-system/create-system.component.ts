import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { System } from 'src/classes/system';

@Component({
  selector: 'app-create-system',
  templateUrl: './create-system.component.html',
  styleUrls: ['./create-system.component.scss']
})
export class CreateSystemComponent implements OnInit {

  @Input()
  createSysForm: FormGroup;
  isEditing: boolean;
  selectedSystem: System;
  modalTitle: string;
  modalSubmit: string;
  newSystemErrorMsgs: string[];

  constructor(public activeModal: NgbActiveModal, 
    private formBuilder: FormBuilder) 
  { }

  ngOnInit() {
    if (!this.isEditing) {
      this.modalTitle = "Add New System";
      this.modalSubmit = "Add New System";
    } else {
      this.modalTitle = "Modify System";
      this.modalSubmit = "Save Changes";
    }
    this.createForm();
  }

  private createForm() : void
  {
    this.createSysForm = this.formBuilder.group({
      systemName: this.isEditing ? this.selectedSystem.systemName : ''
    });
  }

  private isFormValid(newSystem: System) : boolean
  {
    var errorMessages: string[];
    errorMessages = ["Error: "];
    if (newSystem.systemName.trim() == "")
    {
      errorMessages.push("System must have a name.");
    }

    if (errorMessages.length > 1) {
      this.newSystemErrorMsgs = errorMessages;
      return false;
    } else {
      this.newSystemErrorMsgs = [];
      return true;
    }
  }

  submitNewSys() : void
  {
    if (!this.isEditing){
      var newSys = new System(this.createSysForm.value.systemName);
      if (!this.isFormValid(newSys)) return;
      this.newSystemErrorMsgs = [];
      this.activeModal.close(newSys);
    } else {
      this.selectedSystem.systemName = this.createSysForm.value.systemName;
      if (!this.isFormValid(this.selectedSystem)) return;
      this.newSystemErrorMsgs = [];
      this.activeModal.close(this.selectedSystem);
    }
  }

  closeModal() : void
  {
    this.activeModal.close('closed');
  }
}
