import mantine from 'eslint-config-mantine';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...mantine,
  { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}', '.next'] },

  // override só para stories (opcional)
  {
    files: ['**/*.story.tsx'],
    rules: { 'no-console': 'off' },
  },

  // regras globais — deve vir por último para ter precedência
  {
    rules: {
      curly: 'off',
      '@typescript-eslint/curly': 'off',
    },
  }
);
