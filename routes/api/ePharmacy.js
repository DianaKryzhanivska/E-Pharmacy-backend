const express = require("express");

const router = express.Router();

const ctrl = require("../../controllers/ePharmacy");

router.get("/stores", ctrl.getAllStores);

module.exports = router;
