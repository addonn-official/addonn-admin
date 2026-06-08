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
import ReviewHeader from '../../../ui/reviews/ReviewHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import ReviewImagesTab from './tabs/ReviewImagesTab';
import { useReview } from '../../../../api/hooks/reviews/useReview';
import ReviewModel from '../../../../api/models/ReviewModel';
import { Tabs, Tab } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a review name').min(5, 'The review name must be at least 5 characters')
});

/**
 * The review page.
 */
function Review() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();
	
	const { reviewId } = routeParams as { reviewId: string };
	const reviewIdForFetch = reviewId === 'new' ? undefined : reviewId;

	let { data: review, isLoading, isError } = useReview(reviewIdForFetch);

	console.log('Review:', review);
	if (isError) {
        console.error('An error has occurred while fetching review:', isError);
        // review = {};
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
		if (reviewId === 'new') {
			reset(ReviewModel({}));
		}
	}, [reviewId, reset]);

	useEffect(() => {
		if (review) {
			if (review.images === undefined) {
				review.images = [review?.file];
			}
			
			
			reset({ ...review });
		}
	}, [review, reset]);

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
	 * Show Message if the requested reviews is not exists
	 */
	if (isError && reviewId !== 'new') {
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
					There is no such Review!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/reviews"
					color="inherit"
				>
					Go to Review Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while review data is loading and form is setted
	 */
	if (_.isEmpty(form) || (review && routeParams.reviewId !== review.id && routeParams.reviewId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ReviewHeader />}
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
								<ReviewImagesTab />
							</div>
						</div>
					</div>
				}
				scroll={isMobile ? 'page' : 'content'}
			/>
		</FormProvider>
	);
}

export default Review;
