import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
        id: 'applications',
        title: 'Applications',
        translate: 'NAV.PANTRY.TITLE',
        type: 'group',
        children: [
            {
                id: 'sample',
                title: 'Sample',
                translate: 'NAV.PANTRY.ADMIN.TITLE',
                type: 'item',
                icon: 'supervised_user_circle',
                url: '/admin',
                // badge: {
                //     title: '25',
                //     translate: 'NAV.PANTRY.USER.TITLE',
                //     bg: '#F44336',
                //     fg: '#FFFFFF'
                // }
            },
            {
                id: 'user',
                title: 'User',
                translate: 'NAV.PANTRY.USER.TITLE',
                type: 'item',
                icon: 'people',
                url: '/user'
            }
        ]
    }
];
