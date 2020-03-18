import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'pantry',
        title: 'Foods & Beverages',
        translate: 'NAV.PANTRY.TITLE',
        type: 'group',
        children: [
            {
                id: 'admin',
                title: 'Management',
                translate: 'NAV.PANTRY.ADMIN.TITLE',
                icon: 'supervised_user_circle',
                // url: '/admin',
                type: 'collapsable',
                children: [
                    {
                        id: 'restaurant',
                        title: 'Restaurant',
                        translate: 'NAV.PANTRY.ADMIN.RESTAURANT.TITLE',
                        type: 'item',
                        icon: 'restaurant',
                        url: '/admin/restaurant'
                    },
                    {
                        id: 'menu',
                        title: 'Menu',
                        translate: 'NAV.PANTRY.ADMIN.MENU.TITLE',
                        type: 'item',
                        icon: 'restaurant_menu',
                        url: '/admin/menu'
                    },
                    {
                        id: 'booking',
                        title: 'Booking',
                        translate: 'NAV.PANTRY.ADMIN.BOOKING.TITLE',
                        type: 'item',
                        icon: 'restaurant',
                        url: '/admin/booking'
                    },
                    {
                        id: 'order',
                        title: 'Order',
                        translate: 'NAV.PANTRY.ORDER.TITLE',
                        type: 'item',
                        icon: 'receipt',
                        url: '/admin/order'
                    }
                ]
            },
            {
                id: 'order',
                title: 'Order',
                translate: 'NAV.PANTRY.ORDER.TITLE',
                type: 'item',
                icon: 'receipt',
                url: '/user/order'
            }
        ]
    },
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.APPS.TITLE',
        type: 'group',
        children: [
            {
                id: 'iframe',
                title: 'iFrame',
                translate: 'NAV.APPS.IFRAME.TITLE',
                type: 'item',
                icon: 'airplay',
                url: '/iframe'
            }
        ]
    }
];
