import {defineCliConfig} from 'sanity/cli'
// import './tailwind.css'

export default defineCliConfig({
  api: {
    projectId: 'vngrr2a1',
    dataset: 'production',
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
