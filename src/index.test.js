/* eslint-env jest */
import forEach from 'callbag-for-each'
import { createSource } from './test-utils'
import bufferUntil from '.'

const pushToSource = (source, items) => items.forEach(item => source(1, item))
const getItemsFrom = mockFn => mockFn.mock.calls.map(([item]) => item)

test('pushes data through when notified before first item', () => {
  const items = ['Milk', 'Eggs', 'Butter']
  const source = createSource()
  const notifier = createSource()
  const sinkFn = jest.fn()
  forEach(sinkFn)(bufferUntil(notifier)(source))
  // Stop buffering
  notifier(1, {})
  // Send items
  pushToSource(source, items)
  const called = getItemsFrom(sinkFn)
  expect(called).toEqual(items)
})

test('pushes data through when notification happens part way through pushing items', () => {
  const items = ['Milk', 'Eggs', 'Butter']
  const source = createSource()
  const notifier = createSource()
  const sinkFn = jest.fn()
  forEach(sinkFn)(bufferUntil(notifier)(source))
  // Buffer the first two items
  pushToSource(source, items.slice(0, 2))
  expect(getItemsFrom(sinkFn)).toEqual([])
  // Trigger buffer flush
  notifier(1, {})
  expect(getItemsFrom(sinkFn)).toEqual(items.slice(0, 2))
  // Send the rest
  pushToSource(source, items.slice(2))
  expect(getItemsFrom(sinkFn)).toEqual(items)
})

test('items are never pushed when notification never happens', () => {
  const items = ['Milk', 'Eggs', 'Butter']
  const source = createSource()
  const notifier = createSource()
  const sinkFn = jest.fn()
  forEach(sinkFn)(bufferUntil(notifier)(source))
  pushToSource(source, items)
  expect(getItemsFrom(sinkFn)).toEqual([])
})

test('buffers the last 100 items, by default', () => {
  const items = Array.from({ length: 101 }).map((_, i) => i.toString())
  const source = createSource()
  const notifier = createSource()
  const sinkFn = jest.fn()
  forEach(sinkFn)(bufferUntil(notifier)(source))
  pushToSource(source, items)
  notifier(1, {})
  expect(getItemsFrom(sinkFn)).toEqual(items.slice(1))
})

test('buffer size is configurable', () => {
  const items = Array.from({ length: 20 }).map((_, i) => i.toString())
  const source = createSource()
  const notifier = createSource()
  const sinkFn = jest.fn()
  forEach(sinkFn)(bufferUntil(notifier, { size: 10 })(source))
  pushToSource(source, items)
  notifier(1, {})
  expect(getItemsFrom(sinkFn)).toEqual(items.slice(10))
})
