import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

function CountersTab() {
	const methods = useFormContext();
	const { control } = methods;

	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="rating_count"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="rating_count">Rating counter</FormLabel>
						<TextField
							id="rating_count"
							{...field}
							type="number"
							fullWidth
						/>
					</FormControl>
				)}
			/>
			
			<Controller
				name="review_count"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="review_count">Review counter</FormLabel>
						<TextField
							id="review_count"
							{...field}
							type="number"
							fullWidth
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="students_taught"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="students_taught">Student taught counter</FormLabel>
						<TextField
							id="students_taught"
							{...field}
							type="number"
							fullWidth
						/>
					</FormControl>
				)}
			/>

			

			<Controller
				name="average_rating"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="average_rating">Average Actual Rating</FormLabel>
						<TextField
							{...field}
							id="average_rating"
							type="number"
							fullWidth
							// helperText="Add a compare price to show next to the real price"
						/>
					</FormControl>
				)}
			/>
		</div>
	);
}

export default CountersTab;
