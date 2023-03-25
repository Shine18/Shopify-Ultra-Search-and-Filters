export default async function Products(req, res) {
    const {UQuery} = res.locals

    UQuery.getAllProducts().then(data => {
        res.status(200).send({ data })
    })
}