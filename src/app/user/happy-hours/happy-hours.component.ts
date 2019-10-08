import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-happy-hours',
  templateUrl: './happy-hours.component.html',
  styleUrls: ['./happy-hours.component.scss']
})
export class HappyHoursComponent implements OnInit {
  formGroup: FormGroup;
  constructor(private fb: FormBuilder) {
    this.formGroup = fb.group({
      name: ['', Validators.required],
      email: []
    });
  }

  ngOnInit() {}
}
