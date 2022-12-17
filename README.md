# NLPHub
This website(Hosted on render: https://nlphub-web.onrender.com/) aims at providing basic NLP features to the registered user which includes various features like Text Summarization, Topic Modelling and Sentiment Analysis.


## Approach

The website is build using HTML and Bootstrap as front-end and NodeJS as back-end. 
1. The site starts with a landing page.
2. The user is given with two options:
			  a. Login(For Existing Users)
			  b. Sign Up(For new users)
3. Login is built using Passport.JS with a local strategy which can be easily converted to use automatic  logins like Google.
4. After logging in, the user lands on dashboard where he/she is provided with options to choose the feature they want
5. Then they can enter the text they want to perform the operation on.
6. The site communicates with a developed API to process the query and get the result



## Flow Chart
```mermaid
graph LR
A[Landing Page] --Login Selected --> B(Login Page)
A --SignUp Selected--> C(SignUp Page)
B --Details Verified--> D(Dashboard)
C --Details Verified--> B
D --Text Summarization selected-->E(Enter text)--API Call-->Z(Query Processing and Result Output)
Z-->D
D --Topic Modelling selected-->F(Enter text)--API Call-->Y(Query Processing and Result Output)
Y-->D
D --Sentiment Analysis selected-->H(Enter text)--API Call-->Z(Query Processing and Result Output)
Z-->D
D-->G(Logout)
```
## Snippets
Landing Page:
![image](https://user-images.githubusercontent.com/100020768/208232586-2a0eb81b-5be9-4e96-9a1c-7be899b39212.png)

Login Page:
![image](https://user-images.githubusercontent.com/100020768/208232658-d6756a3b-d77c-4586-87b2-d46eeb2e5c24.png)

SignUp Page:
![image](https://user-images.githubusercontent.com/100020768/208233310-ab078962-4f87-48ba-86dd-6b5361a66ac2.png)

Dashboard:
![image](https://user-images.githubusercontent.com/100020768/208233084-c7e3902b-c8f9-4c9d-8749-0b5fb4b92dd1.png)

Change Password Page:
![image](https://user-images.githubusercontent.com/100020768/208233099-47d0a484-ae7f-46cc-b629-efc17b9d48ca.png)

Action:
![image](https://user-images.githubusercontent.com/100020768/208233115-bca397bc-e8e4-4155-8471-72470a8854ea.png)

Result:
![image](https://user-images.githubusercontent.com/100020768/208233288-452e491c-bb2f-4972-aa8e-c496c353c713.png)


