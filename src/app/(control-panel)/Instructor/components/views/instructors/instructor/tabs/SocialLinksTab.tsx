import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

function SocialLinksTab() {
	const methods = useFormContext();
	const { control } = methods;

	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="social_links"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => {
					const slinks: { platform?: string; url?: string }[] = Array.isArray(value) ? value : [];

					const handleUpdate = (index: number, patch: Partial<{ platform: string; url: string }>) => {
						const next = slinks.map((v, i) => (i === index ? { ...v, ...patch } : v));
						onChange(next);
					};

					const handleAdd = () => {
						onChange([...slinks, { platform: 'youtube', url: '' }]);
					};

					const handleRemove = (index: number) => {
						onChange(slinks.filter((_, i) => i !== index));
					};

					return (
						<FormControl className="w-full">
							<FormLabel>Social Links</FormLabel>
							{slinks.map((v, i) => (
								<div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
									<Select
										value={v.platform}
										onChange={(e) => handleUpdate(i, { platform: e.target.value as string })}
										sx={{ minWidth: 160 }}
									>
										<MenuItem value="github">GitHub</MenuItem>
										<MenuItem value="portfolio">Portfolio</MenuItem>
										<MenuItem value="linkedin">LinkedIn</MenuItem>
										<MenuItem value="facebook">Facebook</MenuItem>
										<MenuItem value="instagram">Instagram</MenuItem>
									</Select>

									<TextField
										placeholder="Social URL"
										value={v.url || ''}
										onChange={(e) => handleUpdate(i, { url: e.target.value })}
										fullWidth
									/>

									<IconButton size="small" onClick={() => handleRemove(i)} aria-label="remove video">
										<DeleteIcon />
									</IconButton>
								</div>
							))}

							<Button size="small" startIcon={<AddCircleOutlineIcon />} onClick={handleAdd}>
								Add Social Links
							</Button>
						</FormControl>
					);
				}}
			/>

		</div>
	);
}

export default SocialLinksTab;
