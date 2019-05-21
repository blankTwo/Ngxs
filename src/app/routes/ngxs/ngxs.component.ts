import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ngxs',
  templateUrl: './ngxs.component.html',
  styleUrls: ['./ngxs.component.less'],
})
export class NgxsComponent implements OnInit {
  constructor(private fb: FormBuilder) {}

  form: FormGroup;

  ngOnInit() {
    this.form = this.fb.group({
      name: '',
    });
  }

  _submitForm(value: any) {
    console.log(this.form.value);
  }
}
