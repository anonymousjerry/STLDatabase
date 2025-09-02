"use client";

import React from 'react';
import { useEditor } from '@portabletext/editor'
import { EditorSchema } from '../lib/editorSchema'

interface ToolbarProps {
  schemaDefinition: EditorSchema;
}

export function EditorToolbar({ schemaDefinition }: ToolbarProps) {
  const editor = useEditor()
  
  if (!editor) return null;

  return (
    <div className="px-2 py-1 border-b bg-gray-50 flex gap-2 flex-wrap">
      {/* Style buttons */}
      {schemaDefinition.styles.map((style: any) => (
        <button
          key={style.name}
          type="button"
          className="text-sm px-2 py-1 rounded hover:bg-gray-100 text-gray-700"
          onClick={() => {
            editor.send({ type: 'style.toggle', style: style.name })
            editor.send({ type: 'focus' })
          }}
        >
          {style.name === 'normal' ? 'P' : 
           style.name === 'h1' ? 'H1' : 
           style.name === 'h2' ? 'H2' : 
           style.name === 'blockquote' ? 'Quote' : style.name}
        </button>
      ))}
      
      {/* List buttons */}
      {schemaDefinition.lists.map((list: any) => (
        <button
          key={list.name}
          type="button"
          className="text-sm px-2 py-1 rounded hover:bg-gray-100 text-gray-700"
                      onClick={() => {
              editor.send({ type: 'list.toggle', list: list.name } as any)
              editor.send({ type: 'focus' })
            }}
        >
          {list.name === 'bullet' ? '•' : list.name === 'number' ? '1.' : list.name}
        </button>
      ))}
      
      {/* Decorator buttons */}
      {schemaDefinition.decorators.map((dec: any) => (
        <button
          key={dec.name}
          type="button"
          className="text-sm px-2 py-1 rounded hover:bg-gray-100 text-gray-700"
          onClick={() => {
            editor.send({ type: 'decorator.toggle', decorator: dec.name })
            editor.send({ type: 'focus' })
          }}
        >
          {dec.name === 'strong' ? 'B' : 
           dec.name === 'em' ? 'I' : 
           dec.name === 'underline' ? 'U' : dec.name}
        </button>
      ))}
    </div>
  )
}
