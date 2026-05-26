const questions = [
  {
    q: "処分性とは何を判断する論点か？",
    choices: [
      "行政庁の行為が取消訴訟の対象となる処分に当たるか",
      "原告が法律上の利益を有する者といえるか",
      "判決によって現実に利益が回復されるか",
      "出訴期間内に訴えが提起されたか"
    ],
    answer: 0,
    explanation: "処分性とは、行政庁の行為が取消訴訟の対象となる「処分」に当たるかを判断する論点です（STEP 1）。"
  },
  {
    q: "原告適格で主に問題になるのはどれか？",
    choices: [
      "行政指導に処分性があるかどうか",
      "その人が法律上の利益を有する者といえるか",
      "訴訟の途中で処分の効果が消滅したかどうか",
      "審査請求を経由したかどうか"
    ],
    answer: 1,
    explanation: "原告適格とは、行政事件訴訟法第9条第1項が「法律上の利益を有する者」のみが取消訴訟を提起できると定めていることです（STEP 2）。"
  },
  {
    q: "訴えの利益で問題になるのはどれか？",
    choices: [
      "行政庁の行為が法律に基づくかどうか",
      "原告が処分の名宛人かどうか",
      "判決によって現実に回復される法律上の利益が残っているか",
      "処分があってから1年以内に訴えを提起したかどうか"
    ],
    answer: 2,
    explanation: "訴えの利益とは、判決によって「現実に回復される法律上の利益」が残っているかの問題です（STEP 3）。行政事件訴訟法第9条第1項括弧書きが根拠規定です。"
  },
  {
    q: "取消訴訟の主観的出訴期間はどれか？",
    choices: [
      "処分の日から6か月以内",
      "処分又は裁決があったことを知った日から6か月以内",
      "処分又は裁決の日から1年以内",
      "審査請求を申し立てた日から3か月以内"
    ],
    answer: 1,
    explanation: "主観的出訴期間は「処分又は裁決があったことを知った日から6か月以内」です（行政事件訴訟法第14条第1項・STEP 4）。客観的出訴期間（処分又は裁決の日から1年）と同時に適用されます。"
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
    pct === 1    ? '満点！4つの入口を完全に押さえています。' :
    pct >= 0.75  ? '合格ライン越え！このまま続けましょう。' :
    pct >= 0.5   ? 'もう少し！苦手なSTEPを復習しましょう。' :
                   '各STEPのページをもう一度確認しましょう。';
}

function restart() {
  current = 0; score = 0;
  order = shuffle([...Array(questions.length).keys()]);
  document.getElementById('quiz-card').style.display = '';
  document.getElementById('result-card').className = 'card result';
  loadQuestion();
}

restart();
