const bufferUntil = (notifier, { size = 100 } = {}) => (source) => (
  start,
  sink
) => {
  const buffer = []
  if (start !== 0) {
    return
  }
  let sourceTalkback
  let notifierTalkback
  let notified = false
  source(0, (type, data) => {
    if (type === 0) {
      sourceTalkback = data

      notifier(0, (type, data) => {
        if (type === 0) {
          notifierTalkback = data
          notifierTalkback(1)
        } else if (type === 1) {
          notified = true
          notifierTalkback(2)
          const toFlush = buffer.slice()
          buffer.length = 0
          toFlush.forEach((item) => sink(1, item))
        }
      })
    }
    if (type !== 1) {
      sink(type, data)
      return
    }

    if (!notified) {
      buffer.push(data)
      if (buffer.length > size) {
        buffer.shift()
      }
      sourceTalkback(1)
      return
    }

    sink(1, data)
  })
}

export default bufferUntil
