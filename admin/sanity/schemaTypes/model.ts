// export default {
//   name: 'model',
//   title: 'Model',
//   type: 'document',
//   fields: [
//     {
//       name: 'title',
//       title: 'Title',
//       type: 'string',
//       validation: (Rule: any) => Rule.required(),
//     },
//     {
//       name: 'description',
//       title: 'Description',
//       type: 'text',
//     },
//     {
//       name: 'sourceSite',
//       title: 'Source Site',
//       type: 'reference',
//       to: [{ type: 'sourceSite' }],
//     },
//     {
//       name: 'category',
//       title: 'Category',
//       type: 'reference',
//       to: [{ type: 'category' }],
//     },
//     {
//       name: 'subCategory',
//       title: 'Sub Category',
//       type: 'reference',
//       to: [{ type: 'subCategory' }],
//     },
//     {
//       name: 'tags',
//       title: 'Tags',
//       type: 'array',
//       of: [{ type: 'string' }],
//     },
//     {
//         name: 'likes',
//         title: 'Likes',
//         type: 'array',
//         of: [
//             {
//             type: 'object',
//             fields: [
//                 {
//                 name: 'userId',
//                 title: 'User ID',
//                 type: 'string',
//                 },
//                 {
//                 name: 'likedAt',
//                 title: 'Liked At',
//                 type: 'datetime',
//                 },
//             ],
//             },
//         ],
//     },
//     {
//       name: 'views',
//       title: 'Views',
//       type: 'number',
//       initialValue: 0,
//     },
//     {
//       name: 'deleted',
//       title: 'Deleted',
//       type: 'boolean',
//       initialValue: false,
//     },
//     {
//       name: 'price',
//       title: 'Price',
//       type: 'string',
//     },
//     {
//       name: 'downloads',
//       title: 'Downloads',
//       type: 'number',
//       initialValue: 0,
//     },
//     {
//       name: 'imagesUrl',
//       title: 'Images URLs',
//       type: 'array',
//       of: [{ type: 'url' }],
//     },
//     {
//       name: 'thumbnailUrl',
//       title: 'Thumbnail URL',
//       type: 'url',
//     },
//     {
//       name: 'sourceUrl',
//       title: 'Source URL',
//       type: 'url',
//     },
//     {
//       name: 'createdAt',
//       title: 'Created At',
//       type: 'datetime',
//       readOnly: true,
//     },
//     {
//       name: 'updatedAt',
//       title: 'Updated At',
//       type: 'datetime',
//       readOnly: true,
//     },
//   ],
//   preview: {
//     select: {
//       title: 'title',
//       subtitle: 'category.name',
//       media: 'thumbnailUrl',
//     },
//   },
// }

