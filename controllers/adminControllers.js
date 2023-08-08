const userModel = require("../models/userModel");

//get donar list
const getDonarsListControllers = async (req, res) => {
  try {
    const donarData = await userModel
      .find({ role: "donar" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      totalCount: donarData.length,
      message: "donar list fetched successfully",
      donarData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in donar list api",
      error,
    });
  }
};

//get hospital list
const getHospitalListControllers = async (req, res) => {
  try {
    const hospitalData = await userModel
      .find({ role: "hospital" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      totalCount: hospitalData.length,
      message: "hospital list fetched successfully",
      hospitalData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in hospital list api",
      error,
    });
  }
};

//get organisation list
const getOrgListControllers = async (req, res) => {
  try {
    const orgData = await userModel
      .find({ role: "organisation" })
      .sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      totalCount: orgData.length,
      message: "org list fetched successfully",
      orgData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error in org list api",
      error,
    });
  }
};

//delete donar

const deleteDonarController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      success: true,
      message: " record deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "error while deleting ",
    });
  }
};



module.exports = {
  getDonarsListControllers,
  getHospitalListControllers,
  getOrgListControllers,
  deleteDonarController,
};
