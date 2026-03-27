import { useState, useRef, useEffect } from 'react';

function buildSystemPrompt(ctx, mode) {
  const newsBlock = (ctx.news ?? []).map((n, i) => `  ${i + 1}. ${n}`).join('\n') || '  No major news at this time.';
  const sharedContext = `
SCENARIO CONTEXT — THIS IS YOUR ENTIRE KNOWLEDGE BOUNDARY:
- Stock: ${ctx.ticker} (${ctx.companyName ?? ctx.ticker})
- Scenario date/time: ${ctx.date} at ${ctx.cutoffTime} ET
- Investor sentiment: ${ctx.sentiment?.label ?? 'Neutral'} (${ctx.sentiment?.score ?? 50}/100 greed)
- News & catalysts known at cutoff:
${newsBlock}
- Sector / market conditions: ${ctx.sector ?? 'General market'}
- Technical: RSI ${ctx.rsi ?? '—'}, MACD ${ctx.macd ?? '—'}, 50-Day MA ${ctx.ma50 ?? '—'}
- Analyst ratings: ${ctx.analystBuy ?? 0} Buy / ${ctx.analystHold ?? 0} Hold / ${ctx.analystSell ?? 0} Sell
- Volume: ${ctx.volume ?? 'Not specified'}
`.trim();

  if (mode === 'pre') {
    const difficulty = ctx.difficulty ?? 'intermediate';
    let difficultyInstructions = '';

    if (difficulty === 'beginner') {
      difficultyInstructions = 'Respond like you\'re explaining to someone who has never traded before — no jargon, no terms like RSI/MACD/greed score, use everyday analogies. Max 2 sentences plus one simple question.';
    } else if (difficulty === 'intermediate') {
      difficultyInstructions = 'You can use basic terms like "bullish", "analyst ratings", "momentum" but keep it conversational. 3 sentences max.';
    } else if (difficulty === 'advanced') {
      difficultyInstructions = 'Use full trading language, RSI, MACD, sentiment scores, risk/reward. 3-4 sentences.';
    }

    return `You are Kavon AI, a trading education coach inside the Kavon platform.

${sharedContext}

YOUR RULES — PRE-DECISION MODE:
${difficultyInstructions} Be conversational and simple — like a knowledgeable friend, not a professor. End every response with one short rhetorical question that makes the user think. Never use bullet points, bold text, or headers. Speak plainly.`;
  }

  const decisionNote = ctx.userDecision
    ? `\nUser's decision: ${ctx.userDecision.action} · $${ctx.userDecision.amount} position`
    : '';

  const difficulty = ctx.difficulty ?? 'intermediate';
  let postDecisionDifficultyRules = '';

  if (difficulty === 'beginner') {
    postDecisionDifficultyRules = `
BEGINNER MODE — STRICT PLAIN ENGLISH RULES:
- NEVER mention a financial term without immediately defining it in the SAME sentence in plain English
- Define terms naturally within the sentence — NOT as a separate definition. Like a friend explaining, not a textbook.
- NEVER use these words without defining them first: greed, sentiment, RSI, MACD, bullish, bearish, analyst, bookings, upgrades, or ANY finance term
- Every financial concept must be translated into an everyday analogy. Use phrases like "imagine if..." or "think of it like..."
- This rule applies to EVERY message you send — opening AND all follow-ups
- Example: Instead of "the sentiment (72/100 greed)" say "most investors were feeling confident about this stock — like a 72 out of 100 on a confidence scale"`;
  } else if (difficulty === 'intermediate') {
    postDecisionDifficultyRules = 'You can use basic terms like "bullish", "analyst ratings", "momentum" but keep explanations conversational and accessible.';
  } else if (difficulty === 'advanced') {
    postDecisionDifficultyRules = 'Use full trading language freely: RSI, MACD, sentiment scores, technical setups, risk/reward ratios, etc.';
  }

  return `You are Kavon AI, a trading education coach inside the Kavon platform.

${sharedContext}${decisionNote}

YOUR RULES — POST-DECISION / ${mode === 'learn' ? 'LEARN' : 'REVIEW'} MODE:
1. The user has made their decision. Discuss what the signals meant analytically.
2. do NOT reveal specific price outcomes — the lesson handles that.
3. Discuss what each indicator was saying and what the risk/reward looked like.
4. ${mode === 'learn' ? 'Learn Mode: be thorough. Explain concepts fully, define terms, teach the why.' : 'Review Mode: focus on decision quality — did the signals support the call?'}
5. If asked something unrelated, redirect back to the ${ctx.ticker} scenario.
6. Reference actual numbers from context. Never speak in generalities when you have real data.
7. Tone: ${mode === 'learn' ? 'patient educator unpacking a real case study' : 'analytical peer reviewing a trade together'}.
${postDecisionDifficultyRules}`;
}

function getChips(ctx, mode) {
  const t = ctx.ticker ?? 'this stock';
  if (mode === 'pre') return [
    `What is the sentiment telling us about ${t} right now?`,
    `Which news headline matters most here?`,
    `What do the analyst ratings suggest?`,
    `What signals should I focus on before deciding?`,
  ];
  if (mode === 'learn') return [
    `Explain what the RSI reading means for ${t}`,
    `How do I interpret the analyst rating split?`,
    `What does investor sentiment score actually measure?`,
    `Walk me through how to read this setup`,
  ];
  return [
    `What were the strongest signals in this scenario?`,
    `How significant were those news catalysts?`,
    `What would an experienced trader have focused on?`,
    `Was the risk/reward favorable here?`,
  ];
}

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

  async function send(text) {
    const q = (text ?? input).trim();
    if (!q || loading) return;
    setInput('');
    setStarted(true);
    const nextHistory = [...history, { role: 'user', content: q }];
    setHistory(nextHistory);
    setLoading(true);
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      console.log('[KavonAI] API Key loaded:', apiKey ? `${apiKey.substring(0, 15)}...` : 'MISSING');
      console.log('[KavonAI] Sending request to Anthropic API...');

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 600,
          system: buildSystemPrompt(context, mode),
          messages: nextHistory,
        }),
      });

      console.log('[KavonAI] Response status:', res.status);
      const data = await res.json();
      console.log('[KavonAI] Response data:', data);

      if (data.error) {
        setHistory(h => [...h, { role: 'assistant', content: `API Error: ${data.error.message || JSON.stringify(data.error)}` }]);
      } else {
        const reply = data.content?.find(b => b.type === 'text')?.text ?? 'No response.';
        setHistory(h => [...h, { role: 'assistant', content: reply }]);
      }
    } catch (err) {
      console.error('[KavonAI] Error:', err);
      setHistory(h => [...h, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  }

  const chips = getChips(context, mode);
  const modeLabel = mode === 'pre' ? 'PRE-DECISION' : mode === 'learn' ? 'LEARN MODE' : 'POST-DECISION';
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
            <span style={{ ...s.badge, background: isPreMode ? 'rgba(255,209,102,0.12)' : 'rgba(0,229,160,0.1)', color: isPreMode ? '#ffd166' : '#00e5a0', border: isPreMode ? '1px solid rgba(255,209,102,0.25)' : '1px solid rgba(0,229,160,0.2)' }}>
              {modeLabel}
            </span>
            <button onClick={onClose} style={s.closeBtn}>✕</button>
          </div>
        </div>

        <div style={s.messages}>
          {!started && (
            <div style={s.welcome}>
              <div style={s.welcomeTitle}>
                {mode === 'pre' ? `Analyze ${context?.ticker} at the cutoff` : mode === 'learn' ? `Learn from this ${context?.ticker} scenario` : `Review your ${context?.ticker} decision`}
              </div>
              <div style={s.welcomeSub}>
                {mode === 'pre'
                  ? `Ask me about what was visible at ${context?.cutoffTime} on ${context?.date}. I won't reveal anything after the cutoff.`
                  : mode === 'learn'
                  ? `Ask me anything — I'll explain the signals, concepts, and reasoning in full depth.`
                  : `Now that you've committed, let's break down what the data was saying.`}
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
              placeholder={`Ask about ${context?.ticker ?? 'this stock'} at the cutoff…`}
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
            Context-locked · {context?.date} {context?.cutoffTime}
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
