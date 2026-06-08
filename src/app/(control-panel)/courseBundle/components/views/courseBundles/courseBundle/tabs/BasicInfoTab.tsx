import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { CourseBundle } from '../../../../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useEffect, useRef, useState } from 'react';
import JoditEditor from 'jodit-react';
import { useProducts } from '@/app/(control-panel)/course/api/hooks/products/useProducts';
import { FormControlLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;
	let { data: courses = [], isLoading, error } = useProducts();
	const joditConfig = useRef({
		readonly: false,
		toolbar: true,
		placeholder: 'Enter rich text...',
		uploader: { insertImageAsBase64URI: true }
	});

	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="name">Bundle Name</FormLabel>
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

			{/* description (rich text) */}
			<Controller
				name="description"
				control={control}
				render={({ field }) => {
					const [local, setLocal] = useState<string>(field.value ?? '');
					useEffect(() => setLocal(field.value ?? ''), [field.value]);
					return (
						<FormControl className="w-full">
							<FormLabel htmlFor="description">Description</FormLabel>
							<JoditEditor
								value={local}
								config={joditConfig.current}
								onBlur={(val: string) => {
									setLocal(val);
									field.onChange(val);
								}}
							/>
							{errors?.description && (
								<p style={{ color: '#d32f2f', marginTop: 6 }}>{errors.description.message as string}</p>
							)}
						</FormControl>
					);
				}}
			/>
			{/* Course course (Multi-Select) */}
			<Controller
				name="courses"
				control={control}
				defaultValue={[]}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel>Course</FormLabel>
						<Select
							{...field}
							multiple
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
				name="price"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel>Course Actual Price</FormLabel>
						<TextField {...field} type="number" fullWidth />
					</FormControl>
				)}
			/>

			<Controller
				name="discounted_price"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel>Course Discounted Price</FormLabel>
						<TextField {...field} type="number" fullWidth />
					</FormControl>
				)}
			/>

				<Controller
                name="status"
                control={control}
                defaultValue="false"
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel>Course Status</FormLabel>
                        <RadioGroup {...field} row>
                            <FormControlLabel value="true" control={<Radio />} label="Enable" />
                            <FormControlLabel value="false" control={<Radio />} label="Disable" />
                        </RadioGroup>
                    </FormControl>
                )}
            />

		</div>
	);
}

export default BasicInfoTab;
