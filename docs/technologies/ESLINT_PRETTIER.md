# ESLint & Prettier

## Overview

**ESLint Version:** 8.57.0  
**Prettier Version:** 3.2.5  
**Category:** Code Quality

ESLint is a static code analysis tool for identifying problematic patterns. Prettier is an opinionated code formatter.

---

## Why ESLint & Prettier?

### Benefits

| Benefit             | Description                                   |
| ------------------- | --------------------------------------------- |
| **Consistency**     | Enforced code style across team               |
| **Error Prevention**| Catch bugs before runtime                     |
| **Auto-Fix**        | Automatically fix many issues                 |
| **Best Practices**  | Enforce React Native best practices           |

---

## Configuration

### .eslintrc.js

```javascript
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
```

### .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

---

## Scripts

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"**/*.{js,jsx,ts,tsx,json,md}\""
  }
}
```

---

## Commands

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format with Prettier
npm run format

# Check formatting
npx prettier --check .
```

---

## VS Code Integration

### settings.json

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## Related Documentation

- [TypeScript](TYPESCRIPT.md) - Type checking
- [Jest](JEST.md) - Testing
