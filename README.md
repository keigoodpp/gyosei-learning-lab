# gyosei-learning-lab

行政書士試験の学習教材 MVP。**1論点1ページ**形式でスマホから読める教材と、短時間で確認できるミニクイズを提供する実験リポジトリ。

## 目的

- 隙間時間（通勤・休憩）にスマホで1論点を完結して学べる教材を検証する
- 「結論 → 説明 → 具体例 → 試験ポイント → クイズ」の流れで定着率を測る
- 静的HTMLのみで維持コストゼロのホスティングを実現する

## ファイル構成

```
/
├── index.html                  # トップページ（教材一覧 + 総合ミニクイズ）
├── styles.css                  # トップページ専用スタイル
├── app.js                      # トップページ クイズロジック
├── lesson.css                  # 教材ページ共通スタイル
├── lesson.js                   # 教材ページ共通クイズエンジン
├── lessons/
│   ├── shobunsei.html          # 行政法：処分性とは何か
│   ├── genkoku-tekikaku.html   # 行政法：原告適格とは何か
│   ├── uttae-no-rieki.html     # 行政法：訴えの利益とは何か
│   ├── shusso-kikan.html       # 行政法：出訴期間とは何か
│   └── admin-procedure-map.html  # 行政法：行政手続法の全体地図（申請に対する処分・不利益処分・行政指導・届出・意見公募手続など）
├── docs/
│   ├── content-guideline.md   # 法令・判例教材の書き方ルール
│   ├── source-log.md          # 教材に記載した判例・条文の一次資料確認ログ
│   └── human-check-tasks.md  # 人間確認タスク用チェックリスト（条文・判例の一次資料照合）
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages 自動デプロイ
├── AGENTS.md                   # AIエージェント向け作業ルール
└── TASK_TEMPLATE.md            # 新規教材追加タスクテンプレート
```

## 公開URL

```
https://keigoodpp.github.io/gyosei-learning-lab/
```

## 動作確認

1. ブラウザで公開URLを開く
2. 教材カード「処分性とは何か」をタップ → `lessons/shobunsei.html` に遷移することを確認
3. ミニクイズが正誤判定・解説を表示することを確認
4. Chrome DevTools で幅 390px に設定し、横スクロールが発生しないことを確認

## ローカル確認

```bash
python3 -m http.server 8080
# → http://localhost:8080 を開く
```

## 教材を追加するには

1. `TASK_TEMPLATE.md` を参照して Issue を作成
2. `docs/content-guideline.md` に従って `lessons/<slug>.html` を作成
3. `index.html` の教材セクションに `.lesson-card` を追加
4. `README.md` のファイル構成表を更新
5. PR を作成して main にマージ
