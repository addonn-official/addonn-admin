import React, { useRef, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Product } from '../../../../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import JoditEditor from 'jodit-react';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Select from '@mui/material/Select';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
    const methods = useFormContext();
    const { control, formState } = methods;
    const { errors } = formState;

    const joditConfig = useRef({
        readonly: false,
        toolbar: true,
        placeholder: 'Enter rich text...',
        uploader: { insertImageAsBase64URI: true }
    });
    const courseLanguage = useWatch({ control, name: 'language' });
    console.log(useWatch({ control, name: 'prerequisites' }))

    return (
        <div className="flex flex-col gap-4">
            <Controller
                name="title"
                control={control}
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel htmlFor="title">Course Title</FormLabel>
                        <TextField
                            id="title"
                            {...field}
                            required
                            autoFocus
                            fullWidth
                            error={!!errors.title}
                            helperText={errors?.title?.message as string}
                        />
                    </FormControl>
                )}
            />

            {/* Short description (rich text) */}
            <Controller
                name="short_description"
                control={control}
                render={({ field }) => {
                    const [local, setLocal] = useState<string>(field.value ?? '');
                    useEffect(() => setLocal(field.value ?? ''), [field.value]);
                    return (
                        <FormControl className="w-full">
                            <FormLabel htmlFor="short_description">Short Description</FormLabel>
                            <JoditEditor
                                value={local}
                                config={joditConfig.current}
                                onBlur={(val: string) => {
                                    setLocal(val);
                                    field.onChange(val);
                                }}
                            />
                            {errors?.short_description && (
                                <p style={{ color: '#d32f2f', marginTop: 6 }}>{errors.short_description.message as string}</p>
                            )}
                        </FormControl>
                    );
                }}
            />

            {/* Long description (rich text) */}
            <Controller
                name="long_description"
                control={control}
                render={({ field }) => {
                    const [local, setLocal] = useState<string>(field.value ?? '');
                    useEffect(() => setLocal(field.value ?? ''), [field.value]);
                    return (
                        <FormControl className="w-full">
                            <FormLabel htmlFor="long_description">Long Description</FormLabel>
                            <JoditEditor
                                value={local}
                                config={joditConfig.current}
                                onBlur={(val: string) => {
                                    setLocal(val);
                                    field.onChange(val);
                                }}
                            />
                            {errors?.long_description && (
                                <p style={{ color: '#d32f2f', marginTop: 6 }}>{errors.long_description.message as string}</p>
                            )}
                        </FormControl>
                    );
                }}
            />

            <Controller
                name="categories"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                    <FormControl className="w-full">
                        <FormLabel htmlFor="categories">Categories</FormLabel>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            getOptionLabel={(option: any) => {
                                if (typeof option === 'string') return option;
                                return (option && (option.name || option.label)) || String(option || '');
                            }}
                            value={value as Product['categories']}
                            onChange={(event, newValue) => {
                                // normalize to plain strings before storing in form
                                const normalized = newValue
                                    .map(item => {
                                        if (!item && item !== 0) return null;
                                        if (typeof item === 'string') return item.trim();
                                        if (typeof item === 'object') return (item.name ?? item.label ?? String(item));
                                        return String(item);
                                    })
                                    .filter(Boolean);
                                onChange(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Select multiple categories"
                                    id="categories"
                                />
                            )}
                        />
                    </FormControl>
                )}
            />

            <Controller
                name="tags"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => (
                    <FormControl className="w-full">
                        <FormLabel htmlFor="tags">Tags</FormLabel>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={[]}
                            getOptionLabel={(option: any) => {
                                if (typeof option === 'string') return option;
                                return (option && (option.name || option.label)) || String(option || '');
                            }}
                            value={value as Product['tags']}
                            onChange={(event, newValue) => {
                                const normalized = newValue
                                    .map(item => {
                                        if (!item && item !== 0) return null;
                                        if (typeof item === 'string') return item.trim();
                                        if (typeof item === 'object') return (item.name ?? item.label ?? String(item));
                                        return String(item);
                                    })
                                    .filter(Boolean);
                                onChange(normalized);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Select multiple tags"
                                />
                            )}
                        />
                    </FormControl>
                )}
            />

            {/* Course Intro Videos (multiple) */}
            <Controller
                name="intro_videos"
                control={control}
                defaultValue={[]}
                render={({ field: { onChange, value } }) => {
                    // console.log('Intro videos value:', value);
                    const videos: { platform?: string; url?: string }[] = Array.isArray(value) ? value : [];
                    // console.log(videos)
                    const handleUpdate = (index: number, patch: Partial<{ platform: string; url: string }>) => {
                        const next = videos.map((v, i) => (i === index ? { ...v, ...patch } : v));
                        onChange(next);
                    };

                    const handleAdd = () => {
                        onChange([...videos, { platform: 'youtube', url: '' }]);
                    };

                    const handleRemove = (index: number) => {
                        onChange(videos.filter((_, i) => i !== index));
                    };

                    return (
                        <FormControl className="w-full">
                            <FormLabel>Course Intro Videos</FormLabel>
                            {videos.map((v, i) => (
                                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                                    <Select
                                        value={v.platform || 'youtube'}
                                        onChange={(e) => handleUpdate(i, { platform: e.target.value as string })}
                                        sx={{ minWidth: 160 }}
                                    >
                                        <MenuItem value="youtube">YouTube</MenuItem>
                                        <MenuItem value="vimeo">Vimeo</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>

                                    <TextField
                                        placeholder="Video URL"
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
                                Add Intro Video
                            </Button>
                        </FormControl>
                    );
                }}
            />

            <Controller
                name="language"
                control={control}
                defaultValue="hindi"
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel>Course Language</FormLabel>
                        <RadioGroup {...field} row>
                            <FormControlLabel value="hindi" control={<Radio />} label="Hindi" />
                            <FormControlLabel value="english" control={<Radio />} label="English" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                        </RadioGroup>
                    </FormControl>
                )}
            />
            {/* If user selects 'Other', show text input to specify language */}
            {courseLanguage === 'other' && (
                <Controller
                    name="courseLanguageOther"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <FormControl className="w-full">
                            <FormLabel>Please specify language</FormLabel>
                            <TextField {...field} fullWidth />
                        </FormControl>
                    )}
                />
            )}

            {/* Course Prerequisites */}
            <Controller
                name="prerequisites"
                control={control}
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel>Course Prerequisites</FormLabel>
                        <TextField {...field} fullWidth type="text"
                            multiline
                            rows={3}

                            helperText="Enter for per line" />
                    </FormControl>
                )}
            />

            {/* Course Benefits */}
            <Controller
                name="benefits"
                control={control}
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel>Course Benefits</FormLabel>
                        <TextField
                            {...field}
                            type="text"
                            multiline
                            rows={3}
                            fullWidth
                            helperText="Enter for per line"
                        />
                    </FormControl>
                )}
            />

            {/* Course Targeted Audience */}
            <Controller
                name="target_audience"
                control={control}
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel>Course Targeted Audience</FormLabel>
                        <TextField {...field} fullWidth />
                    </FormControl>
                )}
            />


        </div>
    );
}

export default BasicInfoTab;
