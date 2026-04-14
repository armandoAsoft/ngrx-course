import { Component, effect, OnInit, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

import {Store} from "@ngrx/store";

import {AuthService} from "../auth.service";
import {tap} from "rxjs/operators";
import {noop} from "rxjs";
import {Router} from "@angular/router";
import { login } from '../auth.actions';
// import { AppState } from '../../reducers';
import { AuthState } from '../reducers';
import { selectUser } from '../auth.selector';
import { AppState } from '../../reducers';

// interface AppState {
//     auth: AuthState
// }

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loggedUser = this.store.selectSignal(selectUser);


  constructor(
      private fb:FormBuilder,
      private auth: AuthService,
      private router:Router,
    private store: Store<AppState>) {

      this.form = fb.group({
          email: ['test@angular-university.io', [Validators.required]],
          password: ['test', [Validators.required]]
      });

      effect(() => {
            console.log('Usuario en store:', this.loggedUser());
        });

  }

  ngOnInit() {
    

  }

  login() {
    const val = this.form.value;
    this.auth.login(val.email, val.password)
    .pipe(
        tap(user => {
            console.log('user logged in', user);
            this.store.dispatch(login({user}));
            this.router.navigateByUrl('/courses');
        })
    )
    .subscribe(
        noop,
        () => alert('login failed')
    )
  }

}

