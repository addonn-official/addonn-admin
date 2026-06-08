import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { CourseBundle } from '../types';
import { display } from '@mui/system';

/**
 * The courseBundle model.
 */
const CourseBundleModel = (data: PartialDeep<CourseBundle>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('courseBundle-'),
		name: '',
		display_name: '',
		bio: '',
		rating_count: '0',
		courseBundle_count: '0',
		students_taught: '0',
		average_rating: '0',
		linkdin: '',
		featuredImageId: '',
		images: [],
		active: true,
		image: ''
	});

export default CourseBundleModel;
