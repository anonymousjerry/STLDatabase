// /sanity/schemas/scrapeJob.ts

export default {
  name: 'scrapeJob',
  title: 'Scraping Job',
  type: 'document',
  fields: [
    {
      name: 'platform',
      type: 'string',
      title: 'Platform',
      description: 'Select the platform to scrape',
      options: {
        list: ['Thingiverse', 'CGTrader', 'Makerworld', 'Pinshape', 'Thangs', 'Printables'],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'count',
      type: 'number',
      title: 'Count',
      description: 'Number of models to scrape',
      initialValue: 10,
      validation: (Rule: any) => Rule.min(1).max(1000).required(),
    },
    {
      name: 'startTime',
      type: 'string',
      title: 'Start Time',
      description: 'Time to start scraping (24-hour format)',
      options: {
        list: [
          '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
          '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
          '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ]
      },
      initialValue: '09:00',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'endTime',
      type: 'string',
      title: 'End Time',
      description: 'Time to stop scraping (24-hour format)',
      options: {
        list: [
          '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
          '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
          '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ]
      },
      initialValue: '17:00',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'isActive',
      type: 'boolean',
      title: 'Active',
      description: 'Turn ON/OFF this scraping job',
      initialValue: false,
    },
    {
      name: 'lastRun',
      type: 'datetime',
      title: 'Last Run',
      description: 'When this job was last executed',
      readOnly: true,
    },
    {
      name: 'status',
      type: 'string',
      title: 'Status',
      options: {
        list: [
          { title: 'Idle', value: 'idle' },
          { title: 'Running', value: 'running' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' }
        ],
      },
      initialValue: 'idle',
      readOnly: true,
    },
    {
      name: 'totalRuns',
      type: 'number',
      title: 'Total Runs',
      description: 'Number of times this job has been executed',
      initialValue: 0,
      readOnly: true,
    },
    {
      name: 'totalModelsScraped',
      type: 'number',
      title: 'Total Models Scraped',
      description: 'Total number of models scraped by this job',
      initialValue: 0,
      readOnly: true,
    },
    {
      name: 'createdAt',
      type: 'datetime',
      title: 'Created At',
      readOnly: true,
    },
    {
      name: 'updatedAt',
      type: 'datetime',
      title: 'Updated At',
      readOnly: true,
    }
  ],
  preview: {
    select: {
      platform: 'platform',
      count: 'count',
      isActive: 'isActive',
      status: 'status',
      lastRun: 'lastRun'
    },
    prepare(selection: any) {
      const { platform, count, isActive, status, lastRun } = selection;
      return {
        title: `${platform} - ${count} models`,
        subtitle: `${status} ${isActive ? '(ON)' : '(OFF)'}`,
        media: () => '🕷️'
      };
    }
  },
  orderings: [
    {
      title: 'Created At (Newest)',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }]
    },
    {
      title: 'Last Run (Recent)',
      name: 'lastRunDesc',
      by: [{ field: 'lastRun', direction: 'desc' }]
    },
    {
      title: 'Platform',
      name: 'platformAsc',
      by: [{ field: 'platform', direction: 'asc' }]
    }
  ]
}
