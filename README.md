# callbag-buffer-until

Callbag operator that buffers any stream data until another stream (the notifier) emits a value. Once that the notifier emits a value, all buffered and future stream values and passed downstream.

## API

### `bufferUntil(notifier, { size = 100 })`

- `notifier` _(required)_: the callbag that notifies this operator to flush its buffer and and push items through. Items will be buffered until this callbag pushes its first item.
- `size`  _(defaults to `100`)_: the maxium number of items to buffer. The oldest items are dropped when the number of items is exceeded.

## Example

```js
import { forEach, fromEvent, interval, pipe } from 'callbag-basics'
import bufferUntil from 'callbag-buffer-until'

pipe(
  interval(1000),
  bufferUntil(interval(2500))
  forEach(value => {
    // This will receive every value from interval, but no value will be sent
    // for 2.5 seconds. The buffered values will be sent, in order, all at once, followed by
    // any future values at the regular interval.
  })
)

pipe(
  fromEvent(document, 'mousemove'),
  bufferUntil(interval(2000), { size: 10 })
  forEach(value => {
    // This will receive the last 10 items prior to the 2s (2000ms) interval stream being triggered,
    // at the 2s mark, followed by all events thereafter.
  })
)
```
