import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, Undo2 } from 'lucide-react';
import { cn } from '../lib/cn.js';

export function RichTextBioEditor({
  value,
  onChange,
  placeholder = 'Compose showcase biography…',
  className,
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value ?? '',
    onUpdate: ({ editor: ed }) => onChange?.(ed.getHTML()),
    editorProps: {
      attributes: {
        class:
          cn(
            'tiptap min-h-[148px] max-h-[260px] overflow-y-auto px-3 py-2.5 rounded-xl',
            'border border-white/[0.1] bg-black/50 text-zinc-100 focus:outline-none',
            '[&_.ProseMirror]:min-h-[120px]'
          ),
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const cur = editor.getHTML();
    const next = value ?? '';
    if (next !== cur) editor.commands.setContent(next, false);
  }, [value, editor]);

  if (!editor) return <div className="h-[160px] rounded-xl bg-white/[0.04] animate-pulse" />;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap gap-1 rounded-lg border border-white/10 bg-black/35 p-1">
        <ToolbarBtn
          active={editor.isActive('bold')}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('italic')}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('bulletList')}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn
          active={false}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolbarBtn>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarBtn({ children, active, ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-md p-2 text-zinc-400 transition-colors hover:text-amber-100',
        active && 'bg-amber-500/20 text-amber-100 ring-1 ring-amber-500/30'
      )}
      {...props}
    >
      {children}
    </button>
  );
}
