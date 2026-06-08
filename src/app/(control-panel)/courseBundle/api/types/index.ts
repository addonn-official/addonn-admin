import { Course } from "@/app/(control-panel)/course/api/types";

export type CourseBundleImageType = {
	id: string;
	url: string;
	type: string;
	binary: ArrayBuffer;
	mimeType: string;
	name: string;
};

export type CourseBundle = {
	id: string;
	name: string;
	featuredImageId: string;
	images: CourseBundleImageType[];
	active: boolean;
	status?: string;
	created_at: string;
	file?: any;
	courses?: Course[];
	price?: string;
	discounted_price?: string;
};