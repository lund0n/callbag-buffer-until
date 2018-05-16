# callbag-buffer-until

Callbag operator that buffers any stream data until another stream (the notifier) emits a value. Once that the notifier emits a value, all buffered and future stream values and passed downstream.

## API

### `bufferUntil({ size = 100 })`

- `size`  _(defaults to `100`)_: the maxium number of items to buffer. The oldest items are dropped when the number of items is exceeded.

## Example

```js
import { forEach, interval, pipe } from 'callbag-basics'
import bufferUntil from 'callbag-buffer-until'

const notifier = pipe(
  interval(2500)
)

pipe(
  interval(1000),
  bufferUntil(notifier)
  forEach(value => {
    // This will receive every value from interval, but no value will be sent
    // for 2.5 seconds. The buffered values will be sent, in order, all at once, followed by
    // any future values at the regular interval.
  })
)
```