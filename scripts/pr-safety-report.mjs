import { readFileSync, appendFileSync, existsSync } from 'fs';

const inputPath = process.argv[2] || 'changed-files.txt';

function readChangedFiles(path) {
  if (!existsSync(path)) {
    return { files: [], error: `ファイルが見つかりません: ${path}` };
  }
  try {
    const content = readFileSync(path, 'utf8');
    const files = content.split('\n').map(f => f.trim()).filter(f => f.length > 0);
    return { files, error: null };
  } catch (e) {
    return { files: [], error: `読み取りエラー: ${e.message}` };
  }
}

function categorize(file) {
  if (/^lessons\/.+\.html$/.test(file)) return 'lesson-html';
  if (file === 'index.html') return 'top-page';
  if (file === 'styles.css' || file === 'lesson.css') return 'style';
  if (file === 'app.js' || file === 'lesson.js') return 'script';
  if (file === 'docs/source-log.md') return 'source-log';
  if (file === 'docs/human-check-tasks.md') return 'human-check';
  if (file === 'docs/content-guideline.md') return 'guideline';
  if (file === 'docs/operation-checklist.md') return 'operation-doc';
  if (/^\.github\/workflows\//.test(file) || /^scripts\//.test(file)) return 'workflow';
  if (/^docs\//.test(file)) return 'other-docs';
  return 'other';
}

function classifyPR(files, cats) {
  const has = (cat) => cats.includes(cat);
  const count = (cat) => cats.filter(c => c === cat).length;
  const lessonCount = count('lesson-html');
  const catSet = new Set(cats);

  if (has('script')) return 'script-risk';
  if (has('human-check')) return 'verification-risk';
  if (has('source-log') || has('guideline')) return 'legal-source-risk';
  if (has('workflow')) return 'workflow-risk';
  if (lessonCount >= 2) return 'multi-lesson';
  if (lessonCount === 1 && catSet.size === 1) return 'single-lesson';
  if (catSet.size === 1 && has('top-page')) return 'top-navigation';
  if (catSet.size === 1 && has('style')) return 'style-only';

  const docsOnlyCategories = new Set(['operation-doc', 'other-docs']);
  const allDocOnly = cats.every(c => docsOnlyCategories.has(c));
  if (allDocOnly) return 'docs-only';

  if (catSet.size > 1) return 'mixed-risk';
  return 'docs-only';
}

function assessRisk(prType) {
  const low = ['docs-only', 'top-navigation'];
  const medium = ['style-only', 'multi-lesson', 'workflow-risk'];
  const high = ['script-risk', 'verification-risk', 'legal-source-risk', 'mixed-risk'];
  if (low.includes(prType)) return 'low';
  if (medium.includes(prType)) return 'medium';
  if (high.includes(prType)) return 'high';
  if (prType === 'single-lesson') return 'low';
  return 'medium';
}

function codexReview(cats, prType) {
  const requiredCats = ['lesson-html', 'script', 'source-log', 'human-check', 'guideline', 'workflow'];
  const needsCodex = cats.some(c => requiredCats.includes(c));
  return needsCodex ? '必須' : '任意';
}

function humanCheckItems(prType) {
  const checks = {
    'docs-only': ['docs内容が運用意図と合っているか目視確認'],
    'top-navigation': ['スマホ実機でトップ表示とリンク確認'],
    'single-lesson': [
      'スマホ実機で表示確認',
      'ミニクイズ動作確認',
      '法的表現の人間確認',
    ],
    'multi-lesson': [
      '各ページの実機確認',
      'リンク導線確認',
      '法的表現の人間確認',
    ],
    'style-only': [
      'スマホ実機で表示崩れ確認',
      'タップ領域確認',
      '横スクロール確認',
      'スマホ実機確認必須',
    ],
    'script-risk': [
      '全クイズ動作確認',
      'トップ導線確認',
      'ブラウザコンソールエラー確認',
    ],
    'workflow-risk': [
      'Actionsが正常に走るか確認',
      'Summaryが出るか確認',
      '既存deploy workflowに干渉しないか確認',
    ],
    'verification-risk': ['確認状態を勝手に進めていないか確認'],
    'legal-source-risk': [
      'source-logやcontent-guidelineの根拠確認',
      'Codex Review必須',
    ],
    'mixed-risk': [
      '変更範囲を個別に確認',
      '各カテゴリの人間確認を実施',
      'Codex Review推奨',
    ],
  };
  return checks[prType] || ['変更内容を目視確認してください'];
}

function buildReport(files, readError) {
  if (readError && files.length === 0) {
    return [
      '# PR Safety Report',
      '',
      '> **差分取得失敗・人間確認必要**',
      '',
      `差分ファイルの読み取りに失敗しました: ${readError}`,
      '',
      '最終判断は人間が行ってください。',
    ].join('\n');
  }

  if (files.length === 0) {
    return [
      '# PR Safety Report',
      '',
      '変更ファイルが検出されませんでした。',
      '',
      '> このSafety Reportは初期版のため、PRを自動でfailさせません。',
      '> 最終判断は人間が行ってください。',
    ].join('\n');
  }

  const cats = files.map(categorize);
  const prType = classifyPR(files, cats);
  const risk = assessRisk(prType);
  const codex = codexReview(cats, prType);
  const humanItems = humanCheckItems(prType);

  const catSet = new Set(cats);
  const hasLessonHtml = catSet.has('lesson-html');
  const hasTopPage = catSet.has('top-page');
  const hasStyle = catSet.has('style');
  const hasScript = catSet.has('script');
  const hasSourceLog = catSet.has('source-log');
  const hasHumanCheck = catSet.has('human-check');
  const hasGuideline = catSet.has('guideline');
  const hasWorkflow = catSet.has('workflow');

  const riskEmoji = { low: '🟢', medium: '🟡', high: '🔴' }[risk] || '⚪';
  const codexEmoji = codex === '必須' ? '🔴' : '🟡';

  const lines = [
    '# PR Safety Report',
    '',
    '## 変更ファイル',
    ...files.map(f => `- \`${f}\``),
    '',
    '## 推定PR種別',
    prType,
    '',
    '## リスク',
    `${riskEmoji} **${risk}**`,
    '',
    '## Codex Review',
    `${codexEmoji} **${codex}**`,
    '',
    '## 自動確認',
    `- lessons/*.html 変更${hasLessonHtml ? 'あり ⚠️' : 'なし ✅'}`,
    `- index.html 変更${hasTopPage ? 'あり ⚠️' : 'なし ✅'}`,
    `- CSS変更${hasStyle ? 'あり ⚠️' : 'なし ✅'}`,
    `- JS変更${hasScript ? 'あり ⚠️' : 'なし ✅'}`,
    `- source-log.md 変更${hasSourceLog ? 'あり ⚠️' : 'なし ✅'}`,
    `- human-check-tasks.md 変更${hasHumanCheck ? 'あり ⚠️' : 'なし ✅'}`,
    `- content-guideline.md 変更${hasGuideline ? 'あり ⚠️' : 'なし ✅'}`,
    `- workflow/scripts変更${hasWorkflow ? 'あり ⚠️' : 'なし ✅'}`,
    '',
    '## 人間確認',
    ...humanItems.map(i => `- ${i}`),
    '',
    '## 注意',
    'このSafety Reportは初期版のため、PRを自動でfailさせません。',
    '最終判断は人間が行ってください。',
  ];

  return lines.join('\n');
}

function main() {
  try {
    const { files, error } = readChangedFiles(inputPath);
    const report = buildReport(files, error);

    const summaryPath = process.env.GITHUB_STEP_SUMMARY;
    if (summaryPath) {
      appendFileSync(summaryPath, report + '\n');
    } else {
      console.log(report);
    }
  } catch (e) {
    const fallback = [
      '# PR Safety Report',
      '',
      '> **スクリプトエラー・人間確認必要**',
      '',
      `予期しないエラーが発生しました: ${e.message}`,
      '',
      'このSafety Reportは初期版のため、PRを自動でfailさせません。',
      '最終判断は人間が行ってください。',
    ].join('\n');

    const summaryPath = process.env.GITHUB_STEP_SUMMARY;
    if (summaryPath) {
      try { appendFileSync(summaryPath, fallback + '\n'); } catch (_) {}
    } else {
      console.log(fallback);
    }
  }
  process.exit(0);
}

main();
