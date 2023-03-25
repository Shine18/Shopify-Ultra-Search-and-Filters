import { DeliveryMethod, Session } from '@shopify/shopify-api'
import { saveProductToDb } from '../db/saveProductsToDatabase.js'
import shopify from '../shopify.js'

async function updateProduct(topic, shop, body, webhookId) {
    console.log("Webhook triggered")
    console.log(topic, shop, body, webhookId)
    const offlineSessionId = await shopify.api.session.getOfflineId(shop)
    const session = await shopify.config.sessionStorage.loadSession(offlineSessionId)
    console.log("session", session)

    const product = JSON.parse(body)
    const graphQlProduct = await fetchGraphQlProduct(product.handle, session)
    const {id, handle,title, tags, onlineStoreUrl, featuredImage} = graphQlProduct.productByHandle
    await saveProductToDb({id, handle,title, tags, onlineStoreUrl, featuredImage}, shop)
    
}

async function fetchGraphQlProduct(handle, session) {
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