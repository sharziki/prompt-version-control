# Prompt Version Control

A git-like version control system for managing and versioning LLM prompts. Track changes, compare versions, and test prompts with variable substitution.

## Features

- **Version History**: Track all changes with commit messages and timestamps
- **Diff View**: Compare any two versions side-by-side
- **Variable Extraction**: Automatically detects `{{variable}}` syntax
- **Live Testing**: Substitute variables and preview output in real-time
- **Active Version**: Mark which version is currently in production
- **Semantic Versioning**: Auto-incremented version numbers

## How It Works

### Version Control
Each prompt maintains a history of versions:
- Edit the prompt content
- Add a commit message describing changes
- Save to create a new version
- Compare any two versions with diff view

### Variable Substitution
Use `{{variable_name}}` syntax in prompts:
- Variables are automatically extracted
- Test panel lets you fill in values
- Preview shows rendered output

## Interface

| Panel | Description |
|-------|-------------|
| Left Sidebar | List of all prompts with metadata |
| Center | Prompt editor with diff view option |
| Right Sidebar | Version history with compare/activate buttons |
| Test Panel | Variable inputs and live preview |

## Actions

| Action | Description |
|--------|-------------|
| New Prompt | Create a new prompt with name and description |
| Commit | Save current changes as a new version |
| Set Active | Mark a version as the production version |
| Compare | Select a version to compare against current |
| Test | Open the variable substitution panel |

## Sample Prompts

The app includes three sample prompts:
1. **Code Review Assistant** - Review code with configurable language context
2. **SQL Query Generator** - Convert natural language to SQL
3. **Email Composer** - Draft professional emails

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Lucide React icons

## Getting Started

```bash
npm install
npm run dev
```

## Data Model

```typescript
interface Prompt {
  id: string;
  name: string;
  description: string;
  versions: PromptVersion[];
  activeVersionId: string | null;
}

interface PromptVersion {
  id: string;
  version: string;        // "1.0.0", "1.0.1", etc.
  content: string;        // The prompt text
  message: string;        // Commit message
  timestamp: Date;
  variables: string[];    // Extracted variable names
  isActive: boolean;
}
```

## License

MIT
