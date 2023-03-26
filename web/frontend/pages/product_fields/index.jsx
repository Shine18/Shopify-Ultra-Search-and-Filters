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
} from '@shopify/polaris';
import { useEffect, useState } from 'react';
import MainLayout from "../../components/Layout/MainLayout";

const ProductFieldsTypes = [
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

const AppearAsOptions = [
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

    const totalPages = parseInt(Math.ceil(testData.length / 50))
    const itemsToLoad = testData.slice((currentPage * 50) - 50, currentPage * 50)
    const resourceName = {
        singular: 'data field',
        plural: 'data fields',
    };

    const tableHeader = [
        { title: "Title" },
        { title: "Type" },
        { title: "Tag" }
    ]

    return <MainLayout>
        <Page>
            <AlphaStack gap="5">
                <AlphaCard>
                    <ProductFieldForm />
                </AlphaCard>
                <Pagination label="Results"
                    hasNext={currentPage < totalPages}
                    hasPrevious={currentPage > 1}
                    onPrevious={() => {
                        setCurrentPage(currentPage - 1)
                    }}
                    onNext={() => {
                        setCurrentPage(currentPage + 1)
                    }}>

                </Pagination>
                <AlphaCard padding={0}>
                    <IndexTable
                        loading={false}
                        emptyState={emptyStateMarkup}
                        resourceName={resourceName}
                        itemCount={testData.length}
                        headings={tableHeader}
                        selectable={false}
                    >
                        {itemsToLoad.map(item => (<IndexTable.Row
                            id={item.id}
                            key={item.key}
                        >
                            <IndexTable.Cell>
                                <Text fontWeight="bold" as="span">
                                    {item.title}
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
                <Pagination label="Results"
                    hasNext={currentPage < totalPages}
                    hasPrevious={currentPage > 1}
                    onPrevious={() => {
                        setCurrentPage(currentPage - 1)
                    }}
                    onNext={() => {
                        setCurrentPage(currentPage + 1)
                    }}>

                </Pagination>
            </AlphaStack>
        </Page>
    </MainLayout>
}


function ProductFieldForm() {
    const [title, setTitle] = useState("")
    const [type, setType] = useState("text")
    const [tag, setTag] = useState("")
    const [appearAs, setAppearAs] = useState(AppearAsOptions[0].value)

    return <Form onSubmit={() => {
        setTitle("")
        setType("text")
        setTag("")
        setAppearAs("combobox")
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
                <TextField label="Tag" value={tag} onChange={(e) => { setTag(e) }} autoComplete="off" />
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