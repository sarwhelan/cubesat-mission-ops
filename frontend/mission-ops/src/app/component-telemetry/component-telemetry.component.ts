import { Component, OnInit, Input } from '@angular/core';

import { ComponentTelemetryService } from 'src/app/services/component-telemetry/component-telemetry.service';
import { ComponentTelemetry } from 'src/classes/component-telemetry';
import { Component as CubeSatComp } from 'src/classes/component';
import { TelemetryType } from 'src/classes/telemetry-type';

/**
 * The component describing component telemetry objects.
 * 
 * @class ComponentTelemetryComponent
 */
@Component({
  selector: 'app-component-telemetry',
  templateUrl: './component-telemetry.component.html',
  styleUrls: ['./component-telemetry.component.scss']
})

export class ComponentTelemetryComponent implements OnInit {
  
  private _component: CubeSatComp;

  /**
   * The date range object, to pass through to telemetry data
   * for graph updating.
   * 
   * @memberof ComponentTelemetryComponent
   */
  @Input() dateRangeObj: any;

  /**
   * The telemetry types available, to pass through to
   * telemetry data for graph updating.
   * 
   * @memberof ComponentTelemetryComponent
   */
  @Input() telemetryTypes : TelemetryType[];

  /**
   * The component for which the component telemetry is
   * generated.
   * 
   * @private
   * @memberof ComponentTelemetryComponent
   */
  @Input() 
  private get component() {
    return this._component;
  }
  private set component(val: CubeSatComp) {
    this._component = val;
    this.getComponentTelemetries(this._component.componentID);
  }

  /**
   * The component telemetry collection, before we realized
   * it was Telemetry even when plural. Oops.
   * 
   * @memberof ComponentTelemetryComponent
   */
  componentTelemetries: ComponentTelemetry[];

  /**
   * Creates a new instance of the ComponentTelemetryComponent component.
   * @param componentTelemetryService 
   */
  constructor(private componentTelemetryService: ComponentTelemetryService) { }

  ngOnInit() {
    this._component = this._component;
    this.getComponentTelemetries(this.component.componentID);
  }

  /**
   * Retrieves the component telemetry associated with the given
   * component and assigns it to the used collection asynchronously.
   * @param componentID The specified Component's ID.
   */
  getComponentTelemetries(componentID: number): void {
    this.componentTelemetryService.getComponentTelemetries(componentID)
      .subscribe(componentTelemetries => {
        this.componentTelemetries = componentTelemetries;
      });
  }

}
