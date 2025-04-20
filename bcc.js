const nodemailer = require("nodemailer");
const csv = require("csvtojson");
const { getMsgParams } = require("./msg");

require("dotenv").config();
const BATCH_SIZE = 100;

const smtpTransport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  authMethod: "PLAIN",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

 async function sendBulkEmailBcc(csvFilePath) {
    const recipients = await csv().fromFile(csvFilePath);
    const batches = [];
    
    // Split into batches
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      batches.push(recipients.slice(i, i + BATCH_SIZE));
    }
  
    for (const batch of batches) {
      const bccList = batch.map(r => r.email).join(',');
      const [subject, htmlBody] = getMsgParams();
  
      try {
        await smtpTransport.sendMail({
          from: process.env.EMAIL_FROM,
          bcc: bccList,
          subject,
          html: htmlBody
        });
        
        console.log(`Sent batch of ${batch.length} emails`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        
      } catch (error) {
        console.error('Failed to send batch:', error.message);
      }
    }
  }

  module.exports = { sendBulkEmailBcc };