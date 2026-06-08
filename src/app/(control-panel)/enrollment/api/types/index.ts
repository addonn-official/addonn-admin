export type EnrollmentImageType = {
	id: string;
	url: string;
	type: string;
	binary: ArrayBuffer;
	mimeType: string;
	name: string;
};

export type Enrollment = {
	id: string;
	name: string;
	average_rating: string;
	featuredImageId: string;
	images: EnrollmentImageType[];
	active: boolean;
	status?: string;
	otp_verfied?: string;
	course_purchased?: string;
	created_at: string;
	profession?: string;
	file?: any;
	enrollment?: string;
	course?: string;
	rating?: string;
	certificate_status: string;
	completion_percentage: string;
	enrolled_on: string;
	certificate: any;
	user: {
		id: string;
		name: string;
		email: string;
	};
};