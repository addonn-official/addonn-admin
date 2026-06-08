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
import TestimonialHeader from '../../../ui/testimonials/TestimonialHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import TestimonialImagesTab from './tabs/TestimonialImagesTab';
import { useTestimonial } from '../../../../api/hooks/testimonials/useTestimonial';
import TestimonialModel from '../../../../api/models/TestimonialModel';
import { Tabs, Tab } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a testimonial name').min(5, 'The testimonial name must be at least 5 characters')
});

/**
 * The testimonial page.
 */
function Testimonial() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();
	
	const { testimonialId } = routeParams as { testimonialId: string };
	const testimonialIdForFetch = testimonialId === 'new' ? undefined : testimonialId;

	let { data: testimonial, isLoading, isError } = useTestimonial(testimonialIdForFetch);

	console.log('Testimonial:', testimonial);
	if (isError) {
        console.error('An error has occurred while fetching testimonial:', isError);
        // testimonial = {};
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
		if (testimonialId === 'new') {
			reset(TestimonialModel({}));
		}
	}, [testimonialId, reset]);

	useEffect(() => {
		if (testimonial) {
			if (testimonial.images === undefined) {
				testimonial.images = [testimonial?.thumbnail];
			}

			if (testimonial.videos === undefined) {
				testimonial.videos = [testimonial?.video];
			}
			
			
			reset({ ...testimonial });
		}
	}, [testimonial, reset]);

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
	 * Show Message if the requested testimonials is not exists
	 */
	if (isError && testimonialId !== 'new') {
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
					There is no such Testimonial!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/testimonials"
					color="inherit"
				>
					Go to Testimonial Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while testimonial data is loading and form is setted
	 */
	if (_.isEmpty(form) || (testimonial && routeParams.testimonialId !== testimonial.id && routeParams.testimonialId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<TestimonialHeader />}
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
								label="Medias"
							/>
							
						</Tabs>
						<div className="">
							<div className={tabValue !== 'basic-info' ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							<div className={tabValue !== 'images' ? 'hidden' : ''}>
								<TestimonialImagesTab />
							</div>
						</div>
					</div>
				}
				scroll={isMobile ? 'page' : 'content'}
			/>
		</FormProvider>
	);
}

export default Testimonial;
