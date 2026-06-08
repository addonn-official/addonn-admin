import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { Instructor } from '../../../../../api/types';

const Root = styled('div')(({ theme }) => ({
	'& .instructorImageFeaturedStar': {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
	},
	'& .instructorImageUpload': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	'& .instructorImageItem': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& .instructorImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& .instructorImageFeaturedStar': {
				opacity: 1
			},
			'&:hover .instructorImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

/**
 * The instructor images tab.
 */
function InstructorImagesTab() {
	const methods = useFormContext();
	const { control, watch } = methods;

	const images = watch('images') as Instructor['images'];
	
	return (
		<Root>
			<div className="-mx-3 flex flex-wrap sm:justify-center sm:justify-start">
				<Controller
					name="images"
					control={control}
					render={({ field: { onChange, value } }) => (
						<Box
							sx={(theme) => ({
								backgroundColor: lighten(theme.palette.background.default, 0.02),
								...theme.applyStyles('light', {
									backgroundColor: lighten(theme.palette.background.default, 0.2)
								})
							})}
							component="label"
							htmlFor="button-file"
							className="instructorImageUpload relative mx-3 mb-6 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg shadow-sm hover:shadow-lg"
						>
							<input
								accept="image/*"
								className="hidden"
								id="button-file"
								type="file"
								onChange={async (e) => {
									function readFileAsync() {
										return new Promise((resolve, reject) => {
											const file = e?.target?.files?.[0];

											if (!file) {
												return;
											}

											const reader = new FileReader();
											reader.onload = () => {
												// resolve({
												// 	id: FuseUtils.generateGUID(),
												// 	url: `data:${file.type};base64,${btoa(reader.result as string)}`,
												// 	type: 'image'
												// });
												resolve({
													id: FuseUtils.generateGUID(),
													binary: reader.result, // Binary data
													url: URL.createObjectURL(file), // Generate a URL for the file
													type: 'image',
													name: file.name,
													mimeType: file.type,
												
												});
											};
											reader.onerror = reject;
											reader.readAsArrayBuffer(file);
										});
									}

									const newImage = await readFileAsync();
									onChange([newImage, ...(value as Instructor['images'])]);
								}}
							/>
							<FuseSvgIcon
								size={32}
								color="action"
							>
								lucide:square-arrow-up
							</FuseSvgIcon>
						</Box>
					)}
				/>
				<Controller
					name="featuredImageId"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => {
						return (
							<>
								{images?.map((media) => (
									media && <Box
										sx={(theme) => ({
											backgroundColor: lighten(theme.palette.background.default, 0.02),
											...theme.applyStyles('light', {
												backgroundColor: lighten(theme.palette.background.default, 0.2)
											})
										})}
										onClick={() => onChange(media.id)}
										onKeyDown={() => onChange(media.id)}
										role="button"
										tabIndex={0}
										className={clsx(
											'productImageItem relative mx-3 mb-6 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-lg shadow-sm outline-hidden hover:shadow-lg',
											media?.id === value && 'featured'
										)}
										key={media?.id}
									>
										{/* <FuseSvgIcon className="productImageFeaturedStar">lucide:star</FuseSvgIcon> */}
										<img
											className="h-full w-auto max-w-none"
											src={media?.url}
											alt="Instructor Image"
										/>
									</Box>
								))}
							</>
						);
					}}
				/>
			</div>
		</Root>
	);
}

export default InstructorImagesTab;
