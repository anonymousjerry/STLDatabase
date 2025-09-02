import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemaTypes'
import { structure } from './sanity/structure'
import { socketNotifierPlugin } from './sanity/plugins/socketNotifierPlugin'
import './global.css';

export default defineConfig({
  name: 'default',
  title: '3DDatabase',

  projectId: 'dktl6wwa',
  dataset: 'production',

  plugins: [
    structureTool({structure}), 
    visionTool(),
    socketNotifierPlugin()
  ],

  schema: {
    types: schemaTypes,
  },
})
