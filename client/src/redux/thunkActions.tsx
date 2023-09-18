import { loadtodos, createtodo, statustodo, deletetodo } from './todoSlice';

export const loadTodosThunk = () => (dispatch) => {
  try {
    //* Удалил setTimeout, чтобы загрузка не была слишком долгой
    // setTimeout(() => {
    (async function (): Promise<void> {
      const response: Response = await fetch(
        import.meta.env.VITE_URL + 'todos'
      );

      if (response.ok) {
        const result = await response.json();
        dispatch(loadtodos(result));
      }
    })();
    // }, 1000);
  } catch (error) {
    console.log(error);
  }
};

export const createTodoThunk = (inputTodo) => async (dispatch) => {
  if (inputTodo.title !== '') {
    const resCreate: Response = await fetch(
      import.meta.env.VITE_URL + 'todos',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: inputTodo.title, status: false }),
      }
    );
    if (resCreate.ok) {
      const result = await resCreate.json();
      dispatch(createtodo(result));
    }
    console.log(resCreate.ok);
    return resCreate.ok;
  }
};

export const deleteTodoThunk = (todo) => async (dispatch) => {
  const res: Response = await fetch(
    import.meta.env.VITE_URL + `todos/${todo.id}`,
    {
      method: 'DELETE',
    }
  );
  if (res.ok) {
    dispatch(deletetodo({ id: todo.id }));
  }
  return res.ok;
};

export const statusTodoThunk = (todo) => async (dispatch) => {
  const res: Response = await fetch(
    import.meta.env.VITE_URL + `todos/${todo.id}`,
    {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: !todo.status }),
    }
  );

  //! Дополнительное изменение Redux, на случай если буду реализовывать ф-л NAVBAR
  if (res.ok) {
    const result = await res.json();
    dispatch(statustodo(result));
  }

  return res.ok;
};

export const editTodoThunk = (todoEditId, inputEdit) => async (dispatch) => {
  const resEdit: Response = await fetch(
    import.meta.env.VITE_URL + `todos/${todoEditId}`,
    {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: inputEdit.title }),
    }
  );
  if (resEdit.ok) {
    const result = await resEdit.json();
    dispatch(statustodo(result));
  }

  return resEdit.ok;
};
