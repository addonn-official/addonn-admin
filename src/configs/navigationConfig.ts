import i18n from '@i18n';
import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18n.addResourceBundle('en', 'navigation', en);
i18n.addResourceBundle('tr', 'navigation', tr);
i18n.addResourceBundle('ar', 'navigation', ar);

/**
 * The navigationConfig object is an array of navigation items for the Fuse application.
 */
const navigationConfig: FuseNavItemType[] = [
    {
        id: 'example-component',
        title: 'Dashboard',
        translate: 'Dashboard',
        type: 'item',
        // dashboard/home icon
        icon: 'lucide:home',
        url: 'dashboard'
    },
    {
        id: 'user-component',
        title: 'User',
        translate: 'User',
        type: 'item',
        icon: 'lucide:users',
        url: 'user/user'
    },
    {
        id: 'instructor-component',
        title: 'Instructor',
        translate: 'Instructor',
        type: 'item',
        // single user / instructor icon
        icon: 'lucide:user',
        url: 'instructor/instructor'
    },
    {
        id: 'course-component',
        title: 'Course',
        translate: 'Course',
        type: 'item',
        // course / book icon
        icon: 'lucide:book-open',
        url: 'course/course'
    },
    {
        id: 'review-component',
        title: 'Review',
        translate: 'Review',
        type: 'item',
        // review / message icon
        icon: 'lucide:message-square',
        url: 'review/review'
    },
    {
        id: 'coupon-component',
        title: 'Coupon',
        translate: 'Coupon',
        type: 'item',
        icon: 'lucide:ticket-percent',
        url: 'coupon/coupon'
    },
    {
        id: 'course-bundle-component',
        title: 'Course Bundle',
        translate: 'Course-Bundle',
        type: 'item',
        icon: 'lucide:package',
        url: 'course-bundle/course-bundle'
    },
    {
        id: 'testimonial-component',
        title: 'Testimonial',
        translate: 'Testimonial',
        type: 'item',
        icon: 'lucide:quote',
        url: 'testimonial/testimonial'
    },
    {
        id: 'enrollment-component',
        title: 'Enrollment',
        translate: 'Enrollment',
        type: 'item',
        icon: 'lucide:shopping-cart',
        url: 'enrollment/enrollment'
    },
    {
        id: 'orders-component',
        title: 'Orders',
        translate: 'Orders',
        type: 'item',
        icon: 'lucide:shopping-cart',
        url: 'order/order'
    },
    {
        id: 'discussion-forum-component',
        title: 'Discussion Forum',
        translate: 'Discussion-Forum',
        type: 'item',
        icon: 'lucide:message-square',
        url: 'discussion-form/discussion-form'
    }

];

export default navigationConfig;
