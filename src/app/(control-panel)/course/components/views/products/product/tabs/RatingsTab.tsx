import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import Typography from '@mui/material/Typography';

/**
 * The shipping tab.
 */
function ShippingTab() {
    const methods = useFormContext();
    const { control } = methods;

    return (
        <div className="flex flex-col gap-4">
            <Typography variant="h6" className="font-semibold">
                Rating Input Form
            </Typography>

            {/* Input for 5-star rating */}
            <Controller
                name="five_star_ratings"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel htmlFor="five_star_ratings">5-Star Ratings</FormLabel>
                        <TextField
                            {...field}
                            id="five_star_ratings"
                            type="number"
                            placeholder="Enter number of 5-star ratings"
                            fullWidth
                        />
                    </FormControl>
                )}
            />

            {/* Input for 4-star rating */}
            <Controller
                name="four_star_ratings"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel htmlFor="four_star_ratings">4-Star Ratings</FormLabel>
                        <TextField
                            {...field}
                            id="four_star_ratings"
                            type="number"
                            placeholder="Enter number of 4-star ratings"
                            fullWidth
                        />
                    </FormControl>
                )}
            />

            {/* Input for 3-star rating */}
            <Controller
                name="three_star_ratings"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel htmlFor="three_star_ratings">3-Star Ratings</FormLabel>
                        <TextField
                            {...field}
                            id="three_star_ratings"
                            type="number"
                            placeholder="Enter number of 3-star ratings"
                            fullWidth
                        />
                    </FormControl>
                )}
            />

            {/* Input for 2-star rating */}
            <Controller
                name="two_star_ratings"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel htmlFor="two_star_ratings">2-Star Ratings</FormLabel>
                        <TextField
                            {...field}
                            id="two_star_ratings"
                            type="number"
                            placeholder="Enter number of 2-star ratings"
                            fullWidth
                        />
                    </FormControl>
                )}
            />

            {/* Input for 1-star rating */}
            <Controller
                name="one_star_ratings"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel htmlFor="one_star_ratings">1-Star Ratings</FormLabel>
                        <TextField
                            {...field}
                            id="one_star_ratings"
                            type="number"
                            placeholder="Enter number of 1-star ratings"
                            fullWidth
                        />
                    </FormControl>
                )}
            />

            {/* Course Ratings */}
            <Controller
                name="ratings"
                control={control}
                render={({ field }) => (
                    <FormControl className="w-full">
                        <FormLabel>Course Ratings</FormLabel>
                        <TextField {...field} type="number" fullWidth />
                    </FormControl>
                )}
            />
        </div>
    );
}

export default ShippingTab;
