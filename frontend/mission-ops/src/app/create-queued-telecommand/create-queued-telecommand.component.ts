import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { QueuedTelecommand } from 'src/classes/queuedTelecommand';
import { NgbActiveModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { Telecommand } from 'src/classes/telecommand';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-create-queued-telecommand',
  templateUrl: './create-queued-telecommand.component.html',
  styleUrls: ['./create-queued-telecommand.component.scss']
})
export class CreateQueuedTelecommandComponent implements OnInit {

  @Input()
  createQtcForm: FormGroup;
  isEditing: boolean;
  selectedQtc: QueuedTelecommand;
  modalTitle: string;
  modalSubmit: string;

  public telecommands: Telecommand[];

  selectedTelecommand: Telecommand;

  constructor(public activeModal: NgbActiveModal, private formBuilder: FormBuilder, private auth: AuthService)
  { }

  ngOnInit() {
    if (!this.isEditing) {
      this.modalTitle = "Add Telecommand to Queue";
      this.modalSubmit = "Add to Queue";
    } else {
      this.modalTitle = "Modify Telecommand in Queue";
      this.modalSubmit = "Apply Changes";
    }
    this.createForm();
  }

  private createForm() : void
  {
    var today = new Date();
    var executionDate = new NgbDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDay());
    var executionTime = {hour: 0, minute: 0, second: 0};

    if (this.isEditing) {
      executionDate = new NgbDate(this.selectedQtc.executionTime.getUTCFullYear(), 
        this.selectedQtc.executionTime.getUTCMonth(),
        this.selectedQtc.executionTime.getUTCDay());
      executionTime = {
        hour: this.selectedQtc.executionTime.getUTCHours(),
        minute: this.selectedQtc.executionTime.getUTCMinutes(),
        second: this.selectedQtc.executionTime.getUTCSeconds(),
      };
    }
    this.createQtcForm = this.formBuilder.group({
      telecommandID: this.isEditing ? this.selectedQtc.telecommandID : this.telecommands[0].telecommandID,
      priorityLevel: this.isEditing ? this.selectedQtc.priorityLevel : false,
      executionDate: executionDate,
      executionTime: executionTime,
    });
  }

  updateTelecommand(id: number) : void
  {
    this.selectedTelecommand = this.telecommands.find(x => x.telecommandID == id);
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
