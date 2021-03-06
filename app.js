const express = require('express');
const stripe = require('stripe')('sk_test_K3AZ7bVyBuGC4lXoWfVoYBZL');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

//handlebars middleware
app.engine('handlebars' ,exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//static folder to bring in img
app.use(express.static(`${__dirname}/public`));

//index route
app.get('/', (req, res) => {
    res.render('index');
});

//charge route
app.post('/charge', (req, res) => {
    const amount = 1000000;
    
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description: 'Web Development Services',
        currency:'usd',
        customer:customer.id
    }))
    .then(charge => res.render('success'));
});



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
