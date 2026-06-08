import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Paper } from '@mui/material';

/**
 * The courses purchased tab.
 */
function CoursesPurchasedTab() {
    const methods = useFormContext();
    const { watch } = methods;
    // read courses purchased array from form (fallback to empty array)
    const enrollments = watch('enrollments') || [];

    const columns = useMemo<MRT_ColumnDef<any>[]>(
        () => [
            {
                accessorKey: 'course_name',
                header: 'Course/Bundle name',
                enableColumnFilter: false,
                Cell: ({ row }) => row.original?.course?.title
            },
            {
                accessorKey: 'enroll_date',
                header: 'Enroll Date',
                enableColumnFilter: false,
                Cell: ({ row }) => row.original.enrolled_on
            },
            {
                accessorKey: 'completion_percent',
                header: 'Completion %',
                enableColumnFilter: false,
				size: 10,
                Cell: ({ row }) => row.original.completion_percentage ?? '-'
            },
            {
                accessorKey: 'validity',
                header: 'Validity',
                enableColumnFilter: false,
				size: 10,
                Cell: ({ row }) => `${row.original?.course?.validity_duration} ${row.original.course?.validity_unit}`
            },
            {
                accessorKey: 'transaction_id',
                header: 'Transaction ID',
                enableColumnFilter: false,
                Cell: ({ row }) => row.original?.order?.transaction?.id ?? '-'
            },
            {
                accessorKey: 'status',
                header: 'Status',
                enableColumnFilter: false
            }
        ],
        []
    );

    // if purchases are not available yet we can render a loading state or empty table
    if (!Array.isArray(enrollments)) {
        return <FuseLoading />;
    }

    return (
        <Paper className="flex h-full w-full flex-auto flex-col overflow-hidden rounded-b-none" elevation={0}>
            <DataTable
                data={enrollments}
                columns={columns}
                enableRowActions={false}
				enableRowSelection={false}
            />
        </Paper>
    );
}

export default CoursesPurchasedTab;
