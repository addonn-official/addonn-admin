import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Instructor } from '../types';
import { display } from '@mui/system';

/**
 * The instructor model.
 */
const InstructorModel = (data: PartialDeep<Instructor>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('instructor-'),
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

export default InstructorModel;
