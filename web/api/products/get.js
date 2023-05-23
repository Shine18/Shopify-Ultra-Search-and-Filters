export default async function getSingleProduct(req, res) {
    const {UQuery} = res.locals
    const {id} = req.params
    const product = await UQuery.getProduct(id)
    res.status(200).send({ data: product})
}