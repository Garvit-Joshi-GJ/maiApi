import passport from 'passport';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import validations from '../helpers/userHelper';
import jwt from 'jsonwebtoken';
import config from '../config';
import nodemailer from 'nodemailer';
import randtoken from 'rand-token';
import timediff from 'timediff';

/*
    * Handle user registration process.
    * 1. Check if user is already registered by checking email
    * 2. Encrypt password
    * 3. Save user information in MongoDB
    */
export const register = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;
    const role = req.body.role;
    let hashedPassword;

    if (validations.emailValidation(email) == !true) {
       return res.status(400)
          .json({
             statusCode: 400,
             message: 'Email cannot be empty & should be valid format'
          });
    } else if (password && password.length >= 4) {
       User.findOne({
          email
       }, (err, user) => {
          if (err) {
             return res.status(400).json({
                statusCode: 400,
                message: 'Error on finding user'
             });
          }
          if (user && user.email === email) {
             return res.status(200).json({
                statusCode: 203,
                message: 'This email is already registered'
             });
          }
          bcrypt.genSalt(10, (err, salt) => {
             bcrypt.hash(password, salt, (err1, hash) => {
                if (err1) {
                   return res.status(400).json({
                      statusCode: 400,
                      message: err1.message,
                      data: err1
                   });
                }
                hashedPassword = hash;

                let token = randtoken.generate(16);

                let newUser = new User({
                   'email': email,
                   'password': hashedPassword,
                   'email_verify_token': token,
                   'role': !!role ? role.toLowerCase() : 'user'
                });
                newUser.save((err, theUser) => {
                   if (err) {
                      res.status(500).json({
                         statusCode: 500,
                        message: err.message,
                        data: err,
                      });
                   } else {

                      var transporter = nodemailer.createTransport(config.smtpConfig);

                      var mailOptions = {
                         from: `${config.smtpConfig.auth.user}`,
                         to: `${email}`,
                         subject: 'Account request email',
                         html: `<h1 style="text-align:left; color:#00b9ee;">Welcome To Spineor</h1>
                <div></div>
                <br><p style="text-align:left;color:#000; font-size:20px;">
                <b>Hello, there!</b></p>
                <p style="text-align:left;color:#000;font-size: 14px;"> 
                <b>You have beem invited as ${role} to Spineor Web Services Enterprise Services.</b> </p>
               <br><div style="display:inline-block;background:#00b9ee; padding:10px;-webkit-border-radius: 10px; -moz-border-radius: 4px; border-radius: 4px;">
               <a style="text-decoration:none;color:#fff;font-size:15px;"href="${'https://spineor/'}/verify/${token}">Login to your account</a></div>
               <br><br>
               <p style="text-align:left;color:#000; font-size: 14px;">
                <h4>Thanks,</h4>
                <h4>Spineor Admin</h4>
               </p>`
                      };
                      // send mail with defined transport object
                      transporter.sendMail(mailOptions, (error, info) => {
                         if (error) {
                            res.status(500).json({
                               statusCode: 500,
                               data: error,
                               message: error.message
                            });
                         } else {
                            res.status(201).json({
                               statusCode: true,
                               message: "Account created successfully and verification email is sent to your Account."
                            });
                         }
                      });
                   }
                });
             });
          });
       });
    } else {
       return res.status(400).json({
          statusCode: false,
          message: "Password cannot be empty or send valid format"
       });
    }
}

/**
    * Handle user login process via Passport-jwt 
    * 1. Check user email in the database.
    * 2. Encrypt password and compare with saved password.
    * 3. Generate a token using JWT for authentication
    **/
export const login = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;


    if (validations.emailValidation(email) == !true) {
       return res.status(400)
          .json({
              statusCode: 400,
             message: 'Email cannot be empty and should be valid format'
          });
    } else if (password) {

       User.findOne({
          email: email
       }, function(err, user) {

          if (err) {
             res.status(500).json({
                statusCode: 500,
                message: err.message,
                data: err
             });
          }

          if (!user) {
             res.status(401).json({
                statusCode: 401,
                message: 'Authentication failed'
             });
          } else {
             bcrypt.compare(password, user.password, function(err, isMatch) {
                if (!isMatch) {
                   return res.status(400).json({
                      statusCode: 500,
                      messagege: "Authentication failed",
                      data: err
                   });
                } else {
                   var isVerified = user.email_verified;
                   var createdDate = user.createdAt;
                   var payload = {
                      id: user._id
                   };
                   var token;
                   var currdate = new Date().toISOString();
                   var diff = timediff(createdDate, currdate, 'H');


                   if (isMatch && !err && isVerified === true) {

                      token = jwt.sign(payload, config.auth.secret, {
                         expiresIn: '1d'
                      });
                      res.status(200).json({
                        statusCode: 200,
                        message: 'Authentication successfull',
                        data: {
                        verified: isVerified,
                        token
                        }
                      });
                   } else if (diff.hours < 24) {
                      token = jwt.sign(payload, config.auth.secret, {
                         expiresIn: '1d'
                      });
                      res.status(200).json({
                        statusCode: 200,
                        message: 'Authentication successfull',
                        data: {
                        verified: isVerified,
                        token
                        }
                      });
                   } else {
                      res.status(203).json({
                         statusCode: 203,
                         message: 'Your Email is not verified yet..!!!'
                      });
                   }
                }
             });
          }
       });
    } else {
       res.status(200).json({
          statusCode: 400,
          message: "Password cannot be empty",
          data: err
       });
    }
 }