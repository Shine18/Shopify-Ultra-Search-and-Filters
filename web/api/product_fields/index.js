export default async function ProductFieldsIndex( req, res ) {
    const {UQuery} = res.locals

    const fields = await UQuery.getAllProductFields()
    res.status(200).send(fields)
}