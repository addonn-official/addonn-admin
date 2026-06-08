import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { User } from '../types';
import { display } from '@mui/system';

/**
 * The user model.
 */
const UserModel = (data: PartialDeep<User>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('user-'),
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

export default UserModel;
