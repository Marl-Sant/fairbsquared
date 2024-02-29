const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');


const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');

const router = express.Router()
