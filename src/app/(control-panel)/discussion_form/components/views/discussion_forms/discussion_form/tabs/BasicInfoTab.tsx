import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { DiscussionForm } from '../../../../../api/types';
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
				name="value"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="value">Value</FormLabel>
						<TextField
							id="value"
							{...field}
							type="number"
							required
							autoFocus
							fullWidth
							error={!!errors.value}
							helperText={errors?.value?.message as string}
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
				name="max_uses"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="max_uses">Max Uses</FormLabel>
						<TextField
							{...field}
							id="max_uses"
							type="number"
							fullWidth
							error={!!errors.max_uses}
							helperText={errors?.max_uses?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="max_uses_per_user"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="max_uses_per_user">Max Uses Per User</FormLabel>
						<TextField
							{...field}
							id="max_uses_per_user"
							type="number"
							fullWidth
							error={!!errors.max_uses_per_user}
							helperText={errors?.max_uses_per_user?.message as string}
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
