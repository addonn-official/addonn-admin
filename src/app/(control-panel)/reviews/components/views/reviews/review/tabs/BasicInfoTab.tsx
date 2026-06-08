import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { Review } from '../../../../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useProducts } from '@/app/(control-panel)/course/api/hooks/products/useProducts';
import { MenuItem, Select } from '@mui/material';
/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	let { data: courses = [], isLoading, error } = useProducts();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="name">User Name</FormLabel>
						<TextField
							id="name"
							{...field}
							required
							autoFocus
							fullWidth
							error={!!errors.name}
							helperText={errors?.name?.message as string}
						/>
					</FormControl>
				)}
			/>

			{/* Course course (Multi-Select) */}
			<Controller
				name="courses"
				control={control}
				defaultValue={[formState.defaultValues?.data?.id]}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel>Course</FormLabel>
						<Select
							{...field}
							// multiple
							fullWidth
							value={field.value || []}
							onChange={(event) => field.onChange(event.target.value)}
						>
							{
								courses.map((course: any) => (
									<MenuItem key={course.id} value={course.id}>
										{course.title}
									</MenuItem>
								))
							}


						</Select>
					</FormControl>
				)}
			/>


			<Controller
				name="rating"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="rating">Rating</FormLabel>
						<TextField
							id="rating"
							{...field}
							required
							autoFocus
							fullWidth
							error={!!errors.rating}
							helperText={errors?.rating?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="review"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="review">Review</FormLabel>
						<TextField
							{...field}
							id="review"
							type="text"
							multiline
							rows={3}
							fullWidth
							error={!!errors.review}
							helperText={errors?.review?.message as string}
						/>
					</FormControl>
				)}
			/>




		</div>
	);
}

export default BasicInfoTab;
