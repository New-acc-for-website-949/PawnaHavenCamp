const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const parseJsonField = (field: any) => {
  if (typeof field === 'string') {
    try {
      // Check if it's already a valid JSON string
      if (field.startsWith('[') || field.startsWith('{')) {
        return JSON.parse(field);
      }
      // If it's a comma separated string, split it
      if (field.includes(',')) {
        return field.split(',').map(item => item.trim());
      }
      return [field];
    } catch {
      return [];
    }
  }
  return Array.isArray(field) ? field : [];
};

const transformProperty = (property: any) => {
  const images = Array.isArray(property.images) ? property.images : [];
  return {
    ...property,
    amenities: parseJsonField(property.amenities),
    activities: parseJsonField(property.activities),
    highlights: parseJsonField(property.highlights),
    policies: parseJsonField(property.policies),
    image: images.length > 0 ? images[0].image_url : "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4",
    images: images.map((img: any) => img.image_url)
  };
};

export const propertyAPI = {
  getPublicList: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/public-list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }

      const result = await response.json();

      return {
        success: result.success,
        data: (result.data || []).map(transformProperty),
        categorySettings: result.categorySettings
      };
    } catch (error) {
      console.error('Error fetching properties:', error);
      return {
        success: false,
        data: []
      };
    }
  },
  getPublicBySlug: async (slug: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/properties/public/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch property');
      }

      const result = await response.json();

      const transformedProperty = result.data ? transformProperty(result.data) : null;

      return {
        success: result.success,
        data: transformedProperty
      };
    } catch (error) {
      console.error('Error fetching property:', error);
      return {
        success: false,
        data: null
      };
    }
  },
};
