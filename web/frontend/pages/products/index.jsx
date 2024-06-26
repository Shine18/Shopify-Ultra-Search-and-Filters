import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { SettingToggle, MediaCard, Page, Text, SkeletonDisplayText, SkeletonBodyText, SkeletonThumbnail, Layout, Columns, AlphaStack, Inline, AlphaCard, Checkbox, Button, Divider, Modal, DataTable } from '@shopify/polaris';
import { ViewMinor } from '@shopify/polaris-icons'
import MainLayout from '../../components/Layout/MainLayout';
import { useToast } from "@shopify/app-bridge-react";
import { useCallback, useEffect, useState } from "react";


export default function Products({ }) {
    const fetch = useAuthenticatedFetch()
    const toast = useToast()
    const [isLoading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [productFields, setProductFields] = useState([])

    const [isModalOpen, displayModal] = useState(false)
    const [isModalLoading, setModalLoading] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [singleProductDataRows, setSingleProductData] = useState(false)

    const viewProductDetailsCallback = useCallback((id, title) => {
        setModalLoading(true)
        displayModal(true)
        setModalTitle(title)
        setupModal(id)
    }, [isModalLoading, isModalOpen])


    async function handleFetchProducts() {
        const response = await fetch("/api/products/fetch")
        if (response.ok) {
            response.json().then(body => {
                toast.show(body.message)
            })
        }
    }

    const setupModal = useCallback(async (id) => {
        let rows = []
        productFields.forEach((field) => {
            rows.push([
                field.title,
                ""
            ])
        })
        setSingleProductData(rows)
        setModalLoading(false)
    }, [productFields])

    useEffect(() => {
        fetch('/api/products/').then(data => data.json()).then(data => {
            console.log(data)
            setProducts(data.data)
            setLoading(false)
        })

        fetch("/api/product_fields/").then(data => data.json()).then(data => {
            console.log(data)
            setProductFields(data)
        })
    }, [])

    return <MainLayout>
        <Page>
            <AlphaStack gap="4">
                <SettingToggle
                    action={{
                        content: "Refetch Products",
                        onAction: handleFetchProducts,
                    }}
                    enabled={false}
                >
                    <Text>Manually updates products by refreshing from shopify</Text>
                </SettingToggle>

                <Columns columns={3} gap="4">
                    {isLoading ?
                        <>
                            <SkeletonProductCard />
                            <SkeletonProductCard />
                            <SkeletonProductCard />
                        </>
                        :
                        <>
                            {products.map(product => <ProductCard {...product} onViewDataClick={viewProductDetailsCallback} />)}
                        </>
                    }
                </Columns>
            </AlphaStack>

            <Modal
                open={isModalOpen}
                title={modalTitle}
                onClose={() => { displayModal(false) }}
                loading={isModalLoading}
            >
                <DataTable

                    columnContentTypes={[
                        'text',
                        'text'
                    ]}
                    headings={[
                        'Field',
                        'Value'
                    ]}
                    rows={singleProductDataRows}
                />
            </Modal>
        </Page>
    </MainLayout>
}

function SkeletonProductCard() {
    return <AlphaCard>
        <SkeletonThumbnail size="large" />
        <br />
        <SkeletonDisplayText size="small" />
        <br />
        <SkeletonBodyText lines={2} />
    </AlphaCard>
}

function ProductCard({ id, title, image, onViewDataClick }) {
    return <MediaCard portrait
        title={title}
        primaryAction={{
            icon: ViewMinor,
            content: 'View Data',
            onAction: () => { onViewDataClick(id, title) },
        }}
    >
        <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {image ?
                <img
                    alt=""
                    width="100%"
                    height="100%"
                    style={{
                        objectFit: 'contain',
                        objectPosition: 'center',
                    }}
                    src={image}
                />
                :
                <SkeletonThumbnail size="large" />
            }
        </div>
    </MediaCard>
}