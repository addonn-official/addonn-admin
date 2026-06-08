import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Review } from '../types';
import { display } from '@mui/system';

/**
 * The review model.
 */
const ReviewModel = (data: PartialDeep<Review>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('review-'),
		name: '',
		display_name: '',
		bio: '',
		rating_count: '0',
		review_count: '0',
		students_taught: '0',
		average_rating: '0',
		linkdin: '',
		featuredImageId: '',
		images: [],
		active: true,
		image: ''
	});

export default ReviewModel;
