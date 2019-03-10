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
    var executionDate = new NgbDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDay());
    var executionTime = {hour: 0, minute: 0, second: 0};

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
    this.activeModal.close(this.createQtcForm.value);
  }

  closeModal() : void
  {
    this.activeModal.close('closed');
  }

}
