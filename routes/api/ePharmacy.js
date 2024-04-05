const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/ePharmacy");

router.get("/stores", ctrl.getAllStores);

router.get("/stores/nearest", ctrl.getNearestStores);

module.exports = router;
