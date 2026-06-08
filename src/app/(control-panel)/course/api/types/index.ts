export type ProductImageType = {
	id: string;
	url: string;
	type: string;
	binary: ArrayBuffer;
	mimeType: string;
	name: string;
};

export type Course ={
	id: string
	title: string;
	short_description: string;
	long_description: string;
	status: string;
	images: ProductImageType[];
	featuredImageId: string;
	slug: string;
	created_at: string;
	updated_at: string;
	deleted_at: string;
	is_comment_enabled: string;
	is_certificate_enabled: string;
	is_user_limit_enabled: string;
	user_limit: string;
	difficulty_level: string;
	is_content_drip_enabled: string;
	content_drip_basis: string;
	course_type: string;
	actual_price: string;
	discounted_price: string;
	number_of_lectures: string;
	intro_videos: any;
	start_date: string;
	language: string;
	benefits: string;
	prerequisites: string;
	target_audience: string;
	// duration_hours: string;
	// duration_minutes: string;
	duration: string;
	five_star_ratings: string;
	four_star_ratings: string;
	three_star_ratings: string;
	two_star_ratings: string;
	one_star_ratings: string;
	has_money_back_guarantee: string;
	validity_period: string;
	is_live: string;
	categories: string[];
	tags: string[];
	instructors: { id: string; name: string }[];
	topics: Topic[];
	file?: any;
	ratings: string;
	validity_duration?: string;
	validity_unit?: string;
	introVideos?: any;
	}

export type Product = {
	id: string;
	name: string;
	displayName: string;
	bio: string;
	ratingCounter: string;
	reviewCounter: string;
	studentTaughtCouunter: string;
	averageActualRating: string;
	linkdin: string;
	handle: string;
	description: string;
	categories: string[];
	tags: string[];
	featuredImageId: string;
	images: ProductImageType[];
	priceTaxExcl: number;
	priceTaxIncl: number;
	taxRate: number;
	comparedPrice: number;
	quantity: number;
	sku: string;
	width: string;
	height: string;
	depth: string;
	weight: string;
	extraShippingFee: number;
	active: boolean;
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
	products: Partial<Product & { image: string; price: string }>[];
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

export type Topic = {
	id: string;
	course_id: string;
	name: string;
	slug?: string;
	order?: number;
	course?: Course;
	summary?: string;
	categories?: any[];
	course_contents?: {
		id: string;
		name: string;
		content: string;
		order: number;
	}[];
};

export type SubTopic = {
	id: string;
	topic_id: string;
	category_id: string;
	title: string;
	content: string;
	url: string;
	hours: string;
	minutes: string;
	seconds: string;
	document?: string;
	summary?: string;
}

