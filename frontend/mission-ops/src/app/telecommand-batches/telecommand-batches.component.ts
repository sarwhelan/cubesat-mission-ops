import { Component, OnInit } from '@angular/core';
import { TelecommandBatch } from '../../classes/telecommandBatch';
import { TelecommandBatchService } from '../services/telecommandBatch/telecommand-batch.service';

@Component({
  selector: 'app-telecommand-batches',
  templateUrl: './telecommand-batches.component.html',
  styleUrls: ['./telecommand-batches.component.scss']
})
export class TelecommandBatchesComponent implements OnInit {

  telecommandBatches: TelecommandBatch[];
  selectedBatch: TelecommandBatch;
  constructor(private telecommandBatchService: TelecommandBatchService) { }

  ngOnInit() {
    this.getTelecommandBatches();
  }

  onSelect(batch: TelecommandBatch): void {
    this.selectedBatch = batch;
  }

  getTelecommandBatches(): void {
    this.telecommandBatchService.getTelecommandBatches()
      .subscribe(batches => this.telecommandBatches = batches);
  }
}
