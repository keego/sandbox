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
// Arrange
// ---------------------------------------------------------------------------

const accountInfo$ = new Rx.ReplaySubject(1)
// const accountInfo$ = new Rx.BehaviorSubject(null)
const setupNeeded$ = accountInfo$
  .do(accountInfo => console.log('setupNeeded$ :: accountInfo$ sourced ->', accountInfo))
  .map(accountInfo => {
    return !accountInfo || accountInfo.needsHelp
  })
  .publishReplay(1)
  // .multicast(new Rx.BehaviorSubject())
  // .publish()

  .refCount()

  // .share()


  // Less Manual
  // .let(accountInfo$ => {
  //   const publisher$ = accountInfo$
  //     .do(accountInfo => console.log('_letting_sourced_', accountInfo))
  //     .publishReplay(1)
  //   publisher$.connect()
  //   return publisher$
  //     .do(accountInfo => console.log('_letting_published_', accountInfo))
  // })

  // More Manual
  // .let(accountInfo$ => {
  //   console.log('_letting')
  //   const subject = new Rx.ReplaySubject(1)

  //   accountInfo$
  //     .do(accountInfo => console.log('_letting_sourced_', accountInfo))
  //     .subscribe(x => subject.next(x))
  //   return subject
  //     .do(accountInfo => console.log('_letting_published_', accountInfo))
  // })
  .do(accountInfo => console.log('setupNeeded$ :: accountInfo$ published ->', accountInfo))

function accountInfo$next(accountInfo) {
  console.log('')
  console.log(' -> emitting new account info', accountInfo)
  accountInfo$.next(accountInfo)
}

const subs = {}

function subscribe(observable$, label, cb) {
  console.log()
  console.log(` ${label} - subbing...`)
  const sub = observable$.subscribe(cb)
  console.log(` ${label} - subbed`)

  subs[label] = () => {
    console.log()
    console.log(` ${label} - un-subbing...`)
    sub.unsubscribe()
    console.log(` ${label} - un-subbed`)
  }
}

// ---------------------------------------------------------------------------
// Act
// ---------------------------------------------------------------------------

// - Test subscription semantics

// subscribe then emit
function testSubThenEmit() {
  accountInfo$next({ needsHelp: true })

  const s1 = 'setup sub 1.0'
  subscribe(setupNeeded$, s1, setupNeeded => {
    console.log(s1, '- setupNeeded ?', setupNeeded)
    if (!setupNeeded) {
      console.log(s1, '-> go to dashboard!')
    }
  })

  accountInfo$next({ needsHelp: false })
}

// emit then subscribe
function testEmitThenSub () {

  accountInfo$next({ needsHelp: true })
  accountInfo$next({ needsHelp: false })

  const s2 = 'setup sub 2.0'
  subscribe(setupNeeded$, s2, setupNeeded => {
    console.log(s2, '- setupNeeded ?', setupNeeded)
    if (!setupNeeded) {
      console.log(s2, '-> go to dashboard!')
    }
  })
}

// sub emit unsub emit sub sub
function testSubEmitUnsubEmitSub() {

  const s20 = 'setup sub 2.0'
  subscribe(setupNeeded$, s20, setupNeeded => {
    console.log(s20, '- setupNeeded ?', setupNeeded)
    if (!setupNeeded) {
      console.log(s20, '-> go to dashboard!')
    }
  })

  accountInfo$next({ needsHelp: true })

  subs[s20]()

  accountInfo$next({ needsHelp: false })

  const s21 = 'setup sub 2.1'
  subscribe(setupNeeded$, s21, setupNeeded => {
    console.log(s21, '- setupNeeded ?', setupNeeded)
    if (!setupNeeded) {
      console.log(s21, '-> go to dashboard!')
    }
  })

  const s22 = 'setup sub 2.2'
  subscribe(setupNeeded$, s22, setupNeeded => {
    console.log(s22, '- setupNeeded ?', setupNeeded)
    if (!setupNeeded) {
      console.log(s22, '-> go to dashboard!')
    }
  })
}

// ---------------------------------------------------------------------------
// Assert
// ---------------------------------------------------------------------------

// testSubThenEmit()

// testEmitThenSub()

testSubEmitUnsubEmitSub()

// ---------------------------------------------------------------------------
// Observations
// ---------------------------------------------------------------------------

// Goal: only perform transformations to a hot source$ when absolutely necessary,
// caching the result whenever possible, and sharing it with all subscribers in a way
// such that all subscribers always receive the latest result regardless of subscription time.

// Seems like the publish functions actually are exactly what I want (piping hot streams through
// transformations once and immediately, and storing that result to share with any downstream subscribers)
// but the issue is actually the connection logic. .refCount() unsubscribes to the upstream whenever there
// are no downstream subscribers, which means the persisted transformed value can become outdated. .connect()
// fixes this, but returns a subscription instead of chaining the observable. This can be fixed by using .publishX
// and .connect in a .let expansion.
