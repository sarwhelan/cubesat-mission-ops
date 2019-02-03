import { Component, OnInit } from '@angular/core';
import { HeaderItem } from '../../classes/headerItem';
import { Router } from '@angular/router';

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
  ];

  constructor(private router: Router) {  
    
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
