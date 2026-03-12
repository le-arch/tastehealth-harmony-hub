import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Quote, 
  Minus, 
  Upload,
  Eye,
  Edit3,
  HelpCircle,
  Undo,
  Redo,
  Image
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  onImageUpload?: (dataUrl: string) => void;
}

const TOOLBAR_BUTTONS = [
  { icon: Bold, label: 'Bold', prefix: '**', suffix: '**', shortcut: 'Ctrl+B' },
  { icon: Italic, label: 'Italic', prefix: '*', suffix: '*', shortcut: 'Ctrl+I' },
  { icon: Heading1, label: 'Heading 1', prefix: '# ', suffix: '', shortcut: 'Ctrl+1' },
  { icon: Heading2, label: 'Heading 2', prefix: '## ', suffix: '', shortcut: 'Ctrl+2' },
  { icon: List, label: 'Bullet List', prefix: '- ', suffix: '', shortcut: 'Ctrl+L' },
  { icon: ListOrdered, label: 'Numbered List', prefix: '1. ', suffix: '', shortcut: 'Ctrl+Shift+L' },
  { icon: CheckSquare, label: 'Checklist', prefix: '- [ ] ', suffix: '', shortcut: 'Ctrl+Shift+C' },
  { icon: Quote, label: 'Quote', prefix: '> ', suffix: '', shortcut: 'Ctrl+Q' },
  { icon: Minus, label: 'Divider', prefix: '\n---\n', suffix: '', shortcut: 'Ctrl+Shift+-' },
];

// Sample markdown examples for the help guide
const MARKDOWN_EXAMPLES = [
  { label: 'Bold', syntax: '**bold text**', preview: 'bold text' },
  { label: 'Italic', syntax: '*italic text*', preview: 'italic text' },
  { label: 'Heading 1', syntax: '# Heading 1', preview: 'Heading 1' },
  { label: 'Heading 2', syntax: '## Heading 2', preview: 'Heading 2' },
  { label: 'Bullet List', syntax: '- Item 1\n- Item 2', preview: '• Item 1\n• Item 2' },
  { label: 'Numbered List', syntax: '1. First\n2. Second', preview: '1. First\n2. Second' },
  { label: 'Checklist', syntax: '- [ ] Task\n- [x] Done', preview: '☐ Task\n☑ Done' },
  { label: 'Quote', syntax: '> Quote text', preview: '“Quote text”' },
  { label: 'Image', syntax: '![alt text](image-url)', preview: '🖼️ Image' },
  { label: 'Link', syntax: '[link text](url)', preview: '🔗 link text' },
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, 
  onChange, 
  placeholder = 'Write something...', 
  minRows = 8, 
  onImageUpload 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // Update history when value changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== history[historyIndex]) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(value);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [value]);

  const insertFormat = (prefix: string, suffix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);
    
    let newText;
    if (selected) {
      // If text is selected, wrap it
      newText = `${before}${prefix}${selected}${suffix}${after}`;
    } else {
      // If no text selected, insert prefix at cursor
      newText = `${before}${prefix}${suffix}${after}`;
    }
    
    onChange(newText);
    
    // Set cursor position after the inserted format
    setTimeout(() => { 
      ta.focus(); 
      if (selected) {
        ta.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
      } else {
        ta.setSelectionRange(start + prefix.length, start + prefix.length);
      }
    }, 0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (onImageUpload) { 
        onImageUpload(dataUrl); 
      }
      insertFormat(`![${file.name}](${dataUrl})`, '');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertFormat('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertFormat('*', '*');
          break;
        case '1':
          e.preventDefault();
          insertFormat('# ', '');
          break;
        case '2':
          e.preventDefault();
          insertFormat('## ', '');
          break;
        case 'l':
          e.preventDefault();
          if (e.shiftKey) {
            insertFormat('1. ', '');
          } else {
            insertFormat('- ', '');
          }
          break;
        case 'q':
          e.preventDefault();
          insertFormat('> ', '');
          break;
        case 'z':
          e.preventDefault();
          undo();
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
      }
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onChange(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onChange(history[historyIndex + 1]);
    }
  };

  const renderMarkdown = (text: string) => {
    if (!text.trim()) {
      return <p className="text-muted-foreground italic">{placeholder}</p>;
    }

    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={i} className="text-md font-bold mt-3 mb-1">{processInline(line.slice(4))}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-4 mb-2">{processInline(line.slice(3))}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mt-5 mb-3 border-b pb-1">{processInline(line.slice(2))}</h1>;
      
      // Checklists
      if (line.startsWith('- [x] ')) return (
        <div key={i} className="flex items-center gap-2 my-1">
          <input type="checkbox" checked readOnly className="h-4 w-4 rounded border-primary" />
          <span className="line-through text-muted-foreground">{processInline(line.slice(6))}</span>
        </div>
      );
      if (line.startsWith('- [ ] ')) return (
        <div key={i} className="flex items-center gap-2 my-1">
          <input type="checkbox" readOnly className="h-4 w-4 rounded border-input" />
          <span>{processInline(line.slice(6))}</span>
        </div>
      );
      
      // Lists
      if (line.startsWith('- ')) return <li key={i} className="ml-6 list-disc my-1">{processInline(line.slice(2))}</li>;
      if (/^\d+\. /.test(line)) return <li key={i} className="ml-6 list-decimal my-1">{processInline(line.replace(/^\d+\. /, ''))}</li>;
      
      // Blockquotes
      if (line.startsWith('> ')) return (
        <blockquote key={i} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-2 py-1 bg-muted/30 rounded-r">
          {processInline(line.slice(2))}
        </blockquote>
      );
      
      // Horizontal rule
      if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
        return <hr key={i} className="my-4 border-t-2 border-muted" />;
      }
      
      // Images
      const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
        return (
          <div key={i} className="my-3">
            <img 
              src={imgMatch[2]} 
              alt={imgMatch[1]} 
              className="max-w-full rounded-lg max-h-64 object-cover shadow-md hover:shadow-lg transition-shadow"
            />
            {imgMatch[1] && (
              <p className="text-xs text-center text-muted-foreground mt-1">{imgMatch[1]}</p>
            )}
          </div>
        );
      }
      
      // Links
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      if (linkRegex.test(line)) {
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;
        linkRegex.lastIndex = 0;
        
        while ((match = linkRegex.exec(line)) !== null) {
          if (match.index > lastIndex) {
            parts.push(line.slice(lastIndex, match.index));
          }
          parts.push(
            <a key={i + '-' + match.index} href={match[2]} target="_blank" rel="noopener noreferrer" 
               className="text-primary hover:underline inline-flex items-center gap-1">
              {match[1]}
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          );
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < line.length) {
          parts.push(line.slice(lastIndex));
        }
        return <p key={i} className="my-1">{parts}</p>;
      }
      
      // Empty line
      if (line.trim() === '') return <br key={i} />;
      
      // Regular paragraph
      return <p key={i} className="my-1">{processInline(line)}</p>;
    });
  };

  const processInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;
    
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
      const italicMatch = remaining.match(/\*(.*?)\*/);
      const codeMatch = remaining.match(/`(.*?)`/);
      
      // Find the earliest match
      const matches = [
        { match: boldMatch, type: 'bold', index: boldMatch?.index ?? Infinity },
        { match: italicMatch, type: 'italic', index: italicMatch?.index ?? Infinity },
        { match: codeMatch, type: 'code', index: codeMatch?.index ?? Infinity },
      ].sort((a, b) => a.index - b.index);
      
      const earliest = matches[0];
      
      if (earliest.match && earliest.index !== Infinity) {
        // Add text before the match
        if (earliest.index > 0) {
          parts.push(remaining.slice(0, earliest.index));
        }
        
        // Add formatted text
        switch (earliest.type) {
          case 'bold':
            parts.push(<strong key={key++} className="font-bold">{earliest.match[1]}</strong>);
            break;
          case 'italic':
            parts.push(<em key={key++} className="italic">{earliest.match[1]}</em>);
            break;
          case 'code':
            parts.push(<code key={key++} className="bg-muted px-1 py-0.5 rounded font-mono text-sm">{earliest.match[1]}</code>);
            break;
        }
        
        // Update remaining text
        remaining = remaining.slice(earliest.index + earliest.match[0].length);
      } else {
        // No more matches
        parts.push(remaining);
        break;
      }
    }
    
    return parts;
  };

  return (
    <TooltipProvider>
      <div className="border border-input rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-shadow">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />
        
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 p-1.5 border-b border-input bg-muted/30 flex-wrap">
          {TOOLBAR_BUTTONS.map((btn) => (
            <Tooltip key={btn.label}>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors relative group"
                  onClick={() => insertFormat(btn.prefix, btn.suffix)}
                >
                  <btn.icon className="h-4 w-4" />
                  {!preview && (
                    <span className="absolute -top-1 -right-1 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                      ⌨️
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>{btn.label} <span className="text-muted-foreground">({btn.shortcut})</span></p>
              </TooltipContent>
            </Tooltip>
          ))}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Insert Image</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-primary/10"
                onClick={undo}
                disabled={historyIndex === 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Undo (Ctrl+Z)</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-primary/10"
                onClick={redo}
                disabled={historyIndex === history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Redo (Ctrl+Y)</p>
            </TooltipContent>
          </Tooltip>
          
          <div className="flex-1" />
          
          {/* Help Popover */}
          <Popover open={showHelp} onOpenChange={setShowHelp}>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-3">
                <h4 className="font-medium">Markdown Guide</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {MARKDOWN_EXAMPLES.map((ex, i) => (
                    <div key={i} className="p-2 bg-muted/30 rounded">
                      <p className="font-mono text-[10px]">{ex.syntax}</p>
                      <p className="text-muted-foreground mt-1">→ {ex.preview}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tip: Select text and click buttons to format, or use keyboard shortcuts.
                </p>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Preview Toggle */}
          <Button 
            type="button" 
            variant={preview ? "default" : "outline"} 
            size="sm" 
            className="h-7 gap-1 text-xs px-3 ml-1"
            onClick={() => setPreview(!preview)}
          >
            {preview ? (
              <>
                <Edit3 className="h-3 w-3" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-3 w-3" />
                Preview
              </>
            )}
          </Button>
        </div>

        {/* Editor/Preview Area */}
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-4 min-h-[200px] prose prose-sm dark:prose-invert max-w-none text-sm bg-white dark:bg-gray-950"
            >
              {renderMarkdown(value)}
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <textarea 
                ref={textareaRef} 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={minRows} 
                className="w-full p-4 resize-y bg-transparent text-sm focus:outline-none min-h-[200px] font-mono"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character Count */}
        <div className="px-4 py-1 border-t border-input bg-muted/20 text-xs text-muted-foreground flex justify-between">
          <span>
            {value.length} characters • {value.split('\n').length} lines
          </span>
          {!preview && (
            <span>
              {value.trim() ? 'Ready' : 'Empty'}
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RichTextEditor;