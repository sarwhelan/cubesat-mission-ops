import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

import { HeaderItem } from 'src/classes/headerItem';

/**
 * The navigation header of the application.
 * 
 * @class HeaderComponent
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /**
   * The currently selected item in the header,
   * if any.
   * 
   * @memberof HeaderComponent
   */
  activeHeader: HeaderItem;

  /**
   * The current items in the navigation bar, with
   * their associated route, as a HeaderItem.
   * 
   * @memberof HeaderComponent
   */
  headers: HeaderItem[] = [
    new HeaderItem("Queue", "/queue"),
    new HeaderItem("Telecommands", "/telecommands"),
    new HeaderItem("Telecommand Batches", "/telecommandBatches"),
    new HeaderItem("Telemetry", "/telemetry"),
    new HeaderItem("Anomalies", "/anomalies"),
    new HeaderItem("Payload Data", "/payloadData"),
  ];

  /**
   * For responsiveness, states whether or not the hamburger
   * menu is open or closed.
   * 
   * @memberof HeaderComponent
   */
  isCollapsed = true;

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
      } else {
        if (this.activeHeader.route != this.router.url)
          {
            this.activeHeader = null;
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
