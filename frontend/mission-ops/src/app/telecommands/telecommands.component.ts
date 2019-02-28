import { Component, OnInit } from '@angular/core';
import { Telecommand } from '../../classes/telecommand';
import { TelecommandService } from '../services/telecommand/telecommand.service';

@Component({
  selector: 'app-telecommands',
  templateUrl: './telecommands.component.html',
  styleUrls: ['./telecommands.component.scss']
})
export class TelecommandsComponent implements OnInit {
  telecommands: Telecommand[];
  selectedTelecommand: Telecommand;
  viewingExistingTelecommand: boolean;
  
  constructor(private telecommandService: TelecommandService) { }

  ngOnInit() {
    this.getTelecommands();
    this.viewingExistingTelecommand = true;
  }

  onSelect(telecommand: Telecommand): void {
    this.selectedTelecommand = telecommand;
    this.viewingExistingTelecommand = true;
  }

  addNewTelecommand(): void{
    var newTelecommand = new Telecommand("New Telecommand");
    this.viewingExistingTelecommand = false;
    this.telecommands.push(newTelecommand);
    this.selectedTelecommand = this.telecommands[this.telecommands.length - 1];
  }  

  saveTelecommand() : void
  {
    //validate that its all cool

    // save telecommand
    this.telecommandService.createTelecommand(this.selectedTelecommand)
    .subscribe(response => {      
      this.viewingExistingTelecommand = true;
      this.selectedTelecommand.telecommandID = response.insertId;
    });
  }

  archiveTelecommand() : void
  {
    this.telecommandService.deleteTelecommand(this.selectedTelecommand.telecommandID)
    .subscribe(response =>
      {
        console.log("archive done!")
        this.getTelecommands();
        this.selectedTelecommand = null;
      });
  }

  getTelecommands(): void {
    this.telecommandService.getTelecommands()
      .subscribe(telecommands => {
        this.telecommands = [];

        for (var i = 0; i < telecommands.length; i++) {
          if (!telecommands[i].archived)
          {            
            this.telecommands.push(telecommands[i]);
          }
        }
      });
  }
}
