import _ from 'lodash';
import {
  ADD_TASK,
  DELETE_TASK,
  UPDATE_ACTION,
  UPDATE_TASK,
  SORTED_TASKS,
} from './actions';

const initialState = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
};

function todo(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADD_TASK: {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push(payload);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return {
        ...state,
        tasks,
      };
    }
    case DELETE_TASK: {
      let tasks = JSON.parse(localStorage.getItem('tasks'));

      const index = _.findIndex(tasks, function (t) {
        return t.key === payload;
      });

      tasks.splice(index, 1);

      localStorage.setItem('tasks', JSON.stringify(tasks));

      return {
        ...state,
        tasks,
      };
    }
    case UPDATE_ACTION: {
      let tasks = JSON.parse(localStorage.getItem('tasks'));

      let updatedTasks = tasks.map(function (task) {
        if (task.key === payload) {
          return {
            ...task,
            isDone: !task.isDone,
          };
        }
        return task;
      });

      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      return {
        ...state,
        tasks: updatedTasks,
      };
    }
    case UPDATE_TASK: {
      let tasks = JSON.parse(localStorage.getItem('tasks'));

      let updatedTasks = tasks.map(function (task) {
        if (task.key === payload.key) {
          return {
            ...task,
            summary: payload.summary,
            description: payload.description,
            dueDate: payload.dueDate,
            priority: payload.priority,
          };
        }
        return task;
      });

      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      return {
        ...state,
        tasks: updatedTasks,
      };
    }
    case SORTED_TASKS: {
      let tasks = JSON.parse(localStorage.getItem('tasks'));
      let updatedTasks = [];
      if (payload.order) {
        let order = payload.order === 'ascend' ? 'asc' : 'desc';
        updatedTasks = _.orderBy(tasks, [payload.columnKey], [order]);
      }
      return {
        ...state,
        tasks: updatedTasks.length ? updatedTasks : tasks,
      };
    }
    default: {
      return state;
    }
  }
}

export default todo;
