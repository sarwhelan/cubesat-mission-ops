import { Component, Input } from '@angular/core';

/**
 * Datetime picker form component.
 */
@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss']
})
export class DatetimePickerComponent {

  /**
   * The date (yyyy-mm-dd) selected.
   */
  @Input()
  dateFormControlName;

  /**
   * The time (00:00:00) selected.
   */
  @Input()
  timeFormControlName;

  /**
   * The parent form group title.
   */
  @Input()
  formGroup;
}
