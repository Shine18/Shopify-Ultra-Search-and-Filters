export default async function ProductFieldsDelete(req, res){
    const { UQuery } = res.locals
    const {id} = req.params

    await UQuery.deleteProductField(id)

    res.send({ status: 200, message: "Product Field Deleted"})
}