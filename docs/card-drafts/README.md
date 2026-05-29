# docs/card-drafts/ — 実装前レビュー用ドラフト置き場

## このディレクトリの位置づけ

`docs/card-drafts/` は公開教材ではありません。lesson HTML化する前のレビュー用ドラフト原稿を置くためのディレクトリです。

ここにある内容は**未検証**です。そのまま lesson HTML にコピーしてはなりません。

## 運用ルール

- card-drafts 内の法的説明・クイズ・source-log候補は、後続の教材本文追加PRで再レビューします。
- lesson HTML化する際は、本文に残す法的主張を `docs/source-log.md` に対応させてください。
- `docs/source-log.md` への対応が完了する前に、card-drafts の内容を公開教材として扱ってはなりません。
- card-drafts の文書をmergeしても、source-log対応済み教材とは扱いません。
- ChatGPTレビュー後に、各原稿の採用・修正・没を判断します。

## レビューフロー

```
card-drafts に原稿追加（このPR）
    ↓
ChatGPTによる法的表現・構成・危険表現レビュー
    ↓
採用・修正・没の判断
    ↓
後続PRで lesson HTML化 ＋ source-log追記 ＋ index導線追加
```

## 注意

- このディレクトリをmergeすることと、教材が公開されることは別です。
- source-log未対応の法的説明は、lesson HTMLに転記しないでください。
