import { db } from './helpers';
import { createKeysTable, dropKeysTable } from './keys/helpers';
import {
  createResidenciesTable,
  dropResidenciesTable,
} from './residencies/helpers';
import { createTravelsTable, dropTravelsTable } from './travels/helpers';

/*
 * Each table is in its own folder. All helper files are private
 * (i.e. outside the public interface of the Database API).
 */

export function initialize() {
  db.transaction((tx): void => {
    createKeysTable(tx);
    createResidenciesTable(tx);
    createTravelsTable(tx);
  });
}

export function clear() {
  db.transaction((tx): void => {
    dropKeysTable(tx);
    dropResidenciesTable(tx);
    dropTravelsTable(tx);
  });
}

export * from './abstract';
export * from './keys';
export * from './residencies';
export * from './travels';
