import startFetchProductsJob from "../../jobs/fetchProductsJob.js";
import Settings from "../../db/settings.js";

export default async function ProductsFetch(req, res) {
    const currentShop = res.locals.shopify.session.shop
    const settings = new Settings(currentShop)
    await settings.fetchData()

    if (settings.isRefetchingProducts()) {
        res.status(200).send({ message: "Already in process" })
        return
    }

    startFetchProductsJob(res, settings)
    await settings.disableRefetchingProducts()


    res.status(200).send({ message: "Refreshing products started" })
}
