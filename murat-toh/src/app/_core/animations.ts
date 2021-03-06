import {
  trigger, animateChild, group,
  transition, animate, style, query
} from '@angular/animations';


// Routable animation: gets used in the app.component animations: property

// Defines one transition when switching back and forth from the heroes and hero routes
// to ease the component in from the left of the screen as it enters the application view (:enter),
//  the other to animate the component to the right as it leaves the application view (:leave).
export const slideInAnimation =
  trigger('routeAnimation', [
    transition('heroes <=> hero', [  // animation states are defined in the heroes routing module route config: heroes & hero
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%'}))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%'}))
        ])
      ]),
      query(':enter', animateChild()),
    ])
  ]);
