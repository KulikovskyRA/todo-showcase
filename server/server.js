const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const todoRouter = require('./src/routes/todoRouter');
const userRouter = require('./src/routes/userRouter');

require('dotenv').config();

const errorMiddleware = require('./src/middlewares/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors({ credentials: true, origin: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/todos', todoRouter);
app.use('/api/users', userRouter);

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`Server has started on PORT ${PORT}`));
