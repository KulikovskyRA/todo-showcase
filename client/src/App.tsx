import { useState, useEffect, ChangeEvent, MouseEvent } from 'react';

import './App.css';

import { useDispatch, useSelector } from 'react-redux';

import { Routes, Route, Link } from 'react-router-dom';

import { changepage } from './redux/todoSlice';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {
  SendIcon,
  Button,
  TextField,
  Box,
  Stack,
  Pagination,
  CircularProgress,
  Alert,
} from './MUI';

import Todo from './components/Todo/Todo';
import Navbar from './components/Navbar/Navbar';
import Reg from './components/Reg/Reg';
import Login from './components/Login/Login';
import { createTodoThunk, loadTodosThunk } from './redux/thunkActions';

import { errorCreate, errorRemove } from './redux/errorSlice';

function App() {
  const dispatch = useDispatch();

  const error = useSelector((store) => store.errorSlice);

  // Создание константы для изменения input.value
  const [inputTodo, setInputTodo] = useState({ title: '' });
  const changeInputHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputTodo({ ...inputTodo, [e.target.name]: e.target.value });
  };

  // Нажатие на Enter вызывает создание todo
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') createTodoHandler();
  };

  const createTodoHandler = async (): void => {
    if (inputTodo.title === '') {
      dispatch(
        errorCreate({
          errorMessage: 'Нельзя создавать пустые заметки',
        })
      );
    } else if (inputTodo.title.length > 25) {
      dispatch(
        errorCreate({
          errorMessage: 'Заметка должна быть длиной не более 25 символов',
        })
      );
    } else {
      const resOk = await dispatch(createTodoThunk(inputTodo));
      if (resOk) {
        setInputTodo({ title: '' });
        dispatch(errorRemove());
      } else {
        dispatch(
          errorCreate({
            errorMessage: 'Ошибка при создании todo, повторите позднее',
          })
        );
      }
    }
  };

  //! Использую тудушки из toShow, которые зависят от кнопок Navbar

  const { toshow, pagesAmount, currentPage, loading } = useSelector(
    (store) => store.todoSlice
  );

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    dispatch(changepage({ pagenumber: value }));
  };

  useEffect(() => {
    dispatch(loadTodosThunk());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/reg" element={<Reg />} />
      <Route
        path="/"
        element={
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Navbar />
            <Box sx={{ mx: 'auto', mt: '1rem', mb: '3rem' }}>
              <TextField
                size="small"
                label="Todo"
                variant="outlined"
                name="title"
                value={inputTodo.title}
                onChange={changeInputHandler}
                onKeyDown={handleKeyDown}
              />
              <Button
                onClick={createTodoHandler}
                variant="contained"
                sx={{ my: 0.2, mx: 0.4 }}
                endIcon={<SendIcon />}
              >
                Create
              </Button>
            </Box>

            {error.errorStatus && (
              <Alert
                severity="error"
                sx={{
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  top: '20%',
                  left: '50%',
                  maxWidth: 'md',
                }}
              >
                {error.errorMessage}
              </Alert>
            )}

            {loading ? (
              <Box
                sx={{
                  position: 'absolute',
                  transform: 'translate(-50%, -50%)',
                  top: '50%',
                  left: '50%',
                  display: 'flex',
                }}
              >
                <CircularProgress size={120} thickness={1} disableShrink />
              </Box>
            ) : (
              <Stack
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {toshow.map((todo) => (
                  <Todo key={todo.id} todo={todo} />
                ))}
              </Stack>
            )}

            {pagesAmount > 1 && (
              <Stack
                spacing={2}
                sx={{
                  position: 'absolute',
                  top: '93%',
                  left: '50%',
                  bgcolor: 'background.paper',
                  borderRadius: '10px',
                  boxShadow: 2,
                  p: 1,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Pagination
                  page={currentPage}
                  onChange={handlePageChange}
                  count={pagesAmount}
                />
              </Stack>
            )}
          </div>
        }
      />
    </Routes>
  );
}

export default App;

// const toshow = useSelector((store) => store.todoSlice.toshow);
// const pagesAmount = useSelector((store) => store.todoSlice.pagesAmount);
// const currentPage = useSelector((store) => store.todoSlice.currentPage);
