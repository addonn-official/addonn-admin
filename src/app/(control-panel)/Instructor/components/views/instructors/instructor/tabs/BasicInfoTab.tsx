import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { Instructor } from '../../../../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import FuseUtils from '@fuse/utils';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import { useState } from 'react';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
    const methods = useFormContext();
    const { control, formState, watch } = methods;
    const { errors } = formState;
    const [isEditing, setIsEditing] = useState(false);
    const instructorData = watch();

    return (
        <div className="flex flex-col gap-4">
            {/* Name header with edit/done toggle button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {instructorData?.name || 'Instructor'}
                </Typography>
                <IconButton
                    onClick={() => setIsEditing(!isEditing)}
                    color={isEditing ? 'success' : 'primary'}
                    size="small"
                >
                    {isEditing ? <DoneIcon /> : <EditIcon />}
                </IconButton>
            </Box>

            {isEditing ? (
                <>
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
                                />
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="display_name"
                        control={control}
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel htmlFor="name">Display Name</FormLabel>
                                <TextField
                                    id="name"
                                    {...field}
                                    required
                                    autoFocus
                                    fullWidth
                                    error={!!errors.display_name}
                                    helperText={errors?.display_name?.message as string}
                                />
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="bio"
                        control={control}
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel htmlFor="bio">Bio</FormLabel>
                                <TextField
                                    {...field}
                                    id="bio"
                                    type="text"
                                    multiline
                                    rows={3}
                                    fullWidth
                                    error={!!errors.bio}
                                    helperText={errors?.bio?.message as string}
                                />
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="number"
                        control={control}
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel htmlFor="number">Number</FormLabel>
                                <TextField
                                    id="number"
                                    {...field}
                                    type="text"
                                    fullWidth
                                    error={!!errors.number}
                                    helperText={errors?.number?.message as string}
                                />
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <TextField
                                    id="email"
                                    {...field}
                                    type="text"
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors?.email?.message as string}
                                />
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="short_description"
                        control={control}
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel htmlFor="short_description">Short Description</FormLabel>
                                <TextField
                                    id="short_description"
                                    {...field}
                                    type="text"
                                    multiline
                                    rows={2}
                                    fullWidth
                                    error={!!errors.short_description}
                                    helperText={errors?.short_description?.message as string}
                                />
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel htmlFor="subject">Subject</FormLabel>
                                <TextField
                                    id="subject"
                                    {...field}
                                    type="text"
                                    fullWidth
                                    error={!!errors.subject}
                                    helperText={errors?.subject?.message as string}
                                />
                            </FormControl>
                        )}
                    />

                    {/* Companies: allow multiple company entries, each with name + logo */}
                    <Controller
                        name="companies"
                        control={control}
                        defaultValue={[]}
                        render={({ field: { onChange, value } }) => {
                            const companies: { id: string; name?: string; logo?: any }[] = Array.isArray(value) ? value : [];
                            const handleAdd = () => onChange([...companies, { id: FuseUtils.generateGUID(), name: '', logo: null }]);
                            const handleRemove = (index: number) => onChange(companies.filter((_, i) => i !== index));
                            const handleNameChange = (index: number, name: string) => {
                                const next = companies.map((c, i) => (i === index ? { ...c, name } : c));
                                onChange(next);
                            };
                            const handleLogoChange = async (index: number, file?: File) => {
                                if (!file) return;
                                const readFileAsync = () =>
                                    new Promise<any>((resolve, reject) => {
                                        const reader = new FileReader();
                                        reader.onload = () =>
                                            resolve({
                                                id: FuseUtils.generateGUID(),
                                                binary: reader.result,
                                                url: URL.createObjectURL(file),
                                                name: file.name,
                                                mimeType: file.type
                                            });
                                        reader.onerror = reject;
                                        reader.readAsArrayBuffer(file);
                                    });
                                const logoObj = await readFileAsync();
                                const next = companies.map((c, i) => (i === index ? { ...c, logo: logoObj } : c));
                                onChange(next);
                            };

                            return (
                                <FormControl className="w-full">
                                    <FormLabel>Companies</FormLabel>
                                    <Box className="flex flex-col gap-2">
                                        {companies.map((c, i) => (
                                            <Box key={c.id} className="flex items-center gap-2">
                                                <label>
                                                    <input
                                                        accept="image/*"
                                                        type="file"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleLogoChange(i, e.target.files?.[0])}
                                                    />
                                                    <Tooltip title="Upload logo">
                                                        <Avatar src={c.logo?.url} alt={c.name || 'logo'} sx={{ width: 48, height: 48, cursor: 'pointer' }} />
                                                    </Tooltip>
                                                </label>
                                                <TextField
                                                    placeholder="Company name"
                                                    value={c.name || ''}
                                                    onChange={(e) => handleNameChange(i, e.target.value)}
                                                    size="small"
                                                    sx={{ flex: 1 }}
                                                />
                                                <IconButton size="small" onClick={() => handleRemove(i)} aria-label="remove company">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        ))}
                                        <Box className="flex items-center gap-2" onClick={handleAdd} sx={{ cursor: 'pointer' }}>
                                            <IconButton size="small"  aria-label="add company">
                                                <AddCircleOutlineIcon />
                                            </IconButton>
                                            <Typography variant="body2">Add company</Typography>
                                        </Box>
                                    </Box>
                                </FormControl>
                            );
                        }}
                    />
                </>
            ) : (
                <>
                    {/* Read-only display mode */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>Display Name:</Typography>
                        <Typography variant="body2">{instructorData?.display_name || '-'}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.5, borderBottom: '1px solid', borderColor: 'divider', alignItems: 'flex-start' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>Bio:</Typography>
                        <Typography variant="body2" sx={{ maxWidth: '60%' }}>{instructorData?.bio || '-'}</Typography>
                    </Box>

                    {/* Companies display in read-only mode */}
                    <Box sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary', mb: 1 }}>Companies:</Typography>
                        <Box className="flex flex-col gap-2">
                            {Array.isArray(instructorData?.companies) && instructorData.companies.length > 0 ? (
                                instructorData.companies.map((c: any) => (
                                    <Box key={c.id} className="flex items-center gap-2">
                                        {c.logo?.url && <Avatar src={c.logo.url} alt={c.name || 'logo'} sx={{ width: 40, height: 40 }} />}
                                        <Typography variant="body2">{c.name || '-'}</Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">No companies added</Typography>
                            )}
                        </Box>
                    </Box>
                </>
            )}
        </div>
    );
}

export default BasicInfoTab;
