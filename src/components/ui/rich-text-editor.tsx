
import React, { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, CheckSquare, Quote, Image, ListTodo } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, rows = 5 }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormatting = useCallback((prefix: string, suffix: string = '', wrap: boolean = true) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText;
    let newCursorPos;
    
    if (wrap && selectedText) {
      newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
      newCursorPos = end + prefix.length + suffix.length;
    } else if (!wrap) {
      newText = value.substring(0, start) + prefix + value.substring(end);
      newCursorPos = start + prefix.length;
    } else {
      newText = value.substring(0, start) + prefix + suffix + value.substring(end);
      newCursorPos = start + prefix.length;
    }
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  const formatBold = () => insertFormatting('**', '**');
  const formatItalic = () => insertFormatting('*', '*');
  const formatH1 = () => insertFormatting('# ', '', false);
  const formatH2 = () => insertFormatting('## ', '', false);
  const formatBullet = () => insertFormatting('- ', '', false);
  const formatNumbered = () => insertFormatting('1. ', '', false);
  const formatChecklist = () => insertFormatting('- [ ] ', '', false);
  const formatQuote = () => insertFormatting('> ', '', false);
  
  const handleImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      insertFormatting(`![Image](${url})`, '', false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 p-1 bg-muted/50 rounded-lg">
        <Button type="button" variant="ghost" size="sm" onClick={formatBold} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatItalic} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatH1} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatH2} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatBullet} title="Bullet List">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatNumbered} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatChecklist} title="Checklist">
          <ListTodo className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={formatQuote} title="Quote">
          <Quote className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleImage} title="Add Image">
          <Image className="h-4 w-4" />
        </Button>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <p className="text-xs text-muted-foreground">
        Supports: **bold**, *italic*, # headings, - bullets, 1. numbered, - [ ] checklist, &gt; quote, ![image](url)
      </p>
    </div>
  );
};

export const renderFormattedText = (text: string): React.ReactNode => {
  if (!text) return null;
  
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-xl font-bold">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-lg font-semibold">{line.substring(3)}</h2>;
        }
        if (line.startsWith('- [ ] ')) {
          return (
            <div key={index} className="flex items-center gap-2">
              <input type="checkbox" disabled className="rounded" />
              <span className="line-through text-muted-foreground">{line.substring(6)}</span>
            </div>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <div key={index} className="flex items-center gap-2">
              <span className="text-primary">•</span>
              <span>{line.substring(2)}</span>
            </div>
          );
        }
        if (line.match(/^\d+\. /)) {
          const num = line.match(/^(\d+)\. /)?.[1];
          return (
            <div key={index} className="flex items-center gap-2">
              <span className="text-primary font-medium">{num}.</span>
              <span>{line.substring(num!.length + 2)}</span>
            </div>
          );
        }
        if (line.startsWith('> ')) {
          return (
            <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-muted-foreground">
              {line.substring(2)}
            </blockquote>
          );
        }
        const boldItalicParts = [];
        let remaining = line;
        let key = 0;
        
        while (remaining.length > 0) {
          const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
          if (boldMatch) {
            boldItalicParts.push(<strong key={key++}>{boldMatch[1]}</strong>);
            remaining = remaining.substring(boldMatch[0].length);
            continue;
          }
          const italicMatch = remaining.match(/^\*(.+?)\*/);
          if (italicMatch) {
            boldItalicParts.push(<em key={key++}>{italicMatch[1]}</em>);
            remaining = remaining.substring(italicMatch[0].length);
            continue;
          }
          if (remaining.length > 0) {
            const nextSpecial = remaining.search(/\*\*|\*/);
            if (nextSpecial === -1) {
              boldItalicParts.push(<span key={key++}>{remaining}</span>);
              break;
            } else if (nextSpecial === 0) {
              boldItalicParts.push(<span key={key++}>{remaining[0]}</span>);
              remaining = remaining.substring(1);
            } else {
              boldItalicParts.push(<span key={key++}>{remaining.substring(0, nextSpecial)}</span>);
              remaining = remaining.substring(nextSpecial);
            }
          } else {
            break;
          }
        }
        
        return <p key={index}>{boldItalicParts}</p>;
      })}
    </div>
  );
};
