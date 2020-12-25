const User = require("../models/user-model.js");
const Item = require("../models/item-model.js");
const HttpError = require("../error/http-error");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//////////////////////////////////////////////////////////
// Create new user ///////////////////////////////////////

const createUser = async (req, res, next) => {
  const user = new User({ ...req.body, items: [] });

  try {
    const token = await user.generateAuthToken();
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    res.status(201).send({ user, token });
  } catch (err) {
    return next(new HttpError("Signing up failed, please try again.", 500));
  }
};

//////////////////////////////////////////////////////////
// Login User ////////////////////////////////////////////

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({ user, token });
  } catch (err) {
    next(new HttpError("Unable to login", 422));
  }
};

//////////////////////////////////////////////////////////
// Login with Google ////////////////////////////////////

const googleLogin = async (req, res, next) => {
  const { tokenId } = req.body;

  if (!tokenId) {
    next(new HttpError("Unable to login with Google", 422));
  }

  try {
    const response = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email_verified, name, email } = response.payload;

    if (!email_verified) {
      throw new Error();
    }

    const { user, token } = await User.findOneOrCreate({ name, email });

    if (!user || !token) {
      throw new Error();
    }

    await user.save();

    res.send({ user, token });
  } catch (e) {
    next(new HttpError("Unable to login with Google", 422));
  }
};

//////////////////////////////////////////////////////////
// Logout User ///////////////////////////////////////////

const logoutUser = async (req, res, next) => {
  const { id, token } = req.body;

  try {
    const user = await User.findOne({
      _id: id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    user.tokens = user.tokens.filter((doc) => doc.token !== token);

    await user.save();
  } catch (err) {
    console.log(err);
  }

  res.status(205).send();
};

//////////////////////////////////////////////////////////
// Get user's items ///////////////////////////////////////

const getItems = async (req, res, next) => {
  try {
    await req.user.populate("items").execPopulate();

    res.send(req.user.items);
  } catch (err) {
    return next(
      new HttpError("Fetching items failed, please try again later.", 500)
    );
  }
};

//////////////////////////////////////////////////////////
// Update User ///////////////////////////////////////////

const updateUser = async (req, res, next) => {
  const user = req.user;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  try {
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.send(user);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update user.", 500)
    );
  }
};

//////////////////////////////////////////////////////////
// Delete user ///////////////////////////////////////

const deleteUser = async (req, res, next) => {
  try {
    await req.user.remove();
    sendCancelationEmail(req.user.email, req.user.name);

    res.send();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete user.", 500)
    );
  }
};

module.exports = {
  createUser,
  loginUser,
  googleLogin,
  logoutUser,
  getItems,
  updateUser,
  deleteUser,
};
