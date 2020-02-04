import SLLQueue from '../SLLQueue';

test('stream', () => {
  const queue = new SLLQueue<number>();
  let state: number[] = [];
  let i = 0;

  queue.enqueue(1);
  queue.enqueue(2);
  queue.enqueue(3);
  queue.enqueue(4);
  queue.enqueue(5);

  state = [1, 2, 3, 4, 5];
  testConsistency();

  expect(queue.dequeue()).toBe(1);
  expect(queue.dequeue()).toBe(2);
  expect(queue.dequeue()).toBe(3);

  state = [4, 5];
  testConsistency();

  queue.enqueue(6);
  queue.enqueue(7);
  queue.enqueue(8);
  queue.enqueue(9);
  queue.enqueue(10);

  state = [4, 5, 6, 7, 8, 9, 10];
  testConsistency();

  expect(queue.dequeue()).toBe(4);
  expect(queue.dequeue()).toBe(5);
  expect(queue.dequeue()).toBe(6);
  expect(queue.dequeue()).toBe(7);
  expect(queue.dequeue()).toBe(8);
  expect(queue.dequeue()).toBe(9);

  state = [10];
  testConsistency();

  expect(queue.dequeue()).toBe(10);

  state = [];
  testConsistency();

  function testConsistency() {
    i = 0;
    for (const item of queue) {
      expect(item).toBe(state[i++]);
    }
    i = 0;
  }
});
