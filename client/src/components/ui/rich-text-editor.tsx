import { useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Undo,
  Redo,
  Code,
  Slash,
  Quote,
  PanelLeft,
  Pilcrow
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Inizia a scrivere il contenuto...',
  className
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md max-w-full',
        },
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-slate dark:prose-invert focus:outline-none max-w-none',
          'min-h-[200px] p-4 rounded-md border border-border',
          isFocused ? 'border-primary' : 'border-input bg-background',
        ),
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Aggiorna il contenuto quando cambia dall'esterno
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  function addImage() {
    const url = window.prompt('Inserisci URL dell\'immagine');
    
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }

  function addLink() {
    const url = window.prompt('Inserisci URL del link');
    
    if (url && editor) {
      // Se c'è del testo selezionato, lo trasforma in link
      if (editor.state.selection.empty) {
        const text = window.prompt('Inserisci il testo del link');
        if (text) {
          editor
            .chain()
            .focus()
            .insertContent(`<a href="${url}" target="_blank">${text}</a>`)
            .run();
        }
      } else {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  }

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('flex flex-col space-y-2', className)}>
      <div className="bg-muted p-1 rounded-md flex flex-wrap gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
          title="Grassetto"
          type="button"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
          title="Corsivo"
          type="button"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'bg-accent' : ''}
          title="Codice"
          type="button"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
          title="Titolo 1"
          type="button"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
          title="Titolo 2"
          type="button"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
          title="Lista puntata"
          type="button"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
          title="Lista numerata"
          type="button"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-accent' : ''}
          title="Citazione"
          type="button"
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={editor.isActive('link') ? 'bg-accent' : ''}
          title="Inserisci link"
          type="button"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={addImage}
          title="Inserisci immagine"
          type="button"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'bg-accent' : ''}
          title="Paragrafo"
          type="button"
        >
          <Pilcrow className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Linea orizzontale"
          type="button"
        >
          <Slash className="h-4 w-4" />
        </Button>
        
        <div className="ml-auto flex">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Annulla"
            type="button"
          >
            <Undo className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Ripeti"
            type="button"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <EditorContent 
        editor={editor} 
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      
      {!content && !editor.isEmpty && (
        <div className="text-sm text-muted-foreground">
          {editor.storage.characterCount.words()} parole
        </div>
      )}
    </div>
  );
}