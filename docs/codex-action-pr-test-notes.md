# Codex Action PR Test — Notes

## 1. この実験の目的

GitHub Mention 経由の Codex では、Codex task 内でローカル commit まではできたが、
GitHub HTTPS credentials 不足により既存 PR ブランチへの push が失敗した。

本実験では別経路を検証する:

- GitHub Actions 上で `openai/codex-action@v1` を実行し、Codex に workspace 内で差分を作らせる。
- その差分を `peter-evans/create-pull-request@v8` で自動 PR 化できるかを確認する。

つまり「Codex 自身が push する」のではなく「GitHub Actions が PR を作る」権限経路の検証。
実装そのものではなく **権限経路の検証** が目的。

## 2. GitHub Actions 側で必要な設定

Repository Settings → Actions → General → Workflow permissions:

- **Read and write permissions** を有効にする。
- **Allow GitHub Actions to create and approve pull requests** を有効にする。

これが無いと `peter-evans/create-pull-request` が PR を作成できない。

## 3. 必要な secret

Repository Settings → Secrets and variables → Actions:

- **`OPENAI_API_KEY`** — Codex Action が Responses API を使うために必要。
  - 値はログに出力しない。
  - 未設定の場合、workflow は PR 作成前に安全に失敗する。

## 4. 成功判定

- Actions タブから手動 (`workflow_dispatch`) で実行できる。
- Codex が `docs/codex-action-pr-test.md` のみを作成・更新する。
- 許可外ファイルが変更されていない（ガードが通過する）。
- `codex/action-pr-test` ブランチが作られる。
- 自動 PR（Draft）が作成される。

## 5. 失敗時の切り分け

| 症状 | 想定原因 | 対処 |
| --- | --- | --- |
| 「OPENAI_API_KEY secret is not set」で即失敗 | secret 未設定 | `OPENAI_API_KEY` を Actions secret に登録 |
| Codex ステップでエラー | API キー無効 / quota / モデル権限 | キーの有効性と利用枠を確認 |
| 「Disallowed files were changed」で失敗 | Codex が許可外ファイルを変更 | prompt を見直す。ガードは想定どおり機能 |
| 「No changes detected」で失敗 | Codex が何も変更しなかった | prompt を見直す |
| create-pull-request で 403 / permission エラー | workflow permissions 不足、または "Allow GitHub Actions to create and approve pull requests" 無効 | 上記「2. 必要な設定」を有効化 |
| PR は作られるが空 | add-paths とガードの対象不一致 | 対象ファイルパスを確認 |
