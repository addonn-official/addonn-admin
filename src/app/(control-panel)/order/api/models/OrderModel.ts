import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Order } from '../types';
import { display } from '@mui/system';

/**
 * The order model.
 */
const OrderModel = (data: PartialDeep<Order>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('order-'),
		name: '',
		display_name: '',
		bio: '',
		rating_count: '0',
		order_count: '0',
		students_taught: '0',
		average_rating: '0',
		linkdin: '',
		featuredImageId: '',
		images: [],
		active: true,
		image: ''
	});

export default OrderModel;
