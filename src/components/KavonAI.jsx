import { useState, useRef, useEffect } from 'react';

function buildSystemPrompt(ctx, mode) {
  const difficulty = ctx.difficulty ?? 'intermediate';
  const lessonTopic = ctx.lessonContext ?? ctx.lessonSummary ?? 'reading technical indicators and market signals';

  const newsBlock = (ctx.news ?? []).map((n, i) => {
    if (typeof n === 'object' && n !== null) {
      return `  ${i + 1}. [${n.sentiment ?? 'neutral'}] ${n.headline ?? n.src ?? JSON.stringify(n)}`;
    }
    return `  ${i + 1}. ${n}`;
  }).join('\n') || '  No major news at this time.';

  const optionalFields = [
    ctx.openPrice != null ? `- Opening price: $${ctx.openPrice}` : null,
    ctx.weekHigh != null ? `- 52-week high / low: $${ctx.weekHigh} / $${ctx.weekLow}` : null,
    ctx.pe != null ? `- P/E ratio: ${ctx.pe}` : null,
    ctx.mktCap != null ? `- Market cap: ${ctx.mktCap}` : null,
    ctx.volatility != null ? `- Volatility: ${ctx.volatility}` : null,
    ctx.shortInterest != null ? `- Short interest: ${ctx.shortInterest}` : null,
    ctx.putCallRatio != null ? `- Put/call ratio: ${ctx.putCallRatio}` : null,
    ctx.institutionalFlow != null ? `- Institutional flow: ${ctx.institutionalFlow}` : null,
  ].filter(Boolean).join('\n');

  const scenarioBlock = `FULL SCENARIO CONTEXT:
- Stock: ${ctx.ticker} (${ctx.companyName ?? ctx.ticker})
- Date/time: ${ctx.date} at ${ctx.cutoffTime} ET
- Opening price: $${ctx.openPrice ?? '—'}
- Sector: ${ctx.sector ?? 'Technology'}
- Lesson topic: ${lessonTopic}
- Difficulty level: ${difficulty}
- Investor sentiment: ${ctx.sentiment?.label ?? 'Neutral'} (${ctx.sentiment?.score ?? 50}/100 greed score)
- Technical indicators: RSI ${ctx.rsi ?? '—'}, MACD ${ctx.macd ?? '—'}, 50-Day MA $${ctx.ma50 ?? '—'}, Volume ${ctx.volume ?? '—'}
- Analyst ratings: ${ctx.analystBuy ?? 0} Buy / ${ctx.analystHold ?? 0} Hold / ${ctx.analystSell ?? 0} Sell
${optionalFields ? optionalFields + '\n' : ''}- News & catalysts at cutoff:
${newsBlock}`;

  const difficultyVoice = {
    beginner: 'Write like explaining to someone who has never traded before. No jargon — use everyday analogies. Short sentences.',
    intermediate: 'Use basic terms like "bullish", "momentum", "analyst ratings" but keep it conversational. No Wall Street speak.',
    advanced: 'Use full technical language: RSI, MACD, sentiment, risk/reward ratios. Be precise and analytical.',
  }[difficulty] ?? '';

  const bannedWords = 'NEVER use: hemorrhaging, contrarian, looming, red flags, technicals, fundamentals, catalyst, breakout, or Wall Street research report language. Write like a knowledgeable friend.';

  // ── PRE-DECISION MODE ──────────────────────────────────────────────────────
  if (mode === 'pre') {
    return `You are Kavon AI, an expert trading coach. The user is practicing on a real historical stock scenario. You have complete context — never ask the user for information you already have.

${scenarioBlock}

YOUR ROLE — PRE-DECISION COACHING:
You are TIME-LOCKED to ${ctx.date} at ${ctx.cutoffTime} ET. You do NOT know what happened after this moment.
- Guide the user toward making their own trading decision by explaining what the indicators are showing
- Walk through what each signal means in the context of THIS specific stock and setup
- Highlight key factors to weigh: momentum, sentiment, analyst views, news catalysts
- Ask one focused question at the end to push their thinking — never reveal the answer
- If asked "what happened after?", say: "I'm locked to ${ctx.cutoffTime} on ${ctx.date} — figuring that out is the whole challenge"
- NEVER ask the user what format or topic they want — dive straight into coaching this scenario

${difficultyVoice}
${bannedWords}
Speak plainly, no bullet points or headers. End every response with one short question that makes the user think.`;
  }

  // ── OUTCOME DATA (post-decision modes) ────────────────────────────────────
  const outcomeBlock = `OUTCOME DATA:
- Correct answer: ${ctx.correctAnswer ?? '—'}
- Actual price move: ${ctx.actualMove ?? '—'}${ctx.closePrice != null ? `\n- Close price: $${ctx.closePrice}` : ''}${ctx.lessonSummary ? `\n- Lesson takeaway: ${ctx.lessonSummary}` : ''}${ctx.buyFeedback ? `\n- If bought: ${ctx.buyFeedback}` : ''}${ctx.sellFeedback ? `\n- If sold: ${ctx.sellFeedback}` : ''}`;

  const userDecisionLine = ctx.userDecision
    ? `USER'S DECISION: ${ctx.userDecision.action} · $${ctx.userDecision.amount} position · ${ctx.userDecision.wasCorrect ? 'CORRECT' : 'INCORRECT'}`
    : 'USER\'S DECISION: not yet recorded';

  // ── LEARNING CHECK MODE ───────────────────────────────────────────────────
  if (mode === 'learn' || mode === 'validation') {
    const isComplete = ctx.learningCheckComplete;

    if (isComplete) {
      return `You are Kavon AI, an expert trading coach. The user has completed the learning check and can now explore freely.

${scenarioBlock}

${outcomeBlock}

${userDecisionLine}

YOUR ROLE — FREE EXPLORATION:
The learning check is done. Answer any question the user has about this scenario fully and openly.
- Explain what each indicator was signaling and why the correct answer was ${ctx.correctAnswer ?? 'what it was'}
- Discuss what would have happened with different decisions
- Connect the lesson to broader trading principles
- Reference specific numbers — never speak in generalities when you have real data

${difficultyVoice}
${bannedWords}`;
    }

    const questionStyle = {
      beginner: 'simple, conceptual — no math or jargon. Example: "Why do you think so many investors were feeling confident about this stock?"',
      intermediate: 'moderately analytical. Example: "What does the RSI reading tell you about how the stock was behaving before the cutoff?"',
      advanced: 'technically rigorous. Example: "How would you interpret the combination of an RSI at ${ctx.rsi} with a ${ctx.macd} MACD signal in this context?"',
    }[difficulty] ?? 'clear and educational';

    return `You are Kavon AI, an expert trading coach running a structured learning check. You have complete context — never ask the user for information.

${scenarioBlock}

${outcomeBlock}

${userDecisionLine}

YOUR ROLE — LEARNING CHECK (2 QUESTIONS):
The user just made their decision and you must now test their understanding. Follow this exact sequence:

STEP 1 — OPENING (first message only, no prior history):
- In 1-2 sentences, acknowledge their decision and whether it was correct, using the actual price move
- Then immediately present Question 1 (of 2) about this specific scenario and lesson topic
- Do NOT ask what format or topic the user wants — you already know everything

STEP 2 — AFTER USER ANSWERS QUESTION 1:
- Tell them directly if their answer was right or wrong
- Give a brief explanation (2-3 sentences) tied to the actual data in this scenario
- Present Question 2

STEP 3 — AFTER USER ANSWERS QUESTION 2:
- Tell them if they got it right or wrong with a brief explanation
- End your response with exactly the token: LEARNING_COMPLETE
- Do not add anything after LEARNING_COMPLETE

QUESTION RULES:
- Both questions must be free-response (no multiple choice, no asking preferences)
- Questions must be about THIS specific scenario: ${ctx.ticker} on ${ctx.date}, topic: ${lessonTopic}
- Difficulty: ${questionStyle}
- Question 1 should test understanding of what the indicators were showing
- Question 2 should test understanding of WHY the correct trade was ${ctx.correctAnswer ?? 'what it was'}
- Do not reveal both questions at once — ask them one at a time

${difficultyVoice}
${bannedWords}`;
  }

  // ── POST-DECISION / REVIEW MODE ───────────────────────────────────────────
  return `You are Kavon AI, an expert trading coach. The user has made their decision and you are now debriefing the trade.

${scenarioBlock}

${outcomeBlock}

${userDecisionLine}

YOUR ROLE — POST-DECISION DEBRIEF:
- Explain what happened: the stock moved ${ctx.actualMove ?? '—'} and the correct answer was ${ctx.correctAnswer ?? '—'}
- Walk through what each indicator was signaling and whether it pointed toward the right answer
- Explain what the user should take away from this specific scenario
- Be direct about what the smart trade was and exactly why — reference the actual numbers
- If the user was wrong, explain what they might have misread; if right, explain what they read correctly
- Answer follow-up questions freely using your full knowledge of what happened

${difficultyVoice}
${bannedWords}`;
}

function getChips(ctx, mode) {
  const t = ctx.ticker ?? 'this stock';
  if (mode === 'pre') return [
    `What are the key signals to focus on for ${t} right now?`,
    `What is the sentiment score telling us here?`,
    `How should I interpret the analyst rating split?`,
    `Walk me through the indicators one by one`,
  ];
  if (mode === 'learn' || mode === 'validation') return [
    `Explain what the RSI was showing for ${t}`,
    `Why was the correct answer what it was?`,
    `What was the most important signal in this scenario?`,
    `What should I watch for next time I see this setup?`,
  ];
  return [
    `Why was ${ctx.correctAnswer ?? 'that'} the right call here?`,
    `What were the strongest signals in this scenario?`,
    `What would an experienced trader have focused on?`,
    `What should I take away from this trade?`,
  ];
}

const LEARNING_CHECK_INIT = '__INIT_LEARNING_CHECK__';

export default function KavonAI({ context, mode = 'pre', onClose }) {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  useEffect(() => {
    setHistory([]);
    setStarted(false);
    setInput('');
  }, [context?.ticker, context?.date, context?.cutoffTime, mode]);

  // Auto-fire opening message in learning check mode
  useEffect(() => {
    const isLearningCheck = (mode === 'learn' || mode === 'validation') && !context?.learningCheckComplete;
    if (isLearningCheck && history.length === 0 && !loading) {
      send(LEARNING_CHECK_INIT);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, context?.learningCheckComplete]);

  async function send(text) {
    const raw = text ?? input;
    const isInit = raw === LEARNING_CHECK_INIT;
    const q = isInit ? '' : raw.trim();
    if (!isInit && (!q || loading)) return;
    setInput('');
    setStarted(true);

    // For the init message we inject a hidden trigger — the AI sees no user message,
    // which signals it to deliver the opening learning-check message unprompted.
    const nextHistory = isInit
      ? [{ role: 'user', content: 'Begin.' }]
      : [...history, { role: 'user', content: q }];

    setHistory(isInit ? [] : nextHistory);
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kavon-ai`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            model: 'claude-haiku-4-5',
            max_tokens: 700,
            system: buildSystemPrompt(context, mode),
            messages: nextHistory,
          }),
        }
      );

      const data = await res.json();

      if (data.error) {
        setHistory(h => [...h, { role: 'assistant', content: `Error: ${data.error.message || JSON.stringify(data.error)}` }]);
      } else {
        const reply = data.content?.find(b => b.type === 'text')?.text ?? 'No response.';
        if (isInit) {
          setHistory([{ role: 'assistant', content: reply }]);
        } else {
          setHistory(h => [...h, { role: 'assistant', content: reply }]);
        }
      }
    } catch (err) {
      console.error('[KavonAI] Error:', err);
      setHistory(h => [...h, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  const chips = getChips(context, mode);
  const isLearningCheck = (mode === 'learn' || mode === 'validation') && !context?.learningCheckComplete;
  const modeLabel = mode === 'pre' ? 'PRE-DECISION' : isLearningCheck ? 'LEARNING CHECK' : mode === 'learn' ? 'LEARN MODE' : 'POST-DECISION';
  const isPreMode = mode === 'pre';

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose?.()}>
      <div style={s.panel}>
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.logo}>K</div>
            <div>
              <div style={s.title}>Kavon AI</div>
              <div style={s.sub}>{context?.ticker} · {context?.date} · {context?.cutoffTime}</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ ...s.badge, background: isPreMode ? 'rgba(255,209,102,0.12)' : isLearningCheck ? 'rgba(0,180,255,0.1)' : 'rgba(0,229,160,0.1)', color: isPreMode ? '#ffd166' : isLearningCheck ? '#00b4ff' : '#00e5a0', border: isPreMode ? '1px solid rgba(255,209,102,0.25)' : isLearningCheck ? '1px solid rgba(0,180,255,0.2)' : '1px solid rgba(0,229,160,0.2)' }}>
              {modeLabel}
            </span>
            <button onClick={onClose} style={s.closeBtn}>✕</button>
          </div>
        </div>

        <div style={s.messages}>
          {!started && !isLearningCheck && (
            <div style={s.welcome}>
              <div style={s.welcomeTitle}>
                {mode === 'pre'
                  ? `Coach me through ${context?.ticker} at the cutoff`
                  : `Debrief: ${context?.ticker} — ${context?.actualMove ?? ''}`}
              </div>
              <div style={s.welcomeSub}>
                {mode === 'pre'
                  ? `I'll walk you through what the indicators are showing at ${context?.cutoffTime} on ${context?.date}. I won't reveal what happened after.`
                  : `Let's break down what the data was saying and what the right trade was.`}
              </div>
              <div style={s.divider} />
              <div style={s.chipsLabel}>Suggested questions</div>
              <div style={s.chips}>
                {chips.map((c, i) => (
                  <button key={i} style={s.chip} onClick={() => send(c)}>{c}</button>
                ))}
              </div>
            </div>
          )}

          {isLearningCheck && !started && loading && (
            <div style={s.initMsg}>Generating your learning check questions...</div>
          )}

          {history.map((m, i) => (
            <div key={i} style={{ ...s.msg, ...(m.role === 'user' ? s.msgUser : s.msgAI) }}>
              <div style={s.msgLabel}>{m.role === 'user' ? 'You' : 'Kavon AI'}</div>
              <div style={{ ...s.bubble, ...(m.role === 'user' ? s.bubbleUser : s.bubbleAI) }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ ...s.msg, ...s.msgAI }}>
              <div style={s.msgLabel}>Kavon AI</div>
              <div style={{ ...s.bubbleAI, ...s.bubble, display:'flex', gap:5, alignItems:'center' }}>
                {[0, 150, 300].map((delay, i) => (
                  <span key={i} style={{ ...s.dot, animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={s.inputArea}>
          <div style={s.inputRow}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }}}
              placeholder={
                isLearningCheck
                  ? 'Type your answer…'
                  : mode === 'pre'
                  ? `Ask about ${context?.ticker ?? 'this stock'} at the cutoff…`
                  : `Ask about this ${context?.ticker ?? 'trade'}…`
              }
              rows={1}
              style={s.textarea}
              disabled={loading}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={s.sendBtn}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#080b10">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
          <div style={s.footer}>
            {isLearningCheck ? 'Learning check · answer both questions to continue' : `Context-locked · ${context?.date} ${context?.cutoffTime}`}
            {mode === 'pre' && <span style={s.footerWarn}> · future data off-limits</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.75)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:9999, padding:16 },
  panel: { width:460, maxWidth:'100%', height:640, background:'#0e1318', border:'1px solid #1e2d3d', borderRadius:20, display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.8)' },
  header: { background:'#131920', borderBottom:'1px solid #1e2d3d', padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 },
  headerLeft: { display:'flex', alignItems:'center', gap:10 },
  logo: { width:30, height:30, background:'linear-gradient(135deg,#00d4ff,#0077ff)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:14, color:'#080b10', flexShrink:0 },
  title: { fontWeight:700, fontSize:14, color:'#dde6f0', letterSpacing:'0.04em' },
  sub: { fontSize:11, color:'#7a9ab8', marginTop:1, fontFamily:'monospace' },
  badge: { fontSize:10, padding:'3px 8px', borderRadius:4, fontFamily:'monospace', letterSpacing:'0.08em', fontWeight:500 },
  closeBtn: { background:'none', border:'none', color:'#3d5470', fontSize:16, cursor:'pointer', padding:'2px 6px' },
  messages: { flex:1, overflowY:'auto', padding:'16px 14px', display:'flex', flexDirection:'column', gap:12 },
  initMsg: { fontSize:13, color:'#3d5470', fontStyle:'italic', textAlign:'center', paddingTop:20 },
  welcome: { display:'flex', flexDirection:'column', gap:12 },
  welcomeTitle: { fontWeight:700, fontSize:15, color:'#dde6f0', lineHeight:1.4 },
  welcomeSub: { fontSize:13, color:'#7a9ab8', lineHeight:1.6 },
  divider: { height:1, background:'#1e2d3d' },
  chipsLabel: { fontSize:9, textTransform:'uppercase', letterSpacing:'0.1em', color:'#3d5470', fontFamily:'monospace' },
  chips: { display:'flex', flexWrap:'wrap', gap:6 },
  chip: { fontSize:12, padding:'6px 11px', background:'#1a2230', border:'1px solid #243345', borderRadius:6, color:'#7a9ab8', cursor:'pointer', textAlign:'left', lineHeight:1.3 },
  msg: { display:'flex', flexDirection:'column', maxWidth:'90%' },
  msgUser: { alignSelf:'flex-end', alignItems:'flex-end' },
  msgAI: { alignSelf:'flex-start', alignItems:'flex-start' },
  msgLabel: { fontSize:9, textTransform:'uppercase', letterSpacing:'0.1em', color:'#3d5470', marginBottom:4, padding:'0 3px', fontFamily:'monospace' },
  bubble: { padding:'10px 13px', borderRadius:10, fontSize:13.5, lineHeight:1.65, color:'#dde6f0', wordBreak:'break-word', whiteSpace:'pre-wrap' },
  bubbleUser: { background:'#0f2340', border:'1px solid #1a3a5e', borderBottomRightRadius:3, color:'#c8dff5' },
  bubbleAI: { background:'#131920', border:'1px solid #1e2d3d', borderBottomLeftRadius:3 },
  dot: { display:'inline-block', width:6, height:6, background:'#3d5470', borderRadius:'50%', animation:'blink 1.2s ease-in-out infinite' },
  inputArea: { borderTop:'1px solid #1e2d3d', padding:'12px 14px 14px', background:'#0e1318', flexShrink:0 },
  inputRow: { display:'flex', gap:8, alignItems:'flex-end', background:'#131920', border:'1px solid #243345', borderRadius:10, padding:'9px 10px' },
  textarea: { flex:1, background:'transparent', border:'none', outline:'none', fontSize:13, color:'#dde6f0', resize:'none', maxHeight:100, minHeight:20, lineHeight:1.5 },
  sendBtn: { width:30, height:30, background:'linear-gradient(135deg,#00d4ff,#0077ff)', border:'none', borderRadius:7, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  footer: { marginTop:7, fontSize:9, color:'#3d5470', fontFamily:'monospace', letterSpacing:'0.04em' },
  footerWarn: { color:'rgba(255,77,109,0.5)' },
};
