if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config()
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

const express = require('express')
const app = express()
const fs = require('fs')
const path = require("path")
const collection=require("./mongodb")
const stripe = require('stripe')(stripeSecretKey)
const YOUR_DOMAIN = 'http://localhost:3000';

const bodyParser = require('body-parser');

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.set('view engine','ejs')
app.use(express.json())
app.use(express.static('public'))
// app.use(express.urlencoded({extended:false}))

app.get("/index",(req,res)=>{
    res.render("index.ejs")
})

app.get("/login",(req,res)=>{
    res.render("login.ejs")
})
app.get("/signup",(req,res)=>{
    res.render("signup.ejs")
})


app.post("/signupuser",async (req,res)=>{
    const data={
        name:req.body.name,
        email:req.body.email,
        contact:req.body.contact,
        password:req.body.password
    }

    await collection.insertMany([data])

    res.render("index")

})

app.post("/login",async (req,res)=>{
    
    try{
        const check=await collection.findOne({name:req.body.name})
        if(check.password===req.body.password){
            res.render("index")
        }
        else{
            res.send("Incorrect password")
        }
    }
    catch{
        res.send("Incorrect details")
    }
})

app.get('/vk',function(req,res){
    fs.readFile('itemsvk.json',function(error,data){
        if(error){
            res.status(500).end()
        }else{
            res.render('vk.ejs',{
                stripePublicKey : stripePublicKey,
                items : JSON.parse(data)
            })
        }
    })
})

app.post('/create-checkout', (req, res) => {
  fs.readFile('itemsvk.json', (error, data) => {
    if (error) {
      console.error('Error reading items.json:', error);
      res.status(500).json({ error: 'Error reading items.json' });
      return;
    }

    try {
      const itemsJson = JSON.parse(data);
      const itemsArray = itemsJson.food.concat(itemsJson.beverages);
      const lineItems = [];

      req.body.items.forEach(item => {
        const itemJson = itemsArray.find(i => i.id == item.id);
        if (itemJson) {
          lineItems.push({
            price_data: {
              currency: 'inr',
              unit_amount: itemJson.price * 100, // Convert to smallest currency unit (e.g., rupees to paise)
              product_data: {
                name: itemJson.name,
              },
            },
            quantity: item.quantity,
          });
        } else {
          console.error(`Item with ID ${item.id} not found in items.json`);
        }
      });

      stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/success.html`,
        cancel_url: `${YOUR_DOMAIN}/cancel.html`,
      })
      .then(session => {
        res.json({ sessionId: session.id });
      })
      .catch(error => {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Error creating checkout session' });
      });
    } catch (parseError) {
      console.error('Error parsing items.json:', parseError);
      res.status(500).json({ error: 'Error parsing items.json' });
    }
  });
});


app.get('/foodweb', function(req, res) {
    fs.readFile('items.json', function(error, data) {
      if (error) {
        res.status(500).end()
      } else {
        res.render('Foodweb.ejs', {
          stripePublicKey: stripePublicKey,
          items: JSON.parse(data)
        })
      }
    })
  })


app.post('/create-checkout-session', (req, res) => {
  fs.readFile('items.json', (error, data) => {
    if (error) {
      console.error('Error reading items.json:', error);
      res.status(500).json({ error: 'Error reading items.json' });
      return;
    }

    try {
      const itemsJson = JSON.parse(data);
      const itemsArray = itemsJson.food.concat(itemsJson.beverages);
      const lineItems = [];

      req.body.items.forEach(item => {
        const itemJson = itemsArray.find(i => i.id == item.id);
        if (itemJson) {
          lineItems.push({
            price_data: {
              currency: 'inr',
              unit_amount: itemJson.price *100, // Convert to smallest currency unit (e.g., rupees to paise)
              product_data: {
                name: itemJson.name,
              },
            },
            quantity: item.quantity,
          });
        } else {
          console.error(`Item with ID ${item.id} not found in items.json`);
        }
      });

      stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/index`,
        cancel_url: `${YOUR_DOMAIN}/index`,
      })
      .then(session => {
        res.json({ sessionId: session.id });
      })
      .catch(error => {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Error creating checkout session' });
      });
    } catch (parseError) {
      console.error('Error parsing items.json:', parseError);
      res.status(500).json({ error: 'Error parsing items.json' });
    }
  });
});


app.get('/lawvk',function(req,res){
    fs.readFile('itemslaw.json',function(error,data){
        if(error){
            res.status(500).end()
        }else{
            res.render('lawvk.ejs',{
                stripePublicKey : stripePublicKey,
                items: JSON.parse(data)
            })
        }
    })
})

app.post('/checkout-session', (req, res) => {
  fs.readFile('itemslaw.json', (error, data) => {
    if (error) {
      console.error('Error reading items.json:', error);
      res.status(500).json({ error: 'Error reading items.json' });
      return;
    }

    try {
      const itemsJson = JSON.parse(data);
      const itemsArray = itemsJson.food.concat(itemsJson.beverages);
      const lineItems = [];

      req.body.items.forEach(item => {
        const itemJson = itemsArray.find(i => i.id == item.id);
        if (itemJson) {
          lineItems.push({
            price_data: {
              currency: 'inr',
              unit_amount: itemJson.price *100, // Convert to smallest currency unit (e.g., rupees to paise)
              product_data: {
                name: itemJson.name,
              },
            },
            quantity: item.quantity,
          });
        } else {
          console.error(`Item with ID ${item.id} not found in items.json`);
        }
      });

      stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${YOUR_DOMAIN}/index`,
        cancel_url: `${YOUR_DOMAIN}/index`,
      })
      .then(session => {
        res.json({ sessionId: session.id });
      })
      .catch(error => {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: 'Error creating checkout session' });
      });
    } catch (parseError) {
      console.error('Error parsing items.json:', parseError);
      res.status(500).json({ error: 'Error parsing items.json' });
    }
  });
});
app.listen(3000,()=>{
    console.log("port connectetd");
})
