# es-userのテストコード

## テスト実行

```bash
npx playwright test
```

## テスト実行(ファイル指定)

```bash
npx playwright test [file_path]
```

e.g.

```bash
npx playwright test "e2e\\会員登録項目最適化\\chat-gpt-default-occupations\\signup.spec.ts"
```

## 環境変数

.env.exampleを複製して各環境用に.envで値を設定

```bash
cp .env.example .env
```
