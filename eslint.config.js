// .eslintrc.js
module.exports = {
  root: true,
  // O ignorePatterns geralmente é desnecessário se o arquivo estiver na raiz do projeto
  ignorePatterns: ['projects/**/*', 'node_modules/**/*'], 
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        // Corrigido para caminhos mais comuns
        project: ['tsconfig.json', 'src/tsconfig.app.json'], 
        createDefaultProgram: true
      },
      extends: [
        'plugin:@angular-eslint/recommended'
      ],
      plugins: ['@typescript-eslint'],
      rules: {}
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {}
    }
  ]
};