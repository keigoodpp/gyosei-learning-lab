# gyosei-learning-lab

行政書士試験の学習教材 MVP。**1論点1ページ**形式でスマホから読める教材と、短時間で確認できるミニクイズを提供する実験リポジトリ。

## 目的

- 隙間時間（通勤・休憩）にスマホで1論点を完結して学べる教材を検証する
- 「結論 → 説明 → 具体例 → 試験ポイント → クイズ」の流れで定着率を測る
- 静的HTMLのみで維持コストゼロのホスティングを実現する

## 構成

```
/
├── index.html          # トップページ（教材一覧 + 総合ミニクイズ）
├── lessons/
│   └── shobunsei.html  # 行政法：処分性とは何か
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Pages 自動デプロイ
├── AGENTS.md           # AIエージェント向け作業ルール
└── TASK_TEMPLATE.md    # 新規タスク作成テンプレート
```

## 公開URL

```
https://keigoodpp.github.io/gyosei-learning-lab/
```

## 動作確認

1. ブラウザで上記URLを開く
2. 教材カード「処分性とは何か」をタップして `lessons/shobunsei.html` に遷移することを確認
3. 各ページのミニクイズが正誤判定・解説を表示することを確認
4. Chrome DevTools で幅 390px に設定し、横スクロールが発生しないことを確認

## ローカル確認

```bash
# Python 3
python3 -m http.server 8080
# → http://localhost:8080 を開く
```

## 教材を追加するには

`TASK_TEMPLATE.md` を参照して Issue を作成 → `lessons/` 以下に HTML を追加 → `index.html` の教材カードにリンクを追加。
