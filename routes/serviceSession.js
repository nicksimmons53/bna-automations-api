const express = require('express');
const dotenv = require("dotenv");
const axios = require("axios");
const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
});

dotenv.config();