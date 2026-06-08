'use client';

import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { SyntheticEvent, useEffect, useState } from 'react';
import useParams from '@fuse/hooks/useParams';
import Link from '@fuse/core/Link';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DiscussionFormHeader from '../../../ui/discussion_forms/DiscussionFormHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import { useDiscussionForm } from '../../../../api/hooks/discussion_forms/useDiscussionForm';
import DiscussionFormModel from '../../../../api/models/DiscussionFormModel';

/**
 * Form Validation Schema
 */
const schema = z.object({
	code: z.string().nonempty('You must enter a discussion_form code').min(5, 'The discussion_form code must be at least 5 characters')
});

/**
 * The discussion_form page.
 */
function DiscussionForm() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();
	
	const { discussion_formId } = routeParams as { discussion_formId: string };
	const discussion_formIdForFetch = discussion_formId === 'new' ? undefined : discussion_formId;

	let { data: discussion_form, isLoading, isError } = useDiscussionForm(discussion_formIdForFetch);

	if (isError) {
        console.error('An error has occurred while fetching discussion_form:', isError);
        // discussion_form = {};
    }
	
	const [tabValue, setTabValue] = useState('basic-info');

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;

	const form = watch();

	useEffect(() => {
		if (discussion_formId === 'new') {
			reset(DiscussionFormModel({}));
		}
	}, [discussion_formId, reset]);

	useEffect(() => {
		if (discussion_form) {
			
			reset({ ...discussion_form });
		}
	}, [discussion_form, reset]);

	/**
	 * Tab Change
	 */
	// function handleTabChange(event: SyntheticEvent, value: string) {
	// 	setTabValue(value);
	// }

	if (isLoading) {
		return <FuseLoading />;
	}

	/**
	 * Show Message if the requested discussion_forms is not exists
	 */
	if (isError && discussion_formId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex h-full flex-1 flex-col items-center justify-center"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There is no such DiscussionForm!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/discussion_forms"
					color="inherit"
				>
					Go to DiscussionForm Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while discussion_form data is loading and form is setted
	 */
	if (_.isEmpty(form) || (discussion_form && routeParams.discussion_formId !== discussion_form.id && routeParams.discussion_formId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<DiscussionFormHeader />}
				content={
					<div className="flex max-w-3xl flex-col gap-6 p-4 sm:p-6">
						<div className="">
							<div className={tabValue !== 'basic-info' ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>
						</div>
					</div>
				}
				scroll={isMobile ? 'page' : 'content'}
			/>
		</FormProvider>
	);
}

export default DiscussionForm;
