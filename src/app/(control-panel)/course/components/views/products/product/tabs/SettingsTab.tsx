import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';
import { useInstructors } from '../../../../../../Instructor/api/hooks/instructors/useInstructors';
import { Stack } from '@mui/material';

function SettingTab() {
    const methods = useFormContext();
    const { control } = methods;

    function toBoolean(value) {
        if (typeof value === "string") {
            return value.toLowerCase() === "true";
        }
        return Boolean(value);
    }

    // Watchers for conditional rendering
    const status = useWatch({ control, name: 'status' });
    const contentDrip = useWatch({ control, name: 'is_content_drip_enabled' });
    const moneyBackGuarantee = useWatch({ control, name: 'has_money_back_guarantee' });
    const is_user_limit_enabled = useWatch({ control, name: 'is_user_limit_enabled' });
    const is_live = useWatch({ control, name: 'is_live' });
    const course_type = useWatch({ control, name: 'course_type' });
    const validity_unit = useWatch({ control, name: 'validity_unit' });


    let { data: instructorsList = [], isLoading, error } = useInstructors();

    return (

        <div className="flex flex-col gap-4">
            {/* Course Status */}
            <Controller
                name="status"
                control={control}
                defaultValue="false"
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel>Course Status</FormLabel>
                        <RadioGroup {...field} row>
                            <FormControlLabel value="true" control={<Radio />} label="Active" />
                            <FormControlLabel value="false" control={<Radio />} label="Coming Soon" />
                        </RadioGroup>
                    </FormControl>
                )}
            />

            {/* Show all fields only if the course is Active */}
            {toBoolean(status) && (
                <>
                    {/* Limit to no. of users */}
                    <Controller
                        name="is_user_limit_enabled"
                        control={control}
                        defaultValue="false"
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Limit to no. of users</FormLabel>
                                <RadioGroup {...field} row>
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        )}
                    />

                    {/* Numeric Counter for Number of Users */}
                    {toBoolean(is_user_limit_enabled) && (
                        <Controller
                            name="user_limit"
                            control={control}
                            render={({ field }) => (
                                <FormControl className="w-full">
                                    <FormLabel>Number of Users</FormLabel>
                                    <TextField {...field} type="number" fullWidth />
                                </FormControl>
                            )}
                        />
                    )}

                    {/* Difficulty Level */}
                    <Controller
                        name="difficulty_level"
                        control={control}
                        defaultValue="all_levels"
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Difficulty Level</FormLabel>
                                <Select {...field} fullWidth>
                                    <MenuItem value="all_levels">All levels</MenuItem>
                                    <MenuItem value="beginner">Beginner</MenuItem>
                                    <MenuItem value="intermediate">Intermediate</MenuItem>
                                    <MenuItem value="advance">Advance</MenuItem>
                                    <MenuItem value="expert">Expert</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />

                    {/* Content Drip */}
                    <Controller
                        name="is_content_drip_enabled"
                        control={control}
                        defaultValue="false"
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Content Drip</FormLabel>
                                <RadioGroup {...field} row>
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        )}
                    />

                    {/* Content Drip Basis */}
                    {contentDrip === 'true' && (
                        <Controller
                            name="content_drip_basis"
                            control={control}
                            defaultValue="Course Completion"
                            render={({ field }) => (
                                <FormControl className="w-full">
                                    <FormLabel>Content Drip Basis</FormLabel>
                                    <Select {...field} fullWidth>
                                        <MenuItem value="Course Completion">Course Completion</MenuItem>
                                        <MenuItem value="Calendar">Calendar</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                    )}

                    {/* Number of Lectures */}
                    <Controller
                        name="number_of_lectures"
                        control={control}
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Number of Lectures</FormLabel>
                                <TextField {...field} type="number" fullWidth />
                            </FormControl>
                        )}
                    />






                    {/* Course Duration */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Controller
                            name="duration"
                            control={control}
                            render={({ field }) => (
                                <FormControl style={{ flex: 1 }}>
                                    <FormLabel>Course Duration</FormLabel>
                                    <TextField
                                        {...field}
                                        placeholder="Hours Minutes"
                                        fullWidth
                                    >
                                    </TextField>
                                </FormControl>
                            )}
                        />

                        {/* <Controller
                            name="duration_minutes"
                            control={control}
                            render={({ field }) => (
                                <FormControl style={{ flex: 1 }}>
                                    <FormLabel style={{ visibility: 'hidden' }}>Minutes</FormLabel>
                                    <TextField
                                        {...field}
                                        // select
                                        type="number"
                                        label="Minutes"
                                        fullWidth
                                        SelectProps={{ native: true }}
                                    >
                                        
                                    </TextField>
                                </FormControl>
                            )}
                        /> */}
                    </div>



                    {/* Course Instructor (Multi-Select) */}
                    <Controller
                        name="instructors"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Course Instructor / Tutor</FormLabel>
                                <Select
                                    {...field}
                                    multiple
                                    fullWidth
                                    value={field.value || []}
                                    onChange={(event) => field.onChange(event.target.value)}
                                >
                                    {
                                        instructorsList && Array.isArray(instructorsList?.data) &&
                                            instructorsList?.data?.map((instructor: any) => (
                                                <MenuItem key={instructor.id} value={instructor.id}>
                                                    {instructor.name}
                                                </MenuItem>
                                            ))

                                        
                                    }


                                </Select>
                            </FormControl>
                        )}
                    />

                    {/* Money Back Guarantee */}
                    <Controller
                        name="has_money_back_guarantee"
                        control={control}
                        defaultValue="false"
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Money Back Guarantee</FormLabel>
                                <RadioGroup {...field} row>
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        )}
                    />

                    {/* Money Back Guarantee Counter */}
                    {moneyBackGuarantee === 'true' && (
                        <Controller
                            name="money_back_guarantee_period"
                            control={control}
                            render={({ field }) => (
                                <FormControl className="w-full">
                                    <FormLabel>Money Back Guarantee Counter</FormLabel>
                                    <TextField {...field} type="number" fullWidth />
                                </FormControl>
                            )}
                        />
                    )}

                    {/* Course Validity */}
                    {/* <Controller
                        name="validity_period"
                        control={control}
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Course Validity (Months/Years)</FormLabel>
                                <TextField {...field} fullWidth />
                            </FormControl>
                        )}
                    /> */}

                    {/* Course Live/Recorded */}
                    <Controller
                        name="is_live"
                        control={control}
                        defaultValue="false"
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Course Live/Recorded</FormLabel>
                                <RadioGroup {...field} row>
                                    <FormControlLabel value="true" control={<Radio />} label="Live" />
                                    <FormControlLabel value="false" control={<Radio />} label="Recorded" />
                                </RadioGroup>
                            </FormControl>
                        )}
                    />


                    {toBoolean(is_live) && (
                        <>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <Controller
                                    name="start_date"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <FormControl fullWidth>
                                            <FormLabel>Batch Start Date</FormLabel>
                                            <DatePicker
                                                value={field.value instanceof Date ? field.value : field.value ? new Date(field.value) : null}

                                                onChange={(newValue) => {
                                                    if (newValue) {
                                                        const formattedDate = format(newValue, 'yyyy-MM-dd');
                                                        field.onChange(formattedDate);
                                                    } else {
                                                        field.onChange(null);
                                                    }
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        name: field.name,
                                                        onBlur: field.onBlur, // Important for touched state
                                                        fullWidth: true,
                                                        error: !!fieldState.error,
                                                        helperText: fieldState.error?.message,
                                                    },
                                                }}
                                            />
                                        </FormControl>
                                    )}
                                />
                            </LocalizationProvider>

                        </>
                    )}

                    {!toBoolean(is_live) && <Stack direction="row" spacing={2} alignItems="flex-end">

                        {validity_unit !== 'unlimited' && (
                            <Controller
                                name="validity_duration"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel>Validity Duration</FormLabel>
                                        <TextField {...field} />
                                    </FormControl>
                                )}
                            />
                        )}
                        <Controller
                            name="validity_unit"
                            control={control}
                            defaultValue={'month'}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <FormLabel>Validity Unit</FormLabel>
                                    <Select {...field}>
                                        {['day', 'week', 'month', 'year', 'unlimited'].map((m) => (
                                            <MenuItem key={m} value={m}>{m}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Stack>
                    }


                    <Controller
                        name="is_comment_enabled"
                        control={control}
                        defaultValue="false"
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Enable comment</FormLabel>
                                <RadioGroup {...field} row>
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        )}
                    />

                    <Controller
                        name="is_certificate_enabled"
                        control={control}
                        defaultValue="false"
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Enable Certificate</FormLabel>
                                <RadioGroup {...field} row>
                                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="false" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        )}
                    />


                    {/* Course Type */}
                    <Controller
                        name="course_type"
                        control={control}
                        defaultValue="paid"
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Course Type</FormLabel>
                                <RadioGroup {...field} row>
                                    <FormControlLabel value="paid" control={<Radio />} label="Paid" />
                                    <FormControlLabel value="free" control={<Radio />} label="Free" />
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                    {/* Course Actual Price */}
                    {course_type == 'paid' && <Controller
                        name="actual_price"
                        control={control}
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Course Actual Price</FormLabel>
                                <TextField {...field} type="number" fullWidth />
                            </FormControl>
                        )}
                    />}

                    {/* Course Discounted Price */}
                    {course_type == 'paid' && <Controller
                        name="discounted_price"
                        control={control}
                        render={({ field }) => (
                            <FormControl className="w-full">
                                <FormLabel>Course Discounted Price</FormLabel>
                                <TextField {...field} type="number" fullWidth />
                            </FormControl>
                        )}
                    />}
                </>
            )}
        </div>

    );
}

export default SettingTab;
