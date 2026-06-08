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
import ProductHeader from '../../../ui/products/ProductHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import ContentTab from './tabs/ContentTab';
import SettingTab from './tabs/SettingsTab';
import ProductImagesTab from './tabs/ProductImagesTab';
import ShippingTab from './tabs/RatingsTab';
import { useProduct } from '../../../../api/hooks/products/useProduct';
import ProductModel from '../../../../api/models/ProductModel';
import { Tabs, Tab } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().nonempty('You must enter a course name').min(5, 'The course name must be at least 5 characters')
});

/**
 * The product page.
 */
function Product() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();

	const { productId } = routeParams as { productId: string };

	// let { data: product, isLoading, isError } = useProduct(productId);
	const productIdForFetch = productId === 'new' ? undefined : productId;
    const productQuery = useProduct(productIdForFetch);
    let { data: product, isLoading, isError } = productQuery || { data: undefined, isLoading: false, isError: false };
 
	if (isError) {
        console.error('An error has occurred while fetching course:', isError);
        // product = {};
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
		if (productId === 'new') {
			reset(ProductModel({}));
		}
	}, [productId, reset]);

	useEffect(() => {
		if (product) {
			if (product.images === undefined) {
				product.images = [product?.file];
			}
			if (product.instructors) {
				product.instructors = product.instructors?.filter((i:any) => i?.id);
				product.instructors = product.instructors?.map((i:any) => i?.id);
			}
			if (product.introVideos) {
				product.intro_videos = product.introVideos
			}
			console.log('Resetting form with product:', product);
			reset({ ...product });
		}
	}, [product?.id, reset]);

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
	 * Show Message if the requested products is not exists
	 */
	if (isError && productId !== 'new') {
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
					There is no such Course!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/products"
					color="inherit"
				>
					Go to Course Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (_.isEmpty(form) || (product && routeParams.productId !== product.id && routeParams.productId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<ProductHeader />}
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
								value="settings"
								label="Settings"
							/>
							<Tab
								value="rating"
								label="Rating Counters"
							/>
							{productId !== 'new' && <Tab
								value="content"
								label="Content"
							/>}
						</Tabs>
						<div className="">
							<div className={tabValue !== 'basic-info' ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							<div className={tabValue !== 'images' ? 'hidden' : ''}>
								<ProductImagesTab />
							</div>

							<div className={tabValue !== 'settings' ? 'hidden' : ''}>
								<SettingTab />
							</div>

							
							<div className={tabValue !== 'rating' ? 'hidden' : ''}>
								<ShippingTab />
							</div>

							{productId !== 'new' && <div className={tabValue !== 'content' ? 'hidden' : ''}>
								<ContentTab 
								courseTopics={product?.topics || []}
								courseId={productId}/>
								
							</div>}
						</div>
					</div>
				}
				scroll={isMobile ? 'page' : 'content'}
			/>
		</FormProvider>
	);
}

export default Product;
