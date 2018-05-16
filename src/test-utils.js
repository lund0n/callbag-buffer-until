export const createSource = () => {
  let active = true
  let sink
  return (type, data) => {
    if (!active) return
    if (type === 0) {
      sink = data
      sink(0, (t) => {
        if (t === 2) {
          active = false
        }
      })
    } else {
      sink(type, data)
    }
  }
}
