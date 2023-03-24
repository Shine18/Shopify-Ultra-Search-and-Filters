import knex from "./connect.js"
export default class Settings {
    constructor(shop) {
        this.id = undefined
        this.creating = false
        this.shop = shop
        this.fetchData()
    }
    async data() {
        if (!this.id) {
            await this.fetchData()
        }
        return this.options
    }
    async fetchData() {
        const data = await knex("globals").where({ store: this.shop }).first()
        if (data == undefined) {
            await this.createData()
            return await this.fetchData()
        }
        this.options = data
        this.id = data.id
        return data
    }
    async createData() {
        if( this.creating) {
            return
        }
        this.creating = true
        await knex("globals").insert({ store: this.shop })
        this.creating = false
    }



    isRefetchingProducts() {
        console.log(this.id, this.options)
        return this.options.refetching_products
    }

    async enableRefetchingProducts() {
        await knex("globals").where({ store: this.shop }).update({refetching_products: 0})
        this.options.refetching_products = 1
    }
    async disableRefetchingProducts() {
        await knex("globals").where({ store: this.shop }).update({refetching_products: 1})
        this.options.refetching_products = 0
    }

}