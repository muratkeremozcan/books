import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Crisis } from '../crisis';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CrisisService } from '../crisis.service';

@Component({
  selector: 'app-crisis-detail',
  templateUrl: './crisis-detail.component.html',
  styleUrls: ['./crisis-detail.component.css'],
})
export class CrisisDetailComponent implements OnInit {
  @Input() crisis$: Observable<Crisis>;

  constructor(
    private crisisService: CrisisService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.crisis$ = this.route.paramMap.pipe(
      // switchMap flattens the Observable<Crisis> that CrisisService returns
      // and cancels any previous pending requests
      switchMap((params: ParamMap) =>
        this.crisisService.getCrisis(params.get('id'))
      )
    );
  }

  gotoCrises(crisis: Crisis) {
    const crisisId = crisis ? crisis.id : null;
    // Pass along the crisis id if available so that the CrisisList component can select that crisis.
    // Include a junk 'foo' property for fun.
    // Relative navigation back to the crises
    this.router.navigate(['../', { id: crisisId, foo: 'foo' }], {
      relativeTo: this.route,
    });
  }
}
