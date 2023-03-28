export default async function ProductFieldsGet(req, res) {
    const {UQuery} = res.locals

    const field = await UQuery.getProductField(req.params.id)
    if( field) {
        res.status(200).send(field)
    } else{
        res.status(404).send({message: "Not Found"})
    }
}