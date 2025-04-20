const nodemailer = require("nodemailer");
const csv = require("csvtojson");
const { getMsgParams } = require("./msg");
const {sendBulkEmailBcc} = require("./bcc");

require("dotenv").config();





// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 5000;
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



async function sendBulkEmail(csvFilePath) {
 

    try {
      await sendBulkEmailBcc(csvFilePath);
    } catch (error) {
      console.error(`Failed to send to :`, error.message);
      // Continue with next email instead of throwing
    }
  // }
}

// Start sending after verifying SMTP connection
smtpTransport.verify()
  .then(() => {
    console.log("SMTP Server is ready");
    return sendBulkEmail(process.argv[2]);
  })
  .catch(error => {
    console.error("Failed to initialize:", error);
    process.exit(1);
  });