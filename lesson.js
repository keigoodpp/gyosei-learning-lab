// Lesson quiz engine.
// Requires the page to define `const answers` before loading this script.
// answers = { [qid]: { correct: number, explanation: string }, ... }

const answered = {};

function answer(qid, selected) {
  if (answered[qid]) return;
  if (typeof answers === 'undefined' || !answers[qid]) return;
  answered[qid] = true;

  const a = answers[qid];
  document.querySelectorAll(`#${qid} .quiz-choice`).forEach((btn, idx) => {
    btn.onclick = null;
    if (idx === a.correct) btn.classList.add('correct');
    else if (idx === selected && selected !== a.correct) btn.classList.add('wrong');
  });

  const fb = document.getElementById(`${qid}-fb`);
  fb.className = selected === a.correct
    ? 'quiz-feedback correct show'
    : 'quiz-feedback wrong show';
  fb.textContent = (selected === a.correct ? '✓ 正解！ ' : '✗ 不正解。') + a.explanation;
}
