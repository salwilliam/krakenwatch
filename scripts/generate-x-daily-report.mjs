import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const CONFIG_PATH = new URL('../config/x-monitor.config.json', import.meta.url);
const REPORTS_DIR = new URL('../reports/x-daily', import.meta.url);
const RAW_DIR = new URL('../reports/x-daily/raw', import.meta.url);

function requireEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function maybeEnv(name, fallback = '') {
  const value = process.env[name];
  return value && value.trim().length ? value.trim() : fallback;
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function humanDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function parseJsonSafe(text, fallback = null) {
  try {
    return JSON.parse(text);
  } catch {
    return fallback;
  }
}

function hoursAgo(hours) {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d;
}

function normalizeText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function loadConfig() {
  const parsed = JSON.parse(await readFile(CONFIG_PATH, 'utf8'));
  if (!Array.isArray(parsed.accounts) || parsed.accounts.length === 0) {
    throw new Error('config.accounts must contain at least one X username');
  }
  return parsed;
}

async function fetchX(url, bearerToken) {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`X API error ${res.status}: ${body}`);
  }
  return res.json();
}

async function getUserByUsername(username, bearerToken, baseUrl) {
  const url = new URL(`${baseUrl}/users/by/username/${encodeURIComponent(username)}`);
  url.searchParams.set('user.fields', 'id,name,username');
  const payload = await fetchX(url, bearerToken);
  if (!payload?.data?.id) {
    throw new Error(`No user id found for @${username}`);
  }
  return payload.data;
}

function buildExcludeParam(config) {
  const excludes = [];
  if (config?.x?.exclude_replies !== false) {
    excludes.push('replies');
  }
  if (config?.x?.exclude_retweets !== false) {
    excludes.push('retweets');
  }
  return excludes.join(',');
}

async function getRecentTweets(userId, bearerToken, config) {
  const url = new URL(`${config.x.base_url}/users/${userId}/tweets`);
  url.searchParams.set('max_results', String(Math.min(100, Math.max(5, config.x.max_posts_per_account ?? 12))));
  const exclude = buildExcludeParam(config);
  if (exclude) {
    url.searchParams.set('exclude', exclude);
  }
  url.searchParams.set('tweet.fields', 'created_at,public_metrics,lang');
  const payload = await fetchX(url, bearerToken);
  return Array.isArray(payload?.data) ? payload.data : [];
}

function withinLookback(createdAt, lookbackHours) {
  const dt = new Date(createdAt);
  if (Number.isNaN(dt.getTime())) {
    return false;
  }
  return dt >= hoursAgo(lookbackHours);
}

function scoreCategory(text) {
  const t = text.toLowerCase();
  if (/(exploit|hack|incident|vulnerability|outage|downtime|drain)/.test(t)) {
    return 'Risk / Incident';
  }
  if (/(launch|live|mainnet|deploy|integration|partnership)/.test(t)) {
    return 'Launch / Integration';
  }
  if (/(tvl|liquidity|volume|inflow|bridge|swap|yield|apy)/.test(t)) {
    return 'Liquidity / Market';
  }
  if (/(grant|builder|dev|tooling|sdk|docs|hackathon)/.test(t)) {
    return 'Builder / Ecosystem';
  }
  return 'General Ecosystem';
}

function keywordHitCount(text, keywords) {
  const lc = text.toLowerCase();
  return keywords.reduce((sum, kw) => {
    const re = new RegExp(`\\b${escapeRegExp(String(kw).toLowerCase())}\\b`, 'g');
    const matches = lc.match(re);
    return sum + (matches ? matches.length : 0);
  }, 0);
}

function engagementScore(metrics = {}) {
  const likes = Number(metrics.like_count ?? 0);
  const reposts = Number(metrics.retweet_count ?? 0);
  const replies = Number(metrics.reply_count ?? 0);
  const quotes = Number(metrics.quote_count ?? 0);
  return likes + reposts * 2 + replies * 2 + quotes * 1.5;
}

function buildDeterministicRanking(posts, config) {
  const keywords = Array.isArray(config.relevance_keywords) ? config.relevance_keywords : [];
  const ranked = posts.map((post) => {
    const text = normalizeText(post.text);
    const keyHits = keywordHitCount(text, keywords);
    const ageHours = Math.max(0, (Date.now() - new Date(post.created_at).getTime()) / 3_600_000);
    const recencyBonus = Math.max(0, 24 - ageHours) * 1.2;
    const engage = engagementScore(post.public_metrics);
    const score = keyHits * 8 + recencyBonus + Math.min(35, Math.log10(engage + 1) * 12);
    return {
      ...post,
      _rank_score: Math.round(score * 10) / 10,
      _keyword_hits: keyHits,
      _engagement: Math.round(engage * 10) / 10,
      _category: scoreCategory(text),
    };
  });
  ranked.sort((a, b) => b._rank_score - a._rank_score);
  return ranked;
}

function buildLlmPrompt(shortlist, config) {
  const lines = shortlist.map((post, i) => [
    `Item ${i + 1}`,
    `id: ${post.id}`,
    `created_at: ${post.created_at}`,
    `rank_score: ${post._rank_score}`,
    `engagement: ${post._engagement}`,
    `category_guess: ${post._category}`,
    `text: ${normalizeText(post.text)}`,
    '',
  ].join('\n'));

  return [
    `Objective: ${config.objective}`,
    'You are generating an internal Ink ecosystem snapshot from past-24h X posts.',
    'Do not include source account names. Focus on ecosystem developments only.',
    'Return strict JSON with schema:',
    '{"summary":"string","items":[{"id":"string","headline":"string","why_it_matters":"string","category":"string","watch_next":"string","priority":1-5}],"watchlist":"string"}',
    'Be concise and factual. No markdown.',
    '',
    ...lines,
  ].join('\n');
}

async function runLlm(shortlist, config) {
  const apiKey = requireEnv('OPENAI_API_KEY');
  const model = maybeEnv('OPENAI_MODEL', config.llm?.model || 'gpt-4.1-mini');
  const prompt = buildLlmPrompt(shortlist, config);

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content:
            'You are an ecosystem intelligence analyst. Produce concise, structured synthesis with no source attribution.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: Number(config.llm?.temperature ?? 0.2),
      max_output_tokens: 1600,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
  }

  const payload = await res.json();
  const parsed = parseJsonSafe(payload?.output_text, null);
  if (!parsed || !Array.isArray(parsed.items)) {
    throw new Error(`Unexpected LLM response: ${payload?.output_text ?? 'empty'}`);
  }
  return parsed;
}

function fallbackSynthesis(shortlist) {
  return {
    summary:
      'Automated deterministic snapshot generated without LLM synthesis. Prioritized by relevance keywords, recency, and engagement.',
    items: shortlist.slice(0, 5).map((post, idx) => ({
      id: post.id,
      headline: `Ecosystem signal #${idx + 1}`,
      why_it_matters: `Ranked high on relevance (${post._rank_score}) in ${post._category}.`,
      category: post._category,
      watch_next: 'Track follow-on announcements and onchain traction in the next 24h.',
      priority: Math.max(1, 5 - idx),
    })),
    watchlist: 'LLM unavailable; verify top signals manually.',
  };
}

function markdownReport({ runDate, synthesis, shortlist, config, usedFallback }) {
  const iso = toIsoDate(runDate);
  const lines = [
    `# Ink 24h Snapshot — ${humanDate(runDate)}`,
    '',
    `- Window: last ${config.x.lookback_hours} hours`,
    `- Posts analyzed: ${shortlist.length}`,
    `- Method: ${usedFallback ? 'rules-only fallback' : 'rules + LLM synthesis'}`,
    '',
    '## Daily Summary',
    '',
    synthesis.summary || 'No summary generated.',
    '',
    '## Top Ecosystem Developments',
    '',
  ];

  (synthesis.items || []).slice(0, config.report.top_items).forEach((item, idx) => {
    lines.push(
      `### ${idx + 1}) ${item.headline || `Development ${idx + 1}`}`,
      '',
      `- Category: ${item.category || 'General Ecosystem'}`,
      `- Why it matters: ${item.why_it_matters || 'n/a'}`,
      `- Watch next (24h): ${item.watch_next || 'n/a'}`,
      `- Priority: ${item.priority ?? 'n/a'}/5`,
      '',
    );
  });

  lines.push(
    '## Watchlist',
    '',
    synthesis.watchlist || 'No watchlist generated.',
    '',
    '## Run Metadata',
    '',
    `- report_id: ink-24h-${iso}`,
    `- generated_at_utc: ${runDate.toISOString()}`,
    `- attribution_mode: internal-only (no public account listing)`,
  );
  return `${lines.join('\n')}\n`;
}

async function collectPosts(config, bearerToken) {
  const errors = [];
  const all = [];
  for (const username of config.accounts) {
    try {
      const user = await getUserByUsername(username, bearerToken, config.x.base_url);
      const tweets = await getRecentTweets(user.id, bearerToken, config);
      for (const tweet of tweets) {
        if (!withinLookback(tweet.created_at, config.x.lookback_hours)) {
          continue;
        }
        all.push({
          ...tweet,
          _source_username: user.username,
          url: `https://x.com/${user.username}/status/${tweet.id}`,
        });
      }
    } catch (error) {
      errors.push({ account: username, message: error.message });
    }
  }
  return { posts: all, errors };
}

async function main() {
  const config = await loadConfig();
  const runDate = new Date();
  const iso = toIsoDate(runDate);
  const bearerToken = requireEnv('X_BEARER_TOKEN');

  const { posts, errors } = await collectPosts(config, bearerToken);
  if (posts.length === 0) {
    throw new Error(`No posts collected. Errors: ${JSON.stringify(errors)}`);
  }

  const ranked = buildDeterministicRanking(posts, config);
  const shortlistSize = Number(config.report.shortlist_size ?? 20);
  const shortlist = ranked.slice(0, shortlistSize);

  let synthesis = null;
  let usedFallback = false;
  try {
    synthesis = await runLlm(shortlist, config);
  } catch (error) {
    errors.push({ account: 'llm', message: error.message });
    synthesis = fallbackSynthesis(shortlist);
    usedFallback = true;
  }

  await mkdir(REPORTS_DIR, { recursive: true });
  await mkdir(RAW_DIR, { recursive: true });

  const mdPath = new URL(`./${iso}.md`, REPORTS_DIR);
  const rawPath = new URL(`./${iso}.json`, RAW_DIR);

  const markdown = markdownReport({
    runDate,
    synthesis,
    shortlist,
    config,
    usedFallback,
  });

  const raw = {
    generated_at: runDate.toISOString(),
    config_snapshot: config,
    used_fallback: usedFallback,
    errors,
    shortlist,
    synthesis,
  };

  await writeFile(mdPath, markdown, 'utf8');
  await writeFile(rawPath, `${JSON.stringify(raw, null, 2)}\n`, 'utf8');

  console.log(`Generated report: ${path.relative(process.cwd(), mdPath.pathname)}`);
  console.log(`Generated raw data: ${path.relative(process.cwd(), rawPath.pathname)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
