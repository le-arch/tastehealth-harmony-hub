import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, Heading1, Heading2, List, ListOrdered, CheckSquare, 
  Quote, Minus, Upload, HelpCircle, Undo, Redo, Image, ListChecks
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
  simple?: boolean;
}

// WYSIWYG-style editor that renders content directly
const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  value, onChange, placeholder = 'Write something...', minRows = 8, onImageUpload, simple = false
}) => {
  const isSimple = simple;
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    heading1: false,
    heading2: false,
    unorderedList: false,
    orderedList: false,
    blockquote: false,
  });
  const isInternalChange = useRef(false);

  const getParentBlockTag = (node: Node | null): string | null => {
    let current = node as HTMLElement | null;
    while (current && current !== editorRef.current) {
      if (current.tagName && ['H1', 'H2', 'BLOCKQUOTE', 'LI', 'P', 'PRE'].includes(current.tagName)) {
        return current.tagName;
      }
      current = current.parentElement;
    }
    return null;
  };

  const updateActiveFormats = () => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current || !editorRef.current.contains(selection.anchorNode)) {
      setActiveFormats(prev => ({ ...prev, bold: false, italic: false, underline: false, code: false, heading1: false, heading2: false, unorderedList: false, orderedList: false, blockquote: false }));
      return;
    }

    const parentTag = getParentBlockTag(selection.focusNode);

    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      heading1: parentTag === 'H1',
      heading2: parentTag === 'H2',
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
      blockquote: parentTag === 'BLOCKQUOTE',
    });
  };

  // Convert markdown to HTML for the contentEditable div
  const markdownToHtml = useCallback((md: string): string => {
    if (!md.trim()) return '';
    
    let html = md;
    
    // Process line by line for block elements
    const lines = html.split('\n');
    let result = '';
    let listMode: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (!listMode) return;
      result += `</${listMode}>\n`;
      listMode = null;
    };

    lines.forEach((line) => {
      if (line.startsWith('### ')) {
        flushList();
        result += `<h3>${line.slice(4)}</h3>`;
      } else if (line.startsWith('## ')) {
        flushList();
        result += `<h2>${line.slice(3)}</h2>`;
      } else if (line.startsWith('# ')) {
        flushList();
        result += `<h1>${line.slice(2)}</h1>`;
      } else if (line.startsWith('- [x] ')) {
        flushList();
        result += `<div class="checklist checked"><input type="checkbox" checked disabled /><span class="line-through text-muted-foreground">${line.slice(6)}</span></div>`;
      } else if (line.startsWith('- [ ] ')) {
        flushList();
        result += `<div class="checklist"><input type="checkbox" disabled /><span>${line.slice(6)}</span></div>`;
      } else if (line.startsWith('- ')) {
        if (listMode !== 'ul') {
          flushList();
          listMode = 'ul';
          result += '<ul class="list-disc pl-5">\n';
        }
        result += `<li>${line.slice(2)}</li>`;
      } else {
        const numMatch = line.match(/^(\d+)\. (.*)$/);
        if (numMatch) {
          if (listMode !== 'ol') {
            flushList();
            listMode = 'ol';
            result += '<ol class="list-decimal pl-5">\n';
          }
          result += `<li>${numMatch[2]}</li>`;
        } else if (line.startsWith('> ')) {
          flushList();
          result += `<blockquote>${line.slice(2)}</blockquote>`;
        } else if (line.trim() === '---' || line.trim() === '***') {
          flushList();
          result += '<hr />';
        } else {
          const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
          if (imgMatch) {
            flushList();
            result += `<img src="${imgMatch[2]}" alt="${imgMatch[1]}" />`;
          } else if (line.trim() === '') {
            flushList();
            result += '<br />';
          } else {
            flushList();
            result += `<p>${line}</p>`;
          }
        }
      }
      result += '\n';
    });

    flushList();
    html = result.trim();
    
    // Inline formatting
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    return html;
  }, []);

  // Convert HTML back to markdown
  const htmlToMarkdown = useCallback((html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    const processNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }
      
      if (node.nodeType !== Node.ELEMENT_NODE) return '';
      
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const childContent = Array.from(el.childNodes).map(processNode).join('');
      
      switch (tag) {
        case 'h1': return `# ${childContent}\n`;
        case 'h2': return `## ${childContent}\n`;
        case 'h3': return `### ${childContent}\n`;
        case 'strong': case 'b': return `**${childContent}**`;
        case 'em': case 'i': return `*${childContent}*`;
        case 'code': return `\`${childContent}\``;
        case 'blockquote': return `> ${childContent}\n`;
        case 'hr': return '---\n';
        case 'br': return '\n';
        case 'li': {
          const parent = el.closest('ol');
          if (parent) return `${Array.from(parent.children).indexOf(el) + 1}. ${childContent}\n`;
          const parentUl = el.closest('ul');
          if (parentUl) return `- ${childContent}\n`;
          if (el.classList.contains('bullet')) return `- ${childContent}\n`;
          if (el.classList.contains('numbered')) return `${el.getAttribute('value') || '1'}. ${childContent}\n`;
          return `- ${childContent}\n`;
        }
        case 'div':
          if (el.classList.contains('checklist')) {
            const checked = el.classList.contains('checked');
            const text = el.querySelector('span')?.textContent || childContent;
            return `- [${checked ? 'x' : ' '}] ${text}\n`;
          }
          return childContent + '\n';
        case 'p': return childContent + '\n';
        case 'img': return `![${el.getAttribute('alt') || ''}](${el.getAttribute('src') || ''})\n`;
        case 'a': return `[${childContent}](${el.getAttribute('href') || ''})`;
        case 'input': return '';
        case 'span': return childContent;
        default: return childContent;
      }
    };
    
    const result = Array.from(tempDiv.childNodes).map(processNode).join('');
    // Clean up multiple newlines
    return result.replace(/\n{3,}/g, '\n\n').trim();
  }, []);

  // Sync editor content when value prop changes externally
  useEffect(() => {
    if (isSimple) {
      return;
    }
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editorRef.current) {
      const html = markdownToHtml(value);
      if (editorRef.current.innerHTML !== html) {
        editorRef.current.innerHTML = html || '';
      }
    }
  }, [value, markdownToHtml, isSimple]);

  useEffect(() => {
    if (isSimple) return;
    document.addEventListener('selectionchange', updateActiveFormats);
    return () => document.removeEventListener('selectionchange', updateActiveFormats);
  }, [isSimple]);

  // Handle input from contentEditable
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    const md = htmlToMarkdown(editorRef.current.innerHTML);
    onChange(md);
    updateActiveFormats();
  }, [htmlToMarkdown, onChange]);

  // Update history on value change
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

  // Execute formatting command
  const execFormat = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const applyBlock = (blockTag: 'H1' | 'H2' | 'BLOCKQUOTE') => {
    editorRef.current?.focus();
    let target: string = blockTag;
    if (blockTag === 'BLOCKQUOTE' && activeFormats.blockquote) {
      target = 'P';
    } else if (blockTag === 'H1' && activeFormats.heading1) {
      target = 'P';
    } else if (blockTag === 'H2' && activeFormats.heading2) {
      target = 'P';
    }
    document.execCommand('formatBlock', false, target);
    handleInput();
    updateActiveFormats();
  };

  const toggleList = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, null);
    handleInput();
    updateActiveFormats();
  };

  const insertDivider = () => {
    editorRef.current?.focus();
    document.execCommand('insertHorizontalRule', false, null);
    handleInput();
    updateActiveFormats();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (onImageUpload) onImageUpload(dataUrl);
      const newMd = value + (value.endsWith('\n') || value === '' ? '' : '\n') + `![${file.name}](${dataUrl})`;
      onChange(newMd);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b': e.preventDefault(); execFormat('bold'); break;
        case 'i': e.preventDefault(); execFormat('italic'); break;
        case 'z': e.preventDefault(); undo(); break;
        case 'y': e.preventDefault(); redo(); break;
      }
    }
  };

  const toolbarButtons = [
    { icon: Bold, label: 'Bold', action: () => execFormat('bold'), active: activeFormats.bold, shortcut: 'Ctrl+B' },
    { icon: Italic, label: 'Italic', action: () => execFormat('italic'), active: activeFormats.italic, shortcut: 'Ctrl+I' },
    { icon: Heading1, label: 'Heading 1', action: () => applyBlock('H1'), active: activeFormats.heading1, shortcut: 'Ctrl+1' },
    { icon: Heading2, label: 'Heading 2', action: () => applyBlock('H2'), active: activeFormats.heading2, shortcut: 'Ctrl+2' },
    { icon: List, label: 'Bullet List', action: () => toggleList('insertUnorderedList'), active: activeFormats.unorderedList, shortcut: 'Ctrl+L' },
    { icon: ListOrdered, label: 'Numbered List', action: () => toggleList('insertOrderedList'), active: activeFormats.orderedList, shortcut: 'Ctrl+Shift+L' },
    { icon: ListChecks, label: 'Checklist', action: () => execFormat('insertHTML', '<input type="checkbox" disabled /> '), active: false, shortcut: 'Ctrl+Shift+C' },
    { icon: Quote, label: 'Quote', action: () => applyBlock('BLOCKQUOTE'), active: activeFormats.blockquote, shortcut: 'Ctrl+Q' },
    { icon: Minus, label: 'Divider', action: insertDivider, active: false, shortcut: 'Ctrl+Shift+-' },
  ];

  if (isSimple) {
    return (
      <div className="border border-input rounded-lg overflow-hidden bg-background shadow-sm transition-all duration-300">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={Math.max(minRows, 6)}
          className="w-full p-3 text-sm resize-none outline-none border-none bg-transparent placeholder:text-muted-foreground"
        />
        <div className="px-3 py-2 border-t border-input bg-muted/20 text-xs text-muted-foreground flex justify-between">
          <span>{value.length} characters • {value.split('\n').length} lines</span>
          <span className={value.trim() ? 'text-green-500' : 'text-muted-foreground'}>{value.trim() ? '✓ Ready' : 'Empty'}</span>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="border border-input rounded-lg overflow-hidden bg-background shadow-sm hover:shadow-md transition-all duration-300">
        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
        
        {/* Toolbar */}
        <div className="flex items-center gap-0.5 p-1.5 border-b border-input bg-muted/30 flex-wrap">
          {toolbarButtons.map((btn) => (
            <Tooltip key={btn.label}>
              <TooltipTrigger asChild>
                <Button 
                  type="button" variant="ghost" size="sm" 
                  className={`h-8 w-8 p-0 transition-colors ${btn.active ? 'bg-primary text-background' : 'hover:bg-primary/10 hover:text-primary'}`}
                  onClick={btn.action}
                >
                  <btn.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>{btn.label} <span className="text-muted-foreground">({btn.shortcut})</span></p>
              </TooltipContent>
            </Tooltip>
          ))}
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary" onClick={() => fileInputRef.current?.click()}>
                <Image className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Insert Image</p></TooltipContent>
          </Tooltip>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10" onClick={undo} disabled={historyIndex === 0}>
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Undo (Ctrl+Z)</p></TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10" onClick={redo} disabled={historyIndex === history.length - 1}>
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom"><p>Redo (Ctrl+Y)</p></TooltipContent>
          </Tooltip>
          
          <div className="flex-1" />
          
          <Popover open={showHelp} onOpenChange={setShowHelp}>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Formatting Guide</h4>
                <p className="text-xs text-muted-foreground">
                  Select text and click toolbar buttons to format. Use keyboard shortcuts for quick formatting.
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <div className="p-1.5 bg-muted/30 rounded"><strong>Bold</strong> — Ctrl+B</div>
                  <div className="p-1.5 bg-muted/30 rounded"><em>Italic</em> — Ctrl+I</div>
                  <div className="p-1.5 bg-muted/30 rounded">Undo — Ctrl+Z</div>
                  <div className="p-1.5 bg-muted/30 rounded">Redo — Ctrl+Y</div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* WYSIWYG Editor */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          data-placeholder={placeholder}
          className="w-full p-4 text-sm focus:outline-none bg-background overflow-y-auto
            [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground [&:empty]:before:italic
            [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:border-b [&_h1]:pb-1
            [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-3 [&_h2]:mb-1.5
            [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1
            [&_strong]:font-bold
            [&_em]:italic
            [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:py-1 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-2 [&_blockquote]:bg-muted/30 [&_blockquote]:rounded-r
            [&_hr]:my-3 [&_hr]:border-t-2 [&_hr]:border-muted
            [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
            [&_li]:ml-5 [&_li]:my-0.5
            [&_li.bullet]:list-disc [&_li.bullet]:ml-5 [&_li.bullet]:my-0.5
            [&_li.numbered]:list-decimal [&_li.numbered]:ml-5 [&_li.numbered]:my-0.5
            [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-xs [&_code]:bg-slate-200
            [&_.checklist]:flex [&_.checklist]:items-center [&_.checklist]:gap-2 [&_.checklist]:my-1
            [&_.checklist_input]:h-4 [&_.checklist_input]:w-4 [&_.checklist_input]:rounded [&_.checklist_input]:accent-primary
            [&_img]:max-w-full [&_img]:rounded-lg [&_img]:max-h-64 [&_img]:object-cover [&_img]:shadow-md [&_img]:my-2
            [&_a]:text-primary [&_a]:underline
            [&_p]:my-0.5"
          style={{ minHeight: `${minRows * 1.5}rem`, maxHeight: `${minRows * 2.5}rem` }}
        />

        {/* Footer */}
        <div className="px-4 py-1 border-t border-input bg-muted/20 text-xs text-muted-foreground flex justify-between">
          <span>{value.length} characters • {value.split('\n').length} lines</span>
          <span className={value.trim() ? 'text-green-500' : 'text-muted-foreground'}>
            {value.trim() ? '✓ Saved' : 'Empty'}
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default RichTextEditor;
