const express = require('express');
const {
  validateSpot,
  validateReview,
  validateBooking,
} = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Spot, Review, Booking } = require('../../db/models');

const router = express.Router();

//Create a new spot
router.post('', requireAuth, validateSpot, async (req, res) => {
  const {
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  } = req.body;

  const spot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.json(spot);
});

//Get all spots without search functionality
router.get('', async (req, res) => {
  let { searchCity, searchStartDate, searchEndDate } = req.query;

  let emptyStartDate = new Date();

  let [year, month, day] = [
    emptyStartDate.getFullYear(),
    emptyStartDate.getMonth() + 1,
    emptyStartDate.getDate(),
  ];
  //add a zero for syntax purposes if the month doesn't have the appropriate length
  if (month.toString().length < 2) {
    month = `0${month}`;
  }
  //do the same for the day if it is not the correct length
  if (day.toString().length < 2) {
    day = `0${day}`;
  }

  // if the user does not input a search date, set the start to today's date if start
  // is empty
  emptyStartDate = new Date(
    `${year}-${month}-${day}T00:00:00Z`
  ).getTime();

  // set the end to three days later if end is empty
  let emptyEndDate = emptyStartDate + 86400000 * 3;

  if (searchStartDate)
    searchStartDate = new Date(searchStartDate).getTime();

  if (searchEndDate)
    searchEndDate = new Date(searchEndDate).getTime();

  if (!searchStartDate) searchStartDate = emptyStartDate;
  if (!searchEndDate) searchEndDate = emptyEndDate;

  const spots = await Spot.findAll({
    include: [{ model: Booking }, { model: Review }],
  });

  res.json(
    spots.filter((spot) => {
      if (!spot.Bookings) {
        return true;
      } else {
        for (let booking of spot.Bookings) {
          let existingBookingStart = new Date(
            booking.startDate
          ).getTime();
          let existingBookingEnd = new Date(
            booking.endDate
          ).getTime();
          // if past bookings exist and have ended before your search dates, do not
          //bother comparing
          //**BELOW IS FOR TESTING PURPOSES, UNCOMMENT TO SEE IF COMPARISONS ARE
          // WORKING AS INTENDED
          // console.log(
          //   searchStartDate >= existingBookingStart &&
          //     searchStartDate <= existingBookingEnd,
          //   'start search is in booking'
          // );
          // console.log(
          //   searchEndDate >= existingBookingStart &&
          //     searchEndDate <= existingBookingEnd,
          //   'end search is in booking'
          // );
          // console.log(
          //   existingBookingStart >= searchStartDate &&
          //     existingBookingStart <= searchEndDate,
          //   'existing booking start found between search dates'
          // );
          // console.log(
          //   existingBookingEnd >= searchStartDate &&
          //     existingBookingEnd <= searchEndDate,
          //   'existing booking end found between search dates'
          // );
          if (existingBookingEnd >= searchStartDate) {
            if (
              // if the searchStartDate is between an existing booking
              (searchStartDate >= existingBookingStart &&
                searchStartDate <= existingBookingEnd) ||
              // if the searchEndDate is between an existing booking
              (searchEndDate >= existingBookingStart &&
                searchEndDate <= existingBookingEnd) ||
              // if the existing booking start is between the search dates
              (existingBookingStart >= searchStartDate &&
                existingBookingStart <= searchEndDate) ||
              // if the existing booking end is between the search dates
              (existingBookingEnd >= searchStartDate &&
                existingBookingEnd <= searchEndDate)
            ) {
              return false;
            }
          }
        }
        return true;
      }
    })
  );
});

//Delete spot based on the params
router.delete('/:spotId', requireAuth, async (req, res) => {
  const deleteThisSpot = await Spot.findByPk(req.params.spotId);
  if (!deleteThisSpot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
      statusCode: 404,
    });
  } else if (deleteThisSpot.ownerId !== req.user.id) {
    res.status(401),
      res.json({
        message: 'User must own the spot in order to delete.',
        statusCode: 401,
      });
  } else {
    await deleteThisSpot.destroy();
    res.json({ message: 'Successfully deleted the spot.' });
  }
});

//Update spot based on params and prepopulated information
router.put(
  '/:spotId',
  requireAuth,
  validateSpot,
  async (req, res) => {
    const editThisSpot = await Spot.findByPk(req.params.spotId);
    if (!editThisSpot) {
      res.status(404);
      res.json({
        message: "Spot couldn't be found",
        statusCode: 404,
      });
    } else if (editThisSpot.ownerId !== req.user.id) {
      res.status(401),
        res.json({
          message: `User must own the spot in order to make edits to the spot.`,
          statusCode: 401,
        });
    } else {
      const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      } = req.body;

      editThisSpot.address = address;
      editThisSpot.city = city;
      editThisSpot.state = state;
      editThisSpot.country = country;
      editThisSpot.lat = lat;
      editThisSpot.lng = lng;
      editThisSpot.name = name;
      editThisSpot.description = description;
      editThisSpot.price = price;

      editThisSpot.save();
      res.json(editThisSpot);
    }
  }
);

//REVIEW ROUTES TIED TO SPOTS
//Create a review based on the spot
router.post(
  '/:spotId/reviews',
  requireAuth,
  validateReview,
  async (req, res) => {
    const { review, stars } = req.body;
    const newReview = await Review.create({
      userId: req.user.id,
      spotId: Number(req.params.spotId),
      review,
      stars,
    });
    res.json(newReview);
  }
);

//Get all the reviews on spot
router.get('/:spotId/reviews', async (req, res) => {
  const reviewsOnSpot = await Review.findAll({
    where: { spotId: req.params.spotId },
  });
  res.json(reviewsOnSpot);
});

//Bookings tied to Spots
//Create a booking based on spot, must add logic to return error message if the
//dates have already been taken.
router.post(
  '/:spotId/bookings',
  requireAuth,
  validateBooking,
  async (req, res) => {
    const { startDate, endDate } = req.body;
    const doesSpotExist = await Spot.findByPk(req.params.spotId);
    if (doesSpotExist) {
      const newBooking = await Booking.create({
        userId: req.user.id,
        spotId: Number(req.params.spotId),
        startDate,
        endDate,
      });
      res.json(newBooking);
    } else {
      res.status(404);
      res.json({
        message: 'Spot not found. Unable to make booking.',
      });
    }
  }
);

module.exports = router;
