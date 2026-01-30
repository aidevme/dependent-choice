# Contributing to DependentChoice PCF Control

Thank you for your interest in contributing to the DependentChoice PCF control! We welcome contributions from the community to make this control better.

## 🌟 Ways to Contribute

- **Report Bugs**: Submit detailed bug reports
- **Suggest Features**: Propose new features or enhancements
- **Improve Documentation**: Fix typos, add examples, clarify instructions
- **Submit Code**: Fix bugs or implement new features
- **Share Feedback**: Let us know how you're using the control
- **Help Others**: Answer questions in Discussions

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)
- [Community Guidelines](#community-guidelines)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes**:
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes**:
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Git** installed and configured
- **Visual Studio Code** (recommended)
- **Power Apps CLI** (`pac`) for testing
- Basic knowledge of:
  - TypeScript
  - React
  - Power Apps Component Framework (PCF)

### Fork and Clone

1. **Fork the repository** on GitHub
   - Click the "Fork" button at the top right of the repository page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/dependent-choice.git
   cd dependent-choice
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/aidevme/dependent-choice.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Verify the build**
   ```bash
   npm run build
   ```

### Keep Your Fork Updated

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream changes into your main branch
git checkout master
git merge upstream/master

# Push updates to your fork
git push origin master
```

## 🔧 Development Workflow

### 1. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-description
```

**Branch naming conventions**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or modifications
- `chore/` - Build process or tooling changes

### 2. Make Your Changes

- **Write clean code** following our coding standards
- **Add comments** for complex logic
- **Update documentation** if needed
- **Test thoroughly** before committing

### 3. Test Your Changes

```bash
# Build the control
npm run build

# Run ESLint
npm run lint:fix

# Test in watch mode (for development)
npm start watch
```

**Testing checklist**:
- [ ] Control builds without errors
- [ ] No ESLint warnings
- [ ] Filtering works correctly
- [ ] Both single-select and multi-select work
- [ ] Empty mappings handled correctly
- [ ] Invalid configuration handled gracefully
- [ ] Console has no errors
- [ ] Works in both design mode and runtime

### 4. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: Add support for dynamic placeholder text"
```

**Commit message format**:
```
<type>: <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or tooling changes

**Examples**:
```
feat: Add support for cascading dropdowns

Added ability to chain multiple dependent dropdowns in sequence.
Includes configuration schema update and new filtering logic.

Closes #123
```

```
fix: Resolve controlled/uncontrolled input warning

Changed selectedKey state from undefined to empty string to prevent
React from switching between controlled and uncontrolled states.

Fixes #456
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template:
   - **Title**: Clear, concise description
   - **Description**: What changes were made and why
   - **Related Issues**: Link to related issues
   - **Testing**: How you tested the changes
   - **Screenshots**: If UI changes were made

## 🎨 Coding Standards

### TypeScript

- **Use TypeScript strict mode**
- **Define interfaces for all props and state**
- **Avoid `any` type** - Use specific types or `unknown`
- **Use optional chaining** (`?.`) and nullish coalescing (`??`)

**Example**:
```typescript
interface IMyComponentProps {
  value: number | null;
  onChange: (newValue: number) => void;
}

const MyComponent: React.FC<IMyComponentProps> = (props) => {
  const displayValue = props.value ?? 0;
  // Component logic
};
```

### Naming Conventions

- **PascalCase**: Components, interfaces, classes
  ```typescript
  interface IInputs { }
  class DependentChoice { }
  const MyComponent: React.FC = () => { };
  ```

- **camelCase**: Variables, functions, methods, properties
  ```typescript
  const selectedValue = 123;
  function handleChange(value: number) { }
  ```

- **UPPER_SNAKE_CASE**: Constants
  ```typescript
  const MAX_OPTIONS = 1000;
  const DEFAULT_THEME = 'light';
  ```

### React Best Practices

- **Functional components** with hooks (no class components)
- **Use `React.memo`** for expensive components
- **Use `useMemo`** for expensive calculations
- **Use `useCallback`** for event handlers passed to children
- **Avoid inline functions** in JSX when possible

**Example**:
```typescript
const filteredOptions = React.useMemo(() => {
  return options.filter(opt => allowedValues.has(opt.value));
}, [options, allowedValues]);

const handleChange = React.useCallback((value: number) => {
  props.onChange(value);
}, [props.onChange]);
```

### Code Organization

- **One component per file**
- **Services in separate files**
- **Group related utilities**
- **Keep files under 300 lines** (split if longer)

### Documentation

**Use TSDoc for all public APIs**:
```typescript
/**
 * Service for managing dependency mappings between parent and dependent choice fields.
 * 
 * @remarks
 * This service parses and provides access to the configuration that defines which
 * dependent choice values are available for each parent choice value.
 * 
 * @example
 * ```typescript
 * const service = new DependencyMappingService();
 * service.initialize('{"mappings":[{"parentValue":1,"dependentValues":[101,102]}]}');
 * const allowed = service.getDependentValues(1);
 * ```
 */
export class DependencyMappingService {
  // Class implementation
}
```

### ESLint

Run ESLint before committing:
```bash
npm run lint:fix
```

**No ESLint warnings allowed** in pull requests.

### File Structure

```
DependentChoice/
├── components/
│   └── ComponentName.tsx         # One component per file
├── services/
│   └── ServiceName/
│       ├── ServiceName.ts        # Service implementation
│       └── index.ts              # Re-export
├── styles/
│   └── Styles.ts                 # Fluent UI styles
└── index.ts                      # PCF entry point
```

## 📤 Submitting Changes

### Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code builds successfully (`npm run build`)
- [ ] No ESLint errors or warnings
- [ ] All new code has TSDoc comments
- [ ] Related documentation updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with `master`
- [ ] PR description is clear and complete
- [ ] Linked to related issues

### PR Review Process

1. **Automated Checks**: GitHub Actions will run (if configured)
2. **Code Review**: Maintainers will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, PR will be merged
5. **Release**: Changes included in next release

**Review timeline**:
- Initial response: Within 3 days
- Full review: Within 7 days

### What Happens Next

- **Merged**: Your contribution is merged! 🎉
- **Changes Requested**: Make updates and push to same branch
- **Closed**: PR may be closed if not aligned with project goals

## 🐛 Reporting Bugs

### Before Reporting

1. **Search existing issues** to avoid duplicates
2. **Verify the bug** in latest version
3. **Collect information** about your environment

### Bug Report Template

Create a new issue with the following information:

**Title**: Clear, descriptive summary

**Description**:
```
## Bug Description
Clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Select '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- Control Version: [e.g., 0.0.3]
- Power Apps Environment: [e.g., Production]
- Browser: [e.g., Chrome 120, Edge 121]
- Dataverse Version: [if applicable]

## Configuration
```json
{
  "mappings": [ ... ]
}
```

## Screenshots
If applicable, add screenshots.

## Console Logs
Include relevant browser console errors.

## Additional Context
Any other context about the problem.
```

## 💡 Requesting Features

### Feature Request Template

```
## Feature Description
Clear description of the feature.

## Use Case
Describe the problem this feature would solve.

## Proposed Solution
How you think this should be implemented.

## Alternatives Considered
Other solutions you've considered.

## Additional Context
Any other context or screenshots.

## Willingness to Contribute
Are you willing to implement this feature?
```

## 🧪 Testing Guidelines

### Manual Testing

Test your changes with:

1. **Different data scenarios**
   - Empty mappings
   - Large datasets
   - Invalid configurations
   - Edge cases

2. **Multiple browsers**
   - Chrome
   - Edge
   - Firefox (if applicable)

3. **Different form factors**
   - Desktop
   - Tablet
   - Mobile (model-driven apps)

4. **Both control types**
   - Single-select option sets
   - Multi-select option sets

### Test Cases

Create test cases for:

- ✅ Parent value changes trigger filtering
- ✅ Empty dependent values array shows no options
- ✅ Invalid JSON configuration handled gracefully
- ✅ Currently selected value preserved during filtering
- ✅ Multi-select maintains selections correctly
- ✅ Control disabled state works
- ✅ Theme changes applied correctly
- ✅ Design mode shows mock data

## 📚 Documentation

### When to Update Documentation

- New features added
- Configuration changes
- API changes
- Bug fixes that affect usage
- New examples or use cases

### Documentation Files

- **README.md**: Main documentation
- **SECURITY.md**: Security policy
- **CONTRIBUTING.md**: This file
- **Code comments**: TSDoc for all public APIs
- **Copilot instructions**: `.github/copilot-instructions.md`

## 💬 Community Guidelines

### Asking Questions

- Use [GitHub Discussions](https://github.com/aidevme/dependent-choice/discussions) for questions
- Search before posting to avoid duplicates
- Provide context and examples
- Be patient and respectful

### Helping Others

- Be welcoming to newcomers
- Provide constructive feedback
- Share knowledge and examples
- Point to relevant documentation

### Communication Channels

- **Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions
- **Discussions**: Questions, ideas, and general discussion
- **Security**: Email security@aidevme.com for vulnerabilities

## 🏆 Recognition

Contributors will be recognized:

- Listed in release notes
- Mentioned in commits and PRs
- Added to CONTRIBUTORS file (if significant contribution)
- Social media shoutouts for major contributions

## ❓ Questions?

If you have questions about contributing:

1. Check the [README](README.md) first
2. Search [Discussions](https://github.com/aidevme/dependent-choice/discussions)
3. Create a new Discussion
4. Reach out to maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Thank you for contributing to DependentChoice!** 🙏

Your contributions help make this control better for the entire Power Platform community.