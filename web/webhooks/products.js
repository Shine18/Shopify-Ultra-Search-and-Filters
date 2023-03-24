import { DeliveryMethod } from '@shopify/shopify-api'

async function updateProduct(topic, shop, body, webhookId) {
    console.log("Webhook triggered")
    console.log(topic, shop, body, webhookId)

    const product = JSON.parse(body)
    const {  handle } = product

    const graphQlProduct = await fetchGraphQlProduct(handle)
    console.log(graphQlProduct)
    // TODO: Currently failing, need to create shopify session here in order to do graphql query
    // TODO:save products in db
}

async function fetchGraphQlProduct(handle) {
    const client = new shopify.api.clients.Graphql({ session });

    try {
        const data = await client.query({
            data: {
                query: `{
                    productByHandle(handle:"${handle}" ) {
                        id
                        handle
                        title
                        tags
                        onlineStoreUrl
                        featuredImage {
                            url
                        }
                    }
                }`
            },
        });
        console.log(data.body.extensions.cost)
        return data.body.data
    } catch (error) {
        if (error instanceof GraphqlQueryError) {
            throw new Error(
                `${error.message}\n${JSON.stringify(error.response, null, 2)}`
            );
        } else {
            throw error;
        }
    }
}

export default {
    PRODUCTS_CREATE: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks",
        callback: () => { }
    },
    PRODUCTS_DELETE: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks",
        callback: () => { }
    },
    PRODUCTS_UPDATE: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/api/webhooks",
        callback: updateProduct
    }
}