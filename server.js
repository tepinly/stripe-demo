if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const stripeSecret = process.env.STRIPE_SECRET
const stripePublic = process.env.STRIPE_PUBLIC
const express = require('express')
const app = express()
const fs = require('fs')
const stripe = require('stripe')(stripeSecret)

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

app.get('/store', (req, res) => {
    fs.readFile('items.json', (error, data) => {
        if(error) {
            return res.status(500).end()
        }
        res.render('store.ejs', {
            items: JSON.parse(data),
            stripePublic: stripePublic,
        })
    })
})

app.post('purchase', (req, res) => {
    fs.readFile('items.json', (error, data) => {
        if(error) {
            return res.status(500).end()
        }
        const itemsJson = JSON.parse(data)
        const itemsArray = itemsJson.music.concat(itemJson.merch)
        let total = 0
        req.body.items.forEach((item) => {
            const itemJson = itemsArray.find((i) => {
                return i.id == item.id
            })
            total += itemJson.price * item.quanatity
        })

        stripe.charges.create({
            amount: total,
            source: req.body.stripeTokenId,
            currency: 'usd'
        }).then(() => {
            console.log('Charge successful')
            res.json({message: 'Successfully purchased items'})
        }).catch(() => {
            console.log('Charge failed.')
            res.status(500).end()
        })
    })
})

app.listen(3000)