import { SQLTransaction } from 'expo-sqlite/src/SQLite.types';
import { name, columns } from './config';

export function createTravelsTable(tx: SQLTransaction) {
  tx.executeSql(
    `create table if not exists ${name} (${columns.id} text primary key not null, ${columns.originCode} text, ${columns.departure} text, ${columns.destinationCode} text, ${columns.arrival} text)`,
    [],
    () => {},
    (t, err) => {
      throw new Error(
        `Could not create the '${name}' table. Reason:\n${err.message}`
      );
    }
  );
}

export function dropTravelsTable(tx: SQLTransaction) {
  tx.executeSql(
    `drop table if exists ${name}`,
    [],
    () => {},
    (t, err): void => {
      throw new Error(
        `Could not drop the ${name} table. Reason:\n${err.message}`
      );
    }
  );
}
