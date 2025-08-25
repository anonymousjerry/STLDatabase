import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'adPosition',
  title: 'Ad Position',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Position Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      options: {
        list: [
          { title: 'Homepage', value: 'homepage' },
          { title: 'Detail Page', value: 'detail' },
          { title: 'Explore Page', value: 'explore' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'position',
      title: 'Ad Position',
      type: 'string',
      options: {
        list: [
          // Homepage positions
          { title: 'Header Banner (728x90)', value: 'homepage-header-banner' },
          { title: 'Mid-Content Banner (728x90)', value: 'homepage-mid-content-banner' },
          { title: 'Right Sidebar (300x250)', value: 'homepage-sidebar-right' },
          { title: 'Sponsored Models (Native)', value: 'homepage-sponsored-models' },
          // { title: 'Footer Banner (728x90)', value: 'homepage-footer-banner' },
          // Detail page positions
          { title: 'Detail Header Banner (728x90)', value: 'detail-header-banner' },
          { title: 'Detail Mid-Content Banner (728x90)', value: 'detail-mid-content-banner' },
          // { title: 'Detail Right Sidebar (300x250)', value: 'detail-sidebar-right' },
          { title: 'Detail Sponsored Similar Models (Native)', value: 'detail-sponsored-similar' },
          // Explore page positions
          { title: 'Explore Header Banner (728x90)', value: 'explore-header-banner' },
          { title: 'Explore Mid-Content Banner (728x90)', value: 'explore-mid-content-banner' },
          { title: 'Explore Right Sidebar (300x250)', value: 'explore-sidebar-right' },
          { title: 'Explore Sponsored Listings (Native)', value: 'explore-sponsored-listings' },
          // { title: 'Explore Left Sidebar (300x250)', value: 'explore-sidebar-left' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'adType',
      title: 'Ad Type',
      type: 'string',
      options: {
        list: [
          { title: 'Banner', value: 'banner' },
          { title: 'Sidebar', value: 'sidebar' },
          { title: 'Sponsored Model', value: 'sponsored-model' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Ad Size',
      type: 'string',
      options: {
        list: [
          { title: '728x90', value: '728x90' },
          { title: '300x250', value: '300x250' },
          { title: '300x600', value: '300x600' },
          { title: 'Native', value: 'native' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'enabled',
      title: 'Enabled',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: 'adSlot',
      title: 'Google AdSense Ad Slot ID',
      type: 'string',
      description: 'Enter your Google AdSense ad unit ID (e.g., ca-pub-1234567890123456/1234567890)',
      placeholder: 'ca-pub-1234567890123456/1234567890',
    }),
    defineField({
      name: 'clientName',
      title: 'Client Name',
      type: 'string',
      description: 'Name of the client or advertiser',
    }),
    defineField({
      name: 'clientEmail',
      title: 'Client Email',
      type: 'string',
      description: 'Email of the client or advertiser',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'datetime',
      description: 'When this ad should start showing',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'When this ad should stop showing',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      page: 'page',
      position: 'position',
      enabled: 'enabled',
      clientName: 'clientName',
    },
    prepare(selection) {
      const { title, page, position, enabled, clientName } = selection
      return {
        title: title || 'Untitled Ad Position',
        subtitle: `${page} - ${position} ${enabled ? '(Active)' : '(Inactive)'}${clientName ? ` - ${clientName}` : ''}`,
      }
    },
  },
  orderings: [
    {
      title: 'Page, Position',
      name: 'pagePosition',
      by: [
        { field: 'page', direction: 'asc' },
        { field: 'position', direction: 'asc' },
      ],
    },
    {
      title: 'Priority',
      name: 'priority',
      by: [{ field: 'priority', direction: 'asc' }],
    },
    {
      title: 'Created Date',
      name: 'createdAt',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
  ],
}) 