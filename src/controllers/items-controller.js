const mongoose = require("mongoose");

const Item = require("../models/item-model.js");
const HttpError = require("../error/http-error");

////////////////////////////////////////////////////
// Add all item from one category to the database //

const addAllItem = async (req, res, next) => {
  const items = req.body;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    const promises = items.map(async (item) => {
      const itemData = new Item(item);
      return await itemData.save({ session: sess });
    });

    await Promise.all(promises);

    await sess.commitTransaction();
    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

////////////////////////////////////////////////////
// Create new item /////////////////////////////////

const createItem = async (req, res, next) => {
  const item = new Item(req.body);
  try {
    await item.save();
    res.status(201).send(item);
  } catch (err) {
    return next(new HttpError("Creating item failed, please try again.", 500));
  }
};

//////////////////////////////////////////////////
// Get item by ID ////////////////////////////////

const getItemById = async (req, res, next) => {
  let item;
  try {
    item = await Item.findOne({
      _id: req.params.id,
    });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find item.", 500)
    );
  }

  if (!item) {
    return next(new HttpError("Could not find item for the provided id.", 404));
  }

  res.send(item);
};

/////////////////////////////////////////////////////
// Update item /////////////////////////////////////

const updateItem = async (req, res, next) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["price", "name", "imageUrl"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  try {
    const item = await Item.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    if (!item) {
      return next(
        new HttpError("Could not find item for the provided id.", 404)
      );
    }

    res.send(item);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update item.", 500)
    );
  }
};

////////////////////////////////////////////////////////
// Delete item /////////////////////////////////////////

const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return next(
        new HttpError("Could not find item for the provided id.", 404)
      );
    }

    res.send(item);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete item.", 500)
    );
  }
};

////////////////////////////////////////////////////////

module.exports = {
  createItem,
  addAllItem,
  getItemById,
  updateItem,
  deleteItem,
};
