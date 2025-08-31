import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'code',
  title: 'Code Block',
  type: 'object',
  fields: [
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 10,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'Python', value: 'python' },
          { title: 'Java', value: 'java' },
          { title: 'C++', value: 'cpp' },
          { title: 'C#', value: 'csharp' },
          { title: 'PHP', value: 'php' },
          { title: 'Ruby', value: 'ruby' },
          { title: 'Go', value: 'go' },
          { title: 'Rust', value: 'rust' },
          { title: 'Swift', value: 'swift' },
          { title: 'Kotlin', value: 'kotlin' },
          { title: 'SQL', value: 'sql' },
          { title: 'JSON', value: 'json' },
          { title: 'YAML', value: 'yaml' },
          { title: 'Markdown', value: 'markdown' },
          { title: 'Shell', value: 'shell' },
          { title: 'Plain Text', value: 'text' },
        ],
      },
      initialValue: 'javascript',
    }),
    defineField({
      name: 'filename',
      title: 'Filename',
      type: 'string',
      description: 'Optional filename for the code block',
    }),
    defineField({
      name: 'highlightedLines',
      title: 'Highlighted Lines',
      type: 'array',
      of: [{ type: 'number' }],
      description: 'Line numbers to highlight (optional)',
    }),
  ],
  preview: {
    select: {
      title: 'filename',
      subtitle: 'language',
      media: 'code',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title || 'Code Block',
        subtitle: subtitle ? `${subtitle} code` : 'Code',
        media: () => '💻',
      }
    },
  },
})
