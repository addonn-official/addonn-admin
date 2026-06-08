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
import OrderHeader from '../../../ui/orders/OrderHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import OrderImagesTab from './tabs/OrderImagesTab';
import { useOrder } from '../../../../api/hooks/orders/useOrder';
import OrderModel from '../../../../api/models/OrderModel';
import { Tabs, Tab } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a order name').min(5, 'The order name must be at least 5 characters')
});

/**
 * The order page.
 */
function Order() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();
	
	const { orderId } = routeParams as { orderId: string };
	const orderIdForFetch = orderId === 'new' ? undefined : orderId;

	let { data: order, isLoading, isError } = useOrder(orderIdForFetch);

	console.log('Order:', order);
	if (isError) {
        console.error('An error has occurred while fetching order:', isError);
        // order = {};
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
		if (orderId === 'new') {
			reset(OrderModel({}));
		}
	}, [orderId, reset]);

	useEffect(() => {
		if (order) {
			if (order.images === undefined) {
				order.images = [order?.file];
			}
			
			
			reset({ ...order });
		}
	}, [order, reset]);

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
	 * Show Message if the requested orders is not exists
	 */
	if (isError && orderId !== 'new') {
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
					There is no such Order!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/orders"
					color="inherit"
				>
					Go to Order Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while order data is loading and form is setted
	 */
	if (_.isEmpty(form) || (order && routeParams.orderId !== order.id && routeParams.orderId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<OrderHeader />}
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
								<OrderImagesTab />
							</div> */}
						</div>
					</div>
				}
				scroll={isMobile ? 'page' : 'content'}
			/>
		</FormProvider>
	);
}

export default Order;
