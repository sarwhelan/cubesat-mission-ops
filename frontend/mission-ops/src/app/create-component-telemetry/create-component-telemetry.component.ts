import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { System } from 'src/classes/system';
import { Component as CubeSatComp } from 'src/classes/component';
import { TelemetryType } from 'src/classes/telemetry-type';
import { ComponentTelemetry } from 'src/classes/component-telemetry';
import { AlertComponent } from 'src/app/alert/alert.component';

/**
 * The component describing the modal window for creating/editing a
 * ComponentTelemetry object.
 */
@Component({
  selector: 'app-create-component-telemetry',
  templateUrl: './create-component-telemetry.component.html',
  styleUrls: ['./create-component-telemetry.component.scss']
})

export class CreateComponentTelemetryComponent implements OnInit {

  /**
   * The form group to associate the ComponentTelemetry to.
   */
  @Input() createCompTelemForm: FormGroup;
  
  /**
   * The System that the ComponentTelemetry will be associated with.
   * 
   * @memberof CreateComponentTelemetryComponent
   */
  public system: System;

  /**
   * The Component that the ComponentTelemetry will be associated with.
   * 
   * @memberof CreateComponentTelemetryComponent
   */
  public component: CubeSatComp;

  /**
   * The collection of TelemetryTypes that the ComponentTelemetry 
   * can be associated with.
   * 
   * @memberof CreateComponentTelemetryComponent
   */
  public telemetryTypes: TelemetryType[];
  
  /**
   * If the component is modifying an existing ComponentTelemetry,
   * or creating a new ComponentTelemetry.
   * 
   * @memberof CreateComponentTelemetryComponent
   */
  isEditing: boolean;

  /**
   * If the ComponentTelemetry has upper/lower bounds associated
   * with it.
   * 
   * @memberof CreateComponentTelemetryComponent
   */
  hasBounds: boolean;

  /**
   * If the ComponentTelemetry is being edited (isEditing is true), the
   * ComponentTelemetry to be modified. Can be null (if creating new).
   * 
   * @memberof CreateComponentTelemetryComponent
   */
  selectedCompTelem: ComponentTelemetry;
  
  /**
   * The title of the modal, which changes depending on if we
   * are editing an existing ComponentTelemetry or creating a new one.
   * 
   * @memberof CreateComponentTelemetryComponent
   */
  modalTitle: string;

  /**
   * The text of the modal submit button, which changes depending on 
   * if we are editing an existing ComponentTelemetry or creating a new one.
   * 
   * @memberof CreateComponentTelemetryComponent
   */
  modalSubmit: string;

  /**
   * The currently selected TelemetryType in the modal window dropdown.
   */
  selectedTelemetryType: TelemetryType;
  
  /**
   * Previews errors in the form to the user.
   */
  @ViewChild(AlertComponent)
  private alert: AlertComponent;

  /**
   * Constructs a new instance of the CreateComponentTelemetryComponent.
   * @param activeModal 
   * @param formBuilder 
   */
  constructor(public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder) 
    { }

  ngOnInit() {
    // Assigns an appropriate title and button text, depending on the
    // isEditing value.
    if (!this.isEditing) {
      this.modalTitle = "Add New Component Telemetry";
      this.modalSubmit = "Add New Component Telemetry";
    } else {
      this.modalTitle = "Modify Component Telemetry";
      this.modalSubmit = "Save Changes";
    }

    
    this.hasBounds = this.isEditing ? this.selectedCompTelem.hasBounds : false;;
    this.updateTelemetryType(this.isEditing ? this.selectedCompTelem.telemetryTypeID : this.telemetryTypes[0].telemetryTypeID);
    this.createForm();
  }

  /**
   * Creates the form to edit or create a ComponentTelemetry.
   * 
   * @private
   * @memberof CreateComponentTelemetryComponent
   */
  private createForm() : void
  {
    this.createCompTelemForm = this.formBuilder.group({
      name: this.isEditing ? this.selectedCompTelem.name : '',
      telemetryTypeID: this.selectedTelemetryType.telemetryTypeID,
      newComponentTelemetryHasBounds: this.isEditing ? this.selectedCompTelem.hasBounds : false,
      upperBound: this.isEditing ? this.selectedCompTelem.upperBound : 0,
      lowerBound: this.isEditing ? this.selectedCompTelem.lowerBound : 0,
    });
  }

  /**
   * Checks if the form fields are all valid. If they are not, 
   * an Alert will show to the user and returns false.
   * 
   * @private
   * @memberof CreateComponentTelemetryComponent
   */
  private isFormValid(newCompTelem: ComponentTelemetry) : boolean
  {
    this.alert.hide();

    var errorMessages: string[] = [];

    if (newCompTelem.name.trim() == "")
    {
      errorMessages.push("Component telemetry must have a name.");
    }

    if (!newCompTelem.telemetryTypeID)
    {
      errorMessages.push("Component telemetry must have an associated telemetry type.");
    }

    if (newCompTelem.hasBounds)
    {
      // isNaN doesn't catch null so we need to this
      if ((!newCompTelem.lowerBound && newCompTelem.lowerBound != 0) || isNaN(newCompTelem.lowerBound))
      {
        errorMessages.push("Lower bound must be a valid number.");
      }
  
      if ((!newCompTelem.upperBound && newCompTelem.upperBound != 0) || isNaN(newCompTelem.upperBound))
      {
        errorMessages.push("Upper bound must be a valid number.");
      }
  
      if (newCompTelem.upperBound < newCompTelem.lowerBound)
      {
        errorMessages.push("Lower bound must not exceed upper bound.");
      }
    }

    if (errorMessages.length > 0) {
      this.alert.show('Error', errorMessages);
      
      return false;
    }

    return true;
  }

  /**
   * Updates the selected TelemetryType object, because dropdowns
   * are weird.
   * 
   * @param id The ID of the selected TelemetryType.
   * @memberof CreateComponentTelemetryComponent
   */
  updateTelemetryType(id: number) : void
  {
    this.selectedTelemetryType = this.telemetryTypes.find(x => x.telemetryTypeID == id);
    var boundReset = 0;

    if (this.createCompTelemForm) {
      this.createCompTelemForm.setValue({
        upperBound: boundReset, 
        lowerBound: boundReset,
        newComponentTelemetryHasBounds: this.hasBounds,
        telemetryTypeID: this.createCompTelemForm.get('telemetryTypeID').value,
        name: this.createCompTelemForm.get('name').value
      });
    }
  }

  /**
   * Submits a new ComponentTelemetry back as the modal result if new,
   * otherwise edits the current ComponentTelemetry and returns it as the
   * modal result.
   * 
   * @memberof CreateComponentComponent
   */
  submitNewCompTelem() : void
  {
    this.alert.hide();
    // if we are adding a new componentTelemetry
    if (!this.isEditing){
      var newCT = new ComponentTelemetry(this.createCompTelemForm.value.telemetryTypeID, 
        this.component.componentID,
        this.createCompTelemForm.value.name, 
        this.createCompTelemForm.value.newComponentTelemetryHasBounds,
        this.createCompTelemForm.value.newComponentTelemetryHasBounds ? this.createCompTelemForm.value.upperBound : null, 
        this.createCompTelemForm.value.newComponentTelemetryHasBounds ? this.createCompTelemForm.value.lowerBound : null);
      if (!this.isFormValid(newCT)) return;

      this.activeModal.close(newCT);
    }

    // If we are editing an existing component
    else {
      this.selectedCompTelem.name = this.createCompTelemForm.value.name;
      this.selectedCompTelem.telemetryTypeID = this.createCompTelemForm.value.telemetryTypeID;
      this.selectedCompTelem.hasBounds = this.createCompTelemForm.value.newComponentTelemetryHasBounds;
      this.selectedCompTelem.upperBound = this.createCompTelemForm.value.newComponentTelemetryHasBounds ? this.createCompTelemForm.value.upperBound : null;
      this.selectedCompTelem.lowerBound = this.createCompTelemForm.value.newComponentTelemetryHasBounds ? this.createCompTelemForm.value.lowerBound : null;

      if (!this.isFormValid(this.selectedCompTelem)) return;

      this.activeModal.close(this.selectedCompTelem);
    }
    this.activeModal.close(this.createCompTelemForm.value);
  }

  /**
   * Closes the modal window.
   */
  closeModal() : void
  {
    this.activeModal.close('closed');
  }

}
