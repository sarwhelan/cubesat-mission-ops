import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PanoramicMediaService } from 'src/app/services/panoramic-media/panoramic-media.service';
import { PanoramicMedia } from 'src/classes/panoramic-media';

@Component({
  selector: 'app-media-view',
  templateUrl: './media-view.component.html',
  styleUrls: ['./media-view.component.scss']
})
export class MediaViewComponent implements OnInit {

  private media: PanoramicMedia;

  constructor(private route: ActivatedRoute, private mediaService: PanoramicMediaService) { 
    const mediaId = this.route.snapshot.queryParamMap.get('id');
    if (mediaId) {
      this.mediaService.getMedia(mediaId).subscribe((val) => {
        this.media = val;
      }, (err) => {
        console.log(err);
      });
    }
  }

  ngOnInit() {
  }

}
