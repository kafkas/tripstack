import { FirestoreEventDoc } from '../../api';
import * as Database from '../../database';
import { downloadUserInfo } from '../auth/userInfo';
import { downloadUserTravel, downloadUserResidency } from '../data';

interface Task {
  name:
    | 'FETCH_TRAVEL_AND_SAVE_TO_DB'
    | 'DELETE_TRAVEL_FROM_DB_IF_EXISTS'
    | 'FETCH_RESIDENCY_AND_SAVE_TO_DB'
    | 'DELETE_RESIDENCY_FROM_DB_IF_EXISTS'
    | 'FETCH_USER_DETAILS_AND_SAVE_TO_DB';
  eventNumber: number;
  travelID?: string;
  residencyID?: string;
}

/**
 * Analyses the specified sorted array of events and returns the corresponding
 * array of `Task`s that must be executed in the given order.
 *
 * @param events Must be sorted with respect to the `number` field.
 */
export function createTasksFromEvents(events: FirestoreEventDoc[]): Task[] {
  /*
   * Examine the array and create a hashmap of tasks that will help
   * avoid unnecessary operations.
   */
  interface TaskMap {
    travels: Map<string, Task>;
    residencies: Map<string, Task>;
    userInfo?: Task;
  }
  const taskmap: TaskMap = {
    travels: new Map(),
    residencies: new Map(),
  };

  events.forEach(({ type, number, travelID, residencyID }) => {
    switch (type) {
      case 'ADD_TRAVEL':
      case 'UPDATE_TRAVEL': {
        travelID = travelID as string;
        taskmap.travels.set(travelID, {
          name: 'FETCH_TRAVEL_AND_SAVE_TO_DB',
          eventNumber: number,
        });
        break;
      }
      case 'DELETE_TRAVEL': {
        travelID = travelID as string;
        taskmap.travels.set(travelID, {
          name: 'DELETE_TRAVEL_FROM_DB_IF_EXISTS',
          eventNumber: number,
        });
        break;
      }
      case 'ADD_RESIDENCY':
      case 'UPDATE_RESIDENCY': {
        residencyID = residencyID as string;
        taskmap.residencies.set(residencyID, {
          name: 'FETCH_RESIDENCY_AND_SAVE_TO_DB',
          eventNumber: number,
        });
        break;
      }
      case 'DELETE_RESIDENCY': {
        residencyID = residencyID as string;
        taskmap.residencies.set(residencyID, {
          name: 'DELETE_RESIDENCY_FROM_DB_IF_EXISTS',
          eventNumber: number,
        });
        break;
      }
      case 'UPDATE_USER_DETAILS':
        taskmap.userInfo = {
          name: 'FETCH_USER_DETAILS_AND_SAVE_TO_DB',
          eventNumber: number,
        };
        break;
      default:
    }
  });

  const tasks: Task[] = [];
  // Add all travel and residency tasks in the taskmap
  taskmap.travels.forEach((task, travelID) => {
    tasks.push({
      name: task.name,
      eventNumber: task.eventNumber,
      travelID,
    });
  });
  taskmap.residencies.forEach((task, residencyID) => {
    tasks.push({
      name: task.name,
      eventNumber: task.eventNumber,
      residencyID,
    });
  });
  // Add userInfo task as well, if it exists
  if (taskmap.userInfo) {
    tasks.push(taskmap.userInfo);
  }
  tasks.sort((t1, t2) => t1.eventNumber - t2.eventNumber);
  return tasks;
}

export function delegateTasks(tasks: Task[], uid: string, dispatch: Dispatch) {
  return tasks.map(task => {
    switch (task.name) {
      case 'FETCH_USER_DETAILS_AND_SAVE_TO_DB':
        return downloadUserInfo(uid, dispatch);
      case 'FETCH_TRAVEL_AND_SAVE_TO_DB': {
        const travelID = task.travelID as string;
        return downloadUserTravel(uid, travelID);
      }
      case 'DELETE_TRAVEL_FROM_DB_IF_EXISTS': {
        const travelID = task.travelID as string;
        return Database.deleteTravelSafely(travelID);
      }
      case 'FETCH_RESIDENCY_AND_SAVE_TO_DB': {
        const residencyID = task.residencyID as string;
        return downloadUserResidency(uid, residencyID);
      }
      case 'DELETE_RESIDENCY_FROM_DB_IF_EXISTS': {
        const residencyID = task.residencyID as string;
        return Database.deleteResidencySafely(residencyID);
      }
      default:
        return Promise.resolve();
    }
  });
}
