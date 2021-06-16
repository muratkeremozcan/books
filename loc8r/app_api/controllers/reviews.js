const mongoose = require('mongoose');
// const Loc = mongoose.model('Location');

const doSetAverageRating = (location) => {
  res
    .status(200)
    .json({ "status": "success" })
};

const updateAverageRating = (locationId) => {
  res
    .status(200)
    .json({ "status": "success" })
};

const doAddReview = (req, res, location) => {
  res
    .status(200)
    .json({ "status": "success" })
};

const reviewsCreate = (req, res) => {
  res
    .status(200)
    .json({ "status": "success" })
};

const reviewsReadOne = (req, res) => {
  res
    .status(200)
    .json({ "status": "success" })
};

const reviewsUpdateOne = (req, res) => {
  res
    .status(200)
    .json({ "status": "success" })
};

const reviewsDeleteOne = (req, res) => {
  res
    .status(200)
    .json({ "status": "success" })
};

module.exports = {
  reviewsCreate,
  reviewsReadOne,
  reviewsUpdateOne,
  reviewsDeleteOne
};