import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store, Select } from '@ngxs/store';
import { withLatestFrom } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User, UserModel } from './animal.actions';
import { AddUser } from './animals-state';

@Component({
  selector: 'app-ngxs',
  templateUrl: './ngxs.component.html',
  styleUrls: ['./ngxs.component.less'],
})
export class NgxsComponent implements OnInit {
  constructor(private fb: FormBuilder, private store: Store) {}

  form: FormGroup;

  @Select(AddUser) user$: Observable<UserModel>;

  ngOnInit() {
    this.form = this.fb.group({
      name: '',
      age: null,
    });
  }

  _submitForm() {
    const value = this.form.value;
    this.store.dispatch(new User(value.name, value.age)).subscribe(() => this.form.reset());
  }
}
