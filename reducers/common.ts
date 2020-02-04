/*
 * Common state objects
 */

export interface Progress {
  message: string | null;
  status: 'REQUEST' | 'SUCCESS' | 'ERROR' | null;
}
