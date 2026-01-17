import { supabase } from './supabase';

const parseJsonField = (field: any) => {
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  }
  return Array.isArray(field) ? field : [];
};

const transformProperty = (property: any) => {
  return {
    ...property,
    amenities: parseJsonField(property.amenities),
    activities: parseJsonField(property.activities),
    highlights: parseJsonField(property.highlights),
    policies: parseJsonField(property.policies),
  };
};

export const propertyAPI = {
  getPublicList: async () => {
    try {
      const { data: properties, error } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(
            id,
            image_url,
            display_order
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedProperties = (properties || []).map(transformProperty);

      return {
        success: true,
        data: transformedProperties
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
      const { data: property, error } = await supabase
        .from('properties')
        .select(`
          *,
          images:property_images(
            id,
            image_url,
            display_order
          )
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      const transformedProperty = property ? transformProperty(property) : null;

      return {
        success: true,
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
