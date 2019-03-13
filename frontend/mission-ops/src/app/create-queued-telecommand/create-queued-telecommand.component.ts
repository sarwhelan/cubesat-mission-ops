import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Telecommand } from 'src/classes/telecommand';
import { AuthService } from '../services/auth/auth.service';
import { TelecommandBatch } from 'src/classes/telecommandBatch';

@Component({
  selector: 'app-create-queued-telecommand',
  templateUrl: './create-queued-telecommand.component.html',
  styleUrls: ['./create-queued-telecommand.component.scss']
})
export class CreateQueuedTelecommandComponent implements OnInit {

  @Input()
  createQtcForm: FormGroup;
  modalTitle: string;
  modalSubmit: string;
  isBatch: boolean;
  newQtcErrorMsgs: string[];

  public telecommands: Telecommand[];
  public telecommandBatches: TelecommandBatch[];

  selectedTelecommand: Telecommand;
  selectedTelecommandBatch: TelecommandBatch;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private auth: AuthService)
  { }

  ngOnInit() {
    if (!this.isBatch){
      this.modalTitle = "Add Telecommand to Queue";
      this.updateTelecommand(this.telecommands[0].telecommandID);
    } else {
      this.modalTitle = "Add Telecommand Batch to Queue";
      this.updateTelecommandBatch(this.telecommandBatches[0].batchID);
    }
    this.modalSubmit = "Add to Queue";
    this.createForm();
  }

  private createForm() : void
  {
    var today = new Date();
    var executionDate = { 
      year: today.getUTCFullYear(), 
      month: today.getUTCMonth()+1, // UTC is zero-indexed. Why.
      day: today.getUTCDate()
    }
    var executionTime = {
      hour: 0, 
      minute: 0, 
      second: 0
    };

    if (!this.isBatch) {
      this.createQtcForm = this.formBuilder.group({
        telecommandID: this.selectedTelecommand.telecommandID,
        priorityLevel: false,
        executionDate: executionDate,
        executionTime: executionTime,
        commandParams: this.selectedTelecommand.command,
      });
    } else {
      this.createQtcForm = this.formBuilder.group({
        telecommandBatchID: this.selectedTelecommandBatch.batchID,
        priorityLevel: false,
        executionDate: executionDate,
        executionTime: executionTime,
      });
    }
  }

  private isFormValid(){
    var today = new Date();
    var executionTime = new Date(Date.UTC(
      this.createQtcForm.value.executionDate.year,
      this.createQtcForm.value.executionDate.month-1, // Indexed from 0. Why. WHY.
      this.createQtcForm.value.executionDate.day,
      this.createQtcForm.value.executionTime.hour,
      this.createQtcForm.value.executionTime.minute,
      this.createQtcForm.value.executionTime.second
    ));
    var errorMessages: string[];
    errorMessages = ["Error: "];
    if (this.isBatch && !this.createQtcForm.value.telecommandBatchID)
    {
      errorMessages.push("A telecommand batch must be selected.");
    }

    if (!this.isBatch && !this.createQtcForm.value.telecommandID)
    {
      errorMessages.push("A telecommand must be selected.");
    }

    if (executionTime.getTime() <= today.getTime())
    {
      var addWord = "";
      if (this.isBatch) {
        addWord = "batch";
      }
      errorMessages.push(`A telecommand ${addWord} must be scheduled in the future, not the past.`);
    }

    if (!this.isBatch && this.isJSON(this.createQtcForm.value.commandParams))
    {
      errorMessages.push("Command parameters must be specified and be valid JSON.");
    }

    if (errorMessages.length > 1) {
      this.newQtcErrorMsgs = errorMessages;
      return false;
    } else {
      this.newQtcErrorMsgs = [];
      return true;
    }
  }

  private isJSON(str) :boolean {  
    try {
      var obj = JSON.parse(str);
      return !!obj && typeof(obj) === 'object';
    } catch (e) {
      /* ignore */
    }
  
    return false;
  }

  updateTelecommand(id: number) : void
  {
    this.selectedTelecommand = this.telecommands.find(x => x.telecommandID == id);
  }

  updateTelecommandBatch(id: number) : void
  {
    this.selectedTelecommandBatch = this.telecommandBatches.find(x => x.batchID == id);
  }

  submitQtc() : void
  {
    if (!this.isFormValid()) return;
    this.activeModal.close(this.createQtcForm.value);
  }

  closeModal() : void
  {
    this.activeModal.close('closed');
  }

}
