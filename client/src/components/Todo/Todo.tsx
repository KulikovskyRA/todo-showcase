import { useDispatch } from 'react-redux';
import { useState, MouseEvent, ChangeEvent } from 'react';

import {
  SendIcon,
  TextField,
  Box,
  DeleteIcon,
  EditIcon,
  Checkbox,
  CloseIcon,
  Modal,
  IconButton,
  Typography,
} from '../../MUI';

import {
  deleteTodoThunk,
  editTodoThunk,
  statusTodoThunk,
} from '../../redux/thunkActions';
import { errorCreate, errorRemove } from '../../redux/errorSlice';

export default function Todo({ todo }) {
  const dispatch = useDispatch();

  const deleteHandler = async () => {
    const resOk = await dispatch(deleteTodoThunk(todo));
    if (resOk) {
      dispatch(errorRemove());
    } else {
      dispatch(
        errorCreate({
          errorMessage: 'Ошибка при удалении, повторите позднее',
        })
      );
    }
  };

  const statusHandler = async () => {
    const resOk = await dispatch(statusTodoThunk(todo));
    if (resOk) {
      dispatch(errorRemove());
    } else {
      dispatch(
        errorCreate({
          errorMessage: 'Не могу нажать на пипку',
        })
      );
    }
  };

  //! Модалка зависит от open
  const [open, setOpen] = useState(false);
  //! id todo, которую будем переделывать
  const [todoEditId, setTodoEditId] = useState(0);

  const handleOpen = (number: number) => {
    setOpen(true);
    setTodoEditId(number);
  };
  const handleClose = () => {
    setOpen(false);
    setTodoEditId(0);
  };

  const [inputEdit, setInputEdit] = useState({ title: '' });
  const changeEditInputHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputEdit({ title: e.target.value });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      editHandler();
    }
  };

  const editHandler = async () => {
    if (inputEdit.title !== '') {
      const resOk = await dispatch(editTodoThunk(todoEditId, inputEdit));
      if (resOk) {
        setInputEdit({ title: '' });
        handleClose();
      } else {
        dispatch(
          errorCreate({
            errorMessage: 'Ошибка при изменении',
          })
        );
      }
    }
  };

  return (
    <Box
      width="45%"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          justifyContent: 'start',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Checkbox
          color="success"
          checked={todo.status ? true : false}
          onChange={statusHandler}
        />

        <Typography variant="subtitle1">{todo.title}</Typography>
      </Box>
      <Box
        sx={{
          justifyContent: 'start',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton
          aria-label="edit"
          color="success"
          onClick={() => handleOpen(todo.id)}
        >
          <EditIcon fontSize="small" />
        </IconButton>

        <IconButton aria-label="delete" color="error" onClick={deleteHandler}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 290,
            bgcolor: 'background.paper',
            borderRadius: '10px',
            boxShadow: 24,
            py: 2,
            pl: 2,
          }}
        >
          <TextField
            size="small"
            label="Change title"
            variant="outlined"
            name="title"
            onChange={changeEditInputHandler}
            onKeyUp={handleKeyDown}
          />
          <IconButton aria-label="edit" color="success" onClick={editHandler}>
            <SendIcon fontSize="small" />
          </IconButton>

          <IconButton aria-label="close" color="error" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Modal>
    </Box>
  );
}
