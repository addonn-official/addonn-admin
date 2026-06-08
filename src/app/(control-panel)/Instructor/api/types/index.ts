export type InstructorImageType = {
	id: string;
	url: string;
	type: string;
	binary: ArrayBuffer;
	mimeType: string;
	name: string;
};

export type Instructor = {
	id: string;
	name: string;
	display_name: string;
	bio: string;
	rating_count: string;
	review_count: string;
	students_taught: string;
	average_rating: string;
	handle: string;
	description: string;
	categories: string[];
	tags: string[];
	featuredImageId: string;
	image: string;
	number: string;
	email: string;
	short_description: string;
	subject: string;
	images: InstructorImageType[];
	active: boolean;
	social_links?: { platform: string; url: string }[];
	status?: string;
	socialMedia?: { platform: string; url: string }[];
	file?: any;
	registered_at?: string;
	companies?: { name: string; logo?: { id?:string; binary?:ArrayBuffer; mimeType?:string; name?:string } }[];
};

export type Order = {
	id: string;
	reference: string;
	subtotal: string;
	tax: string;
	discount: string;
	total: string;
	date: string;
	customer: {
		id: string;
		firstName: string;
		lastName: string;
		avatar: string;
		company: string;
		jobTitle: string;
		email: string;
		phone: string;
		invoiceAddress: {
			address: string;
			lat: number;
			lng: number;
		};
		shippingAddress: {
			address: string;
			lat: number;
			lng: number;
		};
	};
	instructors: Partial<Instructor & { image: string; price: string }>[];
	status: {
		id: string;
		name: string;
		color: string;
		date?: string;
	}[];
	payment: {
		transactionId: string;
		amount: string;
		method: string;
		date: string;
	};
	shippingDetails: {
		tracking: string;
		carrier: string;
		weight: string;
		fee: string;
		date: string;
	}[];
};
