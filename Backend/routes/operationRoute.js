const express = require("express");
const router = express.Router();
const {
  addStudent,
  editStudentRecord,
  viewStudents,
  getUserName
} = require("../controller/operationController");

router.route("/addstudent").post(addStudent);
router.route("/editrecord").put(editStudentRecord);
router.route("/viewstudents").get(viewStudents);
router.route("/getusername").get(getUserName)

module.exports = router;
