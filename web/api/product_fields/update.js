export default async function ProductFieldsUpdate(req, res) {
    console.log("updating product fields")
    const { UQuery } = res.locals
    const {id} = req.params
    const { title, appearAs } = req.body

    const field = await UQuery.getProductField(id)
    if (!field) {
        res.status(404).send({ error: true, message: "Data field does not exist" })
        return
    }

    if ( field.title != title && await UQuery.getProductFieldByTitle(title)) {
        res.status(402).send({ error: true, message: "Data field with this title aleady exist" })
        return
    }


    await UQuery.updateProductField(id, { title, appearAs})
    res.status(200).send({ message: "Data field Updated", productField: await UQuery.getProductField(id) })

}