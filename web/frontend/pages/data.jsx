import { AlphaCard, Page, DataTable, Checkbox } from "@shopify/polaris";
import { useCallback, useState, useEffect } from "react";
import { useAuthenticatedFetch } from "../hooks"
import MainLayout from "../components/Layout/MainLayout";
import { useToast } from "@shopify/app-bridge-react";

export default function Data() {
    const fetch = useAuthenticatedFetch()
    const {show} = useToast()
    const [dataFields, setDataFields] = useState([])
    const [changing, setChanging] = useState([])

    const changeVisibility = useCallback((id, channel) => {
        console.log(`changing visibility of ${id} in ${channel}`)
        addInProcess(id, channel)

        fetch(`/api/product_fields/visibility/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                channel
            })
        }).then(data => data.json()).then( data => {
            console.log(data)
            removeInProcess(id, channel)
            const {productField} = data
            const index = dataFields.findIndex(field => field.id == productField.id)
            const fieldsCopy = [...dataFields]
            fieldsCopy[index]= productField
            setDataFields(fieldsCopy)
            show(data.message)
        })
        
    }, [dataFields, setDataFields])
    const fetchDataFields = useCallback(() => {
        console.log("dfkdl")
        fetch('/api/product_fields').then(data => data.json()).then(data => {
            console.log(data)
            setDataFields(data)
        })
    }, [setDataFields, fetch])

    const inProcess = useCallback((id, channel) => {
        return changing.find(c => (c.id == id && c.channel == channel)) !== undefined
    }, [changing])
    const addInProcess = useCallback((id, channel) => {
        if( inProcess(id, channel)) {
            return
        }
        setChanging([
            ...changing,
            {
                id, channel
            }
        ])
    }, [changing])
    const removeInProcess = useCallback((id, channel) => {
        const c = changing.slice(0, changing.length)
        c.splice(c.findIndex(i => (i.id == id && i.channel == channel)))
        setChanging(c)
    }, [changing])

    useEffect(() => {
        fetchDataFields()
    }, [])
    let rows = dataFields.map(field => {
        return [
            field.title,
            field.tag,
            <Checkbox
                disabled={inProcess(field.id, "in_search")}
                checked={field.in_search || (inProcess(field.id, "in_search") && !field.in_search)}
                onChange={() => {
                    changeVisibility(field.id, "in_search")
                }}

            />,
            <Checkbox
                disabled={inProcess(field.id, "in_filters")}
                checked={field.in_filters || (inProcess(field.id, "in_filters") && !field.in_filters)}
                onChange={() => {
                    changeVisibility(field.id, "in_filters")
                }}

            />,
            <Checkbox
                disabled={inProcess(field.id, "in_api")}
                checked={field.in_api || (inProcess(field.id, "in_api") && !field.in_api)}
                onChange={() => {
                    changeVisibility(field.id, "in_api")
                }}

            />
        ]
    })

    console.log("changing" , changing)
    return <MainLayout>
        <Page>
            <AlphaCard>
                <DataTable
                    verticalAlign="middle"
                    hoverable
                    increasedTableDensity
                    columnContentTypes={[
                        'text',
                        'text',
                        'text',
                        'text'
                    ]}
                    headings={[
                        'Title',
                        'Tag',
                        'Search',
                        'Filter',
                        'API'
                    ]}
                    rows={rows}
                />
            </AlphaCard>
        </Page>
    </MainLayout>
}