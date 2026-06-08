import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { Testimonial } from '../../../../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { FormControlLabel, Radio, RadioGroup, Checkbox } from '@mui/material';
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
	console.log(formState)

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

            <Controller
                name="courses"
                control={control}
                defaultValue={[formState.defaultValues?.course?.id]}
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel>Course</FormLabel>
                        <Select
                            {...field}
                            fullWidth
                            value={field.value || []}
                            onChange={(event) => field.onChange(event.target.value)}
                        >
                            {courses.map((course: any) => (
                                <MenuItem key={course.id} value={course.id}>
                                    {course.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            />

			{/* Input for review */}
            <Controller
                name="review"
                control={control}
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel htmlFor="review">Review</FormLabel>
                        <TextField
                            id="review"
                            {...field}
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

			<Controller
                name="script"
                control={control}
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel htmlFor="script">Script</FormLabel>
                        <TextField
                            id="script"
                            {...field}
                            type="text"
                            multiline
                            rows={3}
                            fullWidth
                            error={!!errors.script}
                            helperText={errors?.script?.message as string}
                        />
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

            {/* Checkbox for is_home */}
            <Controller
                name="is_home"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                    <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Show on Home Page"
                    />
                )}
            />

            
        </div>
    );
}

export default BasicInfoTab;
