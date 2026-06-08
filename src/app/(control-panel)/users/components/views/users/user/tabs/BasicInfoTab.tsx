import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { User } from '../../../../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Box, FormControlLabel, Radio, RadioGroup, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;
	const userDetail = watch();
	const [isEditingName, setIsEditingName] = useState(false);

	return (
		<div className="flex flex-col gap-4">
			{/* Name field - editable on button click */}
			{isEditingName ? (
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor="name">Name</FormLabel>
							<TextField
								id="name"
								{...field}
								required
								autoFocus
								fullWidth
								error={!!errors.name}
								helperText={errors?.name?.message as string}
								onBlur={() => setIsEditingName(false)}
							/>
						</FormControl>
					)}
				/>
			) : (
				<Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider', alignItems: 'center' }}>
					<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
						Name:
					</Typography>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Typography variant="body2">
							{userDetail?.name ? userDetail.name : '-'}
						</Typography>
						<IconButton
							size="small"
							onClick={() => setIsEditingName(true)}
							sx={{ p: 0.5 }}
						>
							<EditIcon fontSize="small" />
						</IconButton>
					</Box>
				</Box>
			)}

			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
						<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
							Email:
						</Typography>
						<Typography variant="body2">
							{userDetail?.email ? userDetail.email : '-'}
						</Typography>
					</Box>
				)}
			/>

			<Controller
				name="phone"
				control={control}
				render={({ field }) => (
					<Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
						<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
							Phone:
						</Typography>
						<Typography variant="body2">
							{userDetail?.phone ? userDetail.phone : '-'}
						</Typography>
					</Box>
				)}
			/>

			<Controller
				name="profession"
				control={control}
				render={({ field }) => (
					<Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
						<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
							Profession:
						</Typography>
						<Typography variant="body2">
							{userDetail?.profession ? userDetail.profession : '-'}
						</Typography>
					</Box>
				)}
			/>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
				<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
					University:
				</Typography>
				<Typography variant="body2">
					{userDetail?.university ? userDetail.university : '-'}
				</Typography>
			</Box>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
				<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
					Registration Date:
				</Typography>
				<Typography variant="body2">
					{userDetail?.created_at ? userDetail.created_at : '-'}
				</Typography>
			</Box>

			{/* <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
				<Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
					Status:
				</Typography>
				<Typography variant="body2">
					{userDetail?.status}
				</Typography>
			</Box> */}
			<Controller
				name="status"
				control={control}
				defaultValue="active"
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel>Status</FormLabel>
						<RadioGroup {...field} row>
							<FormControlLabel value="active" control={<Radio />} label="Active" />
							<FormControlLabel value="suspended" control={<Radio />} label="Suspended" />
						</RadioGroup>
					</FormControl>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
