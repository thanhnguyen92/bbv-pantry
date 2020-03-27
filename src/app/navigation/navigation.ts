import { FuseNavigation } from '@fuse/types';
import { UserRole } from 'app/shared/enums/user-roles.enum';

export const navigation: FuseNavigation[] = [
    {
        id: 'pantry',
        title: 'Foods & Beverages',
        translate: 'NAV.PANTRY.TITLE',
        type: 'group',
        permissions: [UserRole.User],
        children: [
            {
                id: 'admin',
                title: 'Management',
                translate: 'NAV.PANTRY.ADMIN.TITLE',
                icon: 'settings_applications',
                // url: '/admin',
                type: 'collapsable',
                permissions: [UserRole.Administrator, UserRole.Host],
                children: [
                    {
                        id: 'restaurant',
                        title: 'Restaurant',
                        translate: 'NAV.PANTRY.ADMIN.RESTAURANT.TITLE',
                        type: 'item',
                        icon: 'restaurant',
                        url: '/admin/restaurants'
                    },
                    {
                        id: 'menu',
                        title: 'Menu',
                        translate: 'NAV.PANTRY.ADMIN.MENU.TITLE',
                        type: 'item',
                        icon: 'restaurant_menu',
                        url: '/admin/menus'
                    },
                    {
                        id: 'booking',
                        title: 'Booking',
                        translate: 'NAV.PANTRY.ADMIN.BOOKING.TITLE',
                        type: 'item',
                        icon: 'assignment',
                        url: '/admin/bookings'
                    },
                    {
                        id: 'order',
                        title: 'Order',
                        translate: 'NAV.PANTRY.ORDER.TITLE',
                        type: 'item',
                        icon: 'receipt',
                        url: '/admin/orders'
                    }
                ]
            },
            {
                id: 'order',
                title: 'Order',
                translate: 'NAV.PANTRY.ORDER.TITLE',
                type: 'item',
                icon: 'shopping_cart',
                url: '/user/order',
                permissions: [UserRole.User],
            }
        ]
    },
    {
        id: 'administrations',
        title: 'Administrations',
        translate: 'NAV.ADMINISTRATIONS.TITLE',
        type: 'group',

        children: [
            {
                id: 'users',
                title: 'Users',
                translate: 'NAV.ADMINISTRATIONS.USER.TITLE',
                type: 'item',
                icon: 'person',
                permissions: [UserRole.Administrator],
                url: '/admin/users'
            },
            {
                id: 'roles',
                title: 'Roles and administrators',
                translate: 'NAV.ADMINISTRATIONS.ROLES.TITLE',
                type: 'item',
                icon: 'supervised_user_circle',
                url: '/admin/roles'
            }
        ]
    },
    // {
    //     id: 'applications',
    //     title: 'Applications',
    //     translate: 'NAV.APPS.TITLE',
    //     type: 'group',
    //     children: [
    //         {
    //             id: 'iframe',
    //             title: 'iFrame',
    //             translate: 'NAV.APPS.IFRAME.TITLE',
    //             type: 'item',
    //             icon: 'airplay',
    //             url: '/iframe'
    //         }
    //     ]
    // }
];
