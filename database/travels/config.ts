import { LocalDBTravelDoc } from '.';

/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */

export const name = 'travels';

/**
 * The (raw) shape of the travel objects coming out of the database.
 * Must be consistent with column names.
 */
export interface LocalDBRawTravelDoc {
  id: string;
  origin_code: string;
  departure: string;
  destination_code: string;
  arrival: string;
}

export type ColumnsMap = {
  [K in keyof (LocalDBTravelDoc & LocalDBRawTravelDoc)]: string;
};

export const columns: ColumnsMap = {
  id: 'id',
  originCode: 'origin_code',
  origin_code: 'originCode',
  departure: 'departure',
  destinationCode: 'destination_code',
  destination_code: 'destinationCode',
  arrival: 'arrival',
};
