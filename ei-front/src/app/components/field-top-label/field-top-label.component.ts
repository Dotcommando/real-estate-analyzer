import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'ei-field-top-label',
  standalone: true,
  imports: [
    NgClass,
  ],
  templateUrl: './field-top-label.component.html',
  styleUrl: './field-top-label.component.scss',
})
export class FieldTopLabelComponent {
  @Input() label = '';
  @Input() focused = false;
}
