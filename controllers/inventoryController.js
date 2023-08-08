const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

//CREATE INVENTORY

const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if(inventoryType === 'in' && user.role !== 'donar'){
    //     throw new Error('Not a donor account')
    // }
    // if(inventoryType === 'out' && user.role !== 'hospital'){
    //     throw new Error('Not a hospital')
    // }

    if (req.body.inventoryType === "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedBloodQuantity = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);

      //calculate blood quantity
      const totalInofRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      // console.log("total in", totalInofRequestedBlood);
      const totalIn = totalInofRequestedBlood[0]?.total || 0;
      //calculate out blood quantity

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: `$bloodGroup`,
            total: { $sum: `$quantity` },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in and out calc
      const availableQuantityOfBloodGroup = totalIn - totalOut;
      //quantity validation
      if (availableQuantityOfBloodGroup < requestedBloodQuantity) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuantityOfBloodGroup}ml of ${requestedBloodGroup.toUpperCase()} is available.`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donar = user?._id;
    }

    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "new blood record added",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in create inventory api",
      error,
    });
  }
};

//GET ALL BLOOD RECORDS

const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({ organisation: req.body.userId })
      .populate("donar")
      .populate("hospital")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get all records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in get all inventory",
      error,
    });
  }
};

// get donar records

const getDonarController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //find donar
    const donarId = await inventoryModel.distinct("donar", {
      organisation,
    });
    // console.log(donarId);
    const donars = await userModel.find({
      _id: { $in: donarId },
    });

    return res.status(200).send({
      success: true,
      message: "donar record fetched successfully",
      donars,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in donar records",
      error,
    });
  }
};

const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //get hospital id
    const hospitalId = await inventoryModel.distinct("hospital", {
      organisation,
    });
    //find hospital
    const hospitals = await userModel.find({
      _id: { $in: hospitalId },
    });
    return res.status(200).send({
      success: true,
      message: "hospitals data fetched successfully",
      hospitals,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in get hospital api",
    });
  }
};

//get org profiles

const getOrganisationControllers = async (req, res) => {
  try {
    const donar = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", {
      donar,
    });
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "org data fetched successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in org api",
      error,
    });
  }
};

//get org for profiles

const getOrganisationForHospitalControllers = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct("organisation", {
      hospital,
    });
    const organisations = await userModel.find({
      _id: { $in: orgId },
    });
    return res.status(200).send({
      success: true,
      message: "hospitals org data fetched successfully",
      organisations,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in hospital org api",
      error,
    });
  }
};

//GET hospital BLOOD RECORDS

const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find(req.body.filters)
      .populate("donar")
      .populate("hospital")
      .populate("organisation")
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "get hospital consumer records successfully",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in get consumer inventory",
      error,
    });
  }
};

//GET BLOOD RECORDS OF 3
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel
      .find({
        organisation: req.body.userId,
      })
      .limit(3)
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "recent inventory data",
      inventory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in recent inventory api",
      error,
    });
  }
};

module.exports = {
  createInventoryController,
  getInventoryController,
  getDonarController,
  getHospitalController,
  getOrganisationControllers,
  getOrganisationForHospitalControllers,
  getInventoryHospitalController,
  getRecentInventoryController,
};
