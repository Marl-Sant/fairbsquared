const express = require('express');
const { validateBooking } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Booking } = require('../../db/models');

const router = express.Router();

router.get('/:bookingId', requireAuth, async (req, res) => {
  const findBooking = await Booking.findByPk(
    req.params.bookingId
  );
  if (!findBooking) {
    res.status(404);
    res.json({ message: 'Booking is not found' });
  } else if (findBooking.userId !== req.user.id) {
    res.status(401);
    res.json({
      message: 'User must be the owner of the booking to see it',
    });
  } else {
    res.json(findBooking);
  }
});

router.delete('/:bookingId', requireAuth, async (req, res) => {
  const bookingToDelete = await Booking.findByPk(
    req.params.bookingId
  );
  if (!bookingToDelete) {
    res.status(404);
    res.json({ message: 'Booking is not found' });
  } else if (bookingToDelete.userId !== req.user.id) {
    res.status(401);
    res.json({
      message:
        'User must be the owner of the booking to delete it',
    });
  } else {
    bookingToDelete.destroy();
    res.json({
      message: 'Booking has been deleted successfully',
    });
  }
});

router.put(
  '/:bookingId',
  requireAuth,
  validateBooking,
  async (req, res) => {
    const bookingToEdit = await Booking.findByPk(
      req.params.bookingId
    );
    if (!bookingToEdit) {
      res.status(404);
      res.json({ message: 'Booking is not found' });
    } else if (bookingToEdit.userId !== req.user.id) {
      res.status(401);
      res.json({
        message:
          'User must be the owner of the booking to make edits',
      });
    } else {
      const { startDate, endDate } = req.body;

      bookingToEdit.startDate = startDate;
      bookingToEdit.endDate = endDate;

      bookingToEdit.save();
      res.json(bookingToEdit);
    }
  }
);

module.exports = router;
