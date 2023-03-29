// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import ProductsWebhookHandlers from './webhooks/products.js'
import fetchProducts from "./api/products/fetch.js";
import getAllProducts from "./api/products/index.js";
import Query from "./db/Query.js";
import ProductFieldsCreate from "./api/product_fields/create.js";
import ProductFieldsIndex from "./api/product_fields/index.js";
import ProductFieldsGet from "./api/product_fields/get.js";
import ProductFieldsUpdate from "./api/product_fields/update.js";
import ProductFieldsDelete from "./api/product_fields/delete.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);
app.post (
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: ProductsWebhookHandlers})
)

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

app.use((req, res, next) => {
  if( res.locals.shopify?.session.shop) {
    res.locals.UQuery = new Query(res.locals.shopify.session.shop)
  }
  
  next()
})

app.get("/api/products/", getAllProducts)
app.get("/api/products/fetch", fetchProducts)

app.get("/api/product_fields/", ProductFieldsIndex)
app.post("/api/product_fields/create", ProductFieldsCreate)
app.get("/api/product_fields/:id", ProductFieldsGet)
app.post("/api/product_fields/:id", ProductFieldsUpdate)
app.post("/api/product_fields/delete/:id", ProductFieldsDelete)


app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
