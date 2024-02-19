# es-userのテストコード

## テスト実行

```bash
npx playwright test
```

### ファイル指定

```bash
npx playwright test [file_path]
```

e.g.

```bash
npx playwright test "e2e\\会員登録項目最適化\\chat-gpt-default-occupations\\signup.spec.ts"
```

### タグ指定

[https://playwright.dev/docs/test-annotations#tag-tests](https://playwright.dev/docs/test-annotations#tag-tests)

```bash
npx playwright test --grep @tag-name
```

e.g.

```bash
npx playwright test --grep @resume
```

## 環境変数

.env.exampleを複製して各環境用に.envで値を設定

```bash
cp .env.example .env
```
