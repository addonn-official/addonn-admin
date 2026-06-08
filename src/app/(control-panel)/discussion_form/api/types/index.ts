export type DiscussionFormImageType = {
	id: string;
	url: string;
	type: string;
	binary: ArrayBuffer;
	mimeType: string;
	name: string;
};

export type DiscussionForm = {
	id: string;
	name?: string;
	code: string;
	// featuredImageId: string;
	created_at: string;
	expires_at: string;
	starts_at: string;
	value: string;
	is_active: boolean;
};
	