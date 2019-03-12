import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-pass',
  templateUrl: './create-pass.component.html',
  styleUrls: ['./create-pass.component.scss']
})
export class CreatePassComponent implements OnInit {

  @Input() createPassForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  private createForm() : void
  {
    var today = new Date();
    var passDate = { 
      year: today.getUTCFullYear(), 
      month: today.getUTCMonth()+1, // UTC is zero-indexed. Why.
      day: today.getUTCDate()
    }
    var passTime = {
      hour: 0, 
      minute: 0, 
      second: 0
    };

    this.createPassForm = this.formBuilder.group({
      passDate: passDate,
      passTime: passTime,
    });
  }

  submitPass() : void
  {
    this.activeModal.close(this.createPassForm.value);
  }

  closeModal() : void
  {
    this.activeModal.close('closed');
  }

}
