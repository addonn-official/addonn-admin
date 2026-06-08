export type ReviewImageType = {
	id: string;
	url: string;
	type: string;
	binary: ArrayBuffer;
	mimeType: string;
	name: string;
};

export type Review = {
	id: string;
	name: string;
	average_rating: string;
	featuredImageId: string;
	images: ReviewImageType[];
	active: boolean;
	status?: string;
	otp_verfied?: string;
	course_purchased?: string;
	created_at: string;
	profession?: string;
	file?: any;
	review?: string;
	course?: any;
	courses?: string;
	rating?: string;
	verified?: string;
};