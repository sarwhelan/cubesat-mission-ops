import { Component, OnInit } from '@angular/core';
import { HeaderItem } from '../../classes/headerItem';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  activeHeader: HeaderItem;
  headers: HeaderItem[] = [
    new HeaderItem("Queue", "/queue"),
    new HeaderItem("Telecommands", "/telecommands"),
    new HeaderItem("Telecommand Batches", "/telecommandBatches"),
    new HeaderItem("Telemetry", "/telemetry"),
  ];

  constructor(private router: Router, private auth: AuthService) {  
    
    // This allows the active header to be selected even when the page is refreshed
    this.router.events.subscribe(val => {
      if (this.activeHeader == null)
      {
        for (let header of this.headers)
        {
          if (header.route == this.router.url)
          {
            this.activeHeader = header;
            break;
          }
        }
      }
    });
  }

  ngOnInit() {
  }

  onSelect(newActiveHeader: HeaderItem): void{
    this.activeHeader = newActiveHeader;
  }

}
