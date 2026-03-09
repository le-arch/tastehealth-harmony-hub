
import React, { useRef, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Heading2, List, ListOrdered, Upload, X } from 'lucide-react';

interface RecipeFormatEditorProps {
  ingredients: string;
  setIngredients: (value: string) => void;
  method: string;
  setMethod: (value: string) => void;
  imageUrl: string;
  setImageUrl: (value: string) => void;
}

export const RecipeFormatEditor: React.FC<RecipeFormatEditorProps> = ({
  ingredients,
  setIngredients,
  method,
  setMethod,
  imageUrl,
  setImageUrl,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ingredientsStyle, setIngredientsStyle] = useState<'bullet' | 'numbered'>('bullet');
  const [methodStyle, setMethodStyle] = useState<'bullet' | 'numbered' | 'steps'>('steps');

  const insertLine = useCallback((text: string, prefix: string, setFn: (v: string) => void) => {
    const lines = text.split('\n').filter(l => l.trim());
    const formatted = lines.map((line, i) => {
      if (prefix === '1.') {
        return `${i + 1}. ${line.replace(/^\d+\. /, '')}`;
      }
      return `${prefix} ${line.replace(/^[-•*] /, '')}`;
    }).join('\n');
    setFn(formatted);
  }, []);

  const formatIngredients = (style: 'bullet' | 'numbered') => {
    const prefix = style === 'numbered' ? '1.' : '-';
    insertLine(ingredients, prefix, setIngredients);
    setIngredientsStyle(style);
  };

  const formatMethod = (style: 'bullet' | 'numbered' | 'steps') => {
    const prefix = style === 'numbered' ? '1.' : style === 'steps' ? '### ' : '-';
    insertLine(method, prefix, setMethod);
    setMethodStyle(style);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addIngredientLine = () => {
    setIngredients(prev => prev + '\n- ');
  };

  const addMethodStep = () => {
    setMethod(prev => prev + '\n### Step ');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Recipe Image</label>
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" /> Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        {imageUrl ? (
          <div className="relative">
            <img src={imageUrl} alt="Recipe" className="w-full h-48 object-cover rounded-lg" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => setImageUrl('')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-muted-foreground">
            <span>Click upload to add image</span>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Ingredients</label>
          <div className="flex gap-1">
            <Button
              type="button"
              variant={ingredientsStyle === 'bullet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => formatIngredients('bullet')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={ingredientsStyle === 'numbered' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => formatIngredients('numbered')}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={addIngredientLine}>
              +
            </Button>
          </div>
        </div>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder={ingredientsStyle === 'numbered' ? "1. Ingredient 1\n2. Ingredient 2" : "- Ingredient 1\n- Ingredient 2"}
          rows={6}
          className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Method</label>
          <div className="flex gap-1">
            <Button
              type="button"
              variant={methodStyle === 'steps' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => formatMethod('steps')}
              title="Steps with headings"
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={methodStyle === 'numbered' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => formatMethod('numbered')}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={methodStyle === 'bullet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => formatMethod('bullet')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={addMethodStep}>
              +
            </Button>
          </div>
        </div>
        <textarea
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          placeholder={methodStyle === 'steps' ? "### Step 1\nDo this\n### Step 2\nDo that" : methodStyle === 'numbered' ? "1. Step 1\n2. Step 2" : "- Step 1\n- Step 2"}
          rows={8}
          className="w-full px-3 py-2 border border-input rounded-md text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
};

export const renderRecipeContent = (text: string, style: 'bullet' | 'numbered' | 'steps' = 'steps'): React.ReactNode => {
  if (!text) return null;
  
  const lines = text.split('\n').filter(l => l.trim());
  
  return (
    <div className="space-y-1">
      {lines.map((line, index) => {
        if (style === 'steps' && line.startsWith('### ')) {
          return <h3 key={index} className="font-semibold text-primary mt-2">{line.substring(4)}</h3>;
        }
        if (style === 'numbered' || (style === 'steps' && line.match(/^\d+\. /))) {
          const num = line.match(/^(\d+)\./)?.[1] || (index + 1).toString();
          return (
            <div key={index} className="flex gap-2">
              <span className="font-bold text-primary min-w-[24px]">{num}.</span>
              <span>{line.replace(/^\d+\. /, '')}</span>
            </div>
          );
        }
        return (
          <div key={index} className="flex gap-2">
            <span className="text-primary">•</span>
            <span>{line.replace(/^[-•*] /, '')}</span>
          </div>
        );
      })}
    </div>
  );
};
