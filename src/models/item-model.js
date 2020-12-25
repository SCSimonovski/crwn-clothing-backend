const mongoose = require("mongoose");
const validator = require("validator");

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      ref: "Section",
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.methods.toJSON = function () {
  const item = this;
  const itemObject = item.toObject();

  itemObject.id = itemObject._id;
  delete itemObject._id;

  return itemObject;
};

const Item = new mongoose.model("Item", itemSchema);

module.exports = Item;
