import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Coupon } from '../types';
import { display } from '@mui/system';

/**
 * The coupon model.
 */
const CouponModel = (data: PartialDeep<Coupon>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('coupon-'),
		name: '',
		
	});

export default CouponModel;
