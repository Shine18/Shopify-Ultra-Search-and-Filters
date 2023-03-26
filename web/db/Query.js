import knex from "./connect.js"

export default class Query {
    table = {
        PRODUCTS: "products",
        PRODUCT_FIELDS: "product_fields"
    }
    TAG_PREFIX = "us_"
    
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

    async insertProductField({title,type,tag, appearAs}) {
        const byTitleExists = await this.getProductFieldByTitle(title)
        const byTagExists = await this.getProductFieldByTag(tag)

        if( !byTagExists && !byTitleExists) {
            await knex(this.table.PRODUCT_FIELDS).insert({
                title,
                type,
                tag: `${TAG_PREFIX}${tag}`,
                store: this.store,
                appear_as: appearAs
            })
            return true
        }
        return false
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

    getAllProductFields() {
        return knex(this.table.PRODUCT_FIELDS).where({store: this.store})
    }
    getProductFieldByTag(tag) {
        return knex(this.table.PRODUCT_FIELDS).where({tag, store: this.store}).first()
    }
    getProductFieldByTitle(title) {
        return knex(this.table.PRODUCT_FIELDS).where({title, store: this.store}).first()
    }
}
