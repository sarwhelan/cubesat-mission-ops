import { Component, OnInit } from '@angular/core';
import { Component as CubeSatComp } from '../../classes/component';
import { ComponentService } from '../services/component/component.service';

@Component({
  selector: 'app-component-list',
  templateUrl: './component-list.component.html',
  styleUrls: ['./component-list.component.scss']
})
export class ComponentListComponent implements OnInit {
  components: CubeSatComp[];
  selectedComponent: CubeSatComp;

  constructor(private componentService: ComponentService) { }

  ngOnInit() {
    this.getComponents();
  }

  onSelect(component: CubeSatComp): void {
    this.selectedComponent = component;
  }

  getComponents(): void {
    this.componentService.getComponents()
      .subscribe(components => this.components = components);
  }

}
