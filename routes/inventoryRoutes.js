const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createInventoryController,
  getInventoryController,
  getDonarController,
  getHospitalController,
  getOrganisationControllers,
  getOrganisationForHospitalControllers,
  getInventoryHospitalController,
  getRecentInventoryController,
} = require("../controllers/inventoryController");

const router = express.Router();

//routes
// ADD Inventory || POST
router.post("/create-inventory", authMiddleware, createInventoryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventory", authMiddleware, getInventoryController);

//GET RECENT BLOOD RECORDS
router.get("/get-recent-inventory", authMiddleware, getRecentInventoryController);

//GET HOSPITAL BLOOD RECORDS
router.post(
  "/get-inventory-hospital",
  authMiddleware,
  getInventoryHospitalController
);

//GET ALL DONAR RECORDS
router.get("/get-donars", authMiddleware, getDonarController);

//GET HOSPITALS RECORDS
router.get("/get-hospitals", authMiddleware, getHospitalController);

//GET ORGANISATION RECORDS
router.get("/get-organisation", authMiddleware, getOrganisationControllers);

//GET ORGANISATION RECORDS
router.get(
  "/get-organisation-for-hospital",
  authMiddleware,
  getOrganisationForHospitalControllers
);

module.exports = router;
