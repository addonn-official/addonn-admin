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
import EnrollmentHeader from '../../../ui/enrollments/EnrollmentHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import EnrollmentImagesTab from './tabs/EnrollmentImagesTab';
import { useEnrollment } from '../../../../api/hooks/enrollments/useEnrollment';
import EnrollmentModel from '../../../../api/models/EnrollmentModel';
import { Tabs, Tab } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a enrollment name').min(5, 'The enrollment name must be at least 5 characters')
});

/**
 * The enrollment page.
 */
function Enrollment() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();
	
	const { enrollmentId } = routeParams as { enrollmentId: string };
	const enrollmentIdForFetch = enrollmentId === 'new' ? undefined : enrollmentId;

	let { data: enrollment, isLoading, isError } = useEnrollment(enrollmentIdForFetch);

	console.log('Enrollment:', enrollment);
	if (isError) {
        console.error('An error has occurred while fetching enrollment:', isError);
        // enrollment = {};
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
		if (enrollmentId === 'new') {
			reset(EnrollmentModel({}));
		}
	}, [enrollmentId, reset]);

	useEffect(() => {
		if (enrollment) {
			if (enrollment.images === undefined) {
				enrollment.images = [enrollment?.file];
			}
			console.log('Enrollment Certificate:', enrollment?.certificate?.request_status);
			enrollment.certificate_status = enrollment?.certificate?.request_status;
			
			
			reset({ ...enrollment });
		}
	}, [enrollment, reset]);

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
	 * Show Message if the requested enrollments is not exists
	 */
	if (isError && enrollmentId !== 'new') {
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
					There is no such Enrollment!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/enrollments"
					color="inherit"
				>
					Go to Enrollment Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while enrollment data is loading and form is setted
	 */
	if (_.isEmpty(form) || (enrollment && routeParams.enrollmentId !== enrollment.id && routeParams.enrollmentId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<EnrollmentHeader />}
				content={
					<div className="flex max-w-3xl flex-col gap-6 p-4 sm:p-6">
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
						>
							{/* <Tab
								value="basic-info"
								label="Detail"
							/> */}
							{/* <Tab
								value="images"
								label="Images"
							/> */}
							
						</Tabs>
						<div className="">
							<div className={tabValue !== 'basic-info' ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							{/* <div className={tabValue !== 'images' ? 'hidden' : ''}>
								<EnrollmentImagesTab />
							</div> */}
						</div>
					</div>
				}
				scroll={isMobile ? 'page' : 'content'}
			/>
		</FormProvider>
	);
}

export default Enrollment;
