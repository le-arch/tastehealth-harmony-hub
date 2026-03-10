import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered, CheckSquare, Quote, ImagePlus, Minus, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  onImageUpload?: (dataUrl: string) => void;
}

const TOOLBAR_BUTTONS = [
  { icon: Bold, label: 'Bold', prefix: '**', suffix: '**' },
  { icon: Italic, label: 'Italic', prefix: '*', suffix: '*' },
  { icon: Heading1, label: 'H1', prefix: '# ', suffix: '' },
  { icon: Heading2, label: 'H2', prefix: '## ', suffix: '' },
  { icon: List, label: 'Bullet', prefix: '- ', suffix: '' },
  { icon: ListOrdered, label: 'Numbered', prefix: '1. ', suffix: '' },
  { icon: CheckSquare, label: 'Checklist', prefix: '- [ ] ', suffix: '' },
  { icon: Quote, label: 'Quote', prefix: '> ', suffix: '' },
  { icon: Minus, label: 'Divider', prefix: '\n---\n', suffix: '' },
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder = 'Write something...', minRows = 8, onImageUpload }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(false);

  const insertFormat = (prefix: string, suffix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);
    const newText = `${before}${prefix}${selected}${suffix}${after}`;
    onChange(newText);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + prefix.length, start + prefix.length + selected.length); }, 0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      if (onImageUpload) { onImageUpload(dataUrl); }
      insertFormat(`![image](${dataUrl})`, '');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-2">{processInline(line.slice(3))}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-xl font-bold mt-3">{processInline(line.slice(2))}</h1>;
      if (line.startsWith('- [x] ')) return <div key={i} className="flex items-center gap-2"><input type="checkbox" checked readOnly className="h-4 w-4" /><span className="line-through text-muted-foreground">{processInline(line.slice(6))}</span></div>;
      if (line.startsWith('- [ ] ')) return <div key={i} className="flex items-center gap-2"><input type="checkbox" readOnly className="h-4 w-4" /><span>{processInline(line.slice(6))}</span></div>;
      if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc">{processInline(line.slice(2))}</li>;
      if (/^\d+\. /.test(line)) return <li key={i} className="ml-4 list-decimal">{processInline(line.replace(/^\d+\. /, ''))}</li>;
      if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-primary pl-3 italic text-muted-foreground my-1">{processInline(line.slice(2))}</blockquote>;
      if (line.trim() === '---') return <hr key={i} className="my-3 border-border" />;
      const imgMatch = line.match(/!\[.*?\]\((.*?)\)/);
      if (imgMatch) return <img key={i} src={imgMatch[1]} alt="" className="max-w-full rounded-lg my-2 max-h-48 object-cover" />;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i}>{processInline(line)}</p>;
    });
  };

  const processInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;
    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
      const italicMatch = remaining.match(/\*(.*?)\*/);
      if (boldMatch && boldMatch.index !== undefined && (!italicMatch || boldMatch.index <= (italicMatch.index ?? Infinity))) {
        parts.push(remaining.slice(0, boldMatch.index));
        parts.push(<strong key={key++}>{boldMatch[1]}</strong>);
        remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      } else if (italicMatch && italicMatch.index !== undefined) {
        parts.push(remaining.slice(0, italicMatch.index));
        parts.push(<em key={key++}>{italicMatch[1]}</em>);
        remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
      } else { parts.push(remaining); break; }
    }
    return parts;
  };

  return (
    <div className="border border-input rounded-lg overflow-hidden bg-background">
      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
      <div className="flex items-center gap-0.5 p-1.5 border-b border-input bg-muted/30 flex-wrap">
        {TOOLBAR_BUTTONS.map((btn) => (
          <Button key={btn.label} type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={() => insertFormat(btn.prefix, btn.suffix)} title={btn.label}>
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
          onClick={() => fileInputRef.current?.click()} title="Upload Image">
          <Upload className="h-4 w-4" />
        </Button>
        <div className="flex-1" />
        <Button type="button" variant={preview ? "default" : "outline"} size="sm" className="h-7 text-xs px-2" onClick={() => setPreview(!preview)}>
          {preview ? 'Edit' : 'Preview'}
        </Button>
      </div>
      {preview ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 min-h-[200px] prose prose-sm dark:prose-invert max-w-none text-sm">
          {value ? renderMarkdown(value) : <p className="text-muted-foreground">{placeholder}</p>}
        </motion.div>
      ) : (
        <textarea ref={textareaRef} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          rows={minRows} className="w-full p-4 resize-y bg-transparent text-sm focus:outline-none min-h-[200px] font-mono" />
      )}
    </div>
  );
};

export default RichTextEditor;
