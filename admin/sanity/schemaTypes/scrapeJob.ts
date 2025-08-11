// /sanity/schemas/scrapeJob.ts
import ThangsCategorySubcategory from "../../components/ThangsCategorySubcategory"
import PrintablesCategorySubcategory from "../../components/PrintablesCategorySubcategory"
import { thangsList } from "../../static/data/thangsList"
import { printablesList } from "../../static/data/printablesList"

export default {
  name: 'scrapeJob',
  title: 'Scraping Job',
  type: 'document',
  fields: [
    {
      name: 'platform',
      type: 'string',
      title: 'Platform',
      options: {
        list: ['Thingiverse', 'CGTrader', 'Makerworld', 'Pinshape', 'Thangs', 'Printables'], // add more if needed
      },
    },
    {
        name: 'categoryCGTrader',
        type: 'string',
        title: 'CGTrader Category',
        options: {
            list: [
            'aircraft', 'household', 'industrial', 'animal', 'architectural',
            'interior', 'exterior', 'car', 'military', 'character',
            'plant', 'space', 'food', 'vehicle', 'furniture', 'watercraft',
            ].map(cat => ({ title: cat, value: cat })),
        },
        hidden: (context: { parent: { platform?: string } }) =>
            context.parent?.platform !== 'CGTrader',
    },
    {
        name: 'categoryPinshape',
        type: 'string',
        title: 'Pinshape Category',
        options: {
            list: [
                { title: 'Art', value: '1' },
                { title: 'Gadgets', value: '4' },
                { title: 'Home Living', value: '6' },
                { title: 'Jewelry Fashion', value: '3' },
                { title: 'Miniatures', value: '7' },
                { title: 'People Creatures', value: '11' },
                { title: 'Toy Games', value: '8' },
                { title: 'Other', value: '14' },
            ],
        },
        hidden: (context: { parent: { platform?: string } }) =>
            context.parent?.platform !== 'Pinshape',
    },
    {
        name: 'thangsCategory',
        type: 'string',
        title: 'Thangs Category',
        hidden: (ctx: { parent: { platform?: string } }) =>
            ctx.parent?.platform !== 'Thangs',
        options: {
            list: Array.from(new Set(thangsList.map(([cat]) => cat)))
                .map(cat => ({ title: cat, value: cat }))
        },
    },
    {
        name: 'thangsSubcategory',
        type: 'string',
        title: 'Thangs Subcategory',
        hidden: (ctx: { parent: { platform?: string } }) =>
            ctx.parent?.platform !== 'Thangs',
        components: { input: ThangsCategorySubcategory }
    },
    {
      name: 'printablesCategory',
      type: 'string',
      title: 'Printables Category',
      hidden: (ctx: { parent: { platform?: string } }) =>
            ctx.parent?.platform !== 'Printables',
      options: {
        list: Array.from(new Set(printablesList.map(([cat]) => cat))).map(cat => ({
          title: cat,
          value: cat,
        })),
      },
    },
    {
      name: 'printablesSubcategory',
      type: 'number',
      title: 'Printables Subcategory',
      hidden: (ctx: { parent: { platform?: string } }) =>
            ctx.parent?.platform !== 'Printables',
      components: {
        input: PrintablesCategorySubcategory,
      },
    },
    {
      name: 'limit',
      type: 'number',
      title: 'Number of Models to Scrape',
      initialValue: 10,
    },
    {
      name: 'status',
      type: 'string',
      title: 'Scraping Status',
      options: {
        list: ['pending', 'in_progress', 'completed', 'failed'],
      },
      initialValue: 'pending',
      readOnly: true,
    },
  ],
}
