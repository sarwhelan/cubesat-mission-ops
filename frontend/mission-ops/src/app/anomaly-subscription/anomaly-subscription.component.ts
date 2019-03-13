import { Component, OnInit } from '@angular/core';
import { SubscriptionsService } from 'src/app/services/subscriptions/subscriptions.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'src/classes/subscription';
import { System } from 'src/classes/system';
import { SystemService } from 'src/app/services/system/system.service';

@Component({
  selector: 'app-anomaly-subscription',
  templateUrl: './anomaly-subscription.component.html',
  styleUrls: ['./anomaly-subscription.component.scss']
})
export class AnomalySubscriptionComponent implements OnInit {

  subscriptions: Subscription[];
  selectedSub: Subscription;
  systems: System[];

  constructor(private route: ActivatedRoute, private subService: SubscriptionsService, private systemService: SystemService) { }

  ngOnInit() {
    const userID = this.route.snapshot.queryParamMap.get('id');
    this.getSubscriptions(userID);
  }

  getSubscriptions(userID) {
    this.subService.getSubscriptions(userID)
      .subscribe(subscriptions => { 
        this.subscriptions = subscriptions;
        this.getSystems();
      });
  }

  addSubscription(systemID) {
    const userID = this.route.snapshot.queryParamMap.get('id');
    this.subService.addSubscription(systemID, userID)
      .subscribe(response => {
        this.getSubscriptions(userID);
      })
  }

  getSystems() {
    this.systemService.getSystems()
      .subscribe(systems => {
        for (var i = 0; i < this.subscriptions.length; i++) {
          for (var j = 0; j < systems.length; j++) {
            if (this.subscriptions[i].systemID == systems[j].systemID) {
              systems.splice(j, 1);
            }
          }
        }
        this.systems = systems;
    })
  }

  selectSub(sub: Subscription) {
    this.selectedSub = sub;
  }

  removeSub() {
    const userID = this.route.snapshot.queryParamMap.get('id');
    this.subService.deleteSubscription(this.selectedSub.systemID, userID)
      .subscribe(response => {
        this.getSubscriptions(userID);
      })
  }

}
