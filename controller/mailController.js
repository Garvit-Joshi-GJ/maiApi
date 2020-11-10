import nodemailer from 'nodemailer';
import config from '../config';
import Query from '../models/queryModel';
import hbs from 'nodemailer-express-handlebars';

export const mail = (req, res) => {

  
    const { email , useremail, name, phone, country,contactType,messageData,StartDate,EndDate,room,guest,tourType } = req.query;
  
    const body=`<html>

    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <title>HolasaTravels</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    
    <body style="font-family: 'Roboto', sans-serif; font-weight: 400;">
      <table style="max-width: 600px;" border="0" align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p>Hello,<br />
              <br />
                Below are the Customer Details.<br />
              <br />
             Name:${name}<br />
             Email:${useremail}<br />
             Phone:${phone}<br />
             Country:${country}<br />
             Contact Reason:${contactType}<br />
             ${StartDate&&'Tour StartDate'+StartDate}<br />
             ${EndDate&&'Tour StartDate'+EndDate}<br />
             ${room&&'Room:'+room}<br />
             ${guest&&'Guest:'+guest}<br />
             ${tourType&&'Tour Type'+tourType}<br />
             Query Message:${messageData}<br />
              <br />
              </p>
          </td>
        </tr>
        
  
      </table>
    </body>
    
    </html>`
    
    
    
    console.log("email", email, req.query)
    const newQuery = new Query({
        'email': email,
        "phone": phone,
        "name": name,
       
    })
    newQuery.save((err) => {
        if(err){
            res.status(500).json({
                message: 'Something went wrong.Try again.',
                error: err.message
             });
        }else{

            const transporter = nodemailer.createTransport(config.smtpConfig)
            const handlebarOptions = {
              viewEngine: {
                extName: '.hbs',
                partialsDir: './views/',
                layoutsDir: './views/',
                defaultLayout: 'mailTemplate.hbs',
              },
              viewPath: './views/',
              extName: '.hbs',
            };
          //  transporter.use('compile', hbs(handlebarOptions))
            var mailOptions = {
                from: `${config.smtpConfig.auth.user}`,
                to: `${email}`, // reciver email
                cc: [],
                bcc: [ ],
                subject: 'HolasaTravles Customer Query',
                html:body
             };
             // send mail with defined transport object
             transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("mail error", error)
                   return res.status(500).json({
                      status: false,
                      message: "Unable to send the email",
                      error: error
                   });
                }
                res.status(200).json({
                   status: true,
                   message: "Query saved successfully"
                });
             });
        }
    })
}