import chalk from "chalk"
import knex from "./connect.js"

export default async function saveGraphQlProductsToDB(data, store) {
    console.log(chalk.green("OP:"), chalk.blue("Saving products to db"))
    return new Promise(async (res, rej) => {
        for (let node of data) {
            await saveProductToDb(node.node, store)
        }
        res()
    })
}

export async function saveProductToDb({ id, handle, title, tags, onlineStoreUrl, featuredImage }, store) {
    await knex("products").where({ store, shopify_id: id }).first().then(async data => {
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
                .catch(err => {
                    console.log(err)
                })
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