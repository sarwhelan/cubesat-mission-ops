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

  submitNewSys() : void
  {
    this.activeModal.close(this.createSysForm.value);
  }

  closeModal() : void
  {
    this.activeModal.close('closed');
  }
}
