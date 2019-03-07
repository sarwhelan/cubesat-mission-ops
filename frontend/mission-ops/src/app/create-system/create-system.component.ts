import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-system',
  templateUrl: './create-system.component.html',
  styleUrls: ['./create-system.component.scss']
})
export class CreateSystemComponent implements OnInit {

  @Input()
  createSysForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, 
    private formBuilder: FormBuilder) 
  {
    this.createForm();
  }

  ngOnInit() {
  }

  private createForm() : void
  {
    this.createSysForm = this.formBuilder.group({
      systemName: ''
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
