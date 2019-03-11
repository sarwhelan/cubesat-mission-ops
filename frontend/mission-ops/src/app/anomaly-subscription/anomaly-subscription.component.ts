import { Component, OnInit } from '@angular/core';
import { SubscriptionsService } from '../services/subscriptions/subscriptions.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from '../../classes/subscription';

@Component({
  selector: 'app-anomaly-subscription',
  templateUrl: './anomaly-subscription.component.html',
  styleUrls: ['./anomaly-subscription.component.scss']
})
export class AnomalySubscriptionComponent implements OnInit {

  subscriptions: Subscription[];
  selectedSub: Subscription;

  constructor(private route: ActivatedRoute, private subService: SubscriptionsService) { }

  ngOnInit() {
    const userID = this.route.snapshot.queryParamMap.get('id');
    this.getSubscriptions(userID);
  }

  getSubscriptions(userID) {
    this.subService.getSubscriptions(userID).subscribe(subscriptions => this.subscriptions = subscriptions);
  }

}
