const express = require("express");
const stripe = require("stripe")("sk_test_GFzGq7wTVQJWAeDu1xe3CO9B001DBtiphx");

const auth = require("../middleware/auth");
const HttpError = require("../error/http-error");
const Item = require("../models/item-model.js");

const router = new express.Router();

const findItem = async (id, quantity) => {
  const item = await Item.findById(id);
  return { item, quantity };
};

const makeCheck = async (items) => {
  try {
    const itemsArray = await Promise.all(
      items.map((item) => findItem(item.id, item.quantity))
    );

    const lineItems = itemsArray.map(({ item, quantity }) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.imageUrl],
          },
          unit_amount: item.price * 100,
        },
        quantity,
      };
    });

    return lineItems;
  } catch (e) {
    return new Error();
  }
};

router.post("/create-checkout-session", auth, async (req, res, next) => {
  const { items } = req.body;

  try {
    const line_items = await makeCheck(items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    });
    res.json({ id: session.id });
  } catch (err) {
    next(new HttpError("Unable to make payment.", 400));
  }
});

module.exports = router;
