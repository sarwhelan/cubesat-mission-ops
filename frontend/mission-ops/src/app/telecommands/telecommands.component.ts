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
  
  constructor(private telecommandService: TelecommandService) { }

  ngOnInit() {
    this.getTelecommands();
  }

  onSelect(telecommand: Telecommand): void {
    this.selectedTelecommand = telecommand;
  }

  getTelecommands(): void {
    this.telecommandService.getTelecommands()
      .subscribe(telecommands => this.telecommands = telecommands);
  }

}
