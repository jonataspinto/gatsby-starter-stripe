const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

module.exports.handler = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body)
  const productData = requestBody.product
  const skusData = requestBody.skus

  const product = await stripe.products.create({
    ...productData,
    type: "good",
  })
  const skus = skusData.map(async skuData => {
    return stripe.skus.create({
      ...skuData,
      product: product.id,
      currency: "usd",
    })
  })

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ product, skus: Promise.all(skus) }),
  }
  callback(null, response)
}