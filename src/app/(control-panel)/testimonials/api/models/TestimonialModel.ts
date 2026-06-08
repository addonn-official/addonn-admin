import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Testimonial } from '../types';
import { display } from '@mui/system';

/**
 * The testimonial model.
 */
const TestimonialModel = (data: PartialDeep<Testimonial>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('testimonial-'),
		name: '',
		display_name: '',
		bio: '',
		rating_count: '0',
		testimonial_count: '0',
		students_taught: '0',
		average_rating: '0',
		linkdin: '',
		featuredImageId: '',
		images: [],
		active: true,
		image: ''
	});

export default TestimonialModel;
