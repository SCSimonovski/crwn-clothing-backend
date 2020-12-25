const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    linkUrl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

sectionSchema.virtual("items", {
  ref: "Item",
  localField: "title",
  foreignField: "category",
});

sectionSchema.methods.toJSON = function () {
  const section = this;
  const sectionObject = section.toObject();

  sectionObject.id = sectionObject._id;
  delete sectionObject._id;

  return sectionObject;
};

const Section = new mongoose.model("Section", sectionSchema);

module.exports = Section;
