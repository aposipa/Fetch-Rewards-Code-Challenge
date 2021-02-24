# Implementing Fetch Reward's Back End Challenge

In this coding exercise, I have written a web service that accepts HTTP requests that returns responses based on the outlined conditions below.

### Background
Our users have points in their accounts. Users only see a single balance in their accounts. But for reporting purposes we actually track their
points per payer/partner. In our system, each transaction record contains: payer (string), points (integer), timestamp (date). 


For earning points it is easy to assign a payer, we know which actions earned the points. And thus which partner should be paying for the points. 


When a user spends points, they don't know or care which payer the points come from. But, our accounting team does care how the points are
spent. There are two rules for determining what points to "spend" first:
* We want the oldest points to be spent first (oldest based on transaction timestamp, not the order they’re received)
* We want no payer's points to go negative.

### The Expected Result Of This Exercise
Routes will need to be provided that:
* Add transactions for a specific payer and date.
* Spend points using the rules above and return a list of { "payer": <string>, "points": <integer> } for each call.
* Return all payer point balances.

## How To Setup Locally
First off, this repo utilizes JavaScript and thus uses Node.js.  If you don't currently have it downloaded on your computer, the link is here to download:
https://nodejs.org/en/


Once you have node installed you will need to make sure you have the packages installed in your editor.
```
npm install
```
```
npm init -yes
```
```
npm install express
```


