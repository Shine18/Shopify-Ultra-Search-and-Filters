import { Frame, Navigation, TopBar } from '@shopify/polaris';
import { HomeMinor, DynamicSourceMajor, ListMajor, ProductsMinor } from '@shopify/polaris-icons';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MainLayout({ children }) {
    const location = useLocation()
    const [currentLocation, setCurrentLocation] = useState(location.pathname)
    const [isMobileNavOpen, showMobileNav] = useState(false)
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


    const topBarMarkup = <TopBar
        showNavigationToggle
        onNavigationToggle={() => { showMobileNav(!isMobileNavOpen) }}
    />
    const logo = {
        width: 124,
        topBarSource:
            'https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-color.svg?6215648040070010999',
        url: '#',
        accessibilityLabel: 'Jaded Pixel',
    };

    return <Frame
        logo={logo}
        showMobileNavigation={isMobileNavOpen}
        onNavigationDismiss={() => { showMobileNav(false) }}
        topBar={topBarMarkup}
        navigation={navigationMarkup}>
        {children}
    </Frame>
}