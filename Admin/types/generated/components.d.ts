import type { Schema, Struct } from '@strapi/strapi';

export interface CategoryCategory extends Struct.ComponentSchema {
  collectionName: 'components_category_categories';
  info: {
    displayName: 'category';
  };
  attributes: {
    categoryId: Schema.Attribute.Integer;
    name: Schema.Attribute.Enumeration<['Books', 'Games', 'Movies']> &
      Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'category.category': CategoryCategory;
    }
  }
}
