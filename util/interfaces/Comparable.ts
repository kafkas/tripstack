export default interface Comparable<K> {
  compareTo: (that: Comparable<K>) => number;
}
