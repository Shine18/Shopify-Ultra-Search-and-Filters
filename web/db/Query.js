import knex from "./connect.js"

export default class Query {
    table = {
        PRODUCTS: "products"
    }
    constructor(store) {
        this.store = store
    }

    // error catch
    catchError(err) {
        console.log(err)
    }


    async insertGraphQlProducts(data) {
        console.log("Saving products to db")
        return new Promise(async (res, rej) => {
            for (let node of data) {
                await this.insertProduct(node.node)
            }
            res()
        })
    }

    async insertProduct({ id, handle, title, tags, onlineStoreUrl, featuredImage }) {
        await knex(this.table.PRODUCTS).where({ store, shopify_id: id }).first().then(async data => {
            if (data == undefined) {
                console.log("inserting products")
                await knex("products").insert({
                    id: null,
                    shopify_id: id,
                    handle,
                    title,
                    store,
                    onlineStoreUrl,
                    tags: tags.join(","),
                    image: null
                })
                    .catch(this.catchError)
            } else {
                console.log("updating product")
                await knex("products").where({ id: data.id }).update({
                    handle,
                    title,
                    onlineStoreUrl,
                    tags: tags.join(","),
                    image: null
                })
            }
        })
    }

}
