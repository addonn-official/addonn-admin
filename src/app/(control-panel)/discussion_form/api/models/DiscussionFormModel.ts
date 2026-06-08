import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { DiscussionForm } from '../types';
import { display } from '@mui/system';

/**
 * The discussion_form model.
 */
const DiscussionFormModel = (data: PartialDeep<DiscussionForm>) =>
	_.defaults(data || {}, {
		id: _.uniqueId('discussion_form-'),
		name: '',
		
	});

export default DiscussionFormModel;
