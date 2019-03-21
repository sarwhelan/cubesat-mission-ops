import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Observable, forkJoin, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { async } from '@angular/core/testing';
import * as moment from 'moment';
const dateFormat = require('dateformat');

import { Pass } from '../../classes/pass';
import { PassService } from '../services/pass/pass.service';
import { CreateQueuedTelecommandComponent } from '../create-queued-telecommand/create-queued-telecommand.component';
import { TelecommandService } from 'src/app/services/telecommand/telecommand.service';
import { Telecommand } from 'src/classes/telecommand';
import { QueuedTelecommandService } from 'src/app/services/queuedTelecommand/queued-telecommand.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { QueuedTelecommand } from 'src/classes/queuedTelecommand';
import { TelecommandBatchService } from 'src/app/services/telecommandBatch/telecommand-batch.service';
import { TelecommandBatch } from 'src/classes/telecommandBatch';
import { PresetTelecommandService } from 'src/app/services/presetTelecommand/preset-telecommand.service';
import { PassSum } from 'src/classes/pass-sum';
import { CreatePassComponent } from '../create-pass/create-pass.component';

/**
 * A component housing the Queue page, including the Pass listings,
 * the Transmission Queue and the Execution Queue.
 * 
 * @class QueuesComponent
 */
@Component({
  selector: 'app-queues',
  templateUrl: './queues.component.html',
  styleUrls: ['./queues.component.scss','../../../node_modules/ngx-toastr/toastr.css'],
  providers: [PassService]
})
export class QueuesComponent implements OnInit {

  /**
   * The collection of Passes that have not returned from
   * the CubeSat yet.
   * 
   * @memberof QueuesComponent
   */
  futurePasses: Pass[];

  /**
   * An Observable of the future Passes listing, created
   * for lazy loading of the Pass data.
   * 
   * @memberof QueuesComponent
   */
  futurePassesObs: Observable<Pass[]>;

  /**
   * An Observable of the total number of future Passes,
   * created for lazy loading of the total number.
   * 
   * @memberof QueuesComponent
   */
  futurePassesTotal: Observable<number>;

  /**
   * The collection of Passes that have returned from
   * the CubeSat.
   * 
   * @memberof QueuesComponent
   */
  pastPasses: Pass[];

  /**
   * An Observable of the past Passes listing, created
   * for lazy loading of the Pass data.
   * 
   * @memberof QueuesComponent
   */
  pastPassesObs: Observable<Pass[]>;

  /**
   * An Observable of the total number of past Passes,
   * created for lazy loading of the total number.
   * 
   * @memberof QueuesComponent
   */
  pastPassesTotal: Observable<number>;

  /**
   * The available telecommands.
   * 
   * @memberof QueuesComponent
   */
  telecommands: Telecommand[];

  /**
   * The available telecommand batches.
   * 
   * @memberof QueuesComponent
   */
  telecommandBatches: TelecommandBatch[];

  /**
   * The current Pass that is selected.
   * 
   * @memberof QueuesComponent
   */
  selectedPass: Pass;

  /**
   * The calculated transmission pass ID to assign 
   * when adding a telecommand to the queue.
   * 
   * @memberof QueuesComponent
   */
  calculatedTransmissionID: number;

  /**
   * The calculated execution pass ID to assign
   * when adding a telecommand to the queue.
   * 
   * @memberof QueuesComponent
   */
  calculatedExecutionID: number;

  /**
   * The collection of PassSums for all passes
   * with transmission queue entries.
   * 
   * @memberof QueuesComponent
   */
  sumTransmissionResults : PassSum[];

  /**
   * The collection of PassSums for all passes
   * with execution queue entries.
   * 
   * @memberof QueuesComponent
   */
  sumExecutionResults : PassSum[];

  /**
   * The string to display on success of the 
   * telecommand being added to the queue.
   * 
   * @memberof QueuesComponent
   */
  additionSuccessStr: string = "";

  /**
   * The string to display on failure of the 
   * telecommand being added to the queue.
   * 
   * @memberof QueuesComponent
   */
  additionFailureStr: string = "";

  /**
   * Constructs a new instance of the QueuesComponent
   * component.
   * @param passService 
   * @param modalService 
   * @param telecommandService 
   * @param telecommandBatchService 
   * @param presetTelecommandService 
   * @param queuedTelecommandService 
   * @param auth 
   * @param toastr 
   */
  constructor(private passService: PassService,
    private modalService: NgbModal,
    private telecommandService: TelecommandService,
    private telecommandBatchService: TelecommandBatchService,
    private presetTelecommandService: PresetTelecommandService,
    private queuedTelecommandService: QueuedTelecommandService,
    private auth: AuthService,
    private toastr: ToastrService) {
      this.pastPassesObs = passService.pastPasses;
      this.futurePassesObs = passService.futurePasses;
      this.pastPassesTotal = passService.pastTotal;
      this.futurePassesTotal = passService.futureTotal;
     }

  /**
   * The tabset defined for the future/past Pass listings.
   * 
   * @private
   * @memberof QueuesComponent
   */
  private tabSet: NgbTabset;

  @ViewChild(NgbTabset) set content(content: NgbTabset) {
    this.tabSet = content;
  };

  ngOnInit() {
    this.getPasses(true);
    this.getTelecommands();
    this.getTelecommandBatches();
  }

  /**
   * Formats the date nicely for the UI.
   * 
   * @memberof QueuesComponent
   */
  getFormatedDate(unformatedDate: Date)
  {
    return dateFormat(unformatedDate, "dddd, mmmm dS, yyyy, HH:MM:ss");
  }

  /**
   * The event that fires on selecting a new Pass.
   * @param pass The selected pass.
   */
  onSelect(pass: Pass) : void
  {
    this.selectedPass = pass;
  }

  /**
   * Gets the entire Pass listing in the database
   * and populates the future and past Pass listings
   * asynchronously.
   * 
   * @param isPaginated 
   * @memberof QueuesComponent
   */
  getPasses(isPaginated: boolean = false) : void{   
    this.selectedPass = null; 
    this.futurePassesObs.subscribe(passes => {
        this.futurePasses = passes;
      });
    this.pastPassesObs.subscribe(passes => {
      this.pastPasses = passes;
    })
  }

  /**
   * Gets the entire Telecommands listing in the
   * database and populates the telecommand listings
   * asynchronously.
   * 
   * @memberof QueuesComponent
   */
  getTelecommands() : void
  {
    this.telecommandService.getTelecommands()
      .subscribe(tcs => {
        this.telecommands = tcs;
      });
  }

  /**
   * Gets the entire Telecommand Batches listing in the
   * database and populates the telecommand batches listings
   * asynchronously.
   * 
   * @memberof QueuesComponent
   */
  getTelecommandBatches() : void
  {
    this.telecommandBatchService.getTelecommandBatches()
      .subscribe(tbs => this.telecommandBatches = tbs);
  }

  /**
   * Spawns a CreatePassComponent modal window and handles on
   * success and on failure results.
   * 
   * @memberof QueuesComponent
   */
  promptAddPass() : void{
    const modalRef = this.modalService.open(CreatePassComponent);
    modalRef.result.then((result) => {
      this.passService.createPass(result)
        .subscribe(pass => {
          this.getPasses();
          this.toastr.success('Created a new pass.', "Success!");
        });
    }).catch((error) => {
      // Modal closed without submission
    });
  }

  /**
   * Spawns a CreateQueuedTelecommandComponent modal window and uses
   * the modal window results to create a QueuedTelecommand, with success
   * and failure handling.
   * 
   * @memberof QueuesComponent
   */
  promptAddQueuedTelecommand() : void
  {
    const modalRef = this.modalService.open(CreateQueuedTelecommandComponent);
    modalRef.componentInstance.isBatch = false;
    modalRef.componentInstance.telecommands = this.telecommands;
    modalRef.result.then((result) => {
      var userID = this.auth.getCurrentUser().id;
      var executionDate = moment(result.executionDate).utc(true);

      // Define the callback to pass to createQueuedTelecommands.
      var createQtc = (self, activePasses) => {
        var activeTelecommand = this.telecommands.find(x => x.telecommandID == result.telecommandID);
        
        // Calculate the pass IDs.
        var [transID, execID] = self.calculatePassIDs(activePasses, activeTelecommand, executionDate.toDate());
        
        // If no transmission or execution ID is available given the
        // constraints, return.
        if (transID === -1 || execID === -1) return of(null);
        var newQtc = new QueuedTelecommand(
          execID,
          transID,
          userID,
          result.telecommandID,
          result.priorityLevel,
          executionDate.toDate(),
          result.commandParams,
        );
        this.additionSuccessStr = `Queued telecommand ${activeTelecommand.name} for transmission in pass ${transID} and execution in pass ${execID}.\n`;
        return self.queuedTelecommandService.createBatchQueuedTelecommands(
          [Object.values(newQtc)]
        );
      }
      this.createQueuedTelecommands(createQtc);
    }).catch((error) => {
      // Modal closed without submission
    });
  }

  /**
   * Spawns a CreateQueuedTelecommandComponent modal window and uses
   * the modal window results to create a collection of QueuedTelecommand, 
   * with success and failure handling.
   * 
   * @memberof QueuesComponent
   */
  promptAddQueuedTelecommandBatch() : void
  {
    const modalRef = this.modalService.open(CreateQueuedTelecommandComponent);
    modalRef.componentInstance.isBatch = true;
    modalRef.componentInstance.telecommandBatches = this.telecommandBatches;
    modalRef.result.then((result) => {
      var userID = this.auth.getCurrentUser().id;
      var executionDate = moment(result.executionDate).utc(true);

      // Retrieve the preset telecommands with the given batch ID.
      this.presetTelecommandService.getPresetTelecommands(result.telecommandBatchID)
        .subscribe(ptcs => {
          // Define the callback to pass to createQueuedTelecommands.
          var createQtc = (self, activePasses) => {
            var pQtcBatch = [];
            var isValid = true;
            this.additionSuccessStr = "";
            for (var i = 0; i < ptcs.length; i++){
              // If a telecommand was not able to be added to the queue, stop.
              if (!isValid) continue;

              // Calculate the execution time of the telecommand based on the 
              // relative timing listed in the preset telecommand.
              var telecommandExecutionTime = executionDate.clone().add(ptcs[i].dayDelay, 'days')
                                                                  .add(ptcs[i].hourDelay, 'hours')
                                                                  .add(ptcs[i].minuteDelay, 'minutes')
                                                                  .add(ptcs[i].secondDelay, 'seconds');
              var activeTelecommand = this.telecommands.find(x => x.telecommandID == ptcs[i].telecommandID);
              
              // Calculate the pass IDs.
              var [transID, execID] = self.calculatePassIDs(activePasses, activeTelecommand, telecommandExecutionTime.toDate());
              
              // If no transmission or execution ID is available given the
              // constraints, stop iterating.
              if (transID === -1 || execID === -1) isValid = false;

              // Push the new telecommand to be added.
              pQtcBatch.push(Object.values(new QueuedTelecommand(
                execID,
                transID,
                userID,
                ptcs[i].telecommandID,
                ptcs[i].priorityLevel,
                telecommandExecutionTime.toDate(),
                ptcs[i].commandParameters,
              )));

              this.additionSuccessStr += `Queued telecommand ${activeTelecommand.name} for transmission in pass ${transID} and execution in pass ${execID}.\n`;
            }
            if (isValid) {
              return self.queuedTelecommandService.createBatchQueuedTelecommands(
                pQtcBatch
              );
            }
            return of(null);
          }
          this.createQueuedTelecommands(createQtc);
        });
    }).catch((error) => {
      // Modal closed without submission
    });
  }

  /**
   * Creates the queued telecommand in the queue based on PassSums and the
   * callback.
   * Must have at least one active pass and pass limits must exist.
   * 
   * @memberof QueuesComponent
   */
  createQueuedTelecommands(qtcCreation: (self, activeP: Pass[]) => Observable<any>) : void
  {
    let passTransmissionSums = this.passService.getPassTransmissionSums();
    let passExecutionSums = this.passService.getPassExecutionSums();
    
    // Wait for both sum results to return, then pipe.
    forkJoin([passTransmissionSums, passExecutionSums])
      .pipe(mergeMap(results => {
        this.sumTransmissionResults = results[0];
        this.sumExecutionResults = results[1];
        return qtcCreation(this, this.futurePasses);
      }))
      .subscribe(() => {
        // Fire off success or failure messages in the UI.
        if (this.additionFailureStr === ""){
          var additionSuccesses = this.additionSuccessStr.split('\n');
          for (var i = 0; i < additionSuccesses.length-1; i++){
            this.toastr.success(additionSuccesses[i], "Success!");
          }
        } else {
          this.toastr.error(this.additionFailureStr, "Oops!");
        }
        // Reset strings.
        this.additionFailureStr = "";
        this.additionSuccessStr = "";

        // Refresh passes.
        this.passService.refreshPasses();
        this.getPasses();        
      });
  }

  /**
   * Calculate the pass IDs based on the given constraints.
   * @param activePasses The current active passes.
   * @param activeTelecommand The current active telecommand to be processed.
   * @param executionTime The execution time of the telecommand.
   */
  calculatePassIDs(activePasses: Pass[], activeTelecommand: Telecommand, executionTime: Date) : [number, number]
  {
    var calcTransID, calcExecID;

    /** EXECUTION **/
    
    // If there are no sums for execution, assign the execution pass
    // ID to the first active pass available.
    if (!this.sumExecutionResults) {
      calcExecID = activePasses[0].passID;
    } 
    else {
      for (var i = 0; i < activePasses.length; i++) {
        var activePassDateTime = moment(activePasses[i].estimatedPassDateTime).utc(true).toDate();
        
        // If the current execution time is passed the active pass time, skip it.
        if (executionTime.getTime() > activePassDateTime.getTime()) continue;
        
        // If the first active pass time was not skipped, this means the execution 
        // datetime requested won't fit into the current Pass listings.
        if (i == 0) {
          this.additionFailureStr = 'No pass exists to execute this command. Create a new pass and try again.';
          break;
        }

        // Retrieve the current active pass and its associated PassSum.
        // Selects the index - 1 to correlate with the execution datetime.
        var activePass = activePasses[i - 1];
        var passSum = this.sumExecutionResults.find(x => x.passID == activePass.passID);

        // Execution queue: Limit passes on power.
        // Pass will be under capacity if the current telecommand power consumption
        // plus the sum of power is less than or equal to the total capacity.
        if (!passSum || passSum.sumPower + activeTelecommand.powerConsumption <= activePass.availablePower)
        {
          // If there is no PassSum but the current telecommand power consumption
          // exceeds the total pass power capacity, break.
          if (!passSum && activeTelecommand.powerConsumption > activePass.availablePower){
            this.additionFailureStr = 'Error: Cannot add telecommand to queue. Telecommand power consumption exceeds the maximum power limitation in one pass.'
            break;
          }

          // Assign the calculated execution pass ID.
          calcExecID = activePass.passID;

          // If there is no pass sum, add a new entry to the results to account
          // for further telecommands to be added to the queue in this instance
          // i.e. a batch.
          if (!passSum) {
            this.sumExecutionResults.push({passID: calcExecID, sumBandwidth: activeTelecommand.bandwidthUsage, sumPower: activeTelecommand.powerConsumption});
          }
          break;
        } else {
          this.additionFailureStr = 'Error: Pass capacity reached. Cannot queue telecommand within specified pass.';
          break;
        }
      }
    }

    // If no calculated execution pass ID is assigned, return error values.
    if (!calcExecID) {
      if (this.additionFailureStr === "") this.additionFailureStr = 'No passes currently exist that will contain the requested telecommand(s). Create a new pass or modify the maximum pass limits and try again.';
      return [-1,-1];
    }

    /** TRANSMISSION **/

    // If there are no sums for transmission, assign the transmission pass
    // ID to the first active pass available.
    if (!this.sumTransmissionResults) {
      calcTransID = activePasses[0].passID;
    }
    else {
      for (var i = 0; i < activePasses.length; i++) {
        // Retrieve the current active pass and its associated PassSum.
        var passSum = this.sumTransmissionResults.find(x => x.passID == activePasses[i].passID);
        var activePass = activePasses[i];

        // Execution queue: Limit passes on bandwidth.
        // Pass will be under capacity if the current telecommand bandwidth usage
        // plus the sum of bandwidth is less than or equal to the total capacity.
        if (!passSum || passSum.sumBandwidth + activeTelecommand.bandwidthUsage <= activePass.availableBandwidth)
        {
          // If there is no PassSum but the current telecommand bandwidth usage
          // exceeds the total pass bandwidth capacity, break.
          if (!passSum && activeTelecommand.bandwidthUsage > activePass.availableBandwidth){
            this.additionFailureStr = 'Error: Cannot add telecommand to queue. Telecommand bandwidth usage exceeds the maximum bandwidth limitation in one pass.'
            break;
          }

          // Assign the calculated transmission pass ID.
          calcTransID = activePasses[i].passID;

          // If there is no pass sum, add a new entry to the results to account
          // for further telecommands to be added to the queue in this instance
          // i.e. a batch.
          if (!passSum) {
            this.sumTransmissionResults.push({passID: calcTransID, sumBandwidth: activeTelecommand.bandwidthUsage, sumPower: activeTelecommand.powerConsumption});
          }
          break;
        }
      }

      // If no calculated transmission pass ID is assigned, return error values.
      if (!calcTransID) {
        if (this.additionFailureStr === "") this.additionFailureStr = 'No passes currently exist that will contain the requested telecommand(s). Create a new pass or modify the maximum pass limits and try again.';
        return [-1,-1];
      }
    }

    // Gets the index of the stored values to update with the active added
    // telecommands. This is required when considering batches.
    var sumTransmissionResultsIndex = this.sumTransmissionResults.findIndex(x => x.passID == calcTransID);
    var sumExecutionResultsIndex = this.sumExecutionResults.findIndex(x => x.passID == calcExecID);

    var sumTransmissionResultToModify = this.sumTransmissionResults[sumTransmissionResultsIndex]
    sumTransmissionResultToModify.sumBandwidth += activeTelecommand.bandwidthUsage;
    this.sumTransmissionResults[sumTransmissionResultsIndex] = sumTransmissionResultToModify;

    var sumExecutionResultToModify = this.sumExecutionResults[sumExecutionResultsIndex];
    sumExecutionResultToModify.sumPower += activeTelecommand.powerConsumption;
    this.sumExecutionResults[sumExecutionResultsIndex] = sumExecutionResultToModify;

    return [calcTransID, calcExecID];
  }
}
