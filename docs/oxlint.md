# oxlint 導入メモ

## 概要

ESLint から [oxlint](https://oxc.rs/docs/guide/usage/linter) へ移行しました。
oxlint は Rust 製のリンターで、ESLint と比べて大幅に高速です。

## 移行内容

### 削除したパッケージ

```
eslint
@eslint/js
eslint-plugin-react-hooks
eslint-plugin-react-refresh
globals
typescript-eslint
```

### 追加したパッケージ

```
oxlint
```

### ファイルの変更

| ファイル | 変更 |
|----------|------|
| `eslint.config.js` | 削除 |
| `oxlint.json` | 新規作成 |
| `package.json` | lint スクリプトを変更 |

## 設定ファイル

`vite-project/oxlint.json` にて以下を設定しています。

- **plugins**: `react`, `react-hooks`, `typescript`
- **rules**:
  - `react-hooks/rules-of-hooks`: error
  - `react-hooks/exhaustive-deps`: warn
- **ignore**: `dist/**`

## 使い方

```bash
cd vite-project
npm run lint
```

## パフォーマンス計測（このリポジトリ）

対象: `src/` 配下の TypeScript / TSX ファイル（2026-05-23 時点）

| リンター | 実行時間 |
|----------|---------|
| ESLint   | 1.59 秒 |
| oxlint   | 0.24 秒 |
| **短縮** | **約 1.35 秒（約 85% 削減 / 約 6〜7 倍高速）** |

プロジェクトが大きくなるほど差は拡大する傾向があります。

## 備考

- TypeScript・React・React Hooks のルールは oxlint に内蔵されているため、別途プラグインのインストールは不要
- `react-refresh` プラグインは oxlint に存在しないため対象外
