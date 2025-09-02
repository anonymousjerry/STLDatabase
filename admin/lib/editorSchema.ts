import { defineSchema } from '@portabletext/editor'

export const schemaDefinition = defineSchema({
  decorators: [
    { name: 'strong' }, 
    { name: 'em' }, 
    { name: 'underline' }
  ],
  styles: [
    { name: 'normal' },
    { name: 'h1' },
    { name: 'h2' },
    { name: 'blockquote' },
  ],
  lists: [
    { name: 'bullet' }, 
    { name: 'number' }
  ],
  annotations: [
    { name: 'link' }
  ],
  inlineObjects: [],
  blockObjects: [
    { name: 'image' }
  ],
})

export type EditorSchema = typeof schemaDefinition
