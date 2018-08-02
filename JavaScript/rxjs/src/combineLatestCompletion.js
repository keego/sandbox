const Rx = require('rxjs')

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function observer(name) {
  return {
    next: (value) => console.log(`observer ${name}: ${value}`),
    complete: () => console.log(`observer ${name}: complete`)
  }
}

// ---------------------------------------------------------------------------
// Assemble
// ---------------------------------------------------------------------------

const v1$ = Rx.Observable.of(1)
const v2$ = Rx.Observable.of(2)
const vMany1$ = Rx.Observable.of(3, 4, 5)
const vUncomplete1$ = new Rx.BehaviorSubject('initial-1')
const vUncomplete2$ = new Rx.BehaviorSubject('initial-2')
const vCombinedMixed$ = Rx.Observable.combineLatest(
  v1$, v2$, vMany1$, vUncomplete1$,
  (...values) => values,
)
const vCombinedOnlyUncompletes$ = Rx.Observable.combineLatest(
  vUncomplete1$, vUncomplete2$,
  (...values) => values,
)

// ---------------------------------------------------------------------------
// Act
// ---------------------------------------------------------------------------

vCombinedOnlyUncompletes$.subscribe(observer('vCombinedOnlyUncompletes'))
vCombinedOnlyUncompletes$.take(1).subscribe(observer('vCombinedOnlyUncompletes-Take1'))

vUncomplete1$.next('next-1')
vUncomplete1$.complete()

// ---------------------------------------------------------------------------
// Observations
// ---------------------------------------------------------------------------

// combineLatest still emits when some source observables haven't completed
// combineLatest only completes when all source observables complete
