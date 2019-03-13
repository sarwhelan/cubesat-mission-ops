import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pass } from 'src/classes/pass';

@Component({
  selector: 'app-create-pass',
  templateUrl: './create-pass.component.html',
  styleUrls: ['./create-pass.component.scss']
})
export class CreatePassComponent implements OnInit {

  @Input() createPassForm: FormGroup;
  newPassErrorMsgs: string[];

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

    var availablePower = 100;
    var availableBandwidth = 1500;

    this.createPassForm = this.formBuilder.group({
      passDate: passDate,
      passTime: passTime,
      availablePower: availablePower,
      availableBandwidth: availableBandwidth,
    });
  }

  private isFormValid(newPass: Pass) : boolean
  {
    var errorMessages: string[];
    errorMessages = ["Error: "];
    var today = new Date().getTime();
    if (newPass.estimatedPassDateTime.getTime() <= today){
      errorMessages.push("Pass must exist in the future. Provide a date and time that exceed the current time.");
    }

    if (isNaN(newPass.availablePower) || newPass.availablePower < 0)
    {
      errorMessages.push("The available power of a pass must be a positive number.");
    }
    
    if (isNaN(newPass.availableBandwidth) || newPass.availableBandwidth < 0)
    {
      errorMessages.push("The available bandwidth of a pass must be a positive number.");
    }

    if (errorMessages.length > 1)
    {
      this.newPassErrorMsgs = errorMessages;
      return false;
    } else {
      this.newPassErrorMsgs = [];
      return true;
    }
  }

  submitPass() : void
  {
    var newPassDate = new Date(Date.UTC(
      this.createPassForm.value.passDate.year,
      this.createPassForm.value.passDate.month-1,
      this.createPassForm.value.passDate.day,
      this.createPassForm.value.passTime.hour,
      this.createPassForm.value.passTime.minute,
      this.createPassForm.value.passTime.second,
    ));
    var newPass = new Pass(newPassDate, this.createPassForm.value.availablePower, this.createPassForm.value.availableBandwidth);
    if (!this.isFormValid(newPass)) return;
    this.newPassErrorMsgs = [];
    this.activeModal.close(newPass);
  }

  closeModal() : void
  {
    this.activeModal.close('closed');
  }

}
