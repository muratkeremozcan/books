import { createSelector } from 'reselect';
import { TASK_STATUSES } from '../constants';

// ch[1.0] decide upfront how the data will look like to determine  what kinds of actions and reducers you might need. 
// it may be helpful to think of client-side state like a database. 
// Similarly to if you were dealing with a persistent data store such as a SQL database, declaring a data model will help you organize your thoughts and drive out the code you need.

// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> STORE(state) -(selector)-> update VIEW
// ch[2.3] create reducers
// reducers are pure functions that receive the previous state and an action as arguments and return the next state.

// you took care of the redux boilerplate (2.0)
// you created the actions & action handlers (2.1) 
// you linked the a container component (ex: App.js) to Redux, you are dispatching actions (2.2)
// now you can create the reducers
// once you update your actions (4.0), you also update your reducers


// [8.3] once data is normalized and actions have changed, adjust the reducers
// we have 2 top level entities (projects & tasks) they need their own individual state and reducers
const initialTasksState = {
  items: [],
  isLoading: false,
  error: null,
};

export function tasks(state = initialTasksState, action) {
  switch (action.type) {
    case 'RECEIVE_ENTITIES': {
      const { entities } = action.payload;
      if (entities && entities.tasks) {
        return {
          ...state,
          isLoading: false,
          items: entities.tasks,
        };
      }

      return state;
    }
    case 'EDIT_TASK_SUCCEEDED': {
      const { task } = action.payload;

      const nextTasks = {
        ...state.items,
        [task.id]: task,
      };

      return {
        ...state,
        items: nextTasks,
      };
    }
    case 'TIMER_INCREMENT': {
      const nextTasks = Object.keys(state.items).map(taskId => {
        const task = state.items[taskId];
        if (task.id === action.payload.taskId) {
          return { ...task, timer: task.timer + 1 };
        }

        return task;
      });
      return {
        ...state,
        tasks: nextTasks,
      };
    }
    default: {
      return state;
    }
  }
}

const initialProjectsState = {
  items: [],
  isLoading: false,
  error: null,
};

export function projects(state = initialProjectsState, action) {
  switch (action.type) {
    case 'RECEIVE_ENTITIES': {
      const { entities } = action.payload;
      if (entities && entities.projects) {
        return {
          ...state,
          isLoading: false,
          items: entities.projects,
        };
      }

      return state;
    }
    case 'FETCH_PROJECTS_STARTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'FETCH_PROJECTS_SUCCEEDED': {
      return {
        ...state,
        isLoading: false,
        items: action.payload.projects,
      };
    }
    // [8.3]
    // Recall that because you’re tracking related entities in different sections of the store, 
    // you need to use IDs to maintain these relationships. 
    // Each project has a tasks property that’s an array of tasks belonging to that project. 
    // When you create a new task, you have to add the task’s ID to the correct project.
    case 'CREATE_TASK_SUCCEEDED': {
      const { task } = action.payload;

      const project = state.items[task.projectId];

      return {
        ...state,
        [task.projectId]: {
          ...project,
          tasks: project.tasks.concat(task.id),
        },
      };
    }
    default: {
      return state;
    }
  }
}

// [7.1] selectors are used to get state data from the Redux store, derive the data, and pass it as props to the React container components
// selectors take a state as input and produce a slice of the state as output. 
// selectors are created in the related reducer file, or their own
// they are consumed at the container components mapStateToProps function while getting the data from the store
// event -> ACTION -(dispatch)-(middleware)-> REDUCER -> STORE(state) -(selector)-> update VIEW
 
const getSearchTerm = state => state.page.searchTerm;

// [8.5] below: update the selectors

const getTasksByProjectId = state => {
  const { currentProjectId } = state.page;
  // if there is no project, or no project matching the currentProjectId, return early
  if (!currentProjectId || !state.projects.items[currentProjectId]) {
    return [];
  }
  // get the list of taskIds
  const taskIds = state.projects.items[currentProjectId].tasks;
  // for task ids, get the corresponding project
  return taskIds.map(id => state.tasks.items[id]);
};

// [7.2] reselect library is great for creating selectors, because it provides memoization and composability (like FP)
// memoization is when a function stores the results of past computations and uses them for future calls.

// createSelector takes an array of input selectors and a transform function
// the transform functions arguments will be the result of the input selectors
// memoization comes for free; this will not re-compute the same filtered tasks twice if receiving the same args (tasks, searchTerm)
export const getFilteredTasks = createSelector(
  // input selectors are simple, they are not memoized, but are used as inputs to memoized selectors
  // with this setup, the transform function only runs when the result of the input selectors change
  [getTasksByProjectId, getSearchTerm],
  (tasks, searchTerm) => {
    return tasks.filter(task => task.title.match(new RegExp(searchTerm, 'i')));
  }
);

export const getGroupedAndFilteredTasks = createSelector(
  [getFilteredTasks],
  tasks => {
    const grouped = {};

    TASK_STATUSES.forEach(status => {
      grouped[status] = tasks.filter(task => task.status === status);
    });

    return grouped;
  }
);

// [8.5] update the selectors
// generic flow: update actions -> update reducers -> update rootReducer -> update selectors to get data out of the store, use mapStateToProps -> update view

export const getGroupedAndFilteredTaskIds = createSelector(
  [getFilteredTasks],
  tasks => {
    const grouped = {};

    TASK_STATUSES.forEach(status => {
      grouped[status] = tasks
        .filter(task => task.status === status)
        .map(task => task.id);
    });

    return grouped;
  }
);

/** a selector to convert the object containing all projects into an array */
// [10.2] use memoized selectors. This allows us to avoid unnecessary re-renders 
// this way Redux's connect gives us free "shouldComponentUpdate"
export const getProjects = createSelector(
  [state => state.projects],
  projects => {
    return Object.keys(projects.items).map(id => {
      return projects.items[id];
    });
  }
);

const initialPageState = {
  currentProjectId: null,
  searchTerm: '',
};

export function page(state = initialPageState, action) {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT_ID': {
      return {
        ...state,
        currentProjectId: action.payload.id,
      };
    }
    case 'FILTER_TASKS': {
      return { ...state, searchTerm: action.payload.searchTerm };
    }
    default: {
      return state;
    }
  }
}
