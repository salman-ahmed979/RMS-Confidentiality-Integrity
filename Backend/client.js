const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { getKeyPair } = require("./controller/generateKeys");
const { generateCSR } = require("./controller/generateCSR");
const { pki } = require("node-forge");
dotenv.config({ path: "./.env" });

const app = express();

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Requests
app.post("/generateKeyPair", (req, res) => {
  const { userName, email } = req.body;
  // Key Generation
  const Keys = getKeyPair();
  const publicKey = Keys.publicKey;
  const privateKey = Keys.privateKey;

  // Store Keys in a file
  const publicFile = `./Keys/${userName}_Public.pem`;
  const privateFile = `./Keys/${userName}_Private.pem`;

  fs.writeFileSync(publicFile, publicKey, { encoding: "utf-8" });
  fs.writeFileSync(privateFile, privateKey, { encoding: "utf-8" });

  // Hash Key
  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
  const hashPrivateKey = bcrypt.hashSync(privateKey, salt);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.HOST_EMAIL.toString(), // generated ethereal user
      pass: process.env.HOST_PASSWORD.toString(), // generated ethereal password
    },
  });
  // send mail with defined transport object
  let information = transporter.sendMail(
    {
      from: process.env.HOST_EMAIL.toString(), // sender address
      to: email.toString(), // list of receivers
      subject: "Private Key for Signature", // Subject line
      text: hashPrivateKey, // plain text body
    },
    (err, info) => {
      if (err) console.log(err);
      else console.log(info.response);
    }
  );

  return res.json({ message: "Keys Successfully Created", status: "success" });
});

app.get("/getPublicKey", (req, res) => {
  const { userName } = req.body;
  if (!userName)
    return res
      .status(404)
      .json({ message: "UserName is empty", status: "failed" });
  else {
    const publicKeyPath = `./Keys/${userName}_Public.key`;
    if (!fs.existsSync(publicKeyPath))
      return res
        .status(404)
        .json({ message: "Public Key doesnot exist", status: "failed" });
    else {
      let publicKey = fs.readFileSync(publicKeyPath);
      return res.json({
        message: "Public Key Reterived",
        status: "success",
        publicKey: publicKey,
      });
    }
  }
});

app.post("/generatecsr", (req, res) => {
  const { userName } = req.body;

  const publicFile = `./Keys/${userName}_Public.pem`;
  const privateFile = `./Keys/${userName}_Private.pem`;

  const publicKey = fs.readFileSync(publicFile);
  const privateKey = fs.readFileSync(privateFile);

  let attribute = [
    {
      name: "commonName",
      value: `Client_${userName}`,
    },
    {
      name: "countryName",
      value: "PK",
    },
    {
      shortName: "ST",
      value: "Sindh",
    },
    {
      name: "localityName",
      value: "Blacksburg",
    },
    {
      name: "organizationName",
      value: "Client",
    },
    {
      shortName: "OU",
      value: "Test",
    },
  ];

  const CSR = generateCSR(publicKey, privateKey, attribute);
  const csrPath = `./Certificate/${userName}_CSR.pem`;
  fs.writeFileSync(csrPath, CSR, { encoding: "utf-8" });

  return res
    .status(200)
    .json({ message: "CSR created", status: "success", csr: CSR });
});

app.post("/saveCertificate", (req, res) => {
  const { userName, certificate } = req.body;
  let path = `./Certificate/${userName}_Certificate.pem`;
  fs.writeFileSync(path, certificate, { encoding: "utf-8" });
  return res.status(200).json({
    message: "Certificate Saved Successfully",
    status: "success",
  });
});

app.post("/generate_digitalsignature", (req, res) => {
  const { userName, key } = req.body;
  const studentData = {
    sid: req.body.sid,
    gpa: req.body.gpa,
  };
  const privateFile = `./Keys/${userName}_Private.pem`;
  const privateKey = fs.readFileSync(privateFile, { encoding: "utf-8" });

  // Hash Key
  const hashPrivateKey = bcrypt.compareSync(privateKey, key);
  console.log(hashPrivateKey);
  if (!hashPrivateKey) {
    return res
      .status(401)
      .json({ message: "Key mismatched", status: "failed" });
  }

  const data = Buffer.from(JSON.stringify(studentData));
  // Sign the data and returned signature in buffer
  const sign = crypto.sign("SHA256", data, privateKey);
  // Convert returned buffer to base64
  const signature = sign.toString("base64");

  const certPath = `./Certificate/${userName}_Certificate.pem`;
  const certificate = fs.readFileSync(certPath, { encoding: "utf-8" });

  return res.status(200).json({
    signature: signature,
    certificate: certificate,
    studentData: studentData,
    status: "success",
  });
});

app.listen("7000", () => {
  console.log("Client Server is Listening on port 7000...");
});

/*
// For Pem Formate file
fs.readFile(publicKeyPath, "utf8", (err, data) => {
        let newData = data.substring(31, data.length - 28 - 2);
        newData = newData.replace(/(\r\n|\n|\r)/gm, "");
        console.log(newData);
    });

*/
