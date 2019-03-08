import { Component, Input } from '@angular/core';
import { formGroupNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss']
})
export class DatetimePickerComponent {
  @Input()
  date;

  @Input()
  time;

  @Input()
  dateFormControlName;

  @Input()
  timeFormControlName;

  @Input()
  formGroup;
}
