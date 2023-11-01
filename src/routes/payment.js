const router = require('express').Router();
const Stripe = require('stripe');
const stripe = new Stripe('sk_test_51NH5WFEnS31hCB3TwNNvlfrVbEMc3Zxe4GiqwN2lSN4MNa1dWpy3sT9B8CuwPqoLi1c2Su1A0zIVAPvjuGp1ZPYn00UUeRRnRP');

  
router.post('/create-payment-intent', async (req, res) => {
    
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 500,
    currency: 'gbp',
    payment_method: 'pm_card_visa',
  });
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  });
module.exports=router