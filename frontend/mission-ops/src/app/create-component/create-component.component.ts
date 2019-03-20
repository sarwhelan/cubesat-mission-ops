import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { System } from 'src/classes/system';
import { Component as CubeSatComp } from 'src/classes/component';
import { AlertComponent } from 'src/app/alert/alert.component';

/**
 * The component describing the modal window for creating/editing a
 * Component object.
 */
@Component({
  selector: 'app-create-component',
  templateUrl: './create-component.component.html',
  styleUrls: ['./create-component.component.scss']
})

export class CreateComponentComponent implements OnInit {

  /**
   * The form group to associate the Component to.
   */
  @Input() createCompForm: FormGroup;

  /**
   * The System that the Component will be associated with.
   * 
   * @memberof CreateComponentComponent
   */
  public system: System;

  /**
   * If the component is modifying an existing Component, or
   * creating a new Component.
   * 
   * @memberof CreateComponentComponent
   */
  isEditing: boolean;

  /**
   * If the component is being edited (isEditing is true), the
   * component to be modified. Can be null (if creating new).
   * 
   * @memberof CreateComponentComponent
   */
  selectedComponent: CubeSatComp;

  /**
   * The title of the modal, which changes depending on if we
   * are editing an existing component or creating a new one.
   * 
   * @memberof CreateComponentComponent
   */
  modalTitle: string;

  /**
   * The text of the modal submit button, which changes depending on 
   * if we are editing an existing component or creating a new one.
   * 
   * @memberof CreateComponentComponent
   */
  modalSubmit: string;

  /**
   * Previews errors in the form to the user.
   */
  @ViewChild(AlertComponent)
  private alert: AlertComponent;

  /**
   * Contructs a new instance of the CreateComponentComponent component.
   * Component. COMPONENT.
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
      this.modalTitle = "Add New Component";
      this.modalSubmit = "Add New Component";
    } else {
      this.modalTitle = "Modify Component";
      this.modalSubmit = "Save Changes";
    }
    this.createForm();
  }

  /**
   * Creates the form to edit or create a Component.
   * 
   * @private
   * @memberof CreateComponentComponent
   */
  private createForm() : void
  {
    this.createCompForm = this.formBuilder.group({
      system: '',
      name: this.isEditing ? this.selectedComponent.name : ''
    });
  }

  /**
   * Checks if the form fields are all valid. If they are not, 
   * an Alert will show to the user and returns false.
   * 
   * @private
   * @memberof CreateComponentComponent
   */
  private isFormValid(newComp: CubeSatComp) : boolean
  {
    this.alert.hide();
    if (newComp.name.trim() == "")
    {
      this.alert.show('Error', 'Component must have a name.');
      return false;
    }

    return true;
  }

  /**
   * Submits a new Component back as the modal result if new,
   * otherwise edits the current Component and returns it as the
   * modal result.
   * 
   * @memberof CreateComponentComponent
   */
  submitNewComp() : void
  {
    this.alert.hide();
    if (!this.isEditing){
      var newComp = new CubeSatComp(this.system.systemID, this.createCompForm.value.name);
      if (!this.isFormValid(newComp)) return;
      this.activeModal.close(newComp);
    } else {
      this.selectedComponent.name = this.createCompForm.value.name;
      if (!this.isFormValid(this.selectedComponent)) return;
      this.activeModal.close(this.selectedComponent);
    }
  }

  /**
   * Closes the modal window.
   */
  closeModal() : void
  {
    this.activeModal.close('closed');
  }
}
