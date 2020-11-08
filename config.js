  /*
  * Basic configuration object
  */

 import dotenv from 'dotenv';
 dotenv.config();
 var url = '';

 module.exports = {
    auth: {
        secret: 'my_secret_key',
        session_secret: "Spineor_api_secret"
    },
   smtpConfig: {
      host: "smtp.gmail.com", // hostname
      secureConnection: false, // TLS requires secureConnection to be false
      port: 587, // port for secure SMTP
      auth: {
          user: "garvit.cars17@gmail.com",
          pass: "9639377216"
      },
      tls: {
          ciphers:'SSLv3'
      }
   },
   auth: {
        secret: 'my_secret_key',
        session_secret: "Riosrso_api_secret"
     },
 };
