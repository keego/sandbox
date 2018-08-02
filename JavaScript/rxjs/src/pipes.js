const Rx = require('rxjs')
const operators = require('rxjs/operators')

const { share } = operators

const { pipe } = Rx

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function observer(name) {
  return {
    next: (value) => console.log(`observer ${name}: ${value}`),
    complete: () => console.log(`observer ${name}: complete`)
  };
}

let stayId = 1
const stay = label => o => {
  const id = stayId++
  console.log('stay(', label, ') #', id)
  const p = o
    .do((v) => console.log('stay -  inbound #', id, ':', v))
    // .take(1)
    // .multicast(() => {
    //   console.log('stay - creating cache #', id, ';', label)
    //   return (new Rx.Subject())
    //   // return (new Rx.Behaviorubject(label))
    //   // return (new Rx.ReplaySubject(label))
    //     .do((v) => console.log('stay -  hitting cache #', id, ':', v))
    // })
    // .publish(1)
    // .publishBehavior(1)
    .publishReplay(1)
    .refCount()
    .do((v) => console.log('stay - outbound #', id, ':', v))
  // p.connect()
  return p
}

// ---------------------------------------------------------------------------
// Define Simulations
// ---------------------------------------------------------------------------

// - One Shots
// ---------------------------------------------------------------------------

const paramMap = new Rx.BehaviorSubject({ ownerId: 'abc123' })

const getOwner = id => new Rx.BehaviorSubject({ id, name: 'owner-' + id })

const getView = id => new Rx.BehaviorSubject({ id, name: 'view-' + id })

const ownerId$ = paramMap
  .map(params => params.ownerId)
  .do(id => console.log('ONCE paramMap.ownerId:', id))
  // .share()
  .let(stay('ownerId'))

const owner$ = ownerId$
  .switchMap(getOwner)
  .do(o => console.log('ONCE getOwner:', o.id))
  // .share()
  .let(stay('owner'))

const subscribeToOwner = () => {
  owner$
    .do(o => console.log('> getting owner...', o.id))
    .subscribe(o => console.log('> got owner:', o.name))
}

const subscribeToView = () => {
  owner$
    .do(o => console.log('> getting view...', o.id))
    .switchMap(o => getView(o.id))
    .subscribe(v => console.log('> got view:', v && v.name))
}

const testOneShots = () => {
  console.log('')
  console.log('testOneShots()')
  console.log('')
  console.log('subscribeToOwner()')
  console.log('')
  subscribeToOwner()
  console.log('')
  console.log('subscribeToView()')
  console.log('')
  subscribeToView()
}

// - Streams
// ---------------------------------------------------------------------------

const userInput$ = new Rx.Subject()

const listenToUserInput = () => {
  userInput$
    .subscribe(txt => console.log('> got input:', txt))
}

const simulateUserInput = (text = 'hello world') => {
  for (let i = 1; i <= text.length; i++) {
    setTimeout(() => {
      userInput$.next(text.substring(0, i))
    }, i * 100)
  }
}

const testStreams = () => {
  listenToUserInput()
  simulateUserInput()
}

// - Checkpointing
// ---------------------------------------------------------------------------

const allOnboardingSteps = [1, 2, 3, 4, 5]

const account$ = new Rx.BehaviorSubject(null)
account$.next({ name: 'keego' })

// expensive operation
const completedOnboardingSteps$ = account$
  .switchMap(account => {
    if (!account) {
      return Rx.Observable.of([])
    }

    console.log('PERFORMING EXPENSIVE OPERATION FOR', account.name)

    const results = new Rx.Subject()

    setTimeout(() => {
      results.next([1])
    }, 100)

    setTimeout(() => {
      results.next([1, 2])
    }, 1000)

    return results
  })
  .let(stay('completedOnboardingSteps'))

const currentOnboardingStep$ = completedOnboardingSteps$
  .map(steps => steps[steps.length-1])

const onboardingStepsRemaining$ = completedOnboardingSteps$
  .map(completed => allOnboardingSteps.filter(step => !completed.includes(step)))

const didCompleteOnboardingStep = (step) => completedOnboardingSteps$
  .map(completed => completed.includes(step))

const testCheckpointing = () => {
  currentOnboardingStep$
    .subscribe(step => console.log('> current onboarding step:', step))
  onboardingStepsRemaining$
    .subscribe(steps => console.log('> onboarding steps remaining:', steps))
  didCompleteOnboardingStep(1)
    .subscribe(didComplete => console.log('> completed onboarding step 1?', didComplete))

  setTimeout(() => {
    account$.next({ name: 'keego2' })
  }, 2000)
}

// ---------------------------------------------------------------------------
// Run Simulations
// ---------------------------------------------------------------------------

console.log('')
console.log('// Run Simulations')
console.log('')

// Simulate view rendering with paramMap + api calls
// i.e. promises
// Expect:
// - transformations to only be run once per source emission
// - transformation results will be shared amongst subscriptions
testOneShots()

// Simulate event listening (user input, etc.)
// i.e. streams
// testStreams()

// Simulate chaining with null handling

// Simulate multiple subscriptions to an expensive transformation
// Expect:
// - EXPENSIVE OPERATION to only be run once per source emission
// - EXPENSIVE OPERATION result will be shared amongst subscriptions
// testCheckpointing()


// Notes:
// - publishReplay(1).refCount() seems to work well for preserving computed results


