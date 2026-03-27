import { useState, useCallback, useEffect } from 'react';
import { PromptList } from './components/PromptList';
import { PromptEditor } from './components/PromptEditor';
import { VersionHistory } from './components/VersionHistory';
import { NewPromptModal } from './components/NewPromptModal';
import {
  getSamplePrompts,
  createPrompt,
  addVersion,
  setActiveVersion,
} from './lib/versionControl';
import type { Prompt } from './lib/versionControl';

function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [compareVersionId, setCompareVersionId] = useState<string | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Load sample prompts
  useEffect(() => {
    const samples = getSamplePrompts();
    setPrompts(samples);
    if (samples.length > 0) {
      setSelectedPromptId(samples[0].id);
      if (samples[0].versions.length > 0) {
        setSelectedVersionId(samples[0].versions[samples[0].versions.length - 1].id);
      }
    }
  }, []);

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId) || null;
  const selectedVersion = selectedPrompt?.versions.find(
    (v) => v.id === selectedVersionId
  ) || null;
  const compareVersion = selectedPrompt?.versions.find(
    (v) => v.id === compareVersionId
  ) || null;

  const handleSelectPrompt = useCallback((id: string) => {
    setSelectedPromptId(id);
    setCompareVersionId(null);
    const prompt = prompts.find((p) => p.id === id);
    if (prompt && prompt.versions.length > 0) {
      setSelectedVersionId(prompt.versions[prompt.versions.length - 1].id);
    } else {
      setSelectedVersionId(null);
    }
  }, [prompts]);

  const handleSelectVersion = useCallback((id: string) => {
    setSelectedVersionId(id);
    if (compareVersionId === id) {
      setCompareVersionId(null);
    }
  }, [compareVersionId]);

  const handleCreatePrompt = useCallback((name: string, description: string) => {
    const newPrompt = createPrompt(name, description);
    setPrompts((prev) => [...prev, newPrompt]);
    setSelectedPromptId(newPrompt.id);
    setSelectedVersionId(null);
    setShowNewModal(false);
  }, []);

  const handleSaveVersion = useCallback(
    (content: string, message: string) => {
      if (!selectedPrompt) return;

      const updatedPrompt = addVersion(selectedPrompt, content, message);
      setPrompts((prev) =>
        prev.map((p) => (p.id === selectedPrompt.id ? updatedPrompt : p))
      );
      setSelectedVersionId(
        updatedPrompt.versions[updatedPrompt.versions.length - 1].id
      );
    },
    [selectedPrompt]
  );

  const handleSetActiveVersion = useCallback(
    (versionId: string) => {
      if (!selectedPrompt) return;

      const updatedPrompt = setActiveVersion(selectedPrompt, versionId);
      setPrompts((prev) =>
        prev.map((p) => (p.id === selectedPrompt.id ? updatedPrompt : p))
      );
    },
    [selectedPrompt]
  );

  return (
    <div className="h-screen flex bg-[hsl(var(--background))]">
      {/* Prompt List */}
      <PromptList
        prompts={prompts}
        selectedId={selectedPromptId}
        onSelect={handleSelectPrompt}
        onCreateNew={() => setShowNewModal(true)}
      />

      {/* Editor */}
      {selectedPrompt ? (
        <>
          <PromptEditor
            prompt={selectedPrompt}
            selectedVersion={selectedVersion}
            compareVersion={compareVersion}
            onSaveVersion={handleSaveVersion}
          />

          {/* Version History */}
          <VersionHistory
            versions={selectedPrompt.versions}
            selectedVersionId={selectedVersionId}
            compareVersionId={compareVersionId}
            onSelectVersion={handleSelectVersion}
            onSetCompare={setCompareVersionId}
            onSetActive={handleSetActiveVersion}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-medium text-[hsl(var(--foreground))]">
              No prompt selected
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              Select a prompt from the list or create a new one
            </p>
          </div>
        </div>
      )}

      {/* New Prompt Modal */}
      {showNewModal && (
        <NewPromptModal
          onClose={() => setShowNewModal(false)}
          onCreate={handleCreatePrompt}
        />
      )}
    </div>
  );
}

export default App;
