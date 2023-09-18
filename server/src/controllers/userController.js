const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { User } = require('../../db/models');

const { validationResult } = require('express-validator');

const ErrorApi = require('../exceptions/error-api');

module.exports.registration = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(ErrorApi.BadRequest('Ошибка валидации', errors.array()));
    }

    const { name, password, email } = req.body;
    const candidate = await User.findOne({
      where: { email },
    });

    if (candidate) {
      throw ErrorApi.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const verifLink = uuid.v4();
    const user = await User.create({
      name,
      password: hashPassword,
      email,
      verified: false,
      verifLink,
    });

    // * nodemailer

    const userDataForTokens = {
      id: user.id,
      email: user.email,
      verified: user.verified,
    };

    const tokens = generateTokens(userDataForTokens);

    await saveToken(user.id, tokens.refreshToken);

    const userData = { ...tokens, user: userDataForTokens };
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.json(userData);
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw ErrorApi.BadRequest('Пользователь не найден');
    }
    const isPasswordRight = await bcrypt.compare(password, user.password);

    if (!isPasswordRight) {
      throw ErrorApi.BadRequest('Неверный пароль');
    }

    const userDataForTokens = {
      id: user.id,
      email: user.email,
      verified: user.verified,
    };

    const tokens = generateTokens(userDataForTokens);
    await saveToken(user.id, tokens.refreshToken);

    const userData = { ...tokens, user: userDataForTokens };

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.json(userData);
  } catch (err) {
    next(err);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await removeToken(refreshToken);
    res.clearCookie('refreshToken');
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

module.exports.activationLink = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

module.exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw ErrorApi.UnauthorizedError();
    }

    const userData = validateRefreshToken(refreshToken);
    const tokenFromDB = await findToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw ErrorApi.UnauthorizedError();
    }

    const user = await User.findByPk(userData.id);

    const userDataForTokens = {
      id: user.id,
      email: user.email,
      verified: user.verified,
    };

    const tokens = generateTokens(userDataForTokens);
    await saveToken(user.id, tokens.refreshToken);

    const userDto = { ...tokens, user: userDataForTokens };

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.json(userDto);
  } catch (err) {
    next(err);
  }
};

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};
