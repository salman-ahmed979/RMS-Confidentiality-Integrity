const forge = require("node-forge");
const pki = forge.pki;

const generateCertificate = (publicKey, privateKey, attribute) => {
  const _publicKey = pki.publicKeyFromPem(publicKey);
  const _privateKey = pki.privateKeyFromPem(privateKey);

  // Certificate Processing
  let certificate = pki.createCertificate();
  certificate.publicKey = _publicKey;
  certificate.serialNumber = "01";
  certificate.validity.notBefore = new Date();
  certificate.validity.notAfter = new Date();
  certificate.validity.notAfter.setFullYear(
    certificate.validity.notBefore.getFullYear() + 1
  );

  // Set Attributes
  certificate.setSubject(attribute);
  certificate.setIssuer(attribute);

  // Sign
  certificate.sign(_privateKey);

  const certificatePem = pki.certificateToPem(certificate);
  return certificatePem;
};

module.exports = { generateCertificate };
