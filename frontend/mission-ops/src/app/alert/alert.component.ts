import { Component, OnInit, Input } from '@angular/core';

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

  public show(heading: string, body: string): void {
    this.listBody = false;
    this.heading = heading;
    this.body = body;
    this.showAlert = true;
  }

  public showList(heading: string, body: Array<string>): void {
    this.listBody = true;
    this.heading = heading;
    this.bodyList = body;
    this.showAlert = true;
  }
  
  public hide(): void {
    this.showAlert = false;
  }
}
