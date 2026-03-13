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
  Image,
  Code,
  ListChecks
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
  { icon: Code, label: 'Code', prefix: '`', suffix: '`', shortcut: 'Ctrl+`' },
  { icon: Heading1, label: 'Heading 1', prefix: '# ', suffix: '', shortcut: 'Ctrl+1' },
  { icon: Heading2, label: 'Heading 2', prefix: '## ', suffix: '', shortcut: 'Ctrl+2' },
  { icon: List, label: 'Bullet List', prefix: '- ', suffix: '', shortcut: 'Ctrl+L' },
  { icon: ListOrdered, label: 'Numbered List', prefix: '1. ', suffix: '', shortcut: 'Ctrl+Shift+L' },
  { icon: ListChecks, label: 'Checklist', prefix: '- [ ] ', suffix: '', shortcut: 'Ctrl+Shift+C' },
  { icon: Quote, label: 'Quote', prefix: '> ', suffix: '', shortcut: 'Ctrl+Q' },
  { icon: Minus, label: 'Divider', prefix: '\n---\n', suffix: '', shortcut: 'Ctrl+Shift+-' },
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
  const previewRef = useRef<HTMLDivElement>(null);
  const splitLeftRef = useRef<HTMLTextAreaElement>(null);
  const splitRightRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'write' | 'preview' | 'split'>('write');
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0 });

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

  // Sync scroll positions in split mode
  useEffect(() => {
    if (mode === 'split' && splitLeftRef.current && splitRightRef.current) {
      const handleLeftScroll = () => {
        if (splitRightRef.current) {
          const leftPercent = splitLeftRef.current.scrollTop / (splitLeftRef.current.scrollHeight - splitLeftRef.current.clientHeight);
          splitRightRef.current.scrollTop = leftPercent * (splitRightRef.current.scrollHeight - splitRightRef.current.clientHeight);
        }
      };

      const handleRightScroll = () => {
        if (splitLeftRef.current) {
          const rightPercent = splitRightRef.current.scrollTop / (splitRightRef.current.scrollHeight - splitRightRef.current.clientHeight);
          splitLeftRef.current.scrollTop = rightPercent * (splitLeftRef.current.scrollHeight - splitLeftRef.current.clientHeight);
        }
      };

      splitLeftRef.current.addEventListener('scroll', handleLeftScroll);
      splitRightRef.current.addEventListener('scroll', handleRightScroll);

      return () => {
        splitLeftRef.current?.removeEventListener('scroll', handleLeftScroll);
        splitRightRef.current?.removeEventListener('scroll', handleRightScroll);
      };
    }
  }, [mode]);

  const insertFormat = (prefix: string, suffix: string) => {
    const ta = mode === 'split' ? splitLeftRef.current : textareaRef.current;
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
        case '`':
          e.preventDefault();
          insertFormat('`', '`');
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

    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listType: 'ul' | 'ol' | 'check' | null = null;
    let listItems: React.ReactNode[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        if (listType === 'ul') {
          elements.push(<ul key={`list-${elements.length}`} className="list-disc pl-6 my-2">{listItems}</ul>);
        } else if (listType === 'ol') {
          elements.push(<ol key={`list-${elements.length}`} className="list-decimal pl-6 my-2">{listItems}</ol>);
        } else if (listType === 'check') {
          elements.push(<div key={`list-${elements.length}`} className="my-2">{listItems}</div>);
        }
        listItems = [];
        inList = false;
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      // Check if line is a list item
      const isBullet = line.startsWith('- ');
      const isNumbered = /^\d+\. /.test(line);
      const isCheckbox = line.startsWith('- [ ] ') || line.startsWith('- [x] ');
      
      if (isBullet || isNumbered || isCheckbox) {
        if (!inList) {
          flushList();
          inList = true;
          listType = isCheckbox ? 'check' : (isBullet ? 'ul' : 'ol');
        }
        
        if (isCheckbox) {
          const checked = line.startsWith('- [x] ');
          const content = line.slice(6);
          listItems.push(
            <div key={`item-${index}`} className="flex items-center gap-2 my-1">
              <input type="checkbox" checked={checked} readOnly className="h-4 w-4 rounded border-primary" />
              <span className={checked ? 'line-through text-muted-foreground' : ''}>
                {processInline(content)}
              </span>
            </div>
          );
        } else {
          const content = isBullet ? line.slice(2) : line.replace(/^\d+\. /, '');
          listItems.push(
            <li key={`item-${index}`} className="my-1">{processInline(content)}</li>
          );
        }
      } else {
        flushList();

        // Handle other elements
        if (line.startsWith('### ')) {
          elements.push(<h3 key={index} className="text-md font-bold mt-3 mb-1">{processInline(line.slice(4))}</h3>);
        } else if (line.startsWith('## ')) {
          elements.push(<h2 key={index} className="text-lg font-bold mt-4 mb-2">{processInline(line.slice(3))}</h2>);
        } else if (line.startsWith('# ')) {
          elements.push(<h1 key={index} className="text-xl font-bold mt-5 mb-3 border-b pb-1">{processInline(line.slice(2))}</h1>);
        } else if (line.startsWith('> ')) {
          elements.push(
            <blockquote key={index} className="border-l-4 border-primary pl-4 italic text-muted-foreground my-2 py-1 bg-muted/30 rounded-r">
              {processInline(line.slice(2))}
            </blockquote>
          );
        } else if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
          elements.push(<hr key={index} className="my-4 border-t-2 border-muted" />);
        } else {
          // Check for images
          const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
          if (imgMatch) {
            elements.push(
              <div key={index} className="my-3">
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
          } else if (line.trim() === '') {
            elements.push(<br key={index} />);
          } else {
            elements.push(<p key={index} className="my-1">{processInline(line)}</p>);
          }
        }
      }
    });

    flushList();
    return elements;
  };

  const processInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;
    
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
      const italicMatch = remaining.match(/\*(.*?)\*/);
      const codeMatch = remaining.match(/`(.*?)`/);
      const linkMatch = remaining.match(/\[(.*?)\]\((.*?)\)/);
      
      // Find the earliest match
      const matches = [
        { match: boldMatch, type: 'bold', index: boldMatch?.index ?? Infinity },
        { match: italicMatch, type: 'italic', index: italicMatch?.index ?? Infinity },
        { match: codeMatch, type: 'code', index: codeMatch?.index ?? Infinity },
        { match: linkMatch, type: 'link', index: linkMatch?.index ?? Infinity },
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
          case 'link':
            parts.push(
              <a key={key++} href={earliest.match[2]} target="_blank" rel="noopener noreferrer" 
                 className="text-primary hover:underline inline-flex items-center gap-1">
                {earliest.match[1]}
              </a>
            );
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
      <div className="border border-input rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-all duration-300">
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
                  <span className="absolute -top-1 -right-1 text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">
                    ⌨️
                  </span>
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
                  <div className="p-2 bg-muted/30 rounded">
                    <p className="font-mono text-[10px]">**bold**</p>
                    <p className="text-muted-foreground mt-1">→ <strong>bold</strong></p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded">
                    <p className="font-mono text-[10px]">*italic*</p>
                    <p className="text-muted-foreground mt-1">→ <em>italic</em></p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded">
                    <p className="font-mono text-[10px]">`code`</p>
                    <p className="text-muted-foreground mt-1">→ <code>code</code></p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded">
                    <p className="font-mono text-[10px]"># Heading</p>
                    <p className="text-muted-foreground mt-1">→ Heading</p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded">
                    <p className="font-mono text-[10px]">- list</p>
                    <p className="text-muted-foreground mt-1">→ • list</p>
                  </div>
                  <div className="p-2 bg-muted/30 rounded">
                    <p className="font-mono text-[10px]">1. numbered</p>
                    <p className="text-muted-foreground mt-1">→ 1. numbered</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select text and click buttons to format, or use keyboard shortcuts.
                </p>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Mode Toggle */}
          <div className="flex items-center gap-1 ml-1 border-l border-border pl-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant={mode === 'write' ? "default" : "ghost"} 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => setMode('write')}
                >
                  <Edit3 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Write mode</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant={mode === 'split' ? "default" : "ghost"} 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => setMode('split')}
                >
                  <div className="flex gap-0.5">
                    <div className="w-1 h-3 bg-current rounded" />
                    <div className="w-1 h-3 bg-current rounded" />
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Split view</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="button" 
                  variant={mode === 'preview' ? "default" : "ghost"} 
                  size="sm" 
                  className="h-7 w-7 p-0"
                  onClick={() => setMode('preview')}
                >
                  <Eye className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Preview mode</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Editor/Preview Area */}
        <AnimatePresence mode="wait">
          {mode === 'write' && (
            <motion.div
              key="write"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-y-auto"
              style={{ maxHeight: `${minRows * 1.5}rem` }}
            >
              <textarea 
                ref={textareaRef} 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                onKeyDown={handleKeyDown}
                onSelect={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  setSelectedText({
                    start: target.selectionStart,
                    end: target.selectionEnd
                  });
                }}
                placeholder={placeholder}
                rows={minRows} 
                className="w-full p-4 resize-none bg-transparent text-sm focus:outline-none min-h-[200px] font-mono"
              />
            </motion.div>
          )}

          {mode === 'preview' && (
            <motion.div 
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-y-auto"
              style={{ maxHeight: `${minRows * 1.5}rem` }}
            >
              <div 
                ref={previewRef}
                className="p-4 prose prose-sm dark:prose-invert max-w-none text-sm bg-white dark:bg-gray-950"
                onClick={() => setMode('split')}
              >
                {renderMarkdown(value)}
              </div>
            </motion.div>
          )}

          {mode === 'split' && (
            <motion.div 
              key="split"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 divide-x divide-border"
              style={{ height: `${minRows * 1.5}rem` }}
            >
              {/* Left side - Editor */}
              <div className="overflow-y-auto h-full">
                <textarea 
                  ref={splitLeftRef} 
                  value={value} 
                  onChange={(e) => onChange(e.target.value)} 
                  onKeyDown={handleKeyDown}
                  onSelect={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    setSelectedText({
                      start: target.selectionStart,
                      end: target.selectionEnd
                    });
                  }}
                  placeholder={placeholder}
                  className="w-full h-full p-4 resize-none bg-transparent text-sm focus:outline-none font-mono"
                />
              </div>
              
              {/* Right side - Preview */}
              <div 
                ref={splitRightRef}
                className="overflow-y-auto h-full p-4 prose prose-sm dark:prose-invert max-w-none text-sm bg-muted/20"
              >
                {renderMarkdown(value)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Character Count */}
        <div className="px-4 py-1 border-t border-input bg-muted/20 text-xs text-muted-foreground flex justify-between">
          <span>
            {value.length} characters • {value.split('\n').length} lines
          </span>
          <div className="flex items-center gap-2">
            {mode !== 'preview' && (
              <span className={value.trim() ? 'text-green-500' : 'text-muted-foreground'}>
                {value.trim() ? '✓' : '○'}
              </span>
            )}
            <span>
              Mode: {mode}
            </span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RichTextEditor;