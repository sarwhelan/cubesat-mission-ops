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
  newTelecommandErrorMessages: string[];
  
  constructor(private telecommandService: TelecommandService) { }

  ngOnInit() {
    this.getTelecommands();
    this.viewingExistingTelecommand = true;
  }

  onSelect(telecommand: Telecommand): void {
    this.selectedTelecommand = telecommand;
    this.viewingExistingTelecommand = true;
    this.newTelecommandErrorMessages = [];
  }

  addNewTelecommand(): void{
    var newTelecommand = new Telecommand("New Telecommand");
    this.viewingExistingTelecommand = false;
    this.telecommands.push(newTelecommand);
    this.selectedTelecommand = this.telecommands[this.telecommands.length - 1];
    this.newTelecommandErrorMessages = [];
  }  

  saveTelecommand() : void
  {
    // if the telecommand is not valid do not save it
    if (!this.checkIsValidTelecommand(this.selectedTelecommand)){
      return;
    }

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

  discardTelecommand(): void{    
    this.getTelecommands();
    this.selectedTelecommand = null;
    this.viewingExistingTelecommand = true;
  }

  checkIsValidTelecommand(newTelecommand: Telecommand) : boolean{

    var errorMessages: string[];
    errorMessages = ["Error: "];

    if (!newTelecommand.name)
    {
      errorMessages.push("Command must have a name.");
    }

    if (!newTelecommand.bandwidthUsage || isNaN(newTelecommand.bandwidthUsage))
    {
      errorMessages.push("Command must specify a bandwidth usage.");
    }

    if (!newTelecommand.powerConsumption || isNaN(newTelecommand.powerConsumption))
    {
      errorMessages.push("Command must specify a power consumption.");
    }

    if (!newTelecommand.command || !this.isJSON(newTelecommand.command))
    {
      errorMessages.push("Command must be specifed and be valid json.");
    }

    // if there is an error than display it and return false
    if (errorMessages.length != 1)
    {
      this.newTelecommandErrorMessages = errorMessages;
      return false;
    }

    this.newTelecommandErrorMessages = [];
    return true;
  }

  isJSON(str) :boolean {  
    try {
      var obj = JSON.parse(str);
      return !!obj && typeof(obj) === 'object';
    } catch (e) {
      /* ignore */
    }
  
    return false;
  }
}
