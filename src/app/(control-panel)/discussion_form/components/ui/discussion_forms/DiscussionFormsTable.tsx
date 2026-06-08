import { useMemo, useState } from 'react';
import { type MRT_ColumnDef } from 'material-react-table';
import DataTable from 'src/components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { Box, Chip, Dialog, DialogContent, DialogTitle, IconButton, ListItemIcon, MenuItem, Paper } from '@mui/material';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Link from '@fuse/core/Link';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { useDiscussionForms } from '../../../api/hooks/discussion_forms/useDiscussionForms';
import { DiscussionForm } from '../../../api/types';
import { useDeleteDiscussionForms } from '../../../api/hooks/discussion_forms/useDeleteDiscussionForms';
import useNavigate from '@fuse/hooks/useNavigate';

function DiscussionFormsTable() {
	// State for nested tables
	const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
	const [selectedComment, setSelectedComment] = useState<any | null>(null);
	const [selectedReply, setSelectedReply] = useState<any | null>(null);

	// State for popup dialogs
	const [openCommentsDialog, setOpenCommentsDialog] = useState(false);
	const [openRepliesDialog, setOpenRepliesDialog] = useState(false);
	const [openReplyRepliesDialog, setOpenReplyRepliesDialog] = useState(false);

	let { data: discussion_forms = [], isLoading, error } = useDiscussionForms();
	const navigate = useNavigate();
	console.log('DiscussionForms:', discussion_forms);
	if (error) {
		console.error('An error has occurred while fetching discussion_forms:', error.message);
		discussion_forms = [];
	}
	const { mutate: deleteDiscussionForms } = useDeleteDiscussionForms();

	// Memoize nested table columns - defined at top level to avoid hooks violation
	const commentsColumns = useMemo<MRT_ColumnDef<any>[]>(
		() => [
			{
				accessorKey: 'comment',
				header: 'Comment',
				Cell: ({ row }) => (
					<Button
						variant="text"
						color="primary"
						onClick={(e) => {
							e.stopPropagation();
							setSelectedComment(row.original);
							setSelectedReply(null);
							setOpenRepliesDialog(true);
						}}
					>
						{row.original.comment}
					</Button>
				)
			},
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ row }) => (
					<Chip label={row.original.status === 1 ? 'Active' : 'Inactive'} color={row.original.status === 1 ? 'success' : 'error'} />
				)
			},
			{
				accessorKey: 'auth.name',
				header: 'Author',
				Cell: ({ row }) => <>{row.original.auth?.name}</>
			},
			{
				accessorKey: 'course_contents.title',
				header: 'Course Content',
				Cell: ({ row }) => <>{row.original.course_contents?.title}</>
			}
		],
		[]
	);

	const repliesColumns = useMemo<MRT_ColumnDef<any>[]>(
		() => [
			{
				accessorKey: 'reply',
				header: 'Reply',
				Cell: ({ row }) => (
					<Button
						variant="text"
						color="primary"
						onClick={(e) => {
							e.stopPropagation();
							setSelectedReply(row.original);
							setOpenReplyRepliesDialog(true);
						}}
					>
						{row.original.reply}
					</Button>
				)
			},
			{
				accessorKey: 'status',
				header: 'Status',
				Cell: ({ row }) => (
					<Chip label={row.original.status === 1 ? 'Active' : 'Inactive'} color={row.original.status === 1 ? 'success' : 'error'} />
				)
			},
			{
				accessorKey: 'auth.name',
				header: 'Author',
				Cell: ({ row }) => <>{row.original.auth?.name}</>
			}
		],
		[]
	);

	const columns = useMemo<MRT_ColumnDef<DiscussionForm>[]>(
		() => [
			{
				accessorKey: 'Course name',
				header: 'Course name',
				size: 100,
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => (
					<Button
						variant="text"
						color="primary"
						onClick={(e) => {
							e.stopPropagation();
							setSelectedCourse(row.original as any);
							setSelectedComment(null);
							setSelectedReply(null);
							setOpenCommentsDialog(true);
						}}
					>
						{row.original['course_name']}
					</Button>
				)
			},
			{
				accessorKey: 'Comment Count',
				header: 'Comment Count',
				size: 100,
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => <>{row.original['comment_count']}</>
			},
			{
				accessorKey: 'Replies Count',
				header: 'Replies Count',
				size: 100,
				enableColumnFilter: false,
				enableColumnDragging: false,
				Cell: ({ row }) => <>{row.original['replies_count']}</>
			}
		],
		[]
	);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Paper
			className="flex h-full w-full flex-auto flex-col overflow-hidden rounded-b-none"
			elevation={2}
		>
			<DataTable
				data={discussion_forms}
				columns={columns}
				renderRowActionMenuItems={({ closeMenu, row, table }) => [
					<MenuItem
						key={0}
						onClick={() => {
							deleteDiscussionForms([row.original.id]);
							closeMenu();
							table.resetRowSelection();
						}}
					>
						<ListItemIcon>
							<FuseSvgIcon>lucide:trash</FuseSvgIcon>
						</ListItemIcon>
						Delete
					</MenuItem>
				]}
				muiTableBodyRowProps={({ row }) => ({
					onClick: () => {
						navigate(`/discussion-form/discussion-form/${row.original.id}`);
					},
					sx: {
						cursor: 'pointer',
						'&:hover': {
							backgroundColor: 'rgba(0, 0, 0, 0.04)'
						}
					}
				})}
				renderTopToolbarCustomActions={({ table }) => {
					const { rowSelection } = table.getState();
					if (Object.keys(rowSelection).length === 0) {
						return null;
					}
					return (
						<Button
							variant="contained"
							size="small"
							onClick={() => {
								const selectedRows = table.getSelectedRowModel().rows;
								deleteDiscussionForms(selectedRows.map((row) => row.original.id));
								table.resetRowSelection();
							}}
							className="flex min-w-9 shrink ltr:mr-2 rtl:ml-2"
							color="secondary"
						>
							<FuseSvgIcon>lucide:trash</FuseSvgIcon>
							<span className="mx-2 hidden sm:flex">Delete selected items</span>
						</Button>
					);
				}}
			/>
			{/* Comments Dialog */}
			<Dialog
				open={openCommentsDialog}
				onClose={() => setOpenCommentsDialog(false)}
				maxWidth="lg"
				fullWidth
			>
				<DialogTitle>
					Comments for {selectedCourse?.course_name}
					<IconButton
						onClick={() => setOpenCommentsDialog(false)}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8
						}}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					{selectedCourse && (
						<Box mt={2}>
							<DataTable
								data={selectedCourse.comments || []}
								columns={commentsColumns}
							/>
						</Box>
					)}
				</DialogContent>
			</Dialog>

			{/* Replies Dialog */}
			<Dialog
				open={openRepliesDialog}
				onClose={() => setOpenRepliesDialog(false)}
				maxWidth="lg"
				fullWidth
			>
				<DialogTitle>
					Replies for Comment
					<IconButton
						onClick={() => setOpenRepliesDialog(false)}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8
						}}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					{selectedComment && (
						<Box mt={2}>
							<DataTable
								data={selectedComment.replies || []}
								columns={repliesColumns}
							/>
						</Box>
					)}
				</DialogContent>
			</Dialog>

			{/* Reply Replies Dialog */}
			<Dialog
				open={openReplyRepliesDialog}
				onClose={() => setOpenReplyRepliesDialog(false)}
				maxWidth="lg"
				fullWidth
			>
				<DialogTitle>
					Replies for Reply
					<IconButton
						onClick={() => setOpenReplyRepliesDialog(false)}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8
						}}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent>
					{selectedReply && selectedReply.replies && selectedReply.replies.length > 0 && (
						<Box mt={2}>
							<DataTable
								data={selectedReply.replies}
								columns={repliesColumns}
							/>
						</Box>
					)}
				</DialogContent>
			</Dialog>
		</Paper>
	);
}

export default DiscussionFormsTable;
