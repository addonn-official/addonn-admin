export type OrderImageType = {
	id: string;
	url: string;
	type: string;
	binary: ArrayBuffer;
	mimeType: string;
	name: string;
};

export type Order = {
	id: string;
	order_id: string;
	status_label: string;
	name: string;
	average_rating: string;
	featuredImageId: string;
	images: OrderImageType[];
	active: boolean;
	status?: string;
	otp_verfied?: string;
	course_purchased?: string;
	created_at: string;
	profession?: string;
	file?: any;
	order?: string;
	course?: string;
	rating?: string;
	final_amount?: string;
	discount_amount?: string;
	refund_requests?: any[];
	admin_note?: string;
	enrollments?: any[];
	refunds?: any[];
	user?: {
		id: string;
		name: string;
		email: string;
		phone?: string;
	};
	transaction?: any;
	items?: any[];
	coupon?: any;
};