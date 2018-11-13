const Rx = require('rxjs')


const aInfoSource$ = new Rx.ReplaySubject(1)
const aInfo$ = aInfoSource$
const subs = []

aInfoSource$.next({ lots: 'init', account: 'init' })

subs.push(aInfo$.subscribe(info => {
  console.log('got account info 1', info)
}))

setTimeout(() => {
  // info 1 isnt called until now
  aInfoSource$.next({ lots: 'of', account: 'info' })

  setTimeout(() => {
    // info 2 called immediately
    subs.push(aInfo$.subscribe(info => {
      console.log('got account info 2', info)
    }))

    setTimeout(() => {
      // both subs called
      aInfoSource$.next({ lots: 'and lots of', account: 'info' })

      setTimeout(() => {
        // info 3 only gets latest value (not any previous)
        subs.push(aInfo$.subscribe(info => {
          console.log('got account info 3', info)
        }))

        setTimeout(() => {
          // info 4 should get the same value as info 3
          subs.forEach(sub => sub.unsubscribe())
          aInfo$.subscribe(info => {
            console.log('got account info 4', info)
          })
        }, 1000)
      }, 1000)
    }, 1000)
  }, 1000)
}, 1000)

console.log('done sync')

// Notes:
// - behaves like a subject until first emission, then behaves like a behavior subject
