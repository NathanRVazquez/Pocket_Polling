/*
Web Development Spring 2024
Project 1 - API
Author: Nathan Vazquez
5/2024
Purpose: This file lets the user know their information is valid.
*/ 
// import all required libraries
import express from "express";
import axios from "axios";
import morgan from "morgan";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require('dotenv').config();

const app = express();
const port = 8000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
// creating object to hold data for the project
var responsesData ={};
responsesData.gov_spend_analysis = "N/A";
responsesData.valid_email ;
responsesData.valid_address;
responsesData.data_entered=false;

//route to lead to the index of the website
app.get("/", (req, res) => {
  res.render("index.ejs",{responsesData});
});

//testing for api
var user = "";
var user_address = "";
function createUserInfo(req,res,next){
  console.log(req.body);
  console.log("Request Method: ", req.method);
  console.log("Request URL: ", req.url);
  user = req.body["fName"] + " " + req.body["lName"];
  user_address = req.body["street_address"] + " " + req.body["state"] + " "
  + req.body["zipcode"]; 
  next();
}
app.use(createUserInfo); 

//route to get to the submission page
// app.get("/submission",(req,res)=>{
//   res.render("submission.ejs",{responsesData});
// })

// route to get the about page
app.get("/about",(req,res)=>{
  res.render("about.ejs",{});
})

// console.log every time the server is started, or changed
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

//initialize all variables to access the apis
const LOB_API_URL = "https://api.lob.com/v1/us_verifications?case=upper";
const MAILBOX_API_URL ="https://api.mailboxvalidator.com/v2/validation/single";
const MAILBOX_API_KEY= process.env.MAILBOX_API_KEY;
const LOB_API_KEY = process.env.LOB_API_KEY;
const CLOUD_MEANING_APIKEY = process.env.CLOUD_MEANING_API_KEY;
const CLOUD_MEANING_URL ="https://api.meaningcloud.com/sentiment-2.1";
let user_zip_code = "";

app.post("/submit", async (req, res) => {
  try {
    //Will hold the data from three different APIs
    responsesData.gov_spend_analysis = "N/A";
    responsesData.valid_email   = false;
    responsesData.valid_address = false ;
    responsesData.data_entered  = true;

    // axios call for the address verification
    const Address_Verification_Response = await axios.post(LOB_API_URL, {
      primary_line: req.body["street_address"],
      state: req.body["state"],
      city: req.body["city"],
      zip_code: user_zip_code.toString()
    },
    {
      auth: {
        username:LOB_API_KEY,
        password:""
      }
    });

    //save the results to a const variable
    const resultAddressVerification = Address_Verification_Response.data;
    // output the results for debugging
    // console.log("Here: ->>"+ (resultAddressVerification.valid_address));
    // save the result of whether the address is valid or not in the responsesData obj
    responsesData.valid_address = resultAddressVerification.valid_address;

    // these calls could possibly be better and easier to read as functions

    // api call to email verification api
    const Email_Verification_Response = await axios.get(MAILBOX_API_URL, 
    {
      params: {
        email:req.body["email"],
        key:MAILBOX_API_KEY,
        format:"json"
      }
    });
    
    // save the results of the response into a const var
    const resultEmailVerification = Email_Verification_Response.data;
    // output the results for debugging
    // console.log("Here: ->>"+ (resultEmailVerification.is_verified));
    // save the value of whether the email is valid into the responsesData obj
    responsesData.valid_email = resultEmailVerification.is_verified;

    // making a call to the sentiment analysis api
    const Sentiment_Analysis_Response = await axios.post(CLOUD_MEANING_URL, {
      lang: "en",
      ilang: "en",
    },
    {
      params: {
        key:CLOUD_MEANING_APIKEY,
        txt:req.body["government_spending"]
      }
    });
    
    // save the results into a const variable
    const resultSentimentAnalysis = Sentiment_Analysis_Response.data;
    // output the results for debugging
    // console.log("Here: ->>"+ (resultSentimentAnalysis.sentence_list[0].score_tag));
    // save the sentiment score the responsesData obj
    responsesData.gov_spend_analysis = resultSentimentAnalysis.sentence_list[0].score_tag;
    //output the responsesData obj to verify all values are correct
    // console.log(responsesData);
    //if email and address are valid, then render submission.ejs
    if(responsesData.valid_address && responsesData.valid_email && responsesData.gov_spend_analysis){
      res.render("submission.ejs",{responsesData});
    }
    else {
      res.render("index.ejs",{responsesData});
    } 

  } catch (error) {
    console.log("---->"+"error");
    // res.status(404).send(error.message);
  }
});

app.post("/testsentiment", async (req, res) => {
  try {
    const response = await axios.post(CLOUD_MEANING_URL, {
      lang: req.body.lang,
      ilang: req.body.ilang,
      of: req.body.of,
      txt: req.body.txt,
      txtf:req.body.txtf
    },
    {
      params: {
        key:CLOUD_MEANING_APIKEY,
        txt:"i am soooooo veryyyy happy todayyyy "
      }
    });

    const result = response.data;
    console.log(result);
    //console.log("Here: ->>"+ typeof result);
    console.log("Here: ->>"+ (result.sentence_list[0].score_tag));
    // res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    
    console.log("---->"+"error");
    // res.status(404).send(error.message);
  }
});



let emailTest ="nathanrvazquez@gmail.com"; 
app.get("/testemail", async (req, res) => {
  try {
    const response = await axios.get(MAILBOX_API_URL, 

    {
      params: {
        email:emailTest,
        key:MAILBOX_API_KEY,
        format:"json"
      }
    });

    const result = response.data;
    console.log(result);
    //console.log("Here: ->>"+ typeof result);
    console.log("Here: ->>"+ (result.is_verified));
    // res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    console.log("---->"+error);
    // console.log(error);
    // res.status(404).send(error.message);
  }
});