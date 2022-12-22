const forge = require("node-forge");
const pki = forge.pki;

const generateCSR = (publicKey, privateKey, attribute) => {
  const _publicKey = pki.publicKeyFromPem(publicKey);
  const _privateKey = pki.privateKeyFromPem(privateKey);

  // Certificate Request
  let csr = pki.createCertificationRequest();
  csr.publicKey = _publicKey;
  csr.setSubject(attribute);

  // Sign
  csr.sign(_privateKey);

  // convert certification request to PEM-format
  const csrPem = pki.certificationRequestToPem(csr);

  return csrPem;
};

module.exports = { generateCSR };
