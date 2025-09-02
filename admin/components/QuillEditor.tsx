"use client";

import React, { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export function QuillEditor({
  value,
  onChange,
  placeholder = "Write your blog content...",
  height = 400
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      // Dynamically import Quill to avoid SSR issues
      import('quill').then((Quill) => {
        const QuillClass = Quill.default || Quill;
        
        // Quill modules configuration
        const modules = {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link', 'image', 'blockquote', 'code-block'],
            ['clean']
          ],
          clipboard: {
            matchVisual: false,
          }
        };

        // Create Quill instance
        quillRef.current = new QuillClass(editorRef.current!, {
          theme: 'snow',
          modules,
          placeholder,
          formats: [
            'header',
            'bold', 'italic', 'underline', 'strike',
            'color', 'background',
            'list', 'bullet', 'indent',
            'align',
            'link', 'image', 'blockquote', 'code-block'
          ]
        });

        // Set initial value
        if (value) {
          quillRef.current.root.innerHTML = value;
        }

        // Handle content changes
        quillRef.current.on('text-change', () => {
          const html = quillRef.current.root.innerHTML;
          // Only trigger onChange if content actually changed
          if (html !== value) {
            onChange(html);
          }
        });
      });
    }
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value]);

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>📝</span>
          <span>Quill Rich Text Editor</span>
        </div>
      </div>
      
      <div style={{ height: height }}>
        <div 
          ref={editorRef}
          style={{ height: height - 60 }}
          className="quill-editor-container"
        />
      </div>
    </div>
  );
}
