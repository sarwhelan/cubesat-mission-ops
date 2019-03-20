import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { empty } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { retry, catchError } from 'rxjs/operators';

import { environment as env } from 'src/environments/environment';
import { Pass } from 'src/classes/pass';
import { QueuedTelecommandService } from 'src/app/services/queuedTelecommand/queued-telecommand.service';
import { QueuedTelecommand } from 'src/classes/queuedTelecommand';
import { Telecommand } from 'src/classes/telecommand';
import { User } from 'src/classes/user';
import { UsersService } from 'src/app/services/users/users.service';

/**
 * The component housing the transmission queue.
 * 
 * @class TransmissionQueueComponent
 */
@Component({
  selector: 'app-transmission-queue',
  templateUrl: './transmission-queue.component.html',
  styleUrls: ['./transmission-queue.component.scss']
})

export class TransmissionQueueComponent implements OnInit {

  /**
   * The selected pass for which to display the queue.
   * 
   * @memberof TransmissionQueueComponent
   */
  @Input() selectedPass: Pass;

  /**
   * The telecommands to pass through to the queued telecommand component.
   * 
   * @memberof TransmissionQueueComponent
   */
  @Input() telecommands: Telecommand[];
  
  /**
   * The collection of queued telecommands for the specified pass.
   * 
   * @memberof TransmissionQueueComponent
   */
  private passQueuedTelecommands: QueuedTelecommand[];

  /**
   * The collection of users.
   * 
   * @memberof TransmissionQueueComponent
   */
  users: User[]

  /**
   * Constructs a new instance of the TransmissionQueueComponent component.
   * @param userService 
   * @param queuedTelecommandService 
   * @param http 
   * @param toastr 
   */
  constructor(private userService: UsersService, 
    private queuedTelecommandService: QueuedTelecommandService,
    private http: HttpClient,
    private toastr: ToastrService) { }

  ngOnInit() {
    // Retrieves all users.
    this.userService.getUsers(Number.MAX_SAFE_INTEGER - 1)
      .subscribe(users => {
        this.users = users.items
        this.reloadQueuedTelecommands();
      });
  }

  ngOnChanges(changes: SimpleChanges) : void
  {
    // If the pass selection changes after the initial load, reload
    // queued telecommands.
    if (changes.selectedPass && !changes.selectedPass.firstChange)
    {
      this.reloadQueuedTelecommands();
    }
  }

  /**
   * Reloads queued telecommands based on the transmission pass ID given.
   * 
   * @memberof TransmissionQueueComponent
   */
  reloadQueuedTelecommands(){
    this.queuedTelecommandService.getQueuedTelecommandsTransmission(this.selectedPass)
      .subscribe(qtc => this.passQueuedTelecommands = qtc);
  }

  /**
   * Submits the current collection of queued telecommands to the ground station
   * server via POST.
   * 
   * @memberof TransmissionQueueComponent
   */
  submitTransmissionQueueToGroundStation(){
      this.http.post(`${env.groundStationIP}/queue/${this.selectedPass.passID}`, { queue: this.passQueuedTelecommands})
      .pipe(
        retry(1),
        catchError(val => {
          this.handleSubmitError(val);
          return empty();
        }))
      .subscribe(_ => {
        this.toastr.success(`Transmitted queue for Pass ${this.selectedPass.passID} to ground station.`, "Success!");
      });
  }

  /**
   * The error handling method called when there was an error during a service request.
   * @param error The error object associated with this mighty failure.
   */
  handleSubmitError(error){
    this.toastr.error(`Error transmitting to the ground station: ${error.statusText} (Status Code ${error.status})`, "Ground station server error!");
  }
}
