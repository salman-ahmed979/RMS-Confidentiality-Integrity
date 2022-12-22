const express = require("express");
const crypto = require("crypto");
const fs = require("fs");
const forge = require("node-forge");
const cors = require("cors");
const app = express();
const { X509Certificate } = require("crypto");

const { generateCertificate } = require("./controller/generateCertificate");
const { getKeyPair } = require("./controller/generateKeys");

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/keys", (req, res) => {
  // Key Generation
  const Keys = getKeyPair();

  // Store Keys in a file
  const publicFile = `./CA_Keys/Public.pem`;
  const privateFile = `./CA_Keys/Private.pem`;

  fs.writeFileSync(publicFile, Keys.publicKey, { encoding: "utf-8" });
  fs.writeFileSync(privateFile, Keys.privateKey, { encoding: "utf-8" });

  return res
    .status(200)
    .json({ message: "Keys Created for CA", status: "Success" });
});

// Generate CA Certificate
app.get("/generate_CA_Certificate", (req, res) => {
  const privateFile = "./CA_Keys/Private.pem";
  let privateKey_CA = fs.readFileSync(privateFile);
  const publicFile = "./CA_Keys/Public.pem";
  let publicKey_CA = fs.readFileSync(publicFile);

  let attribute = [
    {
      name: "commonName",
      value: "CA",
    },
    {
      name: "countryName",
      value: "PAK",
    },
    {
      shortName: "ST",
      value: "Sindh",
    },
    {
      name: "localityName",
      value: "CAAuth",
    },
    {
      name: "organizationName",
      value: "CertificationAuthority",
    },
    {
      shortName: "OU",
      value: "Test",
    },
  ];

  let CA_Certificate = generateCertificate(
    publicKey_CA,
    privateKey_CA,
    attribute
  );

  let certificatePath = "./Certificate/CA_Certificate.pem";
  fs.writeFileSync(certificatePath, CA_Certificate, { encoding: "utf-8" });

  return res
    .status(200)
    .json({ message: "CA Certificate created", status: "success" });
});

// Digital Certificate
app.post("/generateDigitalCertificate", (req, res) => {
  const { userName, csr } = req.body;
  // get client certificate request
  // const csrPath = `./Certificate/${userName}_CSR.pem`;
  // let csr = fs.readFileSync(csrPath, { encoding: "utf-8" });
  const csr_client = forge.pki.certificationRequestFromPem(csr);

  // Read CA Certificate and Key
  const caPath = "./Certificate/CA_Certificate.pem";
  const keyPath = "./CA_Keys/Private.pem";

  let CA_Cert = fs.readFileSync(caPath, { encoding: "utf-8" });
  let CA_Private = fs.readFileSync(keyPath, { encoding: "utf-8" });

  const CA_Certificate = forge.pki.certificateFromPem(CA_Cert);
  const CA_PrivateKey = forge.pki.privateKeyFromPem(CA_Private);

  if (csr_client.verify()) {
    console.log("Certification request (CSR) verified.");
  } else {
    return res
      .status(404)
      .json({ message: "CSR Not Verified", status: "failed" });
  }

  console.log("Creating certificate");

  // Creating certificate
  let certificate = forge.pki.createCertificate();
  certificate.serialNumber = "02";
  certificate.validity.notBefore = new Date();
  certificate.validity.notAfter = new Date();
  certificate.validity.notAfter.setFullYear(
    certificate.validity.notBefore.getFullYear() + 1
  );

  certificate.setSubject(csr_client.subject.attributes);
  certificate.setIssuer(CA_Certificate.subject.attributes);
  certificate.publicKey = csr_client.publicKey;

  // Signing Certificate
  certificate.sign(CA_PrivateKey);
  console.log("Certificate Created");

  const CertificatePem = forge.pki.certificateToPem(certificate);

  // fs.writeFileSync("./Certificate/Client.pem", CertificatePem, {
  //   encoding: "utf-8",
  // });
  return res.status(200).json({
    message: "Certificate Created",
    status: "success",
    certificate: CertificatePem,
  });
});

app.get("/verifyCertificate", (req, res) => {
  let cert = fs.readFileSync("./Certificate/Client.pem", { encoding: "utf-8" });
  const certificate = forge.pki.certificateFromPem(cert);
  const caPath = "./Certificate/CA_Certificate.pem";
  let CA_Cert = fs.readFileSync(caPath, { encoding: "utf-8" });
  const CA_Certificate = forge.pki.certificateFromPem(CA_Cert);

  let store = forge.pki.createCaStore([CA_Cert]);
  const verified = forge.pki.verifyCertificateChain(store, [certificate]);

  res.json({ verified: verified, status: "success" });
});

app.get("/get_CA_Certificate", (req, res) => {
  const caPath = "./Certificate/CA_Certificate.pem";
  let CA_Cert = fs.readFileSync(caPath, { encoding: "utf-8" });
  if (!CA_Cert) {
    return res
      .status(401)
      .json({ message: "No Certificate", status: "failed" });
  }
  return res.status(200).json({ ca_certificate: CA_Cert, status: "success" });
});

app.listen(4000, () => {
  console.log("CA Server is Listening on port 4000...");
});

app.post("/digitalcertificate", (req, res) => {
  const { userName, publicKeys } = req.body;

  const privateFile = "./CA_Keys/Private.pem";
  let privateKey_CA = fs.readFileSync(privateFile);

  let certificate = forge.pki.createCertificate();

  certificate.publicKey = publicKeys;
  certificate.serialNumber = "01";
  certificate.validity.notBefore = new Date();
  certificate.validity.notAfter = new Date();
  certificate.validity.notAfter.setFullYear(
    certificate.validity.notBefore.getFullYear() + 1
  );

  // let attrs = [
  //   {
  //     name: "userName",
  //     value: userName,
  //   },
  //   {
  //     name: "Authority",
  //     value: "CA",
  //   },
  // ];
  var attrs = [
    {
      name: "commonName",
      value: "example.org",
    },
    {
      name: "countryName",
      value: "US",
    },
    {
      shortName: "ST",
      value: "Virginia",
    },
    {
      name: "localityName",
      value: "Blacksburg",
    },
    {
      name: "organizationName",
      value: "Test",
    },
    {
      shortName: "OU",
      value: "Test",
    },
  ];

  certificate.setSubject(attrs);
  certificate.setIssuer(attrs);
  // console.log("\nPrivateKey\n", privateKey_CA.toString("utf-8"));
  // let key = privateKey_CA.toString("utf-8");
  let pri = forge.pki.privateKeyFromPem(privateKey_CA);
  console.log("\n\nPrivate key from pem\n\n", pri);
  // var keys = forge.pki.rsa.generateKeyPair(2048);
  // console.log(keys.privateKey);
  certificate.sign(pri, forge.md.sha256.create());
  console.log(certificate);
  let certificatePEM = forge.pki.certificateToPem(certificate);
  console.log("\nCertificate\n", certificatePEM);

  const publicFile = "./CA_Keys/Public.pem";
  let publicKey_CA = fs.readFileSync(publicFile);
  const x509 = new crypto.X509Certificate(certificatePEM);

  const value = x509.verify(publicKey);
  console.log("\nVerify Certificate: ", value);

  return res.status(200).json({
    message: "Certificate Created",
    status: "success",
    certificate: certificatePEM,
    verify: value,
  });
});

app.post("/certificate", (req, res) => {
  const { userName, publicKeys } = req.body;
  var pki = forge.pki;
  const publicFile = "./CA_Keys/Public.pem";
  let publicKey_CA = fs.readFileSync(publicFile);
  const CAKey = pki.publicKeyFromPem(publicKey_CA);
  // create a new certificate
  var cert = pki.createCertificate();

  // fill the required fields
  cert.publicKey = CAKey;
  cert.serialNumber = "01";
  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

  // use your own attributes here, or supply a csr (check the docs)
  var attrs = [
    {
      name: "commonName",
      value: userName,
    },
    {
      name: "countryName",
      value: "US",
    },
    {
      shortName: "ST",
      value: "Virginia",
    },
    {
      name: "localityName",
      value: "Blacksburg",
    },
    {
      name: "organizationName",
      value: "Test",
    },
    {
      shortName: "OU",
      value: "Test",
    },
  ];
  // here we set subject and issuer as the same one
  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  const privateFile = "./CA_Keys/Private.pem";
  let privateKey_CA = fs.readFileSync(privateFile);

  let acc = pki.privateKeyFromPem(privateKey_CA);
  // the actual certificate signing
  cert.sign(acc);

  // now convert the Forge certificate to PEM format
  var pem = pki.certificateToPem(cert);
  console.log(pem);
  fs.writeFileSync("./CA_Keys/public-cert.pem", pem);

  const x509 = new X509Certificate(pem);
  console.log(x509.toString());

  // console.log("\n\nPublic Key\n\n", publicKey_CA);
  const value = x509.verify(publicKey_CA);
  console.log("\nVerify Certificate: ", value);
  res.json({ cert: pem, verify: value });
});

// Verify

// const verify = crypto.createVerify("SHA256");
// verify.update(certificateData)
// verify.end()

// let result = verify.verify(CA_Key, Buffer.from(certificate, "base64"))
// console.log("Result", result);
