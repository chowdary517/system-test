export const ADD_TASK = 'todo/ADD_TASK';
export const DELETE_TASK = 'todo/DELETE_TASK';
export const UPDATE_ACTION = 'todo/UPDATE_ACTION';
export const UPDATE_TASK = 'todo/UPDATE_TASK';
export const SORTED_TASKS = 'todo/SORTED_TASKS';

export function addTask(payload) {
  return {
    type: ADD_TASK,
    payload,
  };
}

export function deleteTask(payload) {
  return {
    type: DELETE_TASK,
    payload,
  };
}

export function updateAction(payload) {
  return {
    type: UPDATE_ACTION,
    payload,
  };
}

export function updateTask(payload) {
  return {
    type: UPDATE_TASK,
    payload,
  };
}

export function getSortedTasks(payload) {
  return {
    type: SORTED_TASKS,
    payload,
  };
}
