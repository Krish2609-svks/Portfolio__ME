"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Undo, Redo, Code } from 'lucide-react'

export function Editor({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-blue max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950 flex flex-col">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-800 bg-zinc-900">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 transition-colors ${editor.isActive('bold') ? 'bg-zinc-800 text-white' : ''}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 transition-colors ${editor.isActive('italic') ? 'bg-zinc-800 text-white' : ''}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-zinc-700 mx-1" />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-zinc-800 text-white' : ''}`}
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 transition-colors ${editor.isActive('bulletList') ? 'bg-zinc-800 text-white' : ''}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 transition-colors ${editor.isActive('orderedList') ? 'bg-zinc-800 text-white' : ''}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 transition-colors ${editor.isActive('blockquote') ? 'bg-zinc-800 text-white' : ''}`}
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded hover:bg-zinc-800 text-zinc-400 transition-colors ${editor.isActive('codeBlock') ? 'bg-zinc-800 text-white' : ''}`}
        >
          <Code className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-zinc-700 mx-1" />
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-zinc-800 text-zinc-400 transition-colors disabled:opacity-50"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-zinc-800 text-zinc-400 transition-colors disabled:opacity-50"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 bg-zinc-950 text-zinc-200 cursor-text min-h-[300px]">
        <EditorContent editor={editor} className="h-full w-full" />
      </div>
    </div>
  )
}
