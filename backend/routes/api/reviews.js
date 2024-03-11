const express = require('express');
const { validateReview } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models');

const router = express.Router();
//Delete a spot review based on params
router.delete('/:reviewId', async (req, res) => {
  const deleteThisReview = await Review.findByPk(
    req.params.reviewId
  );
  if (!deleteThisReview) {
    res.status(404);
    res.json({
      message: 'This review was not found and cannot be deleted',
    });
  } else if (deleteThisReview.userId !== req.user.id) {
    res.status(401);
    res.json({
      message:
        'User must be author of the review in order to delete it',
    });
  } else {
    deleteThisReview.destroy();
    res.json({
      message: 'Review has been successfully deleted',
    });
  }
});

//Edit a spot review based on params
router.put(
  '/:reviewId',
  requireAuth,
  validateReview,
  async (req, res) => {
    const editThisReview = await Review.findByPk(
      req.params.reviewId
    );
    if (!editThisReview) {
      res.status(404);
      res.json({ message: 'Review was not found' });
    } else if (editThisReview.userId !== req.user.id) {
      res.status(401);
      res.json({
        message:
          'User must be the author of the review in order to make edits',
      });
    } else {
      const { review, stars } = req.body;

      editThisReview.review = review;
      editThisReview.stars = stars;

      editThisReview.save();
      res.json(editThisReview);
    }
  }
);

module.exports = router;
