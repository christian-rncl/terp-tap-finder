var express = require('express');
var router = express.Router();
var building_controller = require('../controllers/buildingController');

/* GET home page. */
router.get('/', building_controller.index_get);

router.post('/', building_controller.index_post);

router.get('/:code', building_controller.nearestTap_get);

router.post('/:code', building_controller.nearestTap_post);

module.exports = router;
