// Server file 

// import http module
import http from "http";

//import express app 
import app from "./app.js";

//setting the port for server
var port = 0;

if(process.env.NODE_ENV === 'production') {
   port = process.env.PROD_PORT || 4001;
} else {
  port = process.env.DEV_PORT || 6000;
}


//creating server using express app
const server = http.createServer(app);


// server listening to the requests.
server.listen(port, function(err) {
   if (err) {
      console.log("Error in starting server", err);
   }
    console.log(`Your App is Running on Port : ${port}`);
});

module.exports = server;