import { AlphaCard, Form, FormLayout, Text, TextField, Select, Button, AlphaStack, Layout, Loading, Page, SkeletonBodyText, SkeletonDisplayText, SkeletonPage, Banner } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/Layout/MainLayout";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";

import { ProductFieldsTypes, AppearAsOptions } from ".";
import { useToast } from "@shopify/app-bridge-react";

const loadingMarkup = <>
    <Loading />
    <SkeletonPage primaryAction>
        <Layout>
            <Layout.Section>
                <AlphaCard>
                    <SkeletonBodyText />
                </AlphaCard>
            </Layout.Section>
            <Layout.Section>
                <AlphaCard>
                    <AlphaStack gap="4">
                        <SkeletonDisplayText size="small" />
                        <AlphaStack gap="0">
                            <SkeletonBodyText />
                        </AlphaStack>
                    </AlphaStack>
                </AlphaCard>
            </Layout.Section>
        </Layout>
    </SkeletonPage>
</>
export default function ProductField() {
    const { id } = useParams()
    const fetch = useAuthenticatedFetch()
    const { show } = useToast()

    const [loading, setLoading] = useState(true)
    const [productField, setProductField] = useState({})
    const [title, setTitle] = useState("")
    const [appearAs, setAppearAs] = useState("")
    const [displayDeleteBanner, showDeleteBanner] = useState(false)

    useEffect(() => {
        fetch(`/api/product_fields/${id}`).then(res => res.json()).then(data => {
            setTitle(data.title)
            setAppearAs(data.appear_as)
            // console.log(data.appearAs)
            setProductField(data)
            setLoading(false)
        })
    }, [id])
    let isSaveEnabled = !loading && ((productField.title != title) || (productField.appearAs != appearAs))

    const deleteBannerMarkup = <Banner
        title="Delete Data Field"
        status="critical"
        onDismiss={() => { showDeleteBanner(false) }}
    >
        <AlphaStack gap="2">
            <p>Are you sure you want to delete this data field?</p>
            <div>
                <Button destructive>Delete</Button>
            </div>
        </AlphaStack>
    </Banner>

    return <MainLayout>
        {loading
            ?
            loadingMarkup
            :
            <Page
                backAction={{ url: "/product_fields/" }}
                primaryAction={{
                    content: "Save",
                    disabled: !isSaveEnabled,
                    onAction: () => {
                        fetch(`/api/product_fields/${id}`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                title, appearAs
                            })
                        }).then(res => res.json()).then(data => {
                            console.log(data)
                            if (data.error) {
                                show(data.message, { isError: true })
                                return
                            }
                            const { message, productField } = data
                            show(message)
                            setProductField(productField)
                        })
                    }
                }}
                secondaryActions={[{
                    content: "Delete",
                    destructive: true,
                    onAction: () => {
                        showDeleteBanner(true)
                    }
                }]}
                compactTitle

                title={productField.title}
                subtitle="Filter & Search Data Field">

                <AlphaStack gap="4">
                    {displayDeleteBanner && deleteBannerMarkup}
                    <AlphaCard>
                        <Form onSubmit={() => {
                        }}>
                            <FormLayout>
                                <TextField label="Title" value={title} onChange={(e) => { setTitle(e) }} autoComplete="off" />
                                <TextField label="Tag" disabled value={productField.tag} autoComplete="off" />
                                <Select
                                    value={productField.type}
                                    label="Type"
                                    disabled
                                    options={ProductFieldsTypes}
                                />

                                <Select
                                    value={appearAs}
                                    disabled={productField.type == "color" || productField.type == "range"}
                                    label="Appear As"
                                    onChange={e => setAppearAs(e)}
                                    options={AppearAsOptions}
                                />
                            </FormLayout>
                        </Form>
                    </AlphaCard>
                </AlphaStack>
            </Page>
        }
    </MainLayout>
}