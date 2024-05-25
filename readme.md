# README
## What is this project about?
- The purpose of this project is to make an application that makes polling more effective. Currently there are many barriers to answering polls. Some include language barriers, inability to poll enough people, people unable to get to pollers

## How does the application work?
- This application uses 3 APIs
    1. Email verification via Mailbox Validator
    2. Address verification via Lob
    3. Sentiment Analysis via meaningCloud
- Users are immediately directed to the index page that holds a form that users will fill out. Once the form is completed their submission is only marked completed once they have provided a valid email, address and answer to a short answer question 
## Features
- Data validation and an easy to use & understand interface
## Use cases
- This application would be used when pollers or community members want to better understand how a district feels about their representative and government spending
- To determine if bots are answering the forms the email and address verification will weed out fake information. This will also provide a way to determine each user uniquely as their email, address and name can be used to verify their voter registration
## Programming stack used
- Node.js
- Express
- Axios
## Real World Application
- There are many things to keep in mind when building an application like this. The two biggest concerns are security and usability
- Forms like these are gathering sensitive information and a users privacy should be considered very important. Therefore forms like these need to prioritize encrypting the users data so it is not easily found or tampered with
- When I mention usability I am referring to the usability of the citizens of the U.S. and the usability for local governments to use an application like this. 
    - For citizens usability should be focused on making the form as easy as possible to use
    - For local governments the usability should be focused on making the form as cost effective as possible so it can be used to replace current polling methods
## Future Improvements
- There are many improvements I would like to make to this project. The biggest improvement I would like to make is adding a page that can show people how other citizens in their district feel about a certain political issue and how they can be more engaged in local politics