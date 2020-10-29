const crypto = require('crypto');

const algo = 'aes-256-ctr';
const secret = 'asmfkd34lfkma3k4ifpvmdlalfpeom32';
const iv = crypto.randomBytes(16);

const encrypt = (data) => {
    const cipher = crypto.createCipheriv(algo, secret, iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  
    return {
      iv: iv.toString('hex'),
      content: encrypted.toString('hex')
    };
};
  
const decrypt = (hash) => {
  const decipher = crypto.createDecipheriv(algo, secret, Buffer.from(hash.iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
  
  return decrypted.toString(); 
};

module.exports = { 
  encrypt, 
  decrypt
}