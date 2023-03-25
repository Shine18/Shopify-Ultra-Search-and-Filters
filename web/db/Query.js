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
        await this.getProductByShopifyId(id).then(async data => {
            if (data == undefined) {
                console.log("inserting product")
                await knex("products").insert({
                    id: null,
                    shopify_id: id,
                    handle,
                    title,
                    store: this.store,
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


    // query methods
    getAllProducts() {
        // TODO: Implement pagination
        const {table, store} = this
        return knex(table.PRODUCTS).where({store: this.store})
    }
    getProductByShopifyId(shopify_id) {
        return knex(this.table.PRODUCTS).where({ store: this.store, shopify_id}).first()
    }
}
