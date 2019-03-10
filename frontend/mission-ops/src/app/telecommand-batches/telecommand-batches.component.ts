import { Component, OnInit } from '@angular/core';
import { TelecommandBatch } from '../../classes/telecommandBatch';
import { TelecommandBatchService } from '../services/telecommandBatch/telecommand-batch.service';
import { PresetTelecommand } from '../../classes/presetTelecommand';
import { PresetTelecommandService } from '../services/presetTelecommand/preset-telecommand.service';

@Component({
  selector: 'app-telecommand-batches',
  templateUrl: './telecommand-batches.component.html',
  styleUrls: ['./telecommand-batches.component.scss']
})
export class TelecommandBatchesComponent implements OnInit {

  telecommandBatches: TelecommandBatch[];
  selectedBatch: TelecommandBatch;
  selectedPresetTelecommands: PresetTelecommand[];
  constructor(private telecommandBatchService: TelecommandBatchService, private presetTelecommandService: PresetTelecommandService) { }

  ngOnInit() {
    this.getTelecommandBatches();
  }

  saveBatchName(): void{
    this.telecommandBatchService.updateTelecommandBatch(this.selectedBatch)
    .subscribe(results => { /* dont need to do anything for the momment */});
  }

  addNewTelecommandBatch() : void{
    var newTelecommandBatch = new TelecommandBatch("new Telecommand Batch");
    this.telecommandBatchService.createNewTelecommandBatch(newTelecommandBatch)
      .subscribe(results =>{
        this.getTelecommandBatches();
      });
  }

  onSelect(batch: TelecommandBatch): void {
    this.selectedBatch = batch;
    
    // get the preset telecommands for the newly selected batch
    this.presetTelecommandService.getPresetTelecommands(batch.batchID)
      .subscribe(presetTelecommands => this.selectedPresetTelecommands = presetTelecommands);
  }

  relaodPresetTelecommands(){
    this.presetTelecommandService.getPresetTelecommands(this.selectedBatch.batchID)
      .subscribe(presetTelecommands => this.selectedPresetTelecommands = presetTelecommands);
  }

  getTelecommandBatches(): void {
    this.selectedPresetTelecommands = [];
    this.selectedBatch = null;
    this.telecommandBatchService.getTelecommandBatches()
      .subscribe(batches => this.telecommandBatches = batches);
  }

  deleteBatch(): void{
    this.telecommandBatchService.deleteTelecommandBatch(this.selectedBatch.batchID)
      .subscribe(results => {
        this.getTelecommandBatches();
      });
  }
}
