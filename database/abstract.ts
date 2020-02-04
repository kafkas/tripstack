import { setKey, getKey } from './keys';

/*
 * lastProcessedEventNumber
 */
const setLastProcessedEventNumber = (lastEventNumber: number) =>
  setKey<number>('lastProcessedEventNumber', lastEventNumber, 'integer');

const getLastProcessedEventNumber = () =>
  getKey<number>('lastProcessedEventNumber', 'integer');

/**
 * Some abstractions over existing methods for reusability.
 */
export const abstract = {
  setLastProcessedEventNumber,
  getLastProcessedEventNumber,
};
