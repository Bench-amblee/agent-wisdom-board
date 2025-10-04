import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

type SupportEvent = {
  event_time: string;
  ticket_id: string;
  user_id: string;
  event_type: 'opened' | 'reply' | 'escalation' | 'solved';
  status: 'open' | 'pending' | 'solved';
  topic: 'shipping' | 'defective_product' | 'refund' | 'app_sync' | 'billing';
  message_text: string;
  eventDate: Date;
};

type SalesEvent = {
  event_time: string;
  opp_id: string;
  account_id: string;
  stage: 'MQL' | 'SQL' | 'Demo' | 'Proposal' | 'Commit' | 'Won' | 'Lost';
  amount_usd: number;
  source: 'ads' | 'affiliate' | 'referral' | 'email';
  reason: string;
  eventDate: Date;
};

type ResearchFinding = {
  found_at: string;
  source_url: string;
  headline: string;
  summary: string;
  feature_tags: string;
  confidence: number;
  relevance: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
const dataDir = path.resolve(projectRoot, 'data');
const outputPath = path.resolve(__dirname, 'query_pack.json');

const SUPPORT_EVENTS = ['opened', 'reply', 'escalation', 'solved'] as const;

function parseDateTime(raw: string): Date {
  const isoReady = raw.replace(' ', 'T');
  return new Date(`${isoReady}Z`);
}

function median(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

async function loadSupport(): Promise<SupportEvent[]> {
  const csvPath = path.resolve(dataDir, 'support.csv');
  const raw = await fs.readFile(csvPath, 'utf-8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Omit<SupportEvent, 'eventDate'>[];

  return records.map((row) => ({
    ...row,
    eventDate: parseDateTime(row.event_time),
  }));
}

async function loadSales(): Promise<SalesEvent[]> {
  const csvPath = path.resolve(dataDir, 'sales.csv');
  const raw = await fs.readFile(csvPath, 'utf-8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as (Omit<SalesEvent, 'eventDate' | 'amount_usd'> & { amount_usd: string })[];

  return records.map((row) => ({
    ...row,
    amount_usd: Number(row.amount_usd),
    reason: row.reason ?? '',
    eventDate: parseDateTime(row.event_time),
  }));
}

async function loadResearch(): Promise<ResearchFinding[]> {
  const csvPath = path.resolve(dataDir, 'research.csv');
  const raw = await fs.readFile(csvPath, 'utf-8');
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as (ResearchFinding & { confidence: string; relevance: string })[];

  return records.map((row) => ({
    ...row,
    confidence: Number(row.confidence),
    relevance: Number(row.relevance),
  }));
}

async function buildSupportMetrics(events: SupportEvent[]) {
  const byTicket = new Map<string, SupportEvent[]>();
  const topicStats = new Map<string, { escalations: number; interactions: number }>();
  const risingCounts = new Map<string, number>();

  events.forEach((event) => {
    const topic = event.topic;
    if (!topicStats.has(topic)) {
      topicStats.set(topic, { escalations: 0, interactions: 0 });
    }
    const stats = topicStats.get(topic)!;
    if (SUPPORT_EVENTS.includes(event.event_type)) {
      stats.interactions += 1;
    }
    if (event.event_type === 'escalation') {
      stats.escalations += 1;
    }
    if (event.event_type === 'opened' || event.event_type === 'reply') {
      risingCounts.set(topic, (risingCounts.get(topic) ?? 0) + 1);
    }

    if (!byTicket.has(event.ticket_id)) {
      byTicket.set(event.ticket_id, []);
    }
    byTicket.get(event.ticket_id)!.push(event);
  });

  const escalationRateByTopic = Array.from(topicStats.entries())
    .map(([topic, stats]) => ({
      topic,
      escalations: stats.escalations,
      interactions: stats.interactions,
      esc_rate_pct: stats.interactions === 0 ? 0 : Number(((stats.escalations / stats.interactions) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.esc_rate_pct - a.esc_rate_pct || b.escalations - a.escalations);

  const durationsByTopic = new Map<string, number[]>();

  byTicket.forEach((ticketEvents) => {
    const sorted = [...ticketEvents].sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
    const opened = sorted.find((evt) => evt.event_type === 'opened');
    const solved = sorted.find((evt) => evt.event_type === 'solved');

    if (!opened || !solved) {
      return;
    }
    const minutes = (solved.eventDate.getTime() - opened.eventDate.getTime()) / (1000 * 60);
    if (minutes < 0) {
      return;
    }
    const topic = opened.topic;
    if (!durationsByTopic.has(topic)) {
      durationsByTopic.set(topic, []);
    }
    durationsByTopic.get(topic)!.push(minutes);
  });

  const p50TtsByTopic = Array.from(durationsByTopic.entries())
    .map(([topic, durations]) => ({
      topic,
      p50_tts_min: Math.round(median(durations)),
    }))
    .sort((a, b) => b.p50_tts_min - a.p50_tts_min);

  const risingTopics = Array.from(risingCounts.entries())
    .map(([topic, total]) => ({ topic, total }))
    .sort((a, b) => b.total - a.total);

  return {
    escalation_rate_by_topic: escalationRateByTopic,
    p50_tts_by_topic: p50TtsByTopic,
    rising_topics: risingTopics,
  };
}

async function buildSalesMetrics(events: SalesEvent[]) {
  const byOpp = new Map<string, SalesEvent[]>();
  let latestEventTime = 0;

  events.forEach((event) => {
    latestEventTime = Math.max(latestEventTime, event.eventDate.getTime());
    if (!byOpp.has(event.opp_id)) {
      byOpp.set(event.opp_id, []);
    }
    byOpp.get(event.opp_id)!.push(event);
  });

  const stalledOpps: Array<{ opp_id: string; amount_usd: number; stage: SalesEvent['stage']; days_stalled: number }> = [];
  const winRateBySource = new Map<string, { won: number; total: number }>();

  byOpp.forEach((oppEvents) => {
    const sorted = [...oppEvents].sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
    const last = sorted[sorted.length - 1];
    const source = last.source;
    if (!winRateBySource.has(source)) {
      winRateBySource.set(source, { won: 0, total: 0 });
    }
    const summary = winRateBySource.get(source)!;
    summary.total += 1;
    if (last.stage === 'Won') {
      summary.won += 1;
    }

    const isClosed = last.stage === 'Won' || last.stage === 'Lost';
    const daysStalled = Math.floor((latestEventTime - last.eventDate.getTime()) / (1000 * 60 * 60 * 24));
    if (!isClosed && daysStalled > 14) {
      stalledOpps.push({
        opp_id: last.opp_id,
        amount_usd: last.amount_usd,
        stage: last.stage,
        days_stalled: daysStalled,
      });
    }
  });

  const stalledSorted = stalledOpps.sort((a, b) => b.days_stalled - a.days_stalled);

  const winRateArray = Array.from(winRateBySource.entries())
    .map(([source, stats]) => ({
      source,
      won: stats.won,
      total: stats.total,
      win_rate: stats.total === 0 ? 0 : Number(((stats.won / stats.total) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.win_rate - a.win_rate || b.won - a.won);

  return {
    stalled_opps_gt14d: stalledSorted,
    win_rate_by_source: winRateArray,
  };
}

async function buildResearchMetrics(findings: ResearchFinding[]) {
  const scored = findings
    .map((finding) => ({
      headline: finding.headline,
      summary: finding.summary,
      source_url: finding.source_url,
      score: Number((finding.confidence * finding.relevance).toFixed(2)),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return { top_findings: scored };
}

async function main() {
  try {
    const [supportEvents, salesEvents, researchItems] = await Promise.all([
      loadSupport(),
      loadSales(),
      loadResearch(),
    ]);

    const supportMetrics = await buildSupportMetrics(supportEvents);
    const salesMetrics = await buildSalesMetrics(salesEvents);
    const researchMetrics = await buildResearchMetrics(researchItems);

    const output = {
      meta: { generated_at: new Date().toISOString() },
      support: supportMetrics,
      sales: salesMetrics,
      research: researchMetrics,
    };

    await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf-8');
    console.log(`Query pack written to ${path.relative(projectRoot, outputPath)}`);
  } catch (error) {
    console.error('Failed to build query pack');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exitCode = 1;
  }
}

void main();
