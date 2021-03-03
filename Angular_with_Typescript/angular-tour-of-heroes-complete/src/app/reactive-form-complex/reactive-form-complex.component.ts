import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Hero } from './hero';

@Component({
  selector: 'app-reactive-form-complex',
  templateUrl: './reactive-form-complex.component.html',
  styleUrls: ['./reactive-form-complex.component.css'],
})
export class ReactiveFormComplexComponent {
  heroForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.heroForm = fb.group({
      name: ['', Validators.required],
      alterEgo: [''],
      powersArray: fb.array([
        fb.control(this.powers, Validators.required)
      ])
    });
  }
  powers = ['Really Smart', 'Super Flexible', 'Super Hot', 'Weather Changer'];

  // constructor(private fb: FormBuilder) {}
  // heroForm = this.fb.group({
  //   name: ['', Validators.required],
  //   alterEgo: [''],
  // });


  model = new Hero(18, 'Dr IQ', this.powers[0], 'Chuck Overstreet');

  submitted = false;

  onSubmit() {
    alert('you submitted');
    console.warn(this.heroForm.value)
    this.submitted = true;
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.model);
  }

  newHero() {
    this.model = new Hero(42, 'Dummy Hero', '');
  }

  skyDog(): Hero {
    const myHero = new Hero(
      42,
      'SkyDog',
      'Fetch any object at any distance',
      'Leslie Rollover'
    );
    console.log('My hero is called ' + myHero.name); // "My hero is called SkyDog"
    return myHero;
  }
}
