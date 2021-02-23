import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Hero } from '../hero';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
})
export class HeroDetailComponent implements OnInit {
  @Input() hero$: Observable<Hero>;

  constructor(
    private service: HeroService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.hero$ = this.route.paramMap.pipe(
      // switchMap flattens the Observable<Hero> that HeroService returns
      // and cancels previous pending requests
      switchMap((params: ParamMap) => this.service.getHero(params.get('id')))
    );
  }

  gotoHeroes(hero: Hero) {
    const heroId = hero ? hero.id : null;
    // Pass along the hero id if available
    // so that the HeroList component can select that hero.
    // Include a junk 'foo' property for fun.
    this.router.navigate(['/heroes', { id: heroId, foo: 'foo' }]);
  }
}
