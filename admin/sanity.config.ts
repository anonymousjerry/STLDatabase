import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemaTypes'
import { structure } from './sanity/structure'
import { socketNotifierPlugin } from './sanity/plugins/socketNotifierPlugin'
import './global.css';

export default defineConfig({
  name: 'default',
  title: 'STLDatabase',

  projectId: 'vngrr2a1',
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
