import { api } from '@/utils/api';
import { Review } from '../types';
export interface ReviewsResponse {
    success?: boolean;
    message?: string;
    data: Review[];
    meta?: {
        current_page?: number;
        from?: number;
        last_page?: number;
        per_page?: number;
        to?: number;
        total?: number;
    };
    links?: {
        first?: string | null;
        last?: string | null;
        prev?: string | null;
        next?: string | null;
    };
}

export const ecommerceApi = {
	// Reviews
	// getReviews: async (): Promise<Review[]> => {
	// 	let  response: Review[] = await api.get('reviews?page=1').json();

    // return response;
	// },
	getReviews: async (page = 1, perPage = 10): Promise<ReviewsResponse> => {
        const response: ReviewsResponse = await api.get(`reviews?page=${page}&per_page=${perPage}`).json();
        return response;
    },

	getReview: async (reviewId: string): Promise<Review> => {
		let response: Review = await api.get(`reviews/${reviewId}`).json();
		console.log(response['data'])
		return response['data']
	},

	createReview: async (review: Omit<Review, 'id'>): Promise<Review> => {
        const formData = new FormData();
		console.log('Creating review:', review);
    // Append basic fields
    formData.append('name', review.name);
    formData.append('review', review.review);
	formData.append('type_id', review.courses);
	formData.append('type', 'courses');
	
	// ensure rating is sent as an integer string (backend expects integer)
	{
		const ratingNum = Number(review.rating);
		console.log(Number.isFinite(ratingNum))
		if (!Number.isFinite(ratingNum)) {
			// fallback to 0 if rating not a number; adjust as needed
			formData.append('rating', '0');
		} else {
			formData.append('rating', String(Math.round(ratingNum)));
		}
	}
    

    // Append images
     if (review.images[0] && review.images[0].binary) {
			const image = review.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

        formData.append(`avatar`, blob, image.name);
    }
    // Append featured image ID
    if (review.featuredImageId) {
        formData.append('featuredImageId', review.featuredImageId);
    }

		return api
			.post('reviews', {
				body: formData
			})
			.json();
	},

	updateReview: async (review: Review): Promise<Review> => {
        console.log('Updating review:', review);

        const formData = new FormData();

    // Append basic fields
    formData.append('name', review.name);
    formData.append('review', review.review);
	formData.append('type_id', review.courses);
	formData.append('type', 'courses');
	// ensure rating is sent as an integer string (backend expects integer)
	{
		const ratingNum = Number(review.rating);
		if (!Number.isFinite(ratingNum)) {
			formData.append('rating', '0');
		} else {
			formData.append('rating', String(Math.round(ratingNum)));
		}
	}
    
    formData.append('status', '1');
    
    // formData.append('linkdin', review.linkdin);

	// Append images
    if (review.images[0] && review.images[0].binary) {
			const image = review.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

        // const blob = new Blob([image.binary], { type: image.mimeType });
		// const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

        formData.append(`avatar`, blob, image.name);
    };

		return api
			.post(`reviews/${review.id}`, {
				body: formData
			})
			.json();
	},

	deleteReview: async (reviewId: string) => {
		return api.delete(`reviews/${reviewId}`);
	},

	deleteReviews: async (reviewIds: string[]) => {
		return api.delete('reviews', {
			json: reviewIds
		});
	},

};
