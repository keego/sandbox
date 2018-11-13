
const waitFor = (t) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve()
  }, t)
})

const one = async () => {
  console.log('1: Fetching...')
  await waitFor(1000)

  console.log('1: Fetching...done!')
  return 1
}

const two = async () => {
  console.log('2: Fetching...')
  await waitFor(1000)

  console.log('2: Fetching...done!')
  return 2
}

const doBoth = async () => {

  console.log('Queueing...')
  const results = await Promise.all([
    one(),
    two(),
  ])
  console.log('Queueing...done!')
  return results
}

const main = async () => {
  console.log('Start')

  await doBoth()

  console.log('Done')
}

main()

