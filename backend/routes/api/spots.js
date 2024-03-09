const express = require('express');
const { validateSpot, validateReview, validateBooking } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');
const { Spot, Review, Booking } = require('../../db/models');


const router = express.Router()


//Create a new spot

router.post(
    '',
    requireAuth, validateSpot,
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        const spot = await Spot.create({ ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price })

        res.json(spot)
    }
)

//Get all spots without search functionality
router.get(
    '',
    async (req, res) => {
        const spots = await Spot.findAll()
        res.json(spots)
    }
)


//Delete spot based on the params
router.delete(
    "/:spotId",
    requireAuth,
    async (req, res) => {
        const deleteThisSpot = await Spot.findByPk(req.params.spotId)
        if (!deleteThisSpot) {
            res.status(404)
            res.json({
                message: "Spot couldn't be found",
                statusCode: 404
            })
        } else if (deleteThisSpot.ownerId !== req.user.id) {
            res.status(401),
                res.json({
                    message: "User must own the spot in order to delete.",
                    statusCode: 401
                })
        } else {
            await deleteThisSpot.destroy()
            res.json({ message: 'Successfully deleted the spot.' })
        }
    })

//Update spot based on params and prepopulated information
router.put(
    "/:spotId",
    requireAuth, validateSpot,
    async (req, res) => {
        const editThisSpot = await Spot.findByPk(req.params.spotId)
        if (!editThisSpot) {
            res.status(404)
            res.json({
                message: "Spot couldn't be found",
                statusCode: 404
            })
        } else if (editThisSpot.ownerId !== req.user.id) {
            res.status(401),
                res.json({
                    message: `User must own the spot in order to make edits to the spot.`,
                    statusCode: 401
                })
        } else {
            const { address, city, state, country, lat, lng, name, description, price } = req.body

            editThisSpot.address = address
            editThisSpot.city = city
            editThisSpot.state = state
            editThisSpot.country = country
            editThisSpot.lat = lat
            editThisSpot.lng = lng
            editThisSpot.name = name
            editThisSpot.description = description
            editThisSpot.price = price

            editThisSpot.save()
            res.json(editThisSpot)
        }
    }
)

//REVIEW ROUTES TIED TO SPOTS

router.post(
    '/:spotId/reviews',
    requireAuth, validateReview,
    async (req, res) => {
        const { review, stars } = req.body
        const newReview = await Review.create({ userId: req.user.id, spotId: Number(req.params.spotId), review, stars })
        res.json(newReview)
    })

router.put(
    '/:spotId/reviews/:reviewId',
    requireAuth, validateReview,
    async (req, res) => {
        const editThisReview = await Review.findByPk(req.params.reviewId)
        if (!editThisReview) {
            res.status(404)
            res.json({ message: "Review was not found" })
        } else if (editThisReview.userId !== req.user.id) {
            res.status(401)
            res.json({ message: "User must be the author of the review in order to make edits" })
        } else {
            const { review, stars } = req.body

            editThisReview.review = review
            editThisReview.stars = stars

            editThisReview.save()
            res.json(editThisReview)
        }
    }
)


router.get(
    "/:spotId/reviews",
    async (req, res) => {
        const reviewsOnSpot = await Review.findAll({ where: { spotId: req.params.spotId } })
        res.json(reviewsOnSpot)
    }
)

router.delete(
    "/:spotId/reviews/:reviewId",
    async (req, res) => {
        const deleteThisReview = await Review.findByPk(req.params.reviewId)
        if(!deleteThisReview){
            res.status(404)
            res.json({message: "This review was not found and cannot be deleted"})
        }else if(deleteThisReview.userId !== req.user.id){
            res.status(401)
            res.json({message: "User must be author of the review in order to delete it"})
        }else{
            deleteThisReview.destroy()
            res.json({message: "Review has been successfully deleted"})
        }
    }
)

//Bookings tied to Spots
router.post(
    '/:spotId/bookings',
    requireAuth, validateBooking,
    async(req, res) => {
        const {startDate, endDate} = req.body
        const newBooking = await Booking.create({userId: req.user.id, spotId: Number(req.params.spotId), startDate, endDate})
        res.json(newBooking)
    }
)

module.exports = router
