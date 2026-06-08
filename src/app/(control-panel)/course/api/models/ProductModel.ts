import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Course } from '../types';
import { display } from '@mui/system';

/**
 * The product model.
 */
const ProductModel = (data: PartialDeep<Course>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('course-'),
		is_content_drip_enabled: 'false',
		course_type: 'free',
		status: 'false',
		is_user_limit_enabled: 'false',
		difficulty_level: 'all_levels',
		language: 'hindi',
		has_money_back_guarantee: 'false',
		is_comment_enabled: 'false',
		images: [],
		image: '',
		featuredImageId: '',

	});

export default ProductModel;
