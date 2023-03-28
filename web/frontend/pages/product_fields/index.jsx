import {  useToast } from '@shopify/app-bridge-react';
import {
    EmptySearchResult,
    IndexTable,
    AlphaCard,
    Page,
    FormLayout,
    TextField,
    Text,
    AlphaStack,
    Select,
    Form,
    Button,
    Tag,
    Columns,
    Icon,
    Pagination,
    Link,
} from '@shopify/polaris';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from "../../components/Layout/MainLayout";
import { useAppQuery, useAuthenticatedFetch } from '../../hooks';

export const ProductFieldsTypes = [
    {
        label: "Text/Number",
        value: "text"
    },
    {
        label: "Color",
        value: "color"
    },
    {
        label: "Range",
        value: "range"
    }
]

export const AppearAsOptions = [
    {
        label: "Check Boxes",
        value: "checkbox"
    },
    {
        label: "Combo Box",
        value: "combobox"
    },
    {
        label: "Radio Buttons",
        value: "radio"
    }
]
const emptyStateMarkup = (
    <EmptySearchResult
        title={'No Data Fields yet'}
        description={'Try creating a new Data field'}
        withIllustration
    />
);

const testData = Array(130).fill(0).map((_, i) => {
    return {
        id: i,
        title: `Category ${i}`,
        tag: `us_Category${i}_tag`,
        type: "checkbox"
    }
})

export default function Index() {
    const [currentPage, setCurrentPage] = useState(1)
    const navigate = useNavigate()

    const {
        data: productFields,
        refetch: refetchProductFields,
        isLoading: isLoadingProductFields,
        isRefetching: isRefetchingProductFields
    } = useAppQuery({
        url: "/api/product_fields/",
        reactQueryOptions: {
            onSuccess: () => {
                console.log("Qury done")
            }
        }
    })

    console.log("product fields", productFields)



    const resourceName = {
        singular: 'data field',
        plural: 'data fields',
    };

    const tableHeader = [
        { title: "Title" },
        { title: "Type" },
        { title: "Tag" }
    ]

    const data = productFields || []

    const pageItemsCount = 50
    const totalPages = parseInt(Math.ceil(data.length / pageItemsCount))
    const itemsToLoad = data.slice((currentPage * pageItemsCount) - pageItemsCount, currentPage * pageItemsCount)
    const startItemCount = ((currentPage * pageItemsCount) - pageItemsCount) + 1
    const endItemCount = data.length < (currentPage * pageItemsCount) ? data.length : currentPage * pageItemsCount
    const paginationMarkup = <Pagination label={`${startItemCount}-${endItemCount} of ${data.length} Results`}
        hasNext={currentPage < totalPages}
        hasPrevious={currentPage > 1}
        onPrevious={() => {
            setCurrentPage(currentPage - 1)
        }}
        onNext={() => {
            setCurrentPage(currentPage + 1)
        }}>

    </Pagination>

    return <MainLayout>
        <Page>
            <AlphaStack gap="5">
                <AlphaCard>
                    <ProductFieldForm refetch={refetchProductFields} />
                </AlphaCard>
                {paginationMarkup}
                <AlphaCard padding={0}>
                    <IndexTable
                        loading={isLoadingProductFields}
                        emptyState={emptyStateMarkup}
                        resourceName={resourceName}
                        itemCount={data.length}
                        headings={tableHeader}
                        selectable={false}
                    >
                        {itemsToLoad.map(item => (<IndexTable.Row
                            id={item.id}
                            key={item.id}
                        >
                            <IndexTable.Cell>
                                <Text fontWeight="bold" as="span">
                                    <Link dataPrimaryLink url={`/product_fields/${item.id}`} onClick={() => { navigate(`/product_fields/${item.id}`)}}>
                                    {item.title}
                                    </Link>
                                </Text>
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                                {item.type}
                            </IndexTable.Cell>
                            <IndexTable.Cell>
                                <Tag>{item.tag}</Tag>
                            </IndexTable.Cell>
                        </IndexTable.Row>
                        ))}
                    </IndexTable>
                </AlphaCard>
                {paginationMarkup}
            </AlphaStack>
        </Page>
    </MainLayout>
}


function ProductFieldForm({ refetch }) {
    const fetch = useAuthenticatedFetch()
    const { show } = useToast()

    const [title, setTitle] = useState("")
    const [type, setType] = useState("text")
    const [tag, setTag] = useState("")
    const [appearAs, setAppearAs] = useState(AppearAsOptions[0].value)

    return <Form onSubmit={() => {
        if (tag == "") {
            show("Please fill tag for new data field", { isError: true })
            return
        }
        if (title == "") {
            show("Please fill title for new data field", { isError: true })
            return
        }
        fetch("/api/product_fields/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({
                title, type, tag, appearAs
            })
        }).then(res => res.json()).then(data => {
            if (data.error) {
                show(data.message, { isError: true })
                return
            }
            console.log(data)
            show(data.message)
            refetch()
            setTitle("")
            setType("text")
            setTag("")
            setAppearAs("combobox")
        })
    }}>
        <FormLayout>
            <Text variant="headingMd">Create Data Field</Text>
            <FormLayout.Group>
                <TextField label="Title" value={title} onChange={(e) => { setTitle(e) }} autoComplete="off" />
                <Select
                    value={type}
                    label="Type"
                    options={ProductFieldsTypes}
                    onChange={e => setType(e)}
                />
                <TextField prefix="us_" label="Tag" value={tag} onChange={(e) => { setTag(e.replace(" ", "_").trim()) }} autoComplete="off" />
                <Select
                    value={appearAs}
                    disabled={type == "color" || type == "range"}
                    label="Appear As"
                    onChange={e => setAppearAs(e)}
                    options={AppearAsOptions}
                />
            </FormLayout.Group>

            <Button submit primary>Add Data Field</Button>
        </FormLayout>
    </Form>
}