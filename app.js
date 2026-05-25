const questions = [
  {
    q: "行政書士が作成できる書類として正しいものはどれか？",
    choices: ["戸籍謄本", "許認可申請書", "登記申請書", "確定申告書"],
    answer: 1,
    explanation: "行政書士は官公署に提出する書類（許認可申請書など）の作成を業とします。戸籍謄本は市区町村が発行し、登記申請書は司法書士、確定申告書は税理士の専管事項です。"
  },
  {
    q: "行政書士法において、行政書士の欠格事由に該当するのはどれか？",
    choices: ["未成年者", "成年被後見人", "破産者で復権を得た者", "禁錮以上の刑に処せられた者"],
    answer: 3,
    explanation: "行政書士法2条の2により、禁錮以上の刑に処せられ、その執行を終わり、又は執行を受けることがなくなってから3年を経過しない者は欠格事由に該当します。"
  },
  {
    q: "行政手続法における「申請」の説明として正しいものはどれか？",
    choices: [
      "行政庁が国民に対して求める情報提供",
      "法令に基づき行政庁の許可・認可等を求める行為",
      "行政庁が職権で行う調査",
      "国民が行政庁に対して苦情を申し出る行為"
    ],
    answer: 1,
    explanation: "行政手続法第2条3号において、「申請」とは法令に基づき、行政庁の許可、認可、免許その他の自己に対し何らかの利益を付与する処分を求める行為とされています。"
  },
  {
    q: "行政不服申立てにおける審査請求の原則的な審査庁はどれか？",
    choices: ["処分庁", "処分庁の上級行政庁", "裁判所", "行政不服申立委員会"],
    answer: 1,
    explanation: "行政不服申立法第4条により、審査請求は原則として処分庁の最上級行政庁に対して行います（上級行政庁への審査請求が原則）。"
  },
  {
    q: "民法における「制限行為能力者」に含まれないのはどれか？",
    choices: ["未成年者", "成年被後見人", "被保佐人", "外国人"],
    answer: 3,
    explanation: "制限行為能力者とは、単独で完全に有効な法律行為ができない者で、未成年者・成年被後見人・被保佐人・被補助人の4類型があります。外国人は含まれません。"
  }
];

let current = 0, score = 0, answered = false, order = [];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function loadQuestion() {
  const q = questions[order[current]];
  document.getElementById('progress').textContent = `問 ${current + 1} / ${questions.length}`;
  document.getElementById('question').textContent = q.q;
  answered = false;

  const choicesEl = document.getElementById('choices');
  choicesEl.innerHTML = '';
  q.choices.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = c;
    btn.onclick = () => selectAnswer(i);
    choicesEl.appendChild(btn);
  });

  document.getElementById('feedback').className = 'feedback';
  document.getElementById('feedback').textContent = '';
  document.getElementById('next-btn').className = 'next-btn';
  document.getElementById('next-btn').textContent = '次の問題へ';
}

function selectAnswer(i) {
  if (answered) return;
  answered = true;

  const q = questions[order[current]];
  document.querySelectorAll('.choice').forEach((btn, idx) => {
    btn.onclick = null;
    if (idx === q.answer) btn.classList.add('correct');
    else if (idx === i && i !== q.answer) btn.classList.add('wrong');
  });

  const fb = document.getElementById('feedback');
  if (i === q.answer) {
    score++;
    fb.className = 'feedback correct show';
    fb.textContent = '✓ 正解！ ' + q.explanation;
  } else {
    fb.className = 'feedback wrong show';
    fb.textContent = '✗ 不正解。' + q.explanation;
  }

  const nb = document.getElementById('next-btn');
  nb.className = 'next-btn show';
  if (current === questions.length - 1) nb.textContent = '結果を見る';
}

function nextQuestion() {
  current++;
  if (current >= questions.length) showResult();
  else loadQuestion();
}

function showResult() {
  document.getElementById('quiz-card').style.display = 'none';
  document.getElementById('result-card').className = 'card result show';
  document.getElementById('score-text').textContent = `${score} / ${questions.length} 点`;
  const pct = score / questions.length;
  document.getElementById('score-comment').textContent =
    pct === 1    ? '満点！素晴らしい理解度です。' :
    pct >= 0.8   ? '合格ライン越え！このまま続けましょう。' :
    pct >= 0.6   ? 'もう少し！苦手分野を復習しましょう。' :
                   '基礎から確認しましょう。焦らずに！';
}

function restart() {
  current = 0; score = 0;
  order = shuffle([...Array(questions.length).keys()]);
  document.getElementById('quiz-card').style.display = '';
  document.getElementById('result-card').className = 'card result';
  loadQuestion();
}

restart();
