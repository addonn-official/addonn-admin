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
import UserHeader from '../../../ui/users/UserHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
// import UserImagesTab from './tabs/UserImagesTab';
import CoursesPurchasedTab from './tabs/CoursesPurchasedTab';
import { useUser } from '../../../../api/hooks/users/useUser';
import UserModel from '../../../../api/models/UserModel';
import { Tabs, Tab } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a user name').min(5, 'The user name must be at least 5 characters')
});

/**
 * The user page.
 */
function User() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();
	
	const { userId } = routeParams as { userId: string };
	const userIdForFetch = userId === 'new' ? undefined : userId;

	let { data: user, isLoading, isError } = useUser(userIdForFetch);

	console.log('User:', user);
	if (isError) {
        console.error('An error has occurred while fetching user:', isError);
        // user = {};
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
		if (userId === 'new') {
			reset(UserModel({}));
		}
	}, [userId, reset]);

	useEffect(() => {
		if (user) {
			if (user.images === undefined) {
				user.images = [user?.file];
			}
			
			reset({ ...user });
		}
	}, [user, reset]);

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
	 * Show Message if the requested users is not exists
	 */
	if (isError && userId !== 'new') {
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
					There is no such User!
				</Typography>
				<Button
					className="mt-6"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/users"
					color="inherit"
				>
					Go to User Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while user data is loading and form is setted
	 */
	if (_.isEmpty(form) || (user && routeParams.userId !== user.id && routeParams.userId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<UserHeader />}
				content={
					<div className="flex flex-col gap-6 p-4 sm:p-6">
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
						>
							<Tab
								value="basic-info"
								label="Basic Info"
							/>
							{/* <Tab
								value="images"
								label="Images"
							/> */}
							
							<Tab
								value="courses-purchased"
								label="Courses Purchased"
							/>
						</Tabs>
						<div className="">
							<div className={tabValue !== 'basic-info' ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>

							{/* <div className={tabValue !== 'images' ? 'hidden' : ''}>
								<UserImagesTab />
							</div> */}

							<div className={tabValue !== 'courses-purchased' ? 'hidden' : ''}>
								<CoursesPurchasedTab />
							</div>
						</div>
					</div>
				}
				scroll={isMobile ? 'page' : 'content'}
			/>
		</FormProvider>
	);
}

export default User;
