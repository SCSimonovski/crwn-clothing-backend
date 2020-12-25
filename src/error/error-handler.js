const errorHandler = (error, req, res, next) => {
  res.status(error.code || 500).send({
    error: error.message || "An unknown error has occured",
    code: error.code || 500,
  });
};

module.exports = errorHandler;
