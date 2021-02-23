const express = require('express');
const app = express();



app.use(express.json());
// const currentDate = new Date();
// DATE FORMAT - (YEAR, MONTH(+1), DAY, HOUR, SECONDS, MILLISECONDS);
// const currentDate = new Date(Date.UTC(2020, 10, 2, 14, 0, 0));
// let today = new Date();
// let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
// let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
// const timestamp = date+' '+time;
// const timestamp = currentDate;
// console.log(new Date(2020, 10, 2, 14, 0, 0).toUTCString());

const transactions = [
    {payer: 'DANNON', points: 1000, timestamp: new Date(2020, 10, 2, 14, 0, 0)},
    {payer: 'DANNON', points: -200, timestamp: new Date(2020, 9, 31, 15, 0, 0)},
    {payer: 'DANNON', points: 300, timestamp: new Date(2020, 9, 31, 10, 0, 0)},
    {payer: 'MILLER CORS', points: 10000, timestamp: new Date(2020, 10, 1, 14, 0, 0)},
    {payer: 'UNILEVER', points: 200, timestamp: new Date(2020, 9, 31, 11, 0, 0)}
    // console.log(transactions[0].payer);
];

function sortedTransactions() { transactions.sort(function(a,b){
    return new Date(a.timestamp) - new Date(b.timestamp);
})}


app.get('/', (req, res) => {
    res.send('Hello, World');
});

app.get('/transactions', (req, res) => {
    sortedTransactions();
    res.send(transactions);
});
// POINTS BALANCES
app.get('/points_balance', (req, res) => {
    const balance = transactions.reduce((a, {payer, points}) => (a[payer] = (a[payer] || 0) + +points, a), {});
    res.send(balance);
})

app.post('/spending', (req, res) => {
    sortedTransactions();
    if(!req.body.points || req.body.points < 0) {
        res.status(404).send("You need to select a point value that is also greater than 0 in order to make a proper spend call.");
    }

    let spend = req.body.points;
    let spendPoints = spend

    if(req.body.points){
        for(i = 0; i < transactions.length; i++){
            currentPoints = spendPoints - transactions[i].points;
                if(spendPoints > 0){
                    spendPoints = currentPoints;
                    transactions[i].points = 0;
                    console.log("points before < 0 check", spendPoints)
                } 
                if(spendPoints < 0){
                    transactions[i].points = transactions[i].points - spendPoints;
                    break;
                }
                
                console.log(spendPoints);
                
            }
        // need to take the spend points total, and subtract them from the current transactions by oldest ==> newest
        // might be easier to sort the transactions by date first, then just iterate through!
        // subtract/add(if -point transaction) until point value hits zero, subtract/add that amount to the spend
        // return the total amount taken out from each NAME of payer
    }
    res.status(200).send("Points have been taken out of their respective accounts.");
});

app.get('/transactions/:payer', (req, res) => {
   const payer = transactions.find(p => p.payer === req.params.payer.toUpperCase());
    if(!payer) res.status(404).send("Transactions with the given account name was not found.");
    res.send(payer)
});


// ADD SPECICIFIC TRANSACTION FOR A PAYER AND DATE 
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

// UPDATE(PUT)

// app.put('/transactions/:payer', (req, res) => {
//     const payer = transactions.find(p => p.payer === req.params.payer.toUpperCase());
//     if(!payer) res.status(404).send("Transactions with the given account name was not found.");
//     res.send(payer)

//     // // Vallidate
//     // // if, invalid, return 400 - Bad request
//     if(!req.body.name || req.body.name.length < 3){
//         res.status(404).send('Name is required and minimum of 3 characters');
//         return;
//     }

//     transaction.name = req.body.name;
//     res.send(course);

// });

// DELETE

// app.delete('/transactions/:payer', (req, res) =>{
//     const payer = transactions.find(p => p.payer === req.params.payer.toUpperCase());
//     if(!payer) res.status(404).send("Transactions with the given account name was not found.");

//     const index = transactions.indexOf(payer);
//     transactions.splice(index, 1);

//     res.send(payer);
// })


//PORT 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listing on port: ${port}`))