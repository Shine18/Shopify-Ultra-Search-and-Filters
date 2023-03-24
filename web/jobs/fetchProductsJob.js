
import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";
import saveGraphQlProductsToDB from "../db/saveProductsToDatabase.js"

export default async function startFetchProductsJob(res, settings) {
    const currentShop = res.locals.shopify.session.shop
    try {
        let totalProducts = []
        let data = await fetchShopProducts(res.locals.shopify.session)
        totalProducts.push(...data.products.edges)
        if (data.products.pageInfo.hasNextPage) {
            data = await fetchShopProducts(res.locals.shopify.session, data.products.pageInfo.endCursor)
            totalProducts.push(...data.products.edges)
        }
        await saveGraphQlProductsToDB(totalProducts, currentShop)
        await settings.enableRefetchingProducts()
    }
    catch (e) {
        console.log(`Failed to process products/fetch: ${e.message}`);
    }
}

async function fetchShopProducts(session, after = false) {

    const client = new shopify.api.clients.Graphql({ session });

    try {
        const data = await client.query({
            data: {
                query: `{
                    products(first: 200, ${after ? `after:"${after}"` : ""}) {
                        edges {
                            node {
                                id
                                handle
                                title
                                tags
                                onlineStoreUrl
                                featuredImage {
                                    url
                                }
                            }
                        }
                        pageInfo {
                            startCursor
                            endCursor
                            hasNextPage
                            hasPreviousPage
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