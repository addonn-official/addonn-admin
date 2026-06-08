import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Enrollment } from '../types';
import { display } from '@mui/system';

/**
 * The enrollment model.
 */
const EnrollmentModel = (data: PartialDeep<Enrollment>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('enrollment-'),
		name: '',
		display_name: '',
		bio: '',
		rating_count: '0',
		enrollment_count: '0',
		students_taught: '0',
		average_rating: '0',
		linkdin: '',
		featuredImageId: '',
		images: [],
		active: true,
		image: ''
	});

export default EnrollmentModel;
