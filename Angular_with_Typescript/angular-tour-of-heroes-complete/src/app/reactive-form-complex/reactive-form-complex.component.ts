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
  powers = ['Really Smart', 'Super Flexible', 'Super Hot', 'Weather Changer'];
  submitted = false;
  model = new Hero('Dr IQ', this.powers[0], 'Chuck Overstreet');
  myHero: Hero;

  constructor(fb: FormBuilder) {
    this.heroForm = fb.group({
      name: ['', Validators.required],
      alterEgo: [''],
      powersArray: fb.array([
        fb.control(this.powers, Validators.required)
      ])
    });
  }

  onSubmit() {
    console.warn(this.heroForm.value);
    this.submitted = true;
    // TODO: get form values and display
  }
}
