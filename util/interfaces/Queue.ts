export default interface Queue<E> extends Iterable<E> {
  enqueue(item: E): void;

  dequeue(): E;

  peek(): E;

  isEmpty(): boolean;

  size(): number;
}
