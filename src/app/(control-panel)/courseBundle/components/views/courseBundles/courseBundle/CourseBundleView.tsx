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
import CourseBundleHeader from '../../../ui/courseBundles/CourseBundleHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import CourseBundleImagesTab from './tabs/CourseBundleImagesTab';
import { useCourseBundle } from '../../../../api/hooks/courseBundles/useCourseBundle';
import CourseBundleModel from '../../../../api/models/CourseBundleModel';
import { Tabs, Tab } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a courseBundle name').min(5, 'The courseBundle name must be at least 5 characters')
});

/**
 * The courseBundle page.
 */
function CourseBundle() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();
	
	const { courseBundleId } = routeParams as { courseBundleId: string };
	const courseBundleIdForFetch = courseBundleId === 'new' ? undefined : courseBundleId;

	let { data: courseBundle, isLoading, isError } = useCourseBundle(courseBundleIdForFetch);

	console.log('CourseBundle:', courseBundle);
	if (isError) {
        console.error('An error has occurred while fetching courseBundle:', isError);
        // courseBundle = {};
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
		if (courseBundleId === 'new') {
			reset(CourseBundleModel({}));
		}
	}, [courseBundleId, reset]);

	useEffect(() => {
		if (courseBundle) {
			if (courseBundle.images === undefined) {
				courseBundle.images = [courseBundle?.file];
			}
			
			if (courseBundle.courses) {
				// courseBundle.courses = courseBundle.courses?.filter((i:any) => i?.id);
				courseBundle.courses = courseBundle.courses?.map((i:any) => i?.id);
			}
			reset({ ...courseBundle });
		}
	}, [courseBundle, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event: SyntheticEvent, value: string) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	/**
	 * Show Message if the requested courseBundles is not exists
	 */
	if (isError && courseBundleId !== 'new') {
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
					There is no such CourseBundle!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/courseBundles"
					color="inherit"
				>
					Go to CourseBundle Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while courseBundle data is loading and form is setted
	 */
	if (_.isEmpty(form) || (courseBundle && routeParams.courseBundleId !== courseBundle.id && routeParams.courseBundleId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<CourseBundleHeader />}
				content={
					<div className="flex max-w-3xl flex-col gap-6 p-4 sm:p-6">
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
						>
							<Tab
								value="basic-info"
								label="Detail"
							/>
							<Tab
								value="images"
								label="Images"
							/>
							
						</Tabs>
						<div className="">
							<div className={tabValue !== 'basic-info' ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							<div className={tabValue !== 'images' ? 'hidden' : ''}>
								<CourseBundleImagesTab />
							</div>
						</div>
					</div>
				}
				scroll={isMobile ? 'page' : 'content'}
			/>
		</FormProvider>
	);
}

export default CourseBundle;
