export type UserImageType = {
	id: string;
	url: string;
	type: string;
	binary: ArrayBuffer;
	mimeType: string;
	name: string;
};

export type User = {
	id: string;
	name: string;
	average_rating: string;
	featuredImageId: string;
	images: UserImageType[];
	image: string;
	active: boolean;
	status?: string;
	otp_verified?: string;
	course_purchased?: string;
	created_at: string;
	profession?: string;
	file?: any;
	profile: any;
};