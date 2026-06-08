import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { Coupon } from '../../../../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MenuItem, Select } from '@mui/material';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="code"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="code">Code</FormLabel>
						<TextField
							id="code"
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
				name="type"
				control={control}
				defaultValue={'percentage'}
				render={({ field }) => (

					<FormControl className="w-full">
						<FormLabel>Type</FormLabel>
						<Select {...field} fullWidth>
							{['fixed','percentage'].map((m) => (
								<MenuItem value={m}>{m}</MenuItem>
							))}
						</Select>

					</FormControl>
				)}
			/>

			<Controller
				name="discount"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="discount">Discount</FormLabel>
						<TextField
							id="discount"
							{...field}
							type="number"
							required
							autoFocus
							fullWidth
							error={!!errors.discount}
							helperText={errors?.discount?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="min_purchase"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="min_purchase">Min Purchase</FormLabel>
						<TextField
							{...field}
							id="min_purchase"
							type="number"
							fullWidth
							error={!!errors.min_purchase}
							helperText={errors?.min_purchase?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="uses_limit"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="max_uses">uses Limit</FormLabel>
						<TextField
							{...field}
							id="max_uses"
							type="number"
							fullWidth
							error={!!errors.uses_limit}
							helperText={errors?.uses_limit?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="user_limit"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="max_uses_per_user">User Limit</FormLabel>
						<TextField
							{...field}
							id="max_uses_per_user"
							type="number"
							fullWidth
							error={!!errors.user_limit}
							helperText={errors?.user_limit?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				control={control}
				name="starts_at"
				render={({ field: { value, onChange } }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="starts_at">Start Date</FormLabel>
						<DateTimePicker
							className="w-full"
							value={new Date(value)}
							onChange={(val) => {
								onChange(val.toISOString());
							}}
							slotProps={{
								textField: {
									id: 'starts_at',
									fullWidth: true,
									variant: 'outlined',
									size: 'small'
								},
								actionBar: {
									actions: ['clear', 'today']
								}
							}}
						/>
					</FormControl>
				)}
			/>

			<Controller
				control={control}
				name="expires_at"
				render={({ field: { value, onChange } }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="expires_at">Expiry Date</FormLabel>
						<DateTimePicker
							className="w-full"
							value={new Date(value)}
							onChange={(val) => {
								onChange(val.toISOString());
							}}
							slotProps={{
								textField: {
									id: 'expires_at',
									fullWidth: true,
									variant: 'outlined',
									size: 'small'
								},
								actionBar: {
									actions: ['clear', 'today']
								}
							}}
						/>
					</FormControl>
				)}
			/>


		</div>
	);
}

export default BasicInfoTab;
