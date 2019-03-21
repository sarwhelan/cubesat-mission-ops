import { Component, OnInit } from '@angular/core';

/**
 * A generic footer containing the current year.
 * 
 * @class FooterComponent
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  /**
   * The current year in UTC.
   * 
   * @memberof FooterComponent
   */
  currentYear: number;

  constructor() { }

  ngOnInit() {
    this.currentYear = new Date().getUTCFullYear();
  }

}
