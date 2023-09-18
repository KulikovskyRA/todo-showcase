import { createSlice, PayloadAction } from '@reduxjs/toolkit';

//! Всегда в initialState нужно делать начальные аргументы
//! Начальные аргументы дб быть такими же по типизации, как и конечные

const initialState = {
  todos: [],
  toshow: [],
  want: 'all',
  pagesAmount: 0,
  currentPage: 1,
  loading: true,
};

function verify(state) {
  if (state.want === 'all') state.toshow = state.todos;
  if (state.want === 'done')
    state.toshow = state.todos.filter((el) => el.status);
  if (state.want === 'undone')
    state.toshow = state.todos.filter((el) => !el.status);

  state.pagesAmount = Math.ceil(state.toshow.length / 10);

  state.toshow = state.toshow.slice(
    (state.currentPage - 1) * 10,
    state.currentPage * 10
  );
}

const todoSlice = createSlice({
  name: 'todoSlice',
  initialState,
  reducers: {
    loadtodos(state, action) {
      state.todos = action.payload;
      verify(state);
      state.loading = false;
    },
    createtodo(state, action) {
      state.todos = [action.payload, ...state.todos];
      verify(state);
    },

    deletetodo(state, action) {
      state.todos = state.todos.filter((el) => el.id !== action.payload.id);
      verify(state);
    },

    statustodo(state, action) {
      const todoIndex = state.todos.findIndex(
        (obj) => obj.id == action.payload.id
      );
      state.todos[todoIndex].status = action.payload.status;
      state.todos[todoIndex].title = action.payload.title;
      verify(state);
    },

    showall(state) {
      state.want = 'all';
      state.currentPage = 1;
      verify(state);
    },
    showdone(state) {
      state.want = 'done';
      state.currentPage = 1;
      verify(state);
    },
    showundone(state) {
      state.want = 'undone';
      state.currentPage = 1;
      verify(state);
    },
    changepage(state, action) {
      state.currentPage = action.payload.pagenumber;
      verify(state);
    },
  },
});

export default todoSlice.reducer;

export const {
  loadtodos,
  createtodo,
  statustodo,
  deletetodo,
  showall,
  showdone,
  showundone,
  changepage,
} = todoSlice.actions;
