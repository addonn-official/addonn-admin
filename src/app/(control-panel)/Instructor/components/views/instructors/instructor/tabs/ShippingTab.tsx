import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Paper, Chip, Avatar, Box, Typography } from '@mui/material';

/**
 * The reviews tab.
 */
function ShippingTab() {
    const methods = useFormContext();
    const { watch } = methods;
    // read reviews array from form (fallback to empty array)
    const reviews = watch('reviews') || [];

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Student',
                enableColumnFilter: false,
                size: 150,
                Cell: ({ row }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* <Avatar
                            src={row.original?.file?.url}
                            alt={row.original.name}
                            sx={{ width: 40, height: 40 }}
                        /> */}
                        <Typography variant="body2">{row.original.name}</Typography>
                    </Box>
                )
            },
            {
                accessorKey: 'review',
                header: 'Review',
                enableColumnFilter: false,
                size: 300,
                Cell: ({ row }) => (
                    <Typography
                        variant="body2"
                        sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {row.original.review}
                    </Typography>
                )
            },
            {
                accessorKey: 'rating',
                header: 'Rating',
                enableColumnFilter: false,
                size: 100,
                Cell: ({ row }) => (
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {row.original.rating} ⭐
                    </Typography>
                )
            },
            {
                accessorKey: 'verified',
                header: 'Status',
                enableColumnFilter: false,
                size: 120,
                Cell: ({ row }) => (
                    <Chip
                        label={row.original.verified === 1 ? 'Verified' : 'Unverified'}
                        color={row.original.verified === 1 ? 'success' : 'warning'}
                        size="small"
                    />
                )
            }
        ],
        []
    );

    // if reviews are not available yet we can render a loading state or empty table
    if (!Array.isArray(reviews)) {
        return <FuseLoading />;
    }

    return (
        <Paper className="flex h-full w-full flex-auto flex-col overflow-hidden" elevation={0}>
            <DataTable
                data={reviews}
                columns={columns}
                enableRowActions={false}
                enableRowSelection={false}
            />
        </Paper>
    );
}

export default ShippingTab;
