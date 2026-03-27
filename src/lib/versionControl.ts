export interface PromptVersion {
  id: string;
  version: string;
  content: string;
  message: string;
  timestamp: Date;
  variables: string[];
  isActive: boolean;
}

export interface Prompt {
  id: string;
  name: string;
  description: string;
  versions: PromptVersion[];
  activeVersionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Extract variables from prompt content (e.g., {{variable_name}})
export function extractVariables(content: string): string[] {
  const matches = content.match(/\{\{(\w+)\}\}/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, '')))];
}

// Generate version number
export function generateVersionNumber(versions: PromptVersion[]): string {
  if (versions.length === 0) return '1.0.0';

  const lastVersion = versions[versions.length - 1].version;
  const parts = lastVersion.split('.').map(Number);

  // Increment patch version
  parts[2]++;
  return parts.join('.');
}

// Create a new prompt
export function createPrompt(name: string, description: string): Prompt {
  return {
    id: generateId(),
    name,
    description,
    versions: [],
    activeVersionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Add a version to a prompt
export function addVersion(
  prompt: Prompt,
  content: string,
  message: string
): Prompt {
  const version: PromptVersion = {
    id: generateId(),
    version: generateVersionNumber(prompt.versions),
    content,
    message,
    timestamp: new Date(),
    variables: extractVariables(content),
    isActive: prompt.versions.length === 0,
  };

  const newVersions = [...prompt.versions, version];
  const activeVersionId =
    prompt.versions.length === 0 ? version.id : prompt.activeVersionId;

  return {
    ...prompt,
    versions: newVersions,
    activeVersionId,
    updatedAt: new Date(),
  };
}

// Set active version
export function setActiveVersion(
  prompt: Prompt,
  versionId: string
): Prompt {
  return {
    ...prompt,
    versions: prompt.versions.map((v) => ({
      ...v,
      isActive: v.id === versionId,
    })),
    activeVersionId: versionId,
    updatedAt: new Date(),
  };
}

// Get active version
export function getActiveVersion(prompt: Prompt): PromptVersion | null {
  return prompt.versions.find((v) => v.id === prompt.activeVersionId) || null;
}

// Diff two strings and return an array of diff parts
export interface DiffPart {
  type: 'unchanged' | 'added' | 'removed';
  content: string;
}

export function diffStrings(oldStr: string, newStr: string): DiffPart[] {
  const oldLines = oldStr.split('\n');
  const newLines = newStr.split('\n');
  const result: DiffPart[] = [];

  // Simple line-by-line diff
  const maxLen = Math.max(oldLines.length, newLines.length);

  for (let i = 0; i < maxLen; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine === newLine) {
      if (oldLine !== undefined) {
        result.push({ type: 'unchanged', content: oldLine });
      }
    } else {
      if (oldLine !== undefined) {
        result.push({ type: 'removed', content: oldLine });
      }
      if (newLine !== undefined) {
        result.push({ type: 'added', content: newLine });
      }
    }
  }

  return result;
}

// Substitute variables in prompt content
export function substituteVariables(
  content: string,
  values: Record<string, string>
): string {
  let result = content;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

// Sample prompts for demo
export function getSamplePrompts(): Prompt[] {
  const prompt1 = createPrompt(
    'Code Review Assistant',
    'Prompt for reviewing code changes'
  );
  const prompt1v1 = addVersion(
    prompt1,
    `You are a code reviewer. Review the following code change:

{{code}}

Provide feedback on:
1. Code quality
2. Potential bugs
3. Performance issues`,
    'Initial version'
  );
  const prompt1v2 = addVersion(
    prompt1v1,
    `You are an expert code reviewer with {{years}} years of experience.

Review the following {{language}} code:

\`\`\`{{language}}
{{code}}
\`\`\`

Provide detailed feedback on:
1. Code quality and best practices
2. Potential bugs or edge cases
3. Performance optimizations
4. Security considerations
5. Suggested improvements

Be constructive and specific in your feedback.`,
    'Added language context and security review'
  );

  const prompt2 = createPrompt(
    'SQL Query Generator',
    'Generate SQL queries from natural language'
  );
  const prompt2v1 = addVersion(
    prompt2,
    `Convert this request to SQL:
{{request}}

Database schema:
{{schema}}`,
    'Initial version'
  );

  const prompt3 = createPrompt(
    'Email Composer',
    'Professional email drafting assistant'
  );
  const prompt3v1 = addVersion(
    prompt3,
    `Write a {{tone}} email to {{recipient}} about:
{{topic}}

Keep it {{length}}.`,
    'Initial version'
  );
  const prompt3v2 = addVersion(
    prompt3v1,
    `You are a professional email writer.

Compose a {{tone}} email with the following details:
- Recipient: {{recipient}}
- Subject: {{subject}}
- Key points: {{topic}}
- Desired length: {{length}}
- Call to action: {{cta}}

Ensure proper formatting and professional language.`,
    'Added subject and CTA fields'
  );

  return [prompt1v2, prompt2v1, prompt3v2];
}
