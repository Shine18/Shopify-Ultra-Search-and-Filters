import knex from "../../db/connect.js"
export default async function Products(req, res) {
    const currentShop = res.locals.shopify.session.shop

    knex("products").where({ store: currentShop }).then(data => {
        res.status(200).send({ data })
    })
}