const Rx = require('rxjs')


const aInfoSource$ = new Rx.Subject()
const aInfo$ = aInfoSource$.publishReplay(1).refCount()

aInfo$.subscribe(info => {
  console.log('got account info 1', info)
})

setTimeout(() => {
  aInfoSource$.next({ lots: 'of', account: 'info' })

  setTimeout(() => {
    aInfo$.subscribe(info => {
      console.log('got account info 2', info)
    })

    setTimeout(() => {
      aInfoSource$.next({ lots: 'and lots of', account: 'info' })

      setTimeout(() => {
        aInfo$.subscribe(info => {
          console.log('got account info 3', info)
        })
      }, 1000)
    }, 1000)
  }, 1000)
}, 1000)

console.log('done sync')

// Notes:
// - behaves like a subject until first emission, then behaves like a behavior subject
