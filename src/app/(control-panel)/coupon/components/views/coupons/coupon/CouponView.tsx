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
import CouponHeader from '../../../ui/coupons/CouponHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import { useCoupon } from '../../../../api/hooks/coupons/useCoupon';
import CouponModel from '../../../../api/models/CouponModel';

/**
 * Form Validation Schema
 */
const schema = z.object({
	code: z.string().nonempty('You must enter a coupon code').min(5, 'The coupon code must be at least 5 characters')
});

/**
 * The coupon page.
 */
function Coupon() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();
	
	const { couponId } = routeParams as { couponId: string };
	const couponIdForFetch = couponId === 'new' ? undefined : couponId;

	let { data: coupon, isLoading, isError } = useCoupon(couponIdForFetch);

	if (isError) {
        console.error('An error has occurred while fetching coupon:', isError);
        // coupon = {};
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
		if (couponId === 'new') {
			reset(CouponModel({}));
		}
	}, [couponId, reset]);

	useEffect(() => {
		if (coupon) {
			
			reset({ ...coupon });
		}
	}, [coupon, reset]);

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
	 * Show Message if the requested coupons is not exists
	 */
	if (isError && couponId !== 'new') {
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
					There is no such Coupon!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/coupons"
					color="inherit"
				>
					Go to Coupon Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while coupon data is loading and form is setted
	 */
	if (_.isEmpty(form) || (coupon && routeParams.couponId !== coupon.id && routeParams.couponId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<CouponHeader />}
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

export default Coupon;
