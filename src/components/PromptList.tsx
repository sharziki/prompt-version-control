import { FileText, Plus, Clock, Hash } from 'lucide-react';
import type { Prompt } from '../lib/versionControl';

interface PromptListProps {
  prompts: Prompt[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
}

export function PromptList({
  prompts,
  selectedId,
  onSelect,
  onCreateNew,
}: PromptListProps) {
  return (
    <div className="w-72 bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] flex flex-col">
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <h1 className="text-lg font-bold text-[hsl(var(--foreground))]">
          Prompt VC
        </h1>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Version Control for Prompts
        </p>
      </div>

      <div className="p-3">
        <button
          onClick={onCreateNew}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Prompt
        </button>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-1">
        {prompts.map((prompt) => (
          <button
            key={prompt.id}
            onClick={() => onSelect(prompt.id)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedId === prompt.id
                ? 'bg-[hsl(var(--primary))]/20 border border-[hsl(var(--primary))]/30'
                : 'hover:bg-[hsl(var(--secondary))]'
            }`}
          >
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 mt-0.5 text-[hsl(var(--muted-foreground))]" />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-[hsl(var(--foreground))] truncate">
                  {prompt.name}
                </div>
                <div className="text-xs text-[hsl(var(--muted-foreground))] truncate mt-0.5">
                  {prompt.description}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    v{prompt.versions[prompt.versions.length - 1]?.version || '0.0.0'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {prompt.versions.length} versions
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
