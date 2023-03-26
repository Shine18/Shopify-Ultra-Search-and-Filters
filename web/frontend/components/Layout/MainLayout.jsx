import { Frame, Navigation } from '@shopify/polaris';
import { HomeMinor, DynamicSourceMajor, ListMajor, ProductsMinor } from '@shopify/polaris-icons';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MainLayout({ children }) {
    const location = useLocation()
    const [currentLocation, setCurrentLocation] = useState(location.pathname)
    const navigate = useNavigate()

    useEffect(() => {
        setCurrentLocation(location.pathname)
    }, [location])

    const navigationMarkup = <Navigation location={currentLocation}>
        <Navigation.Section
            items={[
                {
                    url: '/',
                    label: 'Home',
                    icon: HomeMinor,
                    selected: location.pathname == "/",
                    onClick: () => { navigate("/") }
                },
                {
                    url: '/products/',
                    label: 'Products',
                    icon: ProductsMinor,
                    selected: location.pathname == "/products/",
                    onClick: () => { navigate("/products/") }
                },
                {
                    url: "/product_fields/",
                    label: "Filter & Search Fields",
                    icon: ListMajor,
                    selected: location.pathname == "/product_fields/",
                    onClick: () => { navigate("/product_fields/") }
                },
                {
                    url: '/data/',
                    label: 'Data',
                    icon: DynamicSourceMajor,
                    selected: location.pathname == "/data/",
                    onClick: () => { navigate("/data/") }
                },
            ]}
        />
    </Navigation>

    return <Frame navigation={navigationMarkup}>
        {children}
    </Frame>
}