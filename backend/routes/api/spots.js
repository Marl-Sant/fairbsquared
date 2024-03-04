const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');


const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');

const router = express.Router()


//Create a new spot

router.post(
    '',
    requireAuth,
    async (req, res) => {
        const { address, city, state, country, lat, lng, name, description, price } = req.body
        const spot = await Spot.create({ ownerId: req.user.id, address, city, state, country, lat, lng, name, description, price })

        res.json(spot)
    }
)

router.get(
    '',
    async (req, res) => {
        const spots = await Spot.findAll()
        res.json(spots)
    }
)

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

router.put(
    "/:spotId",
    requireAuth,
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
