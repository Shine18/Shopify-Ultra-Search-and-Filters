export default async function ProductFieldsVisibility(req, res) {
    console.log("updating product fields")
    const { UQuery } = res.locals
    const {id} = req.params
    const { channel } = req.body

    const field = await UQuery.getProductField(id)
    if (!field) {
        res.status(404).send({ error: true, message: "Data field does not exist" })
        return
    }



    // await UQuery.updateProductField(id, { title, appearAs})
    console.log(field)
    console.log("Changing product field ", channel, field[channel], !field[channel])
    await UQuery.toggleProductFieldVisibility(id, channel, !field[channel])
    const updatedField = await UQuery.getProductField(id)
    console.log("updated field", updatedField)
    res.status(200).send({ message: "Data field Updated", productField: updatedField  })

}