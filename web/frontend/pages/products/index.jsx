import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { SettingToggle, Page, Text, SkeletonDisplayText, SkeletonBodyText, SkeletonThumbnail, Layout, Columns, AlphaStack, Inline, AlphaCard, Checkbox } from '@shopify/polaris';
import MainLayout from '../../components/Layout/MainLayout';
import { useToast } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";


export default function Products({ }) {
    const fetch = useAuthenticatedFetch()
    const toast = useToast()
    const [isLoading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    async function handleFetchProducts() {
        const response = await fetch("/api/products/fetch")
        if (response.ok) {
            response.json().then(body => {
                toast.show(body.message)
            })
        }
    }

    useEffect(() => {
        fetch('/api/products/').then(data => data.json()).then(data => {
            console.log(data)
            setProducts(data.data)
            setLoading(false)
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
                            {products.map(product => <ProductCard {...product} />)}
                        </>
                    }
                </Columns>
            </AlphaStack>
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

function ProductCard({ title, image }) {
    return <AlphaCard>
        <SkeletonThumbnail size="large" />
        <br />
        <Text as="h4">{title}</Text>
        <Checkbox
            label="Show in search"
            checked={true}
            onChange={() => { }}
        />
    </AlphaCard>
}