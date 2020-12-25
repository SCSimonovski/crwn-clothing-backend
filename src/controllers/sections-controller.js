const Section = require("../models/section-model.js");
const HttpError = require("../error/http-error");

// Create new section /////////////////////////////

const createSection = async (req, res, next) => {
  const section = new Section(req.body);

  try {
    await section.save();
    res.status(201).send(section);
  } catch (err) {
    return next(
      new HttpError("Creating section failed, please try again.", 500)
    );
  }
};

////////////////////////////////////////////////////
// Find all sections ///////////////////////////////

const getAllSections = async (req, res, next) => {
  try {
    const sections = await Section.find({});

    if (!sections) {
      return next(new HttpError("Could not find any section.", 404));
    }

    res.send(sections);
  } catch (err) {
    return next(
      new HttpError("Fetching sections failed, please try again later.", 500)
    );
  }
};

////////////////////////////////////////////////////////
// Get all items from on section ///////////////////////

const getAllItems = async (req, res, next) => {
  try {
    const section = await Section.findOne({ title: req.params.title });

    if (!section) {
      return next(new HttpError("Could not find the section.", 404));
    }

    await section
      .populate({
        path: "items",
      })
      .execPopulate();

    res.send(section.items);
  } catch (err) {
    return next(
      new HttpError("Fetching sections failed, please try again later.", 500)
    );
  }
};

///////////////////////////////////////////////////////////////
// Update section /////////////////////////////////////////////

const updateSection = async (req, res, next) => {
  const _id = req.params.id;

  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "imageUrl"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  try {
    const section = await Section.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!section) {
      return next(
        new HttpError("Could not find section for the provided id.", 404)
      );
    }

    res.send(section);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find section.", 500)
    );
  }
};

////////////////////////////////////////////////////////////////
// Delete section //////////////////////////////////////////////

const deleteSection = async (req, res, next) => {
  try {
    const section = await Section.findByIdAndDelete(req.params.id);

    if (!section) {
      return next(
        new HttpError("Could not find section for the provided id.", 404)
      );
    }

    res.send(section);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete section.", 500)
    );
  }
};

////////////////////////////////////////////////////////////////

module.exports = {
  deleteSection,
  updateSection,
  getAllItems,
  getAllSections,
  createSection,
};
