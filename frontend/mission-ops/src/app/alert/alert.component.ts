import { Component, OnInit, Input } from '@angular/core';

/**
 * A component representing a standard dismissable bootstrap alert with a heading and body.
 * To include in html, use `<app-alert [alertStyle]="'danger'"></app-alert>`, where danger 
 * can be replaced with any valid bootstrap style (primary, secondary, success, etc). To 
 * show and hide, add `@ViewChild(AlertComponent) alertVarName: AlertComponent` to the 
 * parent component to obtain a reference to the alert component, then just call the 
 * component's show and hide methods using that reference.
 *
 * @export
 * @class AlertComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  private alertClasses = 'alert alert-primary';

  @Input()
  set alertStyle(alertStyle: string) {
    if (alertStyle) {
      this.alertClasses = `alert alert-${alertStyle}`;
    }
  }

  private showAlert: boolean = false;
  private heading: string;

  private listBody: boolean;
  private body: string;
  private bodyList: Array<string>;

  constructor() { }

  ngOnInit() {
  }

  /**
   * Shows the alert and sets its properties to the provided values.
   * Displays the body as a simple paragraph.
   *
   * @param {string} heading The heading for the alert to display.
   * @param {string} body The body of the alert.
   * @param {string} [alertStyle] The style to set the alert to. Can be any valid bootstrap style (primary, secondary, success, etc).
   * @memberof AlertComponent
   */
  public show(heading: string, body: string, alertStyle?: string): void {
    this.listBody = false;
    this.heading = heading;
    this.body = body;
    if (alertStyle) {
      this.alertStyle = alertStyle;
    }
    this.showAlert = true;
  }

  /**
   * Shows the alert and sets its properties to the provided values.
   * Displays the body as an unordered list.
   *
   * @param {string} heading The heading for the alert to display.
   * @param {Array<string>} body The list of items that make up the body of the alert.
   * @param {string} [alertStyle] The style to set the alert to. Can be any valid bootstrap style (primary, secondary, success, etc).
   * @memberof AlertComponent
   */
  public showList(heading: string, body: Array<string>, alertStyle?: string): void {
    this.listBody = true;
    this.heading = heading;
    this.bodyList = body;
    if (alertStyle) {
      this.alertStyle = alertStyle;
    }
    this.showAlert = true;
  }
  
  /**
   * Hides the alert.
   *
   * @memberof AlertComponent
   */
  public hide(): void {
    this.showAlert = false;
  }
}
