import { GitBranch, Check, Clock, ArrowRight } from 'lucide-react';
import type { PromptVersion } from '../lib/versionControl';

interface VersionHistoryProps {
  versions: PromptVersion[];
  selectedVersionId: string | null;
  compareVersionId: string | null;
  onSelectVersion: (id: string) => void;
  onSetCompare: (id: string | null) => void;
  onSetActive: (id: string) => void;
}

export function VersionHistory({
  versions,
  selectedVersionId,
  compareVersionId,
  onSelectVersion,
  onSetCompare,
  onSetActive,
}: VersionHistoryProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-64 bg-[hsl(var(--card))] border-l border-[hsl(var(--border))] flex flex-col">
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <h2 className="text-sm font-medium text-[hsl(var(--foreground))] flex items-center gap-2">
          <GitBranch className="w-4 h-4" />
          Version History
        </h2>
      </div>

      <div className="flex-1 overflow-auto p-2 space-y-1">
        {versions
          .slice()
          .reverse()
          .map((version) => (
            <div
              key={version.id}
              className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                selectedVersionId === version.id
                  ? 'bg-[hsl(var(--primary))]/10 border-[hsl(var(--primary))]/30'
                  : compareVersionId === version.id
                    ? 'bg-[#eab308]/10 border-[#eab308]/30'
                    : 'border-transparent hover:bg-[hsl(var(--secondary))]'
              }`}
              onClick={() => onSelectVersion(version.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-[hsl(var(--foreground))]">
                  v{version.version}
                </span>
                {version.isActive && (
                  <span className="px-1.5 py-0.5 text-xs bg-[#22c55e]/20 text-[#22c55e] rounded">
                    Active
                  </span>
                )}
              </div>

              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 line-clamp-2">
                {version.message}
              </p>

              <div className="flex items-center gap-1 mt-2 text-xs text-[hsl(var(--muted-foreground))]">
                <Clock className="w-3 h-3" />
                {formatDate(version.timestamp)}
              </div>

              {version.variables.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {version.variables.slice(0, 3).map((v) => (
                    <span
                      key={v}
                      className="px-1.5 py-0.5 text-xs bg-[hsl(var(--secondary))] text-[hsl(var(--muted-foreground))] rounded font-mono"
                    >
                      {'{{'}{v}{'}}'}
                    </span>
                  ))}
                  {version.variables.length > 3 && (
                    <span className="text-xs text-[hsl(var(--muted-foreground))]">
                      +{version.variables.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-1 mt-2">
                {!version.isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetActive(version.id);
                    }}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] rounded hover:bg-[hsl(var(--muted))] transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    Set Active
                  </button>
                )}
                {selectedVersionId !== version.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetCompare(
                        compareVersionId === version.id ? null : version.id
                      );
                    }}
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                      compareVersionId === version.id
                        ? 'bg-[#eab308]/20 text-[#eab308]'
                        : 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                    }`}
                  >
                    <ArrowRight className="w-3 h-3" />
                    Compare
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
