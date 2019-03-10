import { Component, OnInit, ElementRef, ViewChild, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { PanoViewer } from '@egjs/view360';

import { PanoramaInput } from 'src/classes/panorama-input';

@Component({
  selector: 'app-panorama-viewer',
  templateUrl: './panorama-viewer.component.html',
  styleUrls: ['./panorama-viewer.component.scss']
})
export class PanoramaViewerComponent implements OnInit, OnDestroy {

  @ViewChild('viewer')
  private viewerElement: ElementRef;

  @Input()
  private inputData: PanoramaInput;

  private viewer: PanoViewer;
  private viewerConfig: any = {
    // Put all config info about image format and etc in here
  };

  private loading: boolean = false;

  @Output()
  public ready: EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
    if (this.inputData) {
      this.loading = true;
      
      this.createViewer();
    }
  }

  ngOnDestroy() {
    if (this.viewer) {
      this.viewer.destroy();
    }
  }

  private buildConfig(): any {
    let viewerConfig: any = {};

    // Builds a config object from the master config and input data and puts it into viewerConfig
    if (this.inputData.type === 'image') {
      Object.assign(viewerConfig, this.viewerConfig, {
        image: this.inputData.src
      });
    } else {
      Object.assign(viewerConfig, this.viewerConfig, {
        video: this.inputData.src
      });
    }

    return viewerConfig;
  }

  private createViewer() {
    this.viewer = new PanoViewer(this.viewerElement.nativeElement as HTMLElement, this.buildConfig());

    this.viewer.on('ready', (eventData) => {
      this.loading = false;
      this.ready.emit();
    });
  }

  public setView(view: PanoramaInput) {
    let oldView = this.inputData;
    this.inputData = view;

    if (this.viewer && oldView.type === view.type) {
      this.loading = true;
      
      if (view.type === 'image') {
        this.viewer.setImage(view.src);
      } else {
        this.viewer.setVideo(view.src);
      }
    } else {
      // Either the viewer doesn't exist or we're changing from displaying an image to displaying a video or vice versa.
      // Either way, we now need to create a new viewer.
      if (this.viewer) {
        // Destroy the old viewer
        this.viewer.destroy();
      }
      this.createViewer();
    }

    if (view.type === 'video') {
      this.viewer.once('ready', (eventData) => {
        this.viewer.getVideo().loop = true;
        this.viewer.getVideo().play();
      });
    }
  }
}
