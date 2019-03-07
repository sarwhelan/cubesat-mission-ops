import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { System } from 'src/classes/system';

@Component({
  selector: 'app-create-component',
  templateUrl: './create-component.component.html',
  styleUrls: ['./create-component.component.scss']
})
export class CreateComponentComponent implements OnInit {

  @Input()
  createCompForm: FormGroup;
  public system: System;

  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder) 
  {
    this.createForm();
  }

  ngOnInit() {
  }

  private createForm() : void
  {
    this.createCompForm = this.formBuilder.group({
      system: '',
      name: ''
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
