import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss']
})
export class DatetimePickerComponent {

  @Input()
  dateFormControlName;

  @Input()
  timeFormControlName;

  @Input()
  formGroup;
}
