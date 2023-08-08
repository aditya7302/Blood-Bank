const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDonarsListControllers,
  getHospitalListControllers,
  getOrgListControllers,
} = require("../controllers/adminControllers");
const adminMiddleware = require("../middlewares/adminMiddleware");

//router object
const router = express.Router();

//Routes

//GET || DONAR LIST
router.get(
  "/donar-list",
  authMiddleware,
  adminMiddleware,
  getDonarsListControllers
);

//GET || Hospital LIST
router.get(
  "/hospital-list",
  authMiddleware,
  adminMiddleware,
  getHospitalListControllers
);

//GET || org LIST
router.get(
  "/org-list",
  authMiddleware,
  adminMiddleware,
  getOrgListControllers
);


//delete donar || get

router.delete('/delete-donar/:id', authMiddleware,adminMiddleware,getOrgListControllers);

//Exports
module.exports = router;
