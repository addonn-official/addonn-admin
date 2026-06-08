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
import InstructorHeader from '../../../ui/instructors/InstructorHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import SocialLinksTab from './tabs/SocialLinksTab';
import CountersTab from './tabs/CountersTab';
import InstructorImagesTab from './tabs/InstructorImagesTab';
import ShippingTab from './tabs/ShippingTab';
import { useInstructor } from '../../../../api/hooks/instructors/useInstructor';
import InstructorModel from '../../../../api/models/InstructorModel';
import { Tabs, Tab } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a instructor name').min(5, 'The instructor name must be at least 5 characters')
});

/**
 * The instructor page.
 */
function Instructor() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();
	
	const { instructorId } = routeParams as { instructorId: string };
	const instructorIdForFetch = instructorId === 'new' ? undefined : instructorId;

	let { data: instructor, isLoading, isError } = useInstructor(instructorIdForFetch);

	console.log('Instructor:', instructor);
	if (isError) {
        console.error('An error has occurred while fetching instructor:', isError);
        // instructor = {};
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
		if (instructorId === 'new') {
			reset(InstructorModel({}));
		}
	}, [instructorId, reset]);

	useEffect(() => {
		if (instructor) {
			if (instructor.images === undefined) {
				instructor.images = [instructor?.file];
			}
			if (instructor.socialMedia) {
				instructor.social_links = instructor.socialMedia
			}
			
			reset({ ...instructor });
		}
	}, [instructor, reset]);

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
	 * Show Message if the requested instructors is not exists
	 */
	if (isError && instructorId !== 'new') {
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
					There is no such Instructor!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/instructors"
					color="inherit"
				>
					Go to Instructor Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while instructor data is loading and form is setted
	 */
	if (_.isEmpty(form) || (instructor && routeParams.instructorId !== instructor.id && routeParams.instructorId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<InstructorHeader />}
				content={
					<div className="flex max-w-3xl flex-col gap-6 p-4 sm:p-6">
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
						>
							<Tab
								value="basic-info"
								label="Basic Info"
							/>
							<Tab
								value="images"
								label="Images"
							/>
							<Tab
								value="counters"
								label="Counters"
							/>
							<Tab
								value="social"
								label="Social Links"
							/>
							<Tab
								value="reviews"
								label="Reviews"
							/>
						</Tabs>
						<div className="">
							<div className={tabValue !== 'basic-info' ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							<div className={tabValue !== 'images' ? 'hidden' : ''}>
								<InstructorImagesTab />
							</div>

							<div className={tabValue !== 'counters' ? 'hidden' : ''}>
								<CountersTab />
							</div>

							<div className={tabValue !== 'social' ? 'hidden' : ''}>
								<SocialLinksTab />
							</div>

							<div className={tabValue !== 'reviews' ? 'hidden' : ''}>
								<ShippingTab />
							</div>
						</div>
					</div>
				}
				scroll={isMobile ? 'page' : 'content'}
			/>
		</FormProvider>
	);
}

export default Instructor;
