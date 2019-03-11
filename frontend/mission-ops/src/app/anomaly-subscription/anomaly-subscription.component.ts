import { Component, OnInit } from '@angular/core';
import { SubscriptionsService } from '../services/subscriptions/subscriptions.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from '../../classes/subscription';
import { System } from '../../classes/system';
import { SystemService } from '../services/system/system.service';

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
    this.getSystems();
  }

  getSubscriptions(userID) {
    this.subService.getSubscriptions(userID)
      .subscribe(subscriptions => { 
        this.subscriptions = subscriptions;
      });
  }

  addSubscription(systemID) {
    console.log("adding subscription to " + systemID);
  }

  getSystems() {
    console.log("getting systems...");
    this.systemService.getSystems()
      .subscribe(systems => {
        this.systems = systems;
    })
    console.log(this.systems);
  }

  selectSub(systemID) {
    console.log("selected subscription " + systemID);
  }

}
