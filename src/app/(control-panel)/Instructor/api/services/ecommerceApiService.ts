import { api } from '@/utils/api';
import { Order, Instructor } from '../types';
import { HTTPError } from 'ky';

export const ecommerceApi = {
	// Instructors
	// getInstructors: async (): Promise<Instructor[]> => {
	// 	let  response: Instructor[] = await api.get('instructors?page=1').json();

  //   // Modify the response here
  //   response = response['data'];
  //   return response;
	// },
  getInstructors: async (page = 1, perPage = 10): Promise<any> => {
          const response: any = await api.get(`instructors?page=${page}&per_page=${perPage}`).json();
          return response;
      },

	getInstructor: async (instructorId: string): Promise<Instructor> => {
		let response: Instructor = await api.get(`instructors/${instructorId}`).json();
		// console.log(response['data'])
    response['data'].image = response['data']?.file?.url;
	
    
    console.log('Instructors Response:', response);
		return response['data']
	},

	createInstructor: async (instructor: Omit<Instructor, 'id'>): Promise<Instructor> => {
    const formData = new FormData();

    // Append basic fields
    formData.append('name', instructor.name);
    // formData.append('active', instructor.active.toString());
    if(instructor.display_name) formData.append('display_name', instructor.display_name);
    if(instructor.bio) formData.append('bio', instructor.bio);
    if(instructor.number) formData.append('number', instructor.number);
    if(instructor.email) formData.append('email', instructor.email);
    if(instructor.short_description) formData.append('short_description', instructor.short_description);
    if(instructor.subject) formData.append('subject', instructor.subject);
    formData.append('rating_count', instructor.rating_count);
    formData.append('review_count', instructor.review_count);
    formData.append('students_taught', instructor.students_taught);
    formData.append('average_rating', instructor.average_rating);
    formData.append('status', '1');
    if(instructor.social_links) {
      instructor.social_links.map((link:any, index:number)=>{
        if(link['url']) formData.append(`social_links[${link['platform']}]`,link['url'])
      })
    }

    // Append companies (name + optional logo file)
    if (Array.isArray(instructor.companies)) {
      instructor.companies.forEach((company, idx) => {
        if (company?.name) {
          formData.append(`companies[${idx}][name]`, String(company.name));
        }
        // company.logo expected shape: { binary, name, mimeType, url, id }
        if (company?.logo?.binary) {
          try {
            const blob = new Blob([new Uint8Array(company.logo.binary)], { type: company.logo.mimeType || 'application/octet-stream' });
            // append file under companies[idx][logo]
            formData.append(`companies[${idx}][logo]`, blob, company.logo.name || `company_logo_${idx}`);
          } catch (e) {
            // fallback: skip logo if it cannot be turned into a blob
            console.warn('Failed to append company logo blob', e);
          }
        }
      });
    }

    if (instructor.images[0] && instructor.images[0].binary) {
			const image = instructor.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });
			formData.append(`avatar`, blob, image.name);
		}
	
      return api
        .post('instructors', {
          body: formData
        })
        .json();
    
	},

	updateInstructor: async (instructor: Instructor): Promise<Instructor> => {
    console.log('Updating instructor:', instructor);

    const formData = new FormData();

    // Append basic fields
    formData.append('name', instructor.name);
    // formData.append('active', instructor.active.toString());
    if(instructor.display_name) formData.append('display_name', instructor.display_name);
    if(instructor.bio) formData.append('bio', instructor.bio);
    if(instructor.number) formData.append('number', instructor.number);
    if(instructor.email) formData.append('email', instructor.email);
    if(instructor.short_description) formData.append('short_description', instructor.short_description);
    if(instructor.subject) formData.append('subject', instructor.subject);
    formData.append('rating_count', instructor.rating_count);
    formData.append('review_count', instructor.review_count);
    formData.append('students_taught', instructor.students_taught);
    formData.append('average_rating', instructor.average_rating);
    formData.append('status', '1');
    if(instructor.social_links) {
      instructor.social_links.map((link:any, index:number)=>{
        if(link['url']) formData.append(`social_links[${link['platform']}]`,link['url'])
      })
    }
    // formData.append('linkdin', instructor.linkdin);

    // Append companies (name + optional logo file) for update as well
    if (Array.isArray(instructor.companies)) {
      instructor.companies.forEach((company, idx) => {
        if (company?.name) {
          formData.append(`companies[${idx}][name]`, String(company.name));
        }
        if (company?.logo?.binary) {
          try {
            const blob = new Blob([new Uint8Array(company.logo.binary)], { type: company.logo.mimeType || 'application/octet-stream' });
            formData.append(`companies[${idx}][logo]`, blob, company.logo.name || `company_logo_${idx}`);
          } catch (e) {
            console.warn('Failed to append company logo blob', e);
          }
        }
		//  else if (company?.logo?.id) {
        //   // if backend expects existing logo id, send it
        //   formData.append(`companies[logo_id][]`, String(company.logo.id));
        // }
      });
    }

    if (instructor.images[0] && instructor.images[0].binary) {
			const image = instructor.images[0];
			const blob = new Blob([new Uint8Array(image.binary)], { type: image.mimeType });
			formData.append(`avatar`, blob, image.name);
		}
	
    try {
        return api
          .post(`instructors/${instructor.id}`, {
            body: formData
          })
          .json();
      } catch (err) {
        console.log('Error during instructor update:', err);
        if (err instanceof HTTPError) {
          console.log('HTTP Error response:', err.response);
            const errorJson = await err.response.json();
            throw { ...errorJson, status: err.response.status };
        }
        throw err;
    }
	},

	deleteInstructor: async (instructorId: string) => {
		return api.delete(`instructors/${instructorId}`);
	},

	deleteInstructors: async (instructorIds: string[]) => {
		return api.delete('instructors', {
			json: instructorIds
		});
	},

};
