export type TestimonialImageType = {
	id: string;
	url: string;
	type: string;
	binary: ArrayBuffer;
	mimeType: string;
	name: string;
};

export type Testimonial = {
	id: string;
	name: string;
	images: TestimonialImageType[];
	featuredImageId: string;
	active: boolean;
	status?: string;
	created_at: string;
	profession?: string;
	file?: any;
	thumbnail?: any;
	testimonial?: string;
	course?: string;
	rating?: string;
	review?: string;
	content?: string;
	videos?: TestimonialImageType[];
	video?: any;
	script?: any;
	courses?: any;
	is_home: any;
};