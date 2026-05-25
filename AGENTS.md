# AGENTS.md — AIエージェント向け作業ルール

このリポジトリで作業する AIエージェントはこのファイルを最初に読むこと。

## リポジトリの性質

- 静的HTML（フレームワーク・ビルドツールなし）
- GitHub Pages でホスティング（`main` ブランチへのマージで自動デプロイ）
- スマホ（390px幅）を主対象とする教材サイト

## ファイル規約

| パス | 役割 |
|------|------|
| `index.html` | トップページ。教材カード一覧 + 総合ミニクイズ |
| `styles.css` | トップページ専用スタイル |
| `app.js` | トップページのクイズロジック |
| `lesson.css` | 教材ページ共通スタイル（lessons/*.html が読み込む） |
| `lesson.js` | 教材ページ共通クイズエンジン（lessons/*.html が読み込む） |
| `lessons/*.html` | 1論点1ファイルの教材ページ |
| `docs/content-guideline.md` | 教材コンテンツの書き方ルール（必読） |
| `.github/workflows/deploy.yml` | デプロイワークフロー（原則変更不要） |

## 教材ページの必須構成

`lessons/` 以下に新しい教材を追加するときは `docs/content-guideline.md` に従うこと。
構成順序は以下のとおり（変更不可）。

1. **まず結論** — 1〜2文で論点の核心を述べる
2. **初心者向け説明** — 判例定義や条文を引用しつつ平易に解説
3. **具体例** — ○/×の対比形式
4. **試験で問われるポイント** — 箇条書き、判例名・年月日・判決種別を明記
5. **ミニクイズ3問** — 択一式、解答後に解説を表示

## コーディング規約

- `lessons/*.html` は `<link rel="stylesheet" href="../lesson.css">` で読み込む
- `lessons/*.html` のクイズデータはページ内 `<script>` で `const answers = {...}` として定義し、その後 `<script src="../lesson.js"></script>` を読み込む
- 外部ライブラリ（CDN含む）は使用しない
- `max-width: 480px` + `padding: 0 16px` でセンタリング
- フォントは `-apple-system, BlinkMacSystemFont, "Hiragino Sans", sans-serif`
- 横スクロールが発生しないこと（390px で必ず確認）
- `<a>` のリンク先は相対パスで記述する（例: `../index.html`）

## 新規教材追加の手順

1. `TASK_TEMPLATE.md` をコピーして Issue を作成
2. `docs/content-guideline.md` を読み、ルールに従って `lessons/<slug>.html` を作成
3. `index.html` の教材セクションに `.lesson-card` を追加
4. `README.md` のファイル構成表を更新
5. コミット → プッシュ → PR → main にマージ

## やってはいけないこと

- `main` ブランチに直接プッシュしない
- ビルドツール（webpack, vite 等）を導入しない
- 教材の法令・判例内容を根拠なく変更しない（一次資料で確認すること）
- `lesson.css` / `styles.css` にページ固有のスタイルを追加しない
- 判例表記から年月日・判決種別を省略しない（content-guideline.md §2 参照）
