const bcrypt = require("bcrypt");
const db = require("../model/model");
const forge = require("node-forge");
const crypto = require("crypto");

const addStudent = (req, res) => {
  const { studentName, department, gpa } = req.body;

  if (studentName === "" || department === "" || gpa === "")
    return res
      .status(400)
      .json({ message: "Invalid Parameters", status: "failed" });

  const sqlQuery =
    "INSERT INTO student_record(sname, department, gpa) VALUES(?,?,?)";
  const GPA = parseFloat(gpa);
  db.query(sqlQuery, [studentName, department, GPA], (err, result) => {
    if (err)
      return res
        .status(400)
        .json({ message: "Failed to add record", status: "failed" });
    return res
      .status(201)
      .json({ message: "Recorded Added Successfully", status: "success" });
  });
};

const editStudentRecord = (req, res) => {
  // Digital Signature
  const { signature, certificate, ca_certificate, studentData } = req.body;

  const certificateVerify = forge.pki.certificateFromPem(certificate);

  let store = forge.pki.createCaStore([ca_certificate]);
  const verified = forge.pki.verifyCertificateChain(store, [certificateVerify]);

  if (!verified) {
    return res
      .status(401)
      .json({ message: "Certificate Verification Failed", status: "failed" });
  }
  console.log("Certificate Public Key\n", certificate.publicKey);
  console.log("\n\nCertificateVerify Public Key\n", forge.pki.publicKeyToPem( certificateVerify.publicKey));
  let publicKey = forge.pki.publicKeyToPem(certificateVerify.publicKey);
  console.log("PublicKey", publicKey);

  const data = Buffer.from(JSON.stringify(studentData));
  const verifySign = crypto.verify("SHA256", data, publicKey, Buffer.from(signature, "base64"));
  if (!verifySign) {
    return res
      .status(401)
      .json({
        message: "Digital Signature Verification Failed",
        status: "failed",
      });
  }

  let sid = studentData.sid;
  let gpa = studentData.gpa;

  if (sid === "" || gpa === "")
    return res
      .status(400)
      .json({ message: "Invalid Parameters", status: "failed" });

  let _sid = parseInt(sid);
  let _gpa = parseFloat(gpa);
  const sqlQuery = "UPDATE student_record SET gpa = ? WHERE sid = ?";
  db.query(sqlQuery, [_gpa, _sid], (err, result) => {
    if (err)
      return res
        .status(400)
        .json({ message: "Failed to add record", status: "failed" });
    if (result.affectedRows > 0)
      return res
        .status(201)
        .json({ message: "Recorded Updated Successfully", status: "success" });
  });
};

const viewStudents = (req, res) => {
  sqlQuery = "SELECT * FROM student_record";
  db.query(sqlQuery, (err, result) => {
    if (err)
      return res
        .status(400)
        .json({ message: "Failed to Display records", status: "failed" });
    if (result.length == 0)
      return res
        .status(200)
        .json({ message: "No records found", status: "failed" });

    return res.status(200).json({ message: result, status: "success" });
  });
};

const getUserName = (req, res) => {
  if (!req.userName)
    return res
      .status(401)
      .json({ message: "User not found", status: "failed" });
  const userName = req.userName;
  return res.status(200).json({ message: userName, status: "success" });
};
module.exports = { addStudent, editStudentRecord, viewStudents, getUserName };
