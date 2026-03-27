import { useState } from 'react';
import { Save, Play, GitCompare, Variable, FileText } from 'lucide-react';
import { diffStrings, substituteVariables, extractVariables } from '../lib/versionControl';
import type { Prompt, PromptVersion, DiffPart } from '../lib/versionControl';

interface PromptEditorProps {
  prompt: Prompt;
  selectedVersion: PromptVersion | null;
  compareVersion: PromptVersion | null;
  onSaveVersion: (content: string, message: string) => void;
}

export function PromptEditor({
  prompt,
  selectedVersion,
  compareVersion,
  onSaveVersion,
}: PromptEditorProps) {
  const [content, setContent] = useState(selectedVersion?.content || '');
  const [commitMessage, setCommitMessage] = useState('');
  const [showDiff, setShowDiff] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  const variables = extractVariables(content);
  const hasChanges = content !== selectedVersion?.content;

  const handleSave = () => {
    if (!commitMessage.trim()) return;
    onSaveVersion(content, commitMessage);
    setCommitMessage('');
  };

  const getDiff = (): DiffPart[] => {
    if (!compareVersion || !selectedVersion) return [];
    return diffStrings(compareVersion.content, selectedVersion.content);
  };

  const getPreview = (): string => {
    return substituteVariables(content, variableValues);
  };

  return (
    <div className="flex-1 flex flex-col bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-[hsl(var(--foreground))]">
            {prompt.name}
          </h2>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {prompt.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTest(!showTest)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              showTest
                ? 'bg-[#22c55e]/20 text-[#22c55e]'
                : 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
            }`}
          >
            <Play className="w-4 h-4" />
            Test
          </button>
          {compareVersion && (
            <button
              onClick={() => setShowDiff(!showDiff)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showDiff
                  ? 'bg-[#eab308]/20 text-[#eab308]'
                  : 'bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              Diff
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col p-4">
          {showDiff && compareVersion ? (
            <div className="flex-1 overflow-auto font-mono text-sm bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] p-4">
              <div className="mb-2 text-xs text-[hsl(var(--muted-foreground))]">
                Comparing v{compareVersion.version} → v{selectedVersion?.version}
              </div>
              {getDiff().map((part, i) => (
                <div
                  key={i}
                  className={`px-2 py-0.5 ${
                    part.type === 'added'
                      ? 'bg-[#22c55e]/20 text-[#22c55e]'
                      : part.type === 'removed'
                        ? 'bg-[#ef4444]/20 text-[#ef4444]'
                        : 'text-[hsl(var(--muted-foreground))]'
                  }`}
                >
                  <span className="mr-2 opacity-50">
                    {part.type === 'added' ? '+' : part.type === 'removed' ? '-' : ' '}
                  </span>
                  {part.content || ' '}
                </div>
              ))}
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-sm font-mono text-[hsl(var(--foreground))] resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50"
              placeholder="Enter your prompt here..."
            />
          )}

          {/* Commit Area */}
          {hasChanges && (
            <div className="mt-4 p-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                <span className="text-sm text-[hsl(var(--foreground))]">
                  Unsaved changes
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Describe your changes..."
                  className="flex-1 px-3 py-2 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50"
                />
                <button
                  onClick={handleSave}
                  disabled={!commitMessage.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  Commit
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Test Panel */}
        {showTest && (
          <div className="w-80 border-l border-[hsl(var(--border))] flex flex-col bg-[hsl(var(--card))]">
            <div className="p-4 border-b border-[hsl(var(--border))]">
              <h3 className="text-sm font-medium text-[hsl(var(--foreground))] flex items-center gap-2">
                <Variable className="w-4 h-4" />
                Test Variables
              </h3>
            </div>

            <div className="p-4 space-y-3 overflow-auto">
              {variables.length === 0 ? (
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  No variables found. Use {'{{variable}}'} syntax.
                </p>
              ) : (
                variables.map((variable) => (
                  <div key={variable}>
                    <label className="text-xs text-[hsl(var(--muted-foreground))] font-mono">
                      {'{{'}{variable}{'}}'}
                    </label>
                    <input
                      type="text"
                      value={variableValues[variable] || ''}
                      onChange={(e) =>
                        setVariableValues({
                          ...variableValues,
                          [variable]: e.target.value,
                        })
                      }
                      className="w-full mt-1 px-3 py-2 bg-[hsl(var(--secondary))] border border-[hsl(var(--border))] rounded-lg text-sm text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/50"
                      placeholder={`Enter ${variable}...`}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="flex-1 p-4 border-t border-[hsl(var(--border))]">
              <h4 className="text-xs text-[hsl(var(--muted-foreground))] mb-2">
                Preview:
              </h4>
              <div className="h-full overflow-auto p-3 bg-[hsl(var(--secondary))] rounded-lg text-xs font-mono text-[hsl(var(--foreground))] whitespace-pre-wrap">
                {getPreview()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
