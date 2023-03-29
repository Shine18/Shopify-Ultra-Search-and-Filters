export default async function ProductFieldsCreate(req, res) {
    const { UQuery } = res.locals
    const { title, tag, type, appearAs } = req.body

    if (await UQuery.getProductFieldByTag(tag)) {
        res.status(200).send({ error: true, message: "Data field with this tag already exists" })
        return
    }
    if (await UQuery.getProductFieldByTitle(title)) {
        res.status(200).send({ error: true, message: "Data field with this title already exists" })
        return
    }


    await UQuery.insertProductField({ title, tag, appearAs, type })
    res.status(200).send({ message: "Data field created" })

}