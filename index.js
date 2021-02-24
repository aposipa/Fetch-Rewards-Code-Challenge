const express = require('express');
const app = express();

app.use(express.json());


const transactions = [
    {payer: 'DANNON', points: 1000, timestamp: new Date(2020, 10, 2, 14, 0, 0)},
    {payer: 'DANNON', points: -200, timestamp: new Date(2020, 9, 31, 15, 0, 0)},
    {payer: 'DANNON', points: 300, timestamp: new Date(2020, 9, 31, 10, 0, 0)},
    {payer: 'MILLER CORS', points: 10000, timestamp: new Date(2020, 10, 1, 14, 0, 0)},
    {payer: 'UNILEVER', points: 200, timestamp: new Date(2020, 9, 31, 11, 0, 0)}
];
// Sorts all the current transactions from oldest => newest, based on timestamp
function sortedTransactions() { 
    transactions.sort(function(a,b){
    return new Date(a.timestamp) - new Date(b.timestamp);
})}

// +++++++++ GETs ++++++++++
// Base Path
app.get('/', (req, res) => {
    res.send('Hello there! \n All endpoints are following the base path of http://localhost:3000/ (3000 is default path number, but your system could give you a different one but it will say in log. \n The following paths are usable working endpoints: \n \n GETs: \n /transactions - Shows all current transactions. \n /points_balance - Shows the total balance of each users points balance \n /transactions/(payer name) - Shows every individual transaction made by account name entered in path.\n \n POSTs: \n /transactions  - Will add a new transaction with name, points, and timestamp the user enters \n /spending  - Will spend points taken out of current account transactions based on two primary rules of... \n 1. The oldest transaction points will be spent first. \n 2. No payers points go negative.');
});

// GET all current transactions
app.get('/transactions', (req, res) => {
    sortedTransactions();
    res.send(transactions);
});

// GET the total sum of all current transaction's points
app.get('/points_balance', (req, res) => {
    const balance = transactions.reduce((a, {payer, points}) => (a[payer] = (a[payer] || 0) + +points, a), {});
    res.send(balance);
});

// GET all current transactions by a given payer's name in the path 
app.get('/transactions/:payer', (req, res) => {
    const payer = transactions.find(p => p.payer === req.params.payer.toUpperCase());
    if(!payer) res.status(404).send("Transactions with the given account name was not found.");
    
    const payerList = [];
// Go through transaction array and for each entry that matches the name entered in the path, it adds it to the payerList array and displays the total list of that payer's entries
    for(i = 0; i < transactions.length; i++){
        if(req.params.payer.toUpperCase() === transactions[i].payer){
            payerList.push(transactions[i])
        }
    }
    res.send(payerList)
});

// +++++++++++ POSTs ++++++++++++++
// Will deduct points from accounts from oldest to newest transactions, and accounts can't go negative
app.post('/spending', (req, res) => {
    // Sort first
    sortedTransactions();
    if(!req.body.points || req.body.points < 0) {
        res.status(404).send("You need to select a point value that is also greater than 0 in order to make a proper spend call.");
    }

    let spend = req.body.points;
    let spendPoints = spend

    if(req.body.points){
        // For each entry in transactions, subtract the points from the spend points total
            // Already takes from oldest first because its sorted beforehand
        for(i = 0; i < transactions.length; i++){
            currentPoints = spendPoints - transactions[i].points;
                // After points are taken out of that transaction you check if there are points left in that transaction by checking spend points
                if(spendPoints > 0){
                    // if there are still points to be spent it means the full amount was taken out of the transaction
                    // set that transaction points to 0
                    spendPoints = currentPoints;
                    transactions[i].points = 0;
                } 
                if(spendPoints < 0){
                    // If the spend points are now negative it means it ran out of points to spend on that transaction
                    // to get the correct value remaining for that transaction, set its points to the transaction points - spend, since spend points were negative, the transaction has enough in its points to cover the difference.
                    transactions[i].points = transactions[i].points - spendPoints;
                    // since spend points went negative, there are no more points to spend, so break
                    break;
                }
            }
    }
    res.status(200).send("Points have been taken out of their respective accounts.");
});

// This will add a new transaction to the current list by name, points, and timestamp given by the user
app.post('/transactions', (req, res) => {
    if(!req.body.payer || req.body.payer.length < 3){
        res.status(404).send('A name of a Payer is required and must be a minimum of 3 characters.');
        return;
    }
    if(!req.body.points){
        res.status(404).send('There must be a "points" value assigned to the transaction.');
        return;
    }
    const transaction = {
        payer: req.body.payer.toUpperCase(),
        points: req.body.points,
        timestamp: new Date(req.body.timestamp)
        // format in Postman ("timestamp": "Year, Month, Day, Hours:Seconds:Milliseconds")
    };

    transactions.push(transaction);
    sortedTransactions();
    res.send(transaction);
});

//PORT 
// Will get the port number from local environment, but will default to 3000 otherwise
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listing on port: ${port}`))