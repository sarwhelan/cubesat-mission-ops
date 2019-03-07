import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { System } from 'src/classes/system';
import { Component as CubeSatComp } from 'src/classes/component';

@Component({
  selector: 'app-create-component',
  templateUrl: './create-component.component.html',
  styleUrls: ['./create-component.component.scss']
})
export class CreateComponentComponent implements OnInit {

  @Input()
  createCompForm: FormGroup;
  public system: System;
  isEditing: boolean;
  selectedComponent: CubeSatComp;
  modalTitle: string;
  modalSubmit: string;

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder) 
  { }

  ngOnInit() {
    if (!this.isEditing) {
      this.modalTitle = "Add New Component";
      this.modalSubmit = "Add New Component";
    } else {
      this.modalTitle = "Modify Component";
      this.modalSubmit = "Save Changes";
    }
    this.createForm();
  }

  private createForm() : void
  {
    this.createCompForm = this.formBuilder.group({
      system: '',
      name: this.isEditing ? this.selectedComponent.name : ''
    });
  }

  submitNewComp() : void
  {
    this.activeModal.close(this.createCompForm.value);
  }

  closeModal() : void
  {
    this.activeModal.close('closed');
  }
}
