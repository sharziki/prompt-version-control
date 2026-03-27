import { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface NewPromptModalProps {
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
}

export function NewPromptModal({ onClose, onCreate }: NewPromptModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name, description);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[hsl(var(--card))] rounded-xl border border-[hsl(var(--border))] w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--border))]">
          <h2 className="text-lg font-medium text-[hsl(var(--foreground))]">
            New Prompt
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors"
          >
            <X className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-[hsl(var(--foreground))] mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50"
              placeholder="My Prompt"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-[hsl(var(--foreground))] mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50"
              placeholder="What does this prompt do?"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] rounded-lg text-sm font-medium hover:bg-[hsl(var(--muted))] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
