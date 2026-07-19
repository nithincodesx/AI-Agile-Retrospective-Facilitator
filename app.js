/* ========================================
   RetroVibe — Application
   ======================================== */  'use strict';

// =========================================
// DOM References
// =========================================

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const DOM = {
  transcript: $('#transcriptInput'),
  wordCount: $('#wordCount'),
  analyzeBtn: $('#analyzeBtn'),
  loading: $('#loading'),
  loadingText: $('#loadingText'),
  loadingProgress: $('#loadingProgress'),
  results: $('#results'),
  scoreNumber: $('#scoreNumber'),
  scoreRing: $('#scoreRing'),
  scoreGrade: $('#scoreGrade'),
  scoreSummary: $('#scoreSummary'),
  scoreTags: $('#scoreTags'),
  bottlenecksGrid: $('#bottlenecksGrid'),
  timelineChart: $('#timelineChart'),
  insightsList: $('#insightsList'),
  analysisDate: $('#analysisDate'),
  analysisWords: $('#analysisWords'),
  traitsContainer: $('#traitsContainer'),
  profileType: $('#profileType'),
  profileDesc: $('#profileDesc'),
  profileTraits: $('#profileTraits'),
  exercisesGrid: $('#exercisesGrid'),
  exercisesEmpty: $('#exercisesEmpty'),
  checkinSliders: $('#checkinSliders'),
  checkinSubmit: $('#checkinSubmit'),
  historyList: $('#historyList'),
  historyEmpty: $('#historyEmpty'),
  historyCount: $('#historyCount'),
  historyAvgScore: $('#historyAvgScore'),
  historyTopBottleneck: $('#historyTopBottleneck'),
  historyExercisesDone: $('#historyExercisesDone'),
  toast: $('#toast'),
  toastMessage: $('#toastMessage'),
  toastIcon: $('#toastIcon'),
  followupsList: $('#followupsList'),
};

// =========================================
// Data Store
// =========================================

const STORE_KEY = 'retrovibe_data';

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return getDefaultStore();
}

function saveStore() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch {}
}

function getDefaultStore() {
  return {
    retrospectives: [],
    personality: {
      communication: 50,
      conflict: 50,
      decision: 50,
      social: 50,
      adaptability: 50,
    },
    vibeHistory: [],
    exercisesTried: [],
  };
}

let store = loadStore();

// =========================================
// Exercise Database
// =========================================

const EXERCISES = [
  {
    id: 'ex-1',
    title: 'Sailboat Retrospective',
    category: 'communication',
    desc: 'Instead of "what went well/wrong," frame the sprint as a sailboat: wind (what pushed you forward), anchors (what held you back), rocks (risks), and the island (the goal). Gets honest emotions out without blame.',
    time: '30-45 min',
    size: 'Any size',
    materials: 'Virtual whiteboard or physical board + sticky notes',
    vibe: 'Encourages open sharing and reveals hidden frustrations',
  },
  {
    id: 'ex-2',
    title: 'Emotional Check-In Circle',
    category: 'social',
    desc: 'Start the retro with a quick round where each person shares how they\'re feeling in one word and a weather metaphor (e.g., "I\'m stormy — too many production fires"). Builds empathy fast.',
    time: '5-10 min',
    size: 'Up to 12',
    materials: 'Nothing needed',
    vibe: 'Builds psychological safety and emotional vocabulary',
  },
  {
    id: 'ex-3',
    title: 'Appreciative Inquiry',
    category: 'trust',
    desc: 'Instead of dissecting failures, focus on a peak moment. Ask: "When did we feel most alive and effective this sprint? What made it possible?" Strengthens trust by building on what works.',
    time: '20-30 min',
    size: 'Any size',
    materials: 'Shared document or board',
    vibe: 'Counteracts burnout by highlighting what went right',
  },
  {
    id: 'ex-4',
    title: 'The 5 Whys (Emotional Edition)',
    category: 'problem-solving',
    desc: 'Take a recurring issue and ask "why" five times — but focus on emotional root causes, not technical ones. "Why are deployments stressful?" → "Because we fear breaking things" → "Because we lack testing confidence."',
    time: '20-30 min',
    size: 'Up to 8',
    materials: 'Whiteboard or digital doc',
    vibe: 'Surfaces anxiety and builds systematic solutions',
  },
  {
    id: 'ex-5',
    title: 'Stress Heat Map',
    category: 'stress',
    desc: 'Draw a timeline of the sprint. Each person marks when their stress was highest with a dot. Discuss patterns. Helps the team see collective pressure points and plan preventive measures.',
    time: '20 min',
    size: 'Any size',
    materials: 'Timeline template (physical or digital)',
    vibe: 'Validates burnout concerns and normalizes stress talk',
  },
  {
    id: 'ex-6',
    title: 'Feedback Poker',
    category: 'communication',
    desc: 'Each person writes one piece of constructive feedback on a card. Cards are shuffled, read aloud anonymously, and the team discusses them together. Reduces fear of direct confrontation.',
    time: '25-35 min',
    size: '5-15',
    materials: 'Cards or digital anonymous board',
    vibe: 'Safe way to address conflict without personal targeting',
  },
  {
    id: 'ex-7',
    title: 'One-Word Retro',
    category: 'social',
    desc: 'Each team member sums up the sprint in one word. Discuss the words that emerge. Quick, low-stakes, and surprisingly revealing. Great for teams that hate long retros.',
    time: '15 min',
    size: 'Any size',
    materials: 'Nothing needed',
    vibe: 'Low friction, good for disengaged or time-pressed teams',
  },
  {
    id: 'ex-8',
    title: 'Trust Fall Sprint',
    category: 'trust',
    desc: 'Pair up team members who don\'t usually work together. Each person shares a current challenge and the other listens without interrupting or solving. Builds trust through genuine listening, not advice-giving.',
    time: '20 min',
    size: 'Any size (pairs)',
    materials: 'Breakout rooms or quiet space',
    vibe: 'Builds cross-team trust and breaks silos',
  },
  {
    id: 'ex-9',
    title: 'Mood Board Retro',
    category: 'social',
    desc: 'Share your screen with a grid of images/emojis/GIFs. Each person picks one that represents their sprint. Discuss choices. Light, visual, and great for distributed teams.',
    time: '15-20 min',
    size: 'Any size',
    materials: 'Digital mood board (Miro, etc.) or shared screen',
    vibe: 'Engages remote teams and surfaces emotions playfully',
  },
  {
    id: 'ex-10',
    title: 'Actionable Agreement Audit',
    category: 'problem-solving',
    desc: 'Review every action item from the last 3 retros. Ask: Did we do it? If not, why — really? Separate "forgot" from "avoided" (emotional block) from "couldn\'t" (resource block).',
    time: '20-30 min',
    size: 'Any size',
    materials: 'Previous retro notes',
    vibe: 'Turns frustration about repeated issues into honest dialogue',
  },
  {
    id: 'ex-11',
    title: 'Energy Map',
    category: 'stress',
    desc: 'Chart your energy levels across a typical sprint day. When does the team collectively dip? When do they peak? Plan meetings, deep work, and social time around the energy curve.',
    time: '15-20 min',
    size: 'Any size',
    materials: 'Shared grid or spreadsheet',
    vibe: 'Reveals burnout patterns and working style mismatches',
  },
  {
    id: 'ex-12',
    title: 'Speed of Trust',
    category: 'trust',
    desc: 'Discuss: "If trust is low, decisions slow down. Where did we waste time because we didn\'t trust each other\'s judgments?" Name specific moments without blame. Identify one trust-building action.',
    time: '25 min',
    size: 'Up to 10',
    materials: 'Whiteboard or doc',
    vibe: 'Direct but constructive, targets friction directly',
  },
];

// Migrate legacy exercisesTried (string[] -> object[])
// Must run after EXERCISES is defined
(function migrateExercisesTried() {
  store.exercisesTried = store.exercisesTried.map(e => {
    if (typeof e === 'string') {
      const ex = EXERCISES.find(x => x.id === e);
      return {
        id: e,
        title: ex ? ex.title : e,
        date: new Date().toISOString(),
        followupDone: false,
      };
    }
    return e;
  });
})();

// =========================================
// Analysis Engine (Simulated AI)
// =========================================

const EMOTIONAL_KEYWORDS = {
  frustration: {
    words: ['frustrat', 'annoy', 'irritat', 'aggravat', 'exasperat', 'fed up', 'sick of', 'tired of', 'again', 'still', 'never', 'always the same', 'same problem', 'same issue', 'yet another', 'enough', 'ugh', 'ugh', 'come on'],
    label: 'Frustration',
    emoji: '😤',
    color: '#f43f5e',
    bgColor: 'rgba(244, 63, 94, 0.12)',
  },
  disengagement: {
    words: ['whatever', 'fine', 'i don\'t care', 'doesn\'t matter', 'not my problem', 'not listening', 'zoning out', 'bored', 'checking out', 'disconnect', 'tune out', 'who cares', 'what\'s the point', 'pointless'],
    label: 'Disengagement',
    emoji: '😐',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
  },
  conflict: {
    words: ['disagree', 'wrong', 'actually', 'but you', 'you always', 'you never', 'blame', 'fault', 'should have', 'why didn\'t', 'that\'s not', 'that\'s wrong', 'accus', 'defensive', 'argument', 'angry', 'raised voice'],
    label: 'Conflict',
    emoji: '⚡',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
  },
  anxiety: {
    words: ['worried', 'anxious', 'nervous', 'stressed', 'pressure', 'overwhelm', 'panic', 'scared', 'fear', 'unsure', 'uncertain', 'nervous', 'tight', 'cant keep up', 'falling behind', 'not enough time'],
    label: 'Anxiety',
    emoji: '😰',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.12)',
  },
  burnout: {
    words: ['exhaust', 'tired', 'burned out', 'burnt out', 'drained', 'depleted', 'no energy', 'too much', 'overwork', 'long hours', 'weekend', 'late night', 'crunch', 'sprint after sprint', 'all the time', 'never stop', 'break needed'],
    label: 'Burnout',
    emoji: '😩',
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.12)',
  },
  positivity: {
    words: ['great', 'awesome', 'amazing', 'love', 'happy', 'proud', 'excellent', 'fantastic', 'wonderful', 'good job', 'nice work', 'teamwork', 'collaborate', 'improve', 'grateful', 'thank', 'appreciate', 'smooth', 'easy', 'fun'],
    label: 'Positivity',
    emoji: '😊',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    positive: true,
  },
};

function analyzeTranscript(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const lowerText = text.toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 0);

  // Score each bottleneck
  const bottlenecks = {};
  for (const [key, data] of Object.entries(EMOTIONAL_KEYWORDS)) {
    let count = 0;
    for (const word of data.words) {
      const regex = new RegExp(word, 'gi');
      const matches = lowerText.match(regex);
      if (matches) count += matches.length;
    }
    const score = Math.min(Math.round((count / Math.max(words.length, 10)) * 500), 100);
    bottlenecks[key] = { ...data, score, count };
  }

  // Emotional tone timeline (simulated by splitting transcript into chunks)
  const chunks = splitIntoChunks(lines, 10);
  const timeline = chunks.map((chunk, i) => {
    const chunkLower = chunk.toLowerCase();
    let sentiment = 0;
    for (const [key, data] of Object.entries(EMOTIONAL_KEYWORDS)) {
      for (const word of data.words) {
        if (chunkLower.includes(word)) {
          sentiment += data.positive ? 1 : -1;
        }
      }
    }
    return {
      index: i,
      sentiment: Math.max(-5, Math.min(5, sentiment)),
      label: `Part ${i + 1}`,
    };
  });

  // Overall health score (0-100)
  const positiveScore = bottlenecks.positivity?.score || 0;
  const negativeScores = Object.entries(bottlenecks)
    .filter(([k]) => k !== 'positivity')
    .map(([, v]) => v.score);

  const avgNegative = negativeScores.length
    ? negativeScores.reduce((a, b) => a + b, 0) / negativeScores.length
    : 0;

  const healthScore = Math.round(Math.max(0, Math.min(100,
    50 + (positiveScore / 2) - (avgNegative * 0.6)
  )));

  // Generate insights
  const sortedBottlenecks = Object.entries(bottlenecks)
    .filter(([k]) => k !== 'positivity')
    .sort((a, b) => b[1].score - a[1].score);

  const insights = [];

  if (sortedBottlenecks.length && sortedBottlenecks[0][1].score > 20) {
    insights.push({
      type: 'warning',
      title: `High ${sortedBottlenecks[0][1].label.toLowerCase()} detected`,
      desc: `This is the dominant emotional signal. The team may need targeted support to address underlying ${sortedBottlenecks[0][0]} issues before they compound.`,
    });
  }

  if (bottlenecks.frustration.score > 30) {
    insights.push({
      type: 'action',
      title: 'Recurring frustration patterns',
      desc: 'Frustration seems tied to repeated blockers. Consider a focused problem-solving session on the top 3 recurring issues to break the cycle.',
    });
  }

  if (bottlenecks.disengagement.score > 20) {
    insights.push({
      type: 'action',
      title: 'Signs of disengagement',
      desc: 'Indifference or detachment was detected. Shorten the retro format, introduce more visual/interactive elements, and check in one-on-one with quieter members.',
    });
  }

  if (bottlenecks.burnout.score > 25) {
    insights.push({
      type: 'danger',
      title: 'Burnout risk is significant',
      desc: 'Exhaustion language appeared frequently. Prioritize reducing sprint scope, enforce "no work" boundaries, and plan a light sprint or recovery week.',
    });
  }

  if (bottlenecks.conflict.score > 15) {
    insights.push({
      type: 'warning',
      title: 'Unresolved conflict simmering',
      desc: 'Disagreements or defensive language surfaced. Use anonymous feedback formats and consider a facilitated mediation session if patterns persist.',
    });
  }

  if (bottlenecks.anxiety.score > 20) {
    insights.push({
      type: 'action',
      title: 'Anxiety about delivery',
      desc: 'Worry and uncertainty were expressed. Improve visibility with clearer sprint goals, smaller batch sizes, and more frequent check-ins.',
    });
  }

  if (positiveScore > 30) {
    insights.push({
      type: 'positive',
      title: 'Healthy positivity present',
      desc: 'Despite challenges, appreciative and encouraging language is still flowing. Lean into this strength — it\'s a protective factor against burnout.',
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: 'info',
      title: 'Low emotional signal strength',
      desc: 'The transcript didn\'t contain strong emotional markers. Consider encouraging the team to share more openly in future retros, or try a more structured format.',
    });
  }

  return {
    healthScore,
    bottlenecks,
    timeline,
    insights,
    wordCount: words.length,
    speakerCount: estimateSpeakers(lines),
    topBottleneck: sortedBottlenecks[0]?.[0] || 'none',
    topBottleneckScore: sortedBottlenecks[0]?.[1]?.score || 0,
  };
}

function splitIntoChunks(lines, chunkSize) {
  const chunks = [];
  for (let i = 0; i < lines.length; i += chunkSize) {
    chunks.push(lines.slice(i, i + chunkSize).join(' '));
  }
  return chunks.length ? chunks : [' '];
}

function estimateSpeakers(lines) {
  const names = new Set();
  const speakerRegex = /^([A-Z][a-z]+):/;
  for (const line of lines) {
    const match = line.match(speakerRegex);
    if (match) names.add(match[1]);
  }
  return names.size || 1;
}

// =========================================
// Personality System
// =========================================

const PERSONALITY_TRAITS = [
  {
    key: 'communication',
    label: 'Communication Style',
    leftLabel: 'Direct & Brief',
    rightLabel: 'Expressive & Detailed',
  },
  {
    key: 'conflict',
    label: 'Conflict Approach',
    leftLabel: 'Confrontational',
    rightLabel: 'Harmony-Seeking',
  },
  {
    key: 'decision',
    label: 'Decision Making',
    leftLabel: 'Data & Analysis',
    rightLabel: 'Intuition & Gut',
  },
  {
    key: 'social',
    label: 'Social Energy',
    leftLabel: 'Introverted',
    rightLabel: 'Extroverted',
  },
  {
    key: 'adaptability',
    label: 'Adaptability',
    leftLabel: 'Structure & Plan',
    rightLabel: 'Flexible & Spontaneous',
  },
];

function getPersonalityType(traits) {
  const avg = Object.values(traits).reduce((a, b) => a + b, 0) / Object.keys(traits).length;

  if (avg >= 80) return { type: 'Expressive Innovator', desc: 'Highly expressive and adaptive. Your team thrives on open communication and creative exploration. Guard against scope creep and decision paralysis.' };
  if (avg >= 60) return { type: 'Balanced Collaborator', desc: 'Your team communicates evenly across all styles. This flexibility helps in most situations but can lack a decisive edge under pressure.' };
  if (avg >= 40) return { type: 'Structured Pragmatist', desc: 'Your team values clarity, plans, and data. You execute well but may miss creative solutions or dismiss emotional signals.' };
  return { type: 'Focused Executor', desc: 'Efficient and disciplined. Your team gets things done but should watch for burnout, low psychological safety, and under-communication.' };
}

function getRecommendedExerciseIds(traits, bottlenecks) {
  const topBottleneckKeys = Object.entries(bottlenecks)
    .filter(([k]) => k !== 'positivity')
    .sort((a, b) => b[1].score - a[1].score)
    .slice(0, 2)
    .map(([k]) => k);

  const catMap = {
    frustration: ['problem-solving', 'communication'],
    disengagement: ['social', 'trust'],
    conflict: ['trust', 'communication'],
    anxiety: ['stress', 'trust'],
    burnout: ['stress', 'social'],
  };

  let preferredCats = new Set();
  for (const bk of topBottleneckKeys) {
    if (catMap[bk]) catMap[bk].forEach(c => preferredCats.add(c));
  }

  const avgPersonality = Object.values(traits).reduce((a, b) => a + b, 0) / Object.keys(traits).length;
  if (avgPersonality < 40) preferredCats.add('problem-solving');
  if (avgPersonality >= 60) preferredCats.add('social');

  // Return 4 exercises: prefer those matching the categories above
  const matched = [];
  const unmatched = [];

  for (const ex of EXERCISES) {
    if (preferredCats.has(ex.category)) {
      matched.push(ex);
    } else {
      unmatched.push(ex);
    }
  }

  // Shuffle within groups for variety
  shuffleArray(matched);
  shuffleArray(unmatched);

  return [...matched, ...unmatched].slice(0, 6);
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// =========================================
// Vibe Check-in Scoring
// =========================================

const VIBE_METRICS = [
  { key: 'morale', label: 'Team Morale', emoji: '💪' },
  { key: 'safety', label: 'Psychological Safety', emoji: '🛡️' },
  { key: 'energy', label: 'Energy Level', emoji: '⚡' },
  { key: 'clarity', label: 'Goal Clarity', emoji: '🎯' },
  { key: 'connection', label: 'Social Connection', emoji: '🤝' },
];

// =========================================
// UI: Navigation
// =========================================

function initNavigation() {
  const toggle = $('.nav__toggle');
  const links = $('.nav__links');

  toggle?.addEventListener('click', () => {
    const isOpen = links?.classList.toggle('nav__links--open');
    toggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav on link click (mobile)
  $$('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      links?.classList.remove('nav__links--open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

// =========================================
// UI: Hero Counters
// =========================================

function animateCounters() {
  const counters = $$('[data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count, 10);
    if (target === 0) return;

    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

function updateHeroStats() {
  const retroCount = store.retrospectives.length;
  const emotionCount = retroCount * 5; // 5 bottleneck categories per analysis
  const exerciseCount = store.exercisesTried.length;

  const stats = [
    { el: $$('[data-count]')[0], count: retroCount },
    { el: $$('[data-count]')[1], count: emotionCount },
    { el: $$('[data-count]')[2], count: exerciseCount },
  ];

  stats.forEach(({ el, count }) => {
    if (el) el.dataset.count = String(count);
  });

  animateCounters();
}

// =========================================
// UI: Transcript Input
// =========================================

function initTranscript() {
  DOM.transcript?.addEventListener('input', updateWordCount);
  updateWordCount();
}

function updateWordCount() {
  const text = DOM.transcript?.value || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  if (DOM.wordCount) DOM.wordCount.textContent = `${words} words`;
  if (DOM.analyzeBtn) DOM.analyzeBtn.disabled = words < 10;
}

function getTranscriptText() {
  return DOM.transcript?.value?.trim() || '';
}

function setTranscriptText(text) {
  if (DOM.transcript) {
    DOM.transcript.value = text;
    updateWordCount();
  }
}

// =========================================
// UI: Analysis
// =========================================

let currentAnalysis = null;

async function runAnalysis() {
  const text = getTranscriptText();
  if (!text || text.split(/\s+/).length < 10) {
    showToast('Please enter at least 10 words.', 'warning');
    return;
  }

  // Show loading
  DOM.results?.setAttribute('hidden', '');
  DOM.loading?.removeAttribute('hidden');

  // Animate loading progress
  const loadingMessages = [
    'Analyzing emotional patterns',
    'Detecting sentiment signals',
    'Identifying bottleneck clusters',
    'Cross-referencing team profile',
    'Generating recommendations',
  ];

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress > 95) progress = 95;
    if (DOM.loadingProgress) DOM.loadingProgress.style.width = `${progress}%`;
  }, 400);

  // Cycle through loading messages
  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % loadingMessages.length;
    if (DOM.loadingText) DOM.loadingText.textContent = loadingMessages[msgIdx];
  }, 1200);

  // Simulate analysis delay (in real app this would be an API call)
  await sleep(2500 + Math.random() * 1500);

  clearInterval(progressInterval);
  clearInterval(msgInterval);
  if (DOM.loadingProgress) DOM.loadingProgress.style.width = '100%';

  // Run analysis
  currentAnalysis = analyzeTranscript(text);

  // Store date info
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  DOM.analysisDate.textContent = dateStr;
  DOM.analysisWords.textContent = `${currentAnalysis.wordCount} words · ${currentAnalysis.speakerCount} speakers`;

  // Fill progress to 100
  if (DOM.loadingProgress) DOM.loadingProgress.style.width = '100%';

  await sleep(400);

  // Hide loading, show results
  DOM.loading?.setAttribute('hidden', '');
  DOM.results?.removeAttribute('hidden');

  renderAnalysisResults(currentAnalysis);
}

function renderAnalysisResults(analysis) {
  renderScoreRing(analysis.healthScore, analysis.bottlenecks);
  renderBottlenecks(analysis.bottlenecks);
  renderTimeline(analysis.timeline);
  renderInsights(analysis.insights);
}

function renderScoreRing(score, bottlenecks) {
  const circumference = 326.73;
  const offset = circumference - (score / 100) * circumference;

  // Animate the ring
  setTimeout(() => {
    if (DOM.scoreRing) DOM.scoreRing.style.strokeDashoffset = offset;
  }, 100);

  // Animate the number
  animateNumber(DOM.scoreNumber, score, 1200);

  // Grade and summary
  let grade, summary, gradeColor;
  if (score >= 80) {
    grade = 'Thriving 🚀';
    summary = 'Your team is in a healthy emotional state. Keep nurturing this positive environment — it\'s your competitive advantage.';
    gradeColor = '#10b981';
  } else if (score >= 60) {
    grade = 'Stable ⚖️';
    summary = 'Things are generally okay, but there are some emotional friction points worth addressing before they escalate.';
    gradeColor = '#f59e0b';
  } else if (score >= 40) {
    grade = 'Strained ⚠️';
    summary = 'The team is showing moderate emotional distress. Some bottlenecks need active intervention to prevent long-term damage.';
    gradeColor = '#f97316';
  } else {
    grade = 'Critical 🔴';
    summary = 'The emotional health signals are concerning. This needs immediate attention — consider pausing feature work for a recovery sprint.';
    gradeColor = '#f43f5e';
  }

  if (DOM.scoreGrade) {
    DOM.scoreGrade.textContent = grade;
    DOM.scoreGrade.style.color = gradeColor;
  }
  if (DOM.scoreSummary) DOM.scoreSummary.textContent = summary;

  // Tags
  if (DOM.scoreTags) {
    DOM.scoreTags.innerHTML = '';
    const primaryBottleneck = Object.entries(bottlenecks)
      .filter(([k]) => k !== 'positivity')
      .sort((a, b) => b[1].score - a[1].score)[0];

    if (primaryBottleneck && primaryBottleneck[1].score > 15) {
      DOM.scoreTags.innerHTML = `
        <span class="tag tag--danger">${primaryBottleneck[1].emoji} ${primaryBottleneck[1].label}: ${primaryBottleneck[1].score}%</span>
        <span class="tag tag--success">😊 Positivity: ${bottlenecks.positivity?.score || 0}%</span>
      `;
    }
  }

  // Color the ring based on score
  const ringColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#f43f5e';
  if (DOM.scoreRing) DOM.scoreRing.style.stroke = ringColor;
}

function animateNumber(el, target, duration) {
  if (!el) return;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function renderBottlenecks(bottlenecks) {
  if (!DOM.bottlenecksGrid) return;

  const sorted = Object.entries(bottlenecks)
    .filter(([k]) => k !== 'positivity')
    .sort((a, b) => b[1].score - a[1].score);

  DOM.bottlenecksGrid.innerHTML = sorted.map(([key, data]) => {
    const barClass = data.score >= 50 ? 'danger' : data.score >= 30 ? 'warm' : 'primary';
    const barColor = data.score >= 50 ? data.color : data.score >= 30 ? '#f59e0b' : '#00d4aa';

    return `
      <div class="bottleneck-card">
        <div class="bottleneck-card__header">
          <div class="bottleneck-card__icon" style="background: ${data.bgColor}; color: ${data.color};">
            ${data.emoji}
          </div>
          <span class="bottleneck-card__score" style="color: ${barColor};">${data.score}%</span>
        </div>
        <div class="bottleneck-card__label">${data.label}</div>
        <div class="bottleneck-card__desc">${getBottleneckDesc(key, data.score)}</div>
        <div class="bottleneck-card__bar">
          <div class="bottleneck-card__bar-fill" style="width: 0%; background: ${barColor};" data-target="${data.score}"></div>
        </div>
      </div>
    `;
  }).join('');

  // Animate bars on next frame
  requestAnimationFrame(() => {
    $$('.bottleneck-card__bar-fill').forEach(bar => {
      const target = parseInt(bar.dataset.target, 10);
      setTimeout(() => {
        bar.style.width = `${target}%`;
      }, 200);
    });
  });
}

function getBottleneckDesc(key, score) {
  const descs = {
    frustration: score > 50 ? 'Repeated frustrations suggest systemic blockers not being addressed.' : 'Mild frustration signals that some processes may need attention.',
    disengagement: score > 50 ? 'Significant detachment — the team may not feel heard or invested.' : 'Slight disengagement detected. Consider varying retro formats.',
    conflict: score > 50 ? 'Active conflict patterns that need facilitated resolution.' : 'Minor disagreements present but not yet escalated.',
    anxiety: score > 50 ? 'High anxiety levels that could lead to burnout or avoidance.' : 'Some worry about delivery or uncertainty in planning.',
    burnout: score > 50 ? 'Serious burnout signals — immediate recovery measures needed.' : 'Early signs of fatigue. Preventive action is recommended.',
    positivity: 'Positive sentiment detected — a healthy counterbalance to challenges.',
  };
  return descs[key] || 'Emotional signal detected in the transcript.';
}

function renderTimeline(timeline) {
  if (!DOM.timelineChart) return;

  const values = timeline.map(t => t.sentiment);
  const maxAbs = Math.max(...values.map(v => Math.abs(v)), 3);

  DOM.timelineChart.innerHTML = timeline.map((point, i) => {
    const height = (Math.abs(point.sentiment) / maxAbs) * 100;
    const color = point.sentiment >= 0
      ? `rgba(16, 185, 129, ${0.4 + (point.sentiment / maxAbs) * 0.6})`
      : `rgba(244, 63, 94, ${0.4 + (Math.abs(point.sentiment) / maxAbs) * 0.6})`;

    const label = point.sentiment > 0 ? '😊' : point.sentiment < 0 ? '😟' : '😐';

    return `
      <div class="timeline__bar" style="height: ${height}%; background: ${color};">
        <span class="timeline__bar-tooltip">${label} ${point.sentiment > 0 ? '+' : ''}${point.sentiment}</span>
      </div>
    `;
  }).join('');
}

function renderInsights(insights) {
  if (!DOM.insightsList) return;

  const iconMap = {
    warning: { svg: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2L2 16h14L9 2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M9 7v3M9 13h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>', bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
    action: { svg: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M9 6v6M6 9h6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>', bg: 'rgba(0, 212, 170, 0.12)', color: '#00d4aa' },
    danger: { svg: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M9 5v5M9 12.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>', bg: 'rgba(244, 63, 94, 0.12)', color: '#f43f5e' },
    positive: { svg: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M6 9l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>', bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
    info: { svg: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M9 8v4M9 6v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>', bg: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' },
  };

  DOM.insightsList.innerHTML = insights.map(insight => {
    const icon = iconMap[insight.type] || iconMap.info;
    return `
      <div class="insight-item">
        <div class="insight-item__icon" style="background: ${icon.bg}; color: ${icon.color};">
          ${icon.svg}
        </div>
        <div>
          <div class="insight-item__title">${insight.title}</div>
          <div class="insight-item__desc">${insight.desc}</div>
        </div>
      </div>
    `;
  }).join('');
}

// =========================================
// UI: Personality
// =========================================

function initPersonality() {
  loadPersonalityUI();
  updatePersonalityProfile();
}

function loadPersonalityUI() {
  if (!DOM.traitsContainer) return;

  DOM.traitsContainer.innerHTML = PERSONALITY_TRAITS.map(trait => {
    const value = store.personality[trait.key] ?? 50;
    return `
      <div class="trait">
        <div class="trait__header">
          <span class="trait__label">${trait.label}</span>
          <span class="trait__value" id="trait-${trait.key}">${value}</span>
        </div>
        <div class="trait__desc">
          <span>${trait.leftLabel}</span>
          <span>${trait.rightLabel}</span>
        </div>
        <input type="range" class="trait__slider" min="0" max="100" value="${value}"
          data-trait="${trait.key}" aria-label="${trait.label}">
      </div>
    `;
  }).join('');

  // Add event listeners
  $$('.trait__slider').forEach(slider => {
    slider.addEventListener('input', onTraitChange);
  });
}

function onTraitChange(e) {
  const key = e.target.dataset.trait;
  const value = parseInt(e.target.value, 10);

  store.personality[key] = value;
  saveStore();

  // Update displayed value
  const display = document.getElementById(`trait-${key}`);
  if (display) display.textContent = value;

  updatePersonalityProfile();
  updateRecommendedExercises();
}

function updatePersonalityProfile() {
  const profile = getPersonalityType(store.personality);

  if (DOM.profileType) DOM.profileType.textContent = profile.type;
  if (DOM.profileDesc) DOM.profileDesc.textContent = profile.desc;

  if (DOM.profileTraits) {
    DOM.profileTraits.innerHTML = Object.entries(store.personality).map(([key, val]) => {
      const trait = PERSONALITY_TRAITS.find(t => t.key === key);
      const side = val >= 60 ? trait.rightLabel : val <= 40 ? trait.leftLabel : 'Balanced';
      return `<span class="tag tag--primary">${trait.label}: ${side}</span>`;
    }).join('');
  }
}

// =========================================
// UI: Exercises
// =========================================

let activeExerciseFilter = 'all';

function initExercises() {
  updateRecommendedExercises();

  // Filter chips
  $$('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.filter-chip').forEach(c => c.classList.remove('filter-chip--active'));
      chip.classList.add('filter-chip--active');
      activeExerciseFilter = chip.dataset.filter;
      renderExercises();
    });
  });
}

function updateRecommendedExercises() {
  const bottlenecks = currentAnalysis?.bottlenecks || {
    frustration: { score: 0 }, disengagement: { score: 0 },
    conflict: { score: 0 }, anxiety: { score: 0 },
    burnout: { score: 0 }, positivity: { score: 0 },
  };

  const recommended = getRecommendedExerciseIds(store.personality, bottlenecks);
  renderExercises(recommended);
}

function renderExercises(exercisesOverride) {
  const grid = DOM.exercisesGrid;
  const empty = DOM.exercisesEmpty;
  if (!grid) return;

  const exs = exercisesOverride || EXERCISES;

  const filtered = activeExerciseFilter === 'all'
    ? exs
    : exs.filter(ex => ex.category === activeExerciseFilter);

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty?.removeAttribute('hidden');
    return;
  }

  empty?.setAttribute('hidden', '');

  const catColors = {
    communication: { bg: 'rgba(0, 212, 170, 0.12)', text: '#00d4aa' },
    trust: { bg: 'rgba(139, 92, 246, 0.12)', text: '#8b5cf6' },
    'problem-solving': { bg: 'rgba(245, 158, 11, 0.12)', text: '#f59e0b' },
    social: { bg: 'rgba(6, 182, 212, 0.12)', text: '#06b6d4' },
    stress: { bg: 'rgba(249, 115, 22, 0.12)', text: '#f97316' },
  };

  const tried = new Set(store.exercisesTried.map(e => typeof e === 'string' ? e : e.id));
  const hasInsights = currentAnalysis !== null;

  grid.innerHTML = filtered.map((ex, i) => {
    const colors = catColors[ex.category] || catColors.communication;
    const isTried = tried.has(ex.id);
    const delay = i * 80;

    // Compute match score based on current analysis bottlenecks
    const matchScore = getExerciseMatchScore(ex, currentAnalysis);
    let matchBadge = '';
    if (hasInsights && matchScore > 15) {
      const matchColor = matchScore >= 70 ? '#10b981' : matchScore >= 50 ? '#f59e0b' : '#f43f5e';
      const matchBg = matchScore >= 70 ? 'rgba(16,185,129,0.12)' : matchScore >= 50 ? 'rgba(245,158,11,0.12)' : 'rgba(244,63,94,0.12)';
      matchBadge = `<span class="tag" style="background:${matchBg};color:${matchColor};">🎯 ${matchScore}% match</span>`;
    }

    return `
      <div class="exercise-card ${isTried ? 'exercise-card--tried' : ''}"
           style="animation-delay: ${delay}ms">
        <span class="exercise-card__category" style="background: ${colors.bg}; color: ${colors.text};">
          ${ex.category}
        </span>
        <h3 class="exercise-card__title">${ex.title} ${matchBadge}</h3>
        <p class="exercise-card__desc">${ex.desc}</p>
        <div class="exercise-card__meta">
          <span class="exercise-card__meta-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" stroke-width="1.2"/><path d="M7 4v3l2 2" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
            ${ex.time}
          </span>
          <span class="exercise-card__meta-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="5" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.2"/></svg>
            ${ex.size}
          </span>
          <span class="exercise-card__meta-item" title="${ex.materials}">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="8" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M5 7h4M7 5v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
            ${ex.materials.length > 30 ? ex.materials.slice(0, 28) + '...' : ex.materials}
          </span>
        </div>
        ${hasInsights ? `
          <div class="exercise-card__actions">
            <button class="btn btn--primary btn--sm" data-action="try-exercise" data-ex-id="${ex.id}">
              ${isTried ? '✓ Do Again' : 'Try This Exercise'}
            </button>
            <button class="btn btn--secondary btn--sm" data-action="exercise-vibe" data-ex-id="${ex.id}">
              💡 How it helps
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  // Attach event listeners after rendering
  grid.querySelectorAll('[data-action="try-exercise"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const exId = btn.dataset.exId;
      const ex = EXERCISES.find(e => e.id === exId);
      if (!ex) return;

      const existing = store.exercisesTried.find(e => typeof e === 'object' && e.id === exId);
      if (!existing) {
        // New exercise try — create follow-up entry
        store.exercisesTried.push({
          id: exId,
          title: ex.title,
          date: new Date().toISOString(),
          followupDone: false,
        });
        saveStore();
        updateHeroStats();
        renderExercises();
        renderFollowUps();
        showToast('Exercise logged! A follow-up reminder will be ready after your next check-in.', 'success');
      } else {
        showToast('Already logged! Use the check-in above and visit Follow-ups to track impact.', 'info');
      }
    });
  });

  grid.querySelectorAll('[data-action="exercise-vibe"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ex = EXERCISES.find(e => e.id === btn.dataset.exId);
      if (ex) showToast(ex.vibe, 'info');
    });
  });
}

function getExerciseMatchScore(ex, analysis) {
  if (!analysis) return 50;

  const bottleneckScores = {
    frustration: analysis.bottlenecks.frustration?.score || 0,
    disengagement: analysis.bottlenecks.disengagement?.score || 0,
    conflict: analysis.bottlenecks.conflict?.score || 0,
    anxiety: analysis.bottlenecks.anxiety?.score || 0,
    burnout: analysis.bottlenecks.burnout?.score || 0,
  };

  const catMatch = {
    communication: (bottleneckScores.frustration + bottleneckScores.conflict) / 2,
    trust: (bottleneckScores.conflict + bottleneckScores.anxiety) / 2,
    'problem-solving': (bottleneckScores.frustration + bottleneckScores.anxiety) / 2,
    social: (bottleneckScores.disengagement + bottleneckScores.burnout) / 2,
    stress: (bottleneckScores.burnout + bottleneckScores.anxiety) / 2,
  };

  return Math.round(catMatch[ex.category] || 50);
}

// =========================================
// UI: Vibe Tracker
// =========================================

let vibeChartInstance = null;

function initVibeTracker() {
  renderVibeSliders();
  renderVibeChart();
}

function renderVibeSliders() {
  if (!DOM.checkinSliders) return;

  DOM.checkinSliders.innerHTML = VIBE_METRICS.map(metric => `
    <div class="checkin-slider">
      <div class="checkin-slider__header">
        <span class="checkin-slider__label">${metric.emoji} ${metric.label}</span>
        <span class="checkin-slider__value" id="vibe-${metric.key}">5</span>
      </div>
      <input type="range" class="checkin-slider__input" min="1" max="10" value="5"
        data-vibe="${metric.key}" aria-label="${metric.label}">
      <div class="checkin-slider__labels">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  `).join('');

  // Add listeners
  DOM.checkinSliders.querySelectorAll('.checkin-slider__input').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const key = e.target.dataset.vibe;
      const display = document.getElementById(`vibe-${key}`);
      if (display) display.textContent = e.target.value;
    });
  });

  DOM.checkinSubmit?.addEventListener('click', submitVibeCheckin);


}

function submitVibeCheckin() {
  const values = {};
  let allSet = true;

  VIBE_METRICS.forEach(metric => {
    const slider = document.querySelector(`[data-vibe="${metric.key}"]`);
    if (slider) {
      values[metric.key] = parseInt(slider.value, 10);
    } else {
      allSet = false;
    }
  });

  if (!allSet) {
    showToast('Please rate all dimensions.', 'warning');
    return;
  }

  const entry = {
    date: new Date().toISOString(),
    ...values,
    average: Object.values(values).reduce((a, b) => a + b, 0) / Object.values(values).length,
  };

  store.vibeHistory.push(entry);
  saveStore();

  showToast('Check-in recorded! Keep tracking to see trends.', 'success');
  renderVibeChart();
  renderFollowUps();
  updateHeroStats();
}

function renderVibeChart() {
  const canvas = document.getElementById('vibeChart');
  if (!canvas) return;

  // Guard against Chart.js not loaded
  if (typeof Chart === 'undefined') {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#5c5c7a';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Chart library loading…', canvas.width / 2, canvas.height / 2);
    return;
  }

  // Destroy existing chart
  if (vibeChartInstance) {
    vibeChartInstance.destroy();
    vibeChartInstance = null;
  }

  const history = store.vibeHistory;

  if (history.length === 0) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const labels = history.map(h => {
    const d = new Date(h.date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const datasets = VIBE_METRICS.map((metric, i) => {
    const colors = [
      { border: '#00d4aa', bg: 'rgba(0, 212, 170, 0.1)' },
      { border: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
      { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
      { border: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
      { border: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
    ];

    return {
      label: metric.label,
      data: history.map(h => h[metric.key] || 5),
      borderColor: colors[i].border,
      backgroundColor: colors[i].bg,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: colors[i].border,
      borderWidth: 2,
      fill: true,
    };
  });

  // Add average line
  datasets.push({
    label: 'Average',
    data: history.map(h => h.average || 5),
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'transparent',
    borderDash: [5, 5],
    borderWidth: 1.5,
    pointRadius: 0,
    fill: false,
  });

  vibeChartInstance = new Chart(canvas, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#9898b8',
            font: { family: "'Inter', sans-serif", size: 11 },
            padding: 16,
            usePointStyle: true,
            pointStyle: 'circle',
          },
        },
        tooltip: {
          backgroundColor: '#18182e',
          titleColor: '#f0f0f4',
          bodyColor: '#9898b8',
          borderColor: '#1e1e3a',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: { family: "'Inter', sans-serif", weight: '600' },
          bodyFont: { family: "'Inter', sans-serif", size: 12 },
        },
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: { color: '#5c5c7a', font: { size: 11 } },
        },
        y: {
          min: 1,
          max: 10,
          grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
          ticks: { color: '#5c5c7a', font: { size: 11 }, stepSize: 1 },
        },
      },
    },
  });
}

// =========================================
// UI: History
// =========================================

function loadHistory() {
  renderHistoryStats();
  renderHistoryList();
}

function renderHistoryStats() {
  const retros = store.retrospectives;

  DOM.historyCount.textContent = retros.length;

  if (retros.length > 0) {
    const avg = Math.round(retros.reduce((a, r) => a + r.healthScore, 0) / retros.length);
    DOM.historyAvgScore.textContent = avg >= 60 ? `${avg} ✅` : `${avg} ⚠️`;

    // Find most common bottleneck
    const bottleneckCounts = {};
    retros.forEach(r => {
      if (r.topBottleneck && r.topBottleneck !== 'none') {
        bottleneckCounts[r.topBottleneck] = (bottleneckCounts[r.topBottleneck] || 0) + 1;
      }
    });

    const top = Object.entries(bottleneckCounts).sort((a, b) => b[1] - a[1])[0];
    const bottleneckLabels = {
      frustration: 'Frustration',
      disengagement: 'Disengagement',
      conflict: 'Conflict',
      anxiety: 'Anxiety',
      burnout: 'Burnout',
    };
    DOM.historyTopBottleneck.textContent = top ? (bottleneckLabels[top[0]] || top[0]) : 'None yet';
  } else {
    DOM.historyAvgScore.textContent = '--';
    DOM.historyTopBottleneck.textContent = '--';
  }

  DOM.historyExercisesDone.textContent = store.exercisesTried.filter(e => typeof e === 'object' && e.followupDone).length + '/' + store.exercisesTried.length;
}

function renderHistoryList() {
  const list = DOM.historyList;
  if (!list) return;

  const retros = store.retrospectives;

  if (retros.length === 0) {
    list.innerHTML = `
      <div class="history__empty" id="historyEmpty">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="12" width="48" height="40" rx="4" stroke="#333" stroke-width="2"/>
          <path d="M22 28h20M22 36h14" stroke="#333" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <h3>No retrospectives yet</h3>
        <p>Run your first analysis above to build up your team's history.</p>
        <a href="#analyze" class="btn btn--primary">Analyze Now</a>
      </div>
    `;
    return;
  }

  // Store a reference to the empty element to hide it
  DOM.historyEmpty?.setAttribute('hidden', '');

  list.innerHTML = retros.slice().reverse().map((r, i) => {
    const date = new Date(r.date);
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    let scoreClass = 'history-item__score--good';
    if (r.healthScore < 40) scoreClass = 'history-item__score--poor';
    else if (r.healthScore < 60) scoreClass = 'history-item__score--okay';

    const bottlenecks = Object.entries(r.bottlenecks || {})
      .filter(([k]) => k !== 'positivity')
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 3);

    return `
      <div class="history-item" style="animation-delay: ${i * 50}ms">
        <div class="history-item__header">
          <span class="history-item__date">${dateStr}</span>
          <span class="history-item__score ${scoreClass}">${r.healthScore}/100</span>
        </div>
        <div class="history-item__summary">
          ${r.wordCount} words · ${r.speakerCount || '?'} speakers · Score: ${r.healthScore}/100
        </div>
        <div class="history-item__bottlenecks">
          ${bottlenecks.map(([k, v]) => {
            const emojiMap = {
              frustration: '😤', disengagement: '😐',
              conflict: '⚡', anxiety: '😰', burnout: '😩',
            };
            return `<span class="tag tag--${v.score >= 40 ? 'danger' : 'primary'}">${emojiMap[k] || ''} ${v.label}: ${v.score}%</span>`;
          }).join('')}
        </div>
      </div>
    `;
  }).join('');
}

// =========================================
// Save Analysis to History
// =========================================

function saveAnalysis() {
  if (!currentAnalysis) {
    showToast('No analysis to save.', 'warning');
    return;
  }

  const text = getTranscriptText();
  const entry = {
    id: Date.now().toString(36),
    date: new Date().toISOString(),
    text: text.slice(0, 500) + (text.length > 500 ? '...' : ''),
    healthScore: currentAnalysis.healthScore,
    wordCount: currentAnalysis.wordCount,
    speakerCount: currentAnalysis.speakerCount,
    topBottleneck: currentAnalysis.topBottleneck,
    topBottleneckScore: currentAnalysis.topBottleneckScore,
    bottlenecks: Object.fromEntries(
      Object.entries(currentAnalysis.bottlenecks).map(([k, v]) => [k, { label: v.label, score: v.score, emoji: v.emoji }])
    ),
  };

  store.retrospectives.push(entry);
  saveStore();

  showToast('Analysis saved to history!', 'success');
  updateHeroStats();
  loadHistory();
}

// =========================================
// Sample Transcript
// =========================================

const SAMPLE_TRANSCRIPT = `Sarah: Alright team, let's start the retrospective. How are we feeling about this sprint?

Mike: Honestly? Frustrated. We keep having the same conversation about the deployment pipeline every single sprint. It's exhausting.

Lisa: Yeah, I'm with Mike. I feel like we're not making progress on the things that actually matter. I'm getting burned out from the constant firefighting.

James: I think we did some good work this sprint. The new search feature is solid. But I agree the deployment issues are frustrating.

Priya: I'm actually pretty anxious about the upcoming release. We have so many unknowns and I feel like we're just guessing at timelines.

Mike: That's exactly what I mean. We keep pushing without fixing the underlying issues. It's like we're running on a treadmill.

Sarah: What would help us break this cycle?

Lisa: I'd love to see us dedicate a full sprint to technical debt and infrastructure. No new features. Just fixing things.

James: That would be amazing. I'm tired of working around broken systems.

Priya: I'm worried that leadership won't go for it. They're always pushing for more features.

Mike: Then we need to have that conversation honestly. If we keep quiet, nothing changes. I'm sick of pretending everything is fine.

Sarah: Okay, I hear the frustration. Let's talk about what specific things we want to change.

Lisa: First, I think we need better testing. Half my time is spent debugging things that shouldn't break.

James: Second, clear ownership. Nobody knows who's responsible for the pipeline.

Priya: Third, realistic deadlines. I'm tired of over-promising and then scrambling.

Mike: And fourth — actually listen to us when we raise concerns. Not just nod and then do the same thing anyway.

Sarah: That's a good list. Let's start by...

Lisa: Sorry, I have to drop — production alert. Same old story.

Sarah: Let's pick this up tomorrow. Team, I hear you. Let's make real changes this time.`;

// =========================================
// Toast System
// =========================================

function showToast(message, type = 'success') {
  const toast = DOM.toast;
  const msg = DOM.toastMessage;
  const icon = DOM.toastIcon;

  if (!toast || !msg) return;

  // Set icon
  const icons = {
    success: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#10b981" stroke-width="1.5"/><path d="M6 10l3 3 5-6" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    warning: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L2 18h16L10 2z" stroke="#f59e0b" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 8v4M10 14h.01" stroke="#f59e0b" stroke-width="1.5" stroke-linecap="round"/></svg>',
    info: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#06b6d4" stroke-width="1.5"/><path d="M10 9v4M10 7v.5" stroke="#06b6d4" stroke-width="1.5" stroke-linecap="round"/></svg>',
    danger: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#f43f5e" stroke-width="1.5"/><path d="M7 7l6 6M13 7l-6 6" stroke="#f43f5e" stroke-width="1.5" stroke-linecap="round"/></svg>',
  };

  if (icon) icon.innerHTML = icons[type] || icons.success;
  msg.textContent = message;

  toast.classList.add('toast--visible');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('toast--visible');
  }, 3500);
}

// Close toast on click
document.querySelector('.toast__close')?.addEventListener('click', () => {
  DOM.toast?.classList.remove('toast--visible');
});

// =========================================
// Utilities
// =========================================

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// =========================================
// Event Delegation
// =========================================

function initEventListeners() {
  // Analyze button
  DOM.analyzeBtn?.addEventListener('click', runAnalysis);

  // Sample transcript buttons
  document.querySelectorAll('[data-action="sample-transcript"]').forEach(btn => {
    btn.addEventListener('click', () => {
      setTranscriptText(SAMPLE_TRANSCRIPT);
      // Scroll to analyze section
      document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' });
      showToast('Sample transcript loaded! Click "Analyze" to run.', 'info');
    });
  });

  // Clear transcript
  document.querySelector('[data-action="clear-transcript"]')?.addEventListener('click', () => {
    setTranscriptText('');
    DOM.results?.setAttribute('hidden', '');
    showToast('Transcript cleared.', 'info');
  });

  // Save analysis
  document.querySelector('[data-action="save-analysis"]')?.addEventListener('click', saveAnalysis);

  // View personality
  document.querySelector('[data-action="view-personality"]')?.addEventListener('click', () => {
    document.getElementById('personality')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Intersection Observer for counter animation
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateHeroStats();
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(heroSection);
  }
}

// =========================================
// Follow-up System
// =========================================

function renderFollowUps() {
  const container = DOM.followupsList;
  if (!container) return;

  const pendingFollowups = store.exercisesTried.filter(e => typeof e === 'object' && !e.followupDone);
  const doneFollowups = store.exercisesTried.filter(e => typeof e === 'object' && e.followupDone);

  if (pendingFollowups.length === 0 && doneFollowups.length === 0) {
    container.innerHTML = '<div class="followups__empty">No exercises tried yet. Run an analysis and try an exercise to start tracking impact.</div>';
    return;
  }

  let html = '';

  for (const f of pendingFollowups) {
    const daysSince = Math.floor((Date.now() - new Date(f.date).getTime()) / (1000 * 60 * 60 * 24));
    const readyForFollowUp = daysSince >= 1;

    html += `
      <div class="followup-card" style="animation-delay: 0ms">
        <div class="followup-card__header">
          <span class="followup-card__exercise">${f.title}</span>
          ${readyForFollowUp
            ? '<span class="followup-card__status followup-card__status--pending">⏳ Awaiting Check-in</span>'
            : '<span class="followup-card__status followup-card__status--pending">📅 Just Started</span>'
          }
        </div>
        <div class="followup-card__date">Started: ${new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
        ${readyForFollowUp
          ? '<div class="followup-card__cta"><button class="btn btn--primary btn--sm" data-action="complete-followup" data-id="' + f.id + '">📊 Check Impact — Compare Before/After</button></div>'
          : '<div class="followup-card__desc" style="font-size:0.8rem;color:var(--color-text-muted)">Do a vibe check-in and come back after <strong>1 day</strong> to measure impact.</div>'
        }
      </div>
    `;
  }

  for (const f of doneFollowups) {
    const before = f.beforeAvg ? f.beforeAvg.toFixed(1) : '--';
    const after = f.afterAvg ? f.afterAvg.toFixed(1) : '--';
    const diff = f.beforeAvg !== undefined && f.afterAvg !== undefined ? (f.afterAvg - f.beforeAvg).toFixed(1) : '--';
    let diffClass = 'followup-card__impact-value--same';
    let diffSymbol = '→';
    const diffNum = parseFloat(diff);
    if (diffNum > 0) { diffClass = 'followup-card__impact-value--up'; diffSymbol = '↑'; }
    if (diffNum < 0) { diffClass = 'followup-card__impact-value--down'; diffSymbol = '↓'; }

    html += `
      <div class="followup-card" style="animation-delay: 0ms">
        <div class="followup-card__header">
          <span class="followup-card__exercise">${f.title}</span>
          <span class="followup-card__status followup-card__status--done">✓ Impact Measured</span>
        </div>
        <div class="followup-card__date">Tried: ${new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
        <div class="followup-card__impact">
          <div class="followup-card__impact-item">
            <div class="followup-card__impact-label">Before</div>
            <div class="followup-card__impact-value">${before}</div>
          </div>
          <div class="followup-card__impact-item">
            <div class="followup-card__impact-label">After</div>
            <div class="followup-card__impact-value">${after}</div>
          </div>
          <div class="followup-card__impact-item">
            <div class="followup-card__impact-label">Change</div>
            <div class="followup-card__impact-value ${diffClass}">${diffSymbol} ${diff !== '--' ? Math.abs(parseFloat(diff)).toFixed(1) : '--'}</div>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;

  container.querySelectorAll('[data-action="complete-followup"]').forEach(btn => {
    btn.addEventListener('click', () => {
      completeFollowUp(btn.dataset.id);
    });
  });
}

function completeFollowUp(exId) {
  const entry = store.exercisesTried.find(e => typeof e === 'object' && e.id === exId);
  if (!entry) return;

  const exerciseDate = new Date(entry.date).getTime();
  const beforeCheckins = store.vibeHistory.filter(h => new Date(h.date).getTime() <= exerciseDate);
  const afterCheckins = store.vibeHistory.filter(h => new Date(h.date).getTime() > exerciseDate);

  if (beforeCheckins.length === 0 || afterCheckins.length === 0) {
    showToast('Need at least one check-in before AND after the exercise to measure impact. Log more check-ins!', 'warning');
    return;
  }

  const beforeAvg = beforeCheckins.reduce((sum, c) => sum + (c.average || 5), 0) / beforeCheckins.length;
  const afterAvg = afterCheckins.reduce((sum, c) => sum + (c.average || 5), 0) / afterCheckins.length;

  entry.followupDone = true;
  entry.beforeAvg = beforeAvg;
  entry.afterAvg = afterAvg;
  entry.followupDate = new Date().toISOString();

  saveStore();
  renderFollowUps();
  updateHeroStats();

  const diff = (afterAvg - beforeAvg).toFixed(1);
  if (parseFloat(diff) > 0) {
    showToast('Impact measured! Vibe improved by ' + diff + ' points. 🎉', 'success');
  } else if (parseFloat(diff) < 0) {
    showToast('Impact measured! Vibe dropped by ' + Math.abs(parseFloat(diff)) + ' points. Consider trying a different approach.', 'warning');
  } else {
    showToast('Impact measured! Vibe stayed the same. May need more time or a different exercise.', 'info');
  }
}

// =========================================
// Init
// =========================================

function init() {
  // Handle hash navigation on load
  if (window.location.hash) {
    setTimeout(() => {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  initNavigation();
  initTranscript();
  initPersonality();
  initExercises();
  initVibeTracker();
  renderFollowUps();
  loadHistory();
  initEventListeners();

  // Set initial hero counter values
  updateHeroStats();
}

document.addEventListener('DOMContentLoaded', init);
