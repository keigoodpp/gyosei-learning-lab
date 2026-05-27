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
│   ├── admin-procedure-map.html  # 行政法：行政手続法の全体地図（申請に対する処分・不利益処分・行政指導・届出・意見公募手続など）
│   ├── admin-appeal-map.html     # 行政法：行政不服審査法の全体地図（処分・不作為・審査請求・再調査の請求・再審査請求・審理員・裁決・執行停止など）
│   ├── state-compensation-map.html  # 行政法：国家賠償法・損失補償の全体地図（国家賠償法1条・2条、営造物責任、損失補償、特別の犠牲など）
│   ├── local-autonomy-map.html      # 地方自治：地方自治法の全体地図（普通地方公共団体、議会、長、条例・規則、直接請求、住民監査請求、住民訴訟、自治事務、法定受託事務、国等の関与など）
│   └── constitution-map.html        # 憲法：憲法の全体地図（基本的人権、精神的自由、経済的自由、社会権、参政権、国会、内閣、裁判所、違憲審査など、憲法で問われる基本場面を整理する教材）
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
