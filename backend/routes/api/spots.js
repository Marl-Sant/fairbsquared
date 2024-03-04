const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');

const router = express.Router()

const validateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Please provide new address'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a new city'),
    check('state')
        .exists({ checkFalsy: true })
        .isLength({ min: 2, max: 2 })
        .withMessage('Please provide a new state using their abbreviation'),
    check('country')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a new country'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ max: 40 })
        .withMessage('Please provide the spot with a new name within the 40 character maximum'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a new description for the spot'),
    check('price')
        .exists({checkFalsy: true})
        .withMessage('Please provide a new price'),
    handleValidationErrors
]


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
module.exports = router
