const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');

router.post('/', showController.createShow);
router.get('/', showController.listShows);
router.get('/:id', showController.getShowWithSeats);

module.exports = router;
