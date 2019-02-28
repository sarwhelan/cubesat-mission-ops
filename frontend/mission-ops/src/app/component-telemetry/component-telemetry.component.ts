import { Component, OnInit, Input } from '@angular/core';
import { ComponentTelemetryService } from '../services/component-telemetry/component-telemetry.service';
import { ComponentTelemetry } from 'src/classes/component-telemetry';
import { Component as CubeSatComp } from '../../classes/component';
 
@Component({
  selector: 'app-component-telemetry',
  templateUrl: './component-telemetry.component.html',
  styleUrls: ['./component-telemetry.component.scss']
})
export class ComponentTelemetryComponent implements OnInit {
  
  private _component: CubeSatComp;

  @Input() 
  private get component() {
    return this._component;
  }
  private set component(val: CubeSatComp) {
    this._component = val;
    this.getComponentTelemetries(this._component.componentID);
  }

  componentTelemetries: ComponentTelemetry[];

  constructor(private componentTelemetryService: ComponentTelemetryService) { }

  ngOnInit() {
    console.log('init comp telemetry');
    this._component = this._component;
    this.getComponentTelemetries(this.component.componentID);
  }

  getComponentTelemetries(componentID: number): void {
    console.log('get comp telemetries from ' + componentID);
    this.componentTelemetryService.getComponentTelemetries(componentID)
      .subscribe(componentTelemetries => this.componentTelemetries = componentTelemetries);
  }

}
