import { db, processRawResult } from '../helpers';
import { name, columns, ColumnsMap, LocalDBRawTravelDoc } from './config';
import Travel from '../../data-types/Travel';
import TravelHistory from '../../data-types/TravelHistory';

/** The shape of the travel objects going into the database. */
export interface LocalDBTravelDoc {
  id: string;
  originCode: string;
  departure: string;
  destinationCode: string;
  arrival: string;
}

/** Creates a new row in travels table. */
export function createTravel(travelDoc: LocalDBTravelDoc): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx): void => {
      tx.executeSql(
        `insert into ${name} values (?, ?, ?, ?, ?);`,
        [
          travelDoc.id,
          travelDoc.originCode,
          travelDoc.departure,
          travelDoc.destinationCode,
          travelDoc.arrival,
        ],
        () => {
          resolve();
        },
        (t, err) => {
          reject(err);
        }
      );
    });
  });
}

/** Updates an existing travel record. */
export function updateTravel(travelDoc: LocalDBTravelDoc): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx): void => {
      tx.executeSql(
        `update ${name} set ${columns.originCode}=?, ${columns.departure}=?, ${columns.destinationCode}=?, ${columns.arrival}=? where ${columns.id}=?;`,
        [
          travelDoc.originCode,
          travelDoc.departure,
          travelDoc.destinationCode,
          travelDoc.arrival,
          travelDoc.id,
        ],
        () => {
          resolve();
        },
        (t, err) => {
          reject(err);
        }
      );
    });
  });
}

/** Deletes an existing travel record. */
export function deleteTravel(travelID): Promise<void> {
  return new Promise((resolve, reject) => {
    db.transaction((tx): void => {
      tx.executeSql(
        `delete from ${name} where ${columns.id}=?;`,
        [travelID],
        () => {
          resolve();
        },
        (t, err) => {
          reject(err);
        }
      );
    });
  });
}

/** @returns A promise that resolves to an ordered array of `Travel` objects. */
export function getTravelHistory(): Promise<TravelHistory> {
  return new Promise((resolve, reject) => {
    db.transaction((tx): void => {
      tx.executeSql(
        `select * from ${name};`,
        [],
        (t, resultSet) => {
          const rawTravels = resultSet.rows._array as LocalDBRawTravelDoc[];
          const travelHistory = new TravelHistory();
          rawTravels.forEach(rawTravel => {
            travelHistory.add(
              Travel.createWithRawValues(
                rawTravel[columns.id],
                rawTravel[columns.originCode],
                rawTravel[columns.departure],
                rawTravel[columns.destinationCode],
                rawTravel[columns.arrival]
              )
            );
          });
          resolve(travelHistory);
        },
        (t, err) => {
          reject(err);
        }
      );
    });
  });
}

/** Gets the travel with the specified id. */
export function getTravel(
  travelID: string
): Promise<LocalDBTravelDoc | undefined> {
  return new Promise((resolve, reject) => {
    db.transaction((tx): void => {
      tx.executeSql(
        `select * from ${name} where ${columns.id}=?;`,
        [travelID],
        (t, resultSet) => {
          const results = resultSet.rows._array as LocalDBRawTravelDoc[];
          let result: LocalDBTravelDoc | undefined;
          if (results.length !== 0) {
            result = processRawResult<
              LocalDBRawTravelDoc,
              LocalDBTravelDoc,
              ColumnsMap
            >(results[0], columns);
          }
          resolve(result);
        },
        (t, err) => {
          reject(err);
        }
      );
    });
  });
}

export async function setTravel(travelID: string, travelDoc: LocalDBTravelDoc) {
  try {
    const t = await getTravel(travelID);
    if (t) return updateTravel(travelDoc);
    return createTravel(travelDoc);
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function deleteTravelSafely(travelID: string) {
  try {
    const t = await getTravel(travelID);
    if (!t) return Promise.resolve();
    return deleteTravel(travelID);
  } catch (err) {
    return Promise.reject(err);
  }
}
