import { api } from '@/utils/api';
import { Enrollment } from '../types';

export const ecommerceApi = {
	// Enrollments
	getEnrollments: async (): Promise<Enrollment[]> => {
		let  response: Enrollment[] = await api.get('enrollments?page=1').json();

    // Modify the response here
	response = response['data'];
    

    return response;
	},

	getEnrollment: async (enrollmentId: string): Promise<Enrollment> => {
		let response: Enrollment = await api.get(`enrollments/${enrollmentId}`).json();
		console.log(response['data'])
		return response['data']
	},

	createEnrollment: async (enrollment: Omit<Enrollment, 'id'>): Promise<Enrollment> => {
        const formData = new FormData();
		console.log('Creating enrollment:', enrollment);
    // Append basic fields
    formData.append('name', enrollment.name);
    formData.append('enrollment', enrollment.enrollment);
	// ensure rating is sent as an integer string (backend expects integer)
	{
		const ratingNum = Number(enrollment.rating);
		console.log(Number.isFinite(ratingNum))
		if (!Number.isFinite(ratingNum)) {
			// fallback to 0 if rating not a number; adjust as needed
			formData.append('rating', '0');
		} else {
			formData.append('rating', String(Math.round(ratingNum)));
		}
	}
    

    // Append images
     if (enrollment.images[0] && enrollment.images[0].binary) {
			const image = enrollment.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

        formData.append(`avatar`, blob, image.name);
    }
    // Append featured image ID
    if (enrollment.featuredImageId) {
        formData.append('featuredImageId', enrollment.featuredImageId);
    }

		return api
			.post('enrollments', {
				body: formData
			})
			.json();
	},

	updateEnrollment: async (enrollment: Enrollment): Promise<Enrollment> => {
        console.log('Updating enrollment:', enrollment);

        const formData = new FormData();

    // Append basic fields
    formData.append('name', enrollment.name);
    formData.append('enrollment', enrollment.enrollment);
	// ensure rating is sent as an integer string (backend expects integer)
	{
		const ratingNum = Number(enrollment.rating);
		if (!Number.isFinite(ratingNum)) {
			formData.append('rating', '0');
		} else {
			formData.append('rating', String(Math.round(ratingNum)));
		}
	}
    
    formData.append('status', '1');
    
    // formData.append('linkdin', enrollment.linkdin);

	// Append images
    if (enrollment.images[0] && enrollment.images[0].binary) {
			const image = enrollment.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

        // const blob = new Blob([image.binary], { type: image.mimeType });
		// const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });

        formData.append(`avatar`, blob, image.name);
    };

		return api
			.put(`enrollments/${enrollment.id}`, {
				body: formData
			})
			.json();
	},

	deleteEnrollment: async (enrollmentId: string) => {
		return api.delete(`enrollments/${enrollmentId}`);
	},
	
	updateCertificate: async (certData: any): Promise<Enrollment> => {
		console.log('Updating certificate with data:', certData);

		return api.put(`certificates/${certData.id}`,{json:certData}).json();
	},

	deleteEnrollments: async (enrollmentIds: string[]) => {
		return api.delete('enrollments', {
			json: enrollmentIds
		});
	},

};
