gdjs.ExperimentCode = {};
gdjs.ExperimentCode.localVariables = [];
gdjs.ExperimentCode.idToCallbackMap = new Map();
gdjs.ExperimentCode.GDFloorObjects1= [];
gdjs.ExperimentCode.GDDino_9595DouxObjects1= [];
gdjs.ExperimentCode.GDGunObjects1= [];
gdjs.ExperimentCode.GDMain_9595Ship_9595Auto_9595Cannon_9595BulletObjects1= [];
gdjs.ExperimentCode.GDChi_9595Chi_9595the_9595BirdObjects1= [];
gdjs.ExperimentCode.GDCenter_9595gameObjects1= [];
gdjs.ExperimentCode.GDenemy_9595spawn_9595downObjects1= [];
gdjs.ExperimentCode.GDScoreObjects1= [];
gdjs.ExperimentCode.GDPixelHeartBarObjects1= [];
gdjs.ExperimentCode.GDZombieObjects1= [];
gdjs.ExperimentCode.GDScutum_9595ShieldObjects1= [];
gdjs.ExperimentCode.GDWallObjects1= [];
gdjs.ExperimentCode.GDTimerTextObjects1= [];
gdjs.ExperimentCode.GDOverlayObjects1= [];
gdjs.ExperimentCode.GDBurstObjects1= [];
gdjs.ExperimentCode.GDFeedbackTextObjects1= [];
gdjs.ExperimentCode.GDShadowObjects1= [];
gdjs.ExperimentCode.GDVignetteObjects1= [];
gdjs.ExperimentCode.GDHudPanelObjects1= [];


gdjs.ExperimentCode.userFunc0xa0c460 = function GDJSInlineCode(runtimeScene) {
"use strict";
// =====================================================================
// PERSPECTIVE LAB — trial engine (Experiment scene, runs every frame)
// Discrete-trial conditional discrimination: S+ is defined by the
// relation between the avatar's facing and the stimulus' facing.
// v3: participant turns the avatar (A/D); single-component trials;
//     constant-speed stimuli that path-find around walls.
// All parameters are in CONFIG below.
// =====================================================================
if (!gdjs.__PerspLab) {
  gdjs.__PerspLab = (function () {
    const CONFIG = {
      // ---- Phase structure ----
      TRAINING_MIN: 8,              // CRF training ends after TRAINING_RUN consecutive eliminations (at least TRAINING_MIN trials)
      TRAINING_RUN: 6,
      TRAINING_MAX: 20,             // ...or after TRAINING_MAX trials
      N_CONTINGENCY_PHASES: 4,      // Discrimination + 3 reversals (A-B-A-B: three demonstrations of a change in control)
      INITIAL_RULE: 'same',         // S+ relation in the first discrimination phase
      // ---- Trial timing / movement ----
      STIM_SPEED: 100,              // px/s, constant, identical across trials
      TRIAL_MAX_S: 20,              // safety: trial ends as 'stuck' if no contact/kill
      STATIC_WINDOW_S: 1.5,         // stimulus appears and stays still (orientation visible without locomotion) before advancing
      PRESERVE_RELATION: true,      // if the avatar crosses to the other side, the stimulus turns so its relation to the avatar is unchanged
      WALLS_ENABLED: false,         // open arena: no walls (continuous reinforcement in S+; uniform trajectories)
      CONTACT_SHRINK: 0.6,          // contact = overlap of the central 60% of both bodies
      RELATION_DEADZONE_PX: 16,     // the stimulus' side relative to the avatar only changes beyond +/-16 px (no flicker at contact)
      GRID_CELL: 20, WALL_INFLATE: 40, PATH_REPLAN_S: 0.4,
      FACING_DEADZONE_PX: 14,       // avatar faces the cursor's side; hysteresis avoids flicker
      SIDE_SPAWN_MARGIN_PX: 110,    // stimuli spawn only from left/right edges (incl. corners)
      ITI_MIN_S: 1, ITI_MAX_S: 3,   // variable ITI, uniform
      TIMEOUT_S: 3,                 // timeout after contact
      // ---- Mastery criterion ----
      BLOCK_SIZE: 10,               // baseline trials per block
      CRITERION: 0.80,              // block accuracy reported every BLOCK_SIZE trials (descriptive)
      CRITERION_WINDOW: 16,         // mastery: >= CRITERION_CORRECT correct of the last CRITERION_WINDOW baseline trials (rolling)
      CRITERION_CORRECT: 14,
      CONSECUTIVE_BLOCKS: 2,
      TRIAL_CAP: 48,                // max baseline trials per phase
      ADVANCE_ON_CAP: true,         // reversals: a non-mastered reversal is logged and the next phase starts
      STOP_IF_DISCRIMINATION_NOT_MASTERED: true,   // non-learner rule: session ends if the initial discrimination hits the cap
      REDIRECT_URL_TEMPLATE: 'https://msmary.questionpro.com/t/AbDe6ZBAJfT?custom1={pid}',   // post-session questionnaire + debriefing (QuestionPro); used only in the hosted study
      // ---- Stimulus-control probes (post-criterion block, EXTINCTION: hits have no consequence; arrival is harmless) ----
      PROBE_BLOCK_TRIALS: 10,       // 4 baseline trials (current contingency, not counted for criterion) + 6 probes
      PROBE_TYPES: { static: 2, lateral: 2, bird: 2 },   // one S+ and one S- (relation to the avatar) per type per block
      PROBE_MAX_RUN: 2,             // no more than 2 consecutive probes; the block starts with a baseline trial
      PROBE_AFTER_FINAL_PHASE: true,
      PROBE_STATIC_S: 6,            // static probe: animal never moves; trial ends after 6 s
      PROBE_LATERAL_S: 6,           // lateral probe: animal moves vertically (no approach to the avatar) for 6 s
      PROBE_LATERAL_DX: 300, PROBE_STATIC_DX: 320,
      // ---- Environment ----
      WALL_ROTATE_S: 60,
      BULLET_SPEED: 900,            // px/s
      BULLET_RANGE: 1100,           // px
      // ---- Visual design (matched-salience feedback, equated sizes) ----
      DINO_SIZE_PX: 96,             // 32 px sprite x3
      ZOMBIE_SCALE: 3,              // 32x24 sprite -> 96x72
      BIRD_SCALE: 3,                // 32x24 sprite -> 96x72
      GUN_W: 30, GUN_H: 15, GUN_OPACITY: 255,
      AIM_ARC_DEG: 75,              // forward-only weapon: aim clamped to +/-75 deg around the facing direction
      HAND_DX: 22, HAND_DY: 3,      // front hand relative to avatar centre (mirrors with facing)
      HOP_HEIGHT: 10, HOP_RATE: 2.2, // stimuli advance in small hops (legs still), readable in any direction
      FEEDBACK_S: 0.3,              // identical duration for S+ and S- feedback
      FEEDBACK_VOLUME: 80,          // identical volume for both feedback sounds
      TIMEOUT_OVERLAY_OPACITY: 150,
      Z: { floor: 1, vignette: 3, wall: 10, shadow: 12, stim: 20, dino: 25, gun: 26, bullet: 30, feedback: 40, overlay: 90, hudpanel: 99, hud: 100 },
      SHADOW_SCALE: 2.7,
      // ---- Native sprite orientation (VERIFY IN PREVIEW) ----
      DINO_NATIVE_FACES_RIGHT: true,
      ZOMBIE_NATIVE_FACES_RIGHT: true,
      BIRD_NATIVE_FACES_RIGHT: true,
      // ---- Data ----
      ENDPOINT_URL: 'https://script.google.com/macros/s/AKfycbwfuM8-4ELL-FOGOrAAvwe_KJ1zYiU7yL5MXZP6b09BHTxwWHiVXT_RjeZfHckdhOY/exec',   // Google Apps Script web app (empty = local only)
      ENDPOINT_TOKEN: 'pl-orSg8I0tB79-G5Sr5Lz5V1rX',   // must match CFG.TOKEN in Code.gs
      SEND_EVERY_TRIALS: 10,        // incremental upload: a chunk every 10 trials, plus phase and session ends
      SEND_RETRY_S: 10,             // retry interval for failed uploads (outbox kept in localStorage)
      SCHEMA_VERSION: 'PL-4.2',
    };

    // Symmetric wall layouts (dx = offset from the vertical midline; cy = centre y; w,h)
    const WALL_LAYOUTS = [
      [[-400, 200, 50, 180], [400, 200, 50, 180], [-400, 520, 50, 180], [400, 520, 50, 180], [-200, 120, 150, 40], [200, 120, 150, 40], [0, 620, 200, 40]],
      [[-250, 250, 40, 200], [250, 250, 40, 200], [-250, 540, 180, 40], [250, 540, 180, 40], [-480, 360, 40, 160], [480, 360, 40, 160], [0, 110, 220, 40]],
      [[-350, 140, 200, 40], [350, 140, 200, 40], [-350, 600, 200, 40], [350, 600, 200, 40], [-220, 360, 40, 140], [220, 360, 40, 140], [0, 130, 40, 120]],
      [[-300, 360, 160, 40], [300, 360, 160, 40], [-480, 150, 40, 160], [480, 150, 40, 160], [-480, 570, 40, 160], [480, 570, 40, 160], [0, 610, 40, 140]],
    ];

    // ------------------------------------------------------------ utils
    const rnd = (a, b) => a + Math.random() * (b - a);
    const opp = (f) => (f === 'L' ? 'R' : 'L');
    function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
    function maxRun(seq) { let m = 0, r = 0; for (let i = 0; i < seq.length; i++) { r = i > 0 && seq[i] === seq[i - 1] ? r + 1 : 1; m = Math.max(m, r); } return m; }
    // Component-order generator: blocks of 4 (2 'P' = S+ first, 2 'M' = S- first), max run 2 incl. across blocks
    function makeOrderGen() {
      const hist = []; let buf = [];
      return function () {
        if (!buf.length) {
          let cand, guard = 0;
          do { cand = shuffle(['P', 'P', 'M', 'M']); guard++; } while (maxRun(hist.slice(-2).concat(cand)) > 2 && guard < 200);
          buf = cand.slice();
        }
        const v = buf.shift(); hist.push(v); return v;
      };
    }
    // Spawn side x stimulus facing: fully crossed, blocks of 4
    function makeCellGen() {
      let buf = [];
      return function () {
        if (!buf.length) buf = shuffle([['L', 'L'], ['L', 'R'], ['R', 'L'], ['R', 'R']]);
        const c = buf.shift(); return { side: c[0], facing: c[1] };
      };
    }
    // Probe block plan: 4 baseline + 6 probes (3 types x 2 statuses), first trial baseline, max 2 consecutive probes
    function probePlan() {
      const items = [];
      Object.keys(CONFIG.PROBE_TYPES).forEach((t) => { for (let i = 0; i < CONFIG.PROBE_TYPES[t]; i++) items.push({ kind: 'probe', ptype: t, pstatus: i % 2 ? 'S-' : 'S+' }); });
      const nBase = CONFIG.PROBE_BLOCK_TRIALS - items.length;
      for (let i = 0; i < nBase; i++) items.push({ kind: 'probe_block_baseline' });
      for (let g = 0; g < 20000; g++) {
        const seq = shuffle(items.slice());
        if (seq[0].kind !== 'probe_block_baseline') continue;
        let run = 0, ok = true;
        for (const it of seq) { run = it.kind === 'probe' ? run + 1 : 0; if (run > CONFIG.PROBE_MAX_RUN) { ok = false; break; } }
        if (ok) return seq;
      }
      return items.sort((a, b) => (a.kind === 'probe') - (b.kind === 'probe'));
    }
    function probePositions(n, len) {
      for (let g = 0; g < 500; g++) {
        const pos = shuffle(Array.from({ length: len - 1 }, (_, i) => i + 1)).slice(0, n).sort((a, b) => a - b);
        let ok = true; for (let i = 1; i < pos.length; i++) if (pos[i] - pos[i - 1] < 2) ok = false;
        if (ok) return pos;
      }
      return [3, 7, 10].slice(0, n);
    }
    const setTxt = (o, s) => { if (!o) return; if (o.setText) o.setText(s); else if (o.setString) o.setString(s); };
    function setCenter(o, x, y) {
      if (o.setCenterPositionInScene) o.setCenterPositionInScene(x, y);
      else { o.setX(o.getX() + (x - o.getCenterXInScene())); o.setY(o.getY() + (y - o.getCenterYInScene())); }
    }
    function overlap(a, b) {
      const A = a.getAABB(), B = b.getAABB();
      return A.min[0] < B.max[0] && A.max[0] > B.min[0] && A.min[1] < B.max[1] && A.max[1] > B.min[1];
    }
    function overlapShrink(a, b, f) {
      const s = (A) => { const cx = (A.min[0] + A.max[0]) / 2, cy = (A.min[1] + A.max[1]) / 2, hw = (A.max[0] - A.min[0]) * f / 2, hh = (A.max[1] - A.min[1]) * f / 2; return [cx - hw, cy - hh, cx + hw, cy + hh]; };
      const A = s(a.getAABB()), B = s(b.getAABB());
      return A[0] < B[2] && A[2] > B[0] && A[1] < B[3] && A[3] > B[1];
    }
    // ---- grid A* around (inflated) walls ----
    function buildGrid(S, rs) {
      const c = CONFIG.GRID_CELL, cols = Math.ceil((S.viewRight - S.viewLeft) / c), rows = Math.ceil((S.viewBottom - S.viewTop) / c);
      const g = new Uint8Array(cols * rows), inf = CONFIG.WALL_INFLATE;
      rs.getObjects('Wall').filter((w) => !w.isHidden()).forEach((w) => {
        const A = w.getAABB();
        const x0 = Math.max(0, Math.floor((A.min[0] - inf - S.viewLeft) / c)), x1 = Math.min(cols - 1, Math.floor((A.max[0] + inf - S.viewLeft) / c));
        const y0 = Math.max(0, Math.floor((A.min[1] - inf - S.viewTop) / c)), y1 = Math.min(rows - 1, Math.floor((A.max[1] + inf - S.viewTop) / c));
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) g[y * cols + x] = 1;
      });
      S.grid = { c: c, cols: cols, rows: rows, g: g };
    }
    function cellOf(S, x, y) {
      const G = S.grid;
      return [Math.max(0, Math.min(G.cols - 1, Math.floor((x - S.viewLeft) / G.c))), Math.max(0, Math.min(G.rows - 1, Math.floor((y - S.viewTop) / G.c)))];
    }
    function nearestFree(S, cx, cy) {
      const G = S.grid; if (!G.g[cy * G.cols + cx]) return [cx, cy];
      for (let r = 1; r < 15; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = cx + dx, y = cy + dy;
        if (x >= 0 && y >= 0 && x < G.cols && y < G.rows && !G.g[y * G.cols + x]) return [x, y];
      }
      return [cx, cy];
    }
    function findPath(S, x0, y0, x1, y1) {
      const G = S.grid, W = G.cols, N = W * G.rows;
      const [sx, sy] = nearestFree(S, ...cellOf(S, x0, y0)), [tx, ty] = nearestFree(S, ...cellOf(S, x1, y1));
      const start = sy * W + sx, goal = ty * W + tx;
      const gS = new Float32Array(N).fill(Infinity), came = new Int32Array(N).fill(-1), closed = new Uint8Array(N);
      const heap = []; const push = (n, f) => { heap.push([f, n]); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
      const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
      const h = (n) => { const x = n % W, y = (n / W) | 0; const dx = Math.abs(x - tx), dy = Math.abs(y - ty); return Math.max(dx, dy) + 0.4142 * Math.min(dx, dy); };
      gS[start] = 0; push(start, h(start));
      while (heap.length) {
        const [, n] = pop(); if (closed[n]) continue; closed[n] = 1; if (n === goal) break;
        const x = n % W, y = (n / W) | 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue; const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= G.rows) continue;
          const m = ny * W + nx; if (G.g[m] || closed[m]) continue;
          if (dx && dy && (G.g[y * W + nx] || G.g[ny * W + x])) continue;   // no corner cutting
          const ng = gS[n] + (dx && dy ? 1.4142 : 1);
          if (ng < gS[m]) { gS[m] = ng; came[m] = n; push(m, ng + h(m)); }
        }
      }
      if (came[goal] === -1 && goal !== start) return null;
      const cells = []; for (let n = goal; n !== -1 && n !== start; n = came[n]) cells.push(n); cells.reverse();
      const pts = []; let pdx = null, pdy = null, prev = start;
      cells.forEach((n, i) => { const dx = (n % W) - (prev % W), dy = ((n / W) | 0) - ((prev / W) | 0); if (i > 0 && (dx !== pdx || dy !== pdy)) pts.push(prev); pdx = dx; pdy = dy; prev = n; });
      pts.push(goal);
      const world = pts.map((n) => [S.viewLeft + (n % W + 0.5) * G.c, S.viewTop + (((n / W) | 0) + 0.5) * G.c]);
      // string-pulling: keep only the corners needed for a clear straight line
      const out = []; let cur = [x0, y0], i = 0;
      while (i < world.length) {
        let j = world.length - 1;
        while (j > i && !lineClear(S, cur[0], cur[1], world[j][0], world[j][1])) j--;
        out.push(world[j]); cur = world[j]; i = j + 1;
      }
      return out;
    }
    function lineClear(S, x0, y0, x1, y1) {
      const G = S.grid, n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / (G.c / 2));
      for (let k = 1; k <= n; k++) { const [cx, cy] = cellOf(S, x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n); if (G.g[cy * G.cols + cx]) return false; }
      return true;
    }
    function sessionStore() { return gdjs.__PL_lastSession; }

    // ------------------------------------------------------------ data
    const COLUMNS = ['session_id', 'participant_id', 'schema', 'event', 't_ms', 'wall_ms', 'phase_index', 'phase', 'rule_splus', 'trial', 'phase_trial', 'block',
      'trial_kind', 'stimulus', 'order', 'component', 'dino_facing', 'stim_facing', 'relation', 'status', 'spawn_side', 'click_id', 'outcome',
      'x', 'y', 'value', 'info'];

    function log(S, ev, fields) {
      const T = S.trial;
      const rec = {
        session_id: S.sessionId, participant_id: S.participantId, schema: CONFIG.SCHEMA_VERSION, event: ev,
        t_ms: Math.round(S.clock * 1000), wall_ms: Math.round(Date.now() - S.wallT0), phase_index: S.phaseIdx, phase: S.phase ? S.phase.label : '',
        rule_splus: S.phase && S.phase.rule ? S.phase.rule : '', trial: T ? T.id : '', phase_trial: T ? T.phaseTrial : '',
        block: T ? T.block : '', trial_kind: T ? T.kind : '', stimulus: T ? T.stim : '', order: T ? T.order : '',
        component: '', dino_facing: S.dinoFacing, stim_facing: T ? T.stimFacing : '', relation: '', status: '',
        spawn_side: T ? T.side : '', click_id: '', outcome: '', x: '', y: '', value: '', info: '',
      };
      if (T && T.state === 'active') { const st = statusNow(S); rec.component = st.component; rec.relation = st.relation; rec.status = st.status; }
      Object.assign(rec, fields || {});
      S.events.push(rec); S.unsent.push(rec);
      return rec;
    }

    function persist(S) {
      gdjs.__PL_lastSession = { meta: S.meta, events: S.events, columns: COLUMNS, summaries: S.summaries };
      try { localStorage.setItem('PerspectiveLab_' + S.sessionId, JSON.stringify({ meta: S.meta, summaries: S.summaries, events: S.events })); } catch (e) { }
    }

    // ---- Upload: queue of envelopes (outbox) sent in order; retried until the receiver answers ok ----
    function saveOutbox(S) { try { localStorage.setItem('PerspectiveLab_OUTBOX_' + S.sessionId, JSON.stringify(S.outbox)); } catch (e) { } }
    function uploadLog(entry) { gdjs.__PL_uploadLog = gdjs.__PL_uploadLog || []; gdjs.__PL_uploadLog.push(entry); }
    function sendChunk(S, kind, extra) {
      const payload = Object.assign({ kind: kind, token: CONFIG.ENDPOINT_TOKEN, schema: CONFIG.SCHEMA_VERSION, session_id: S.sessionId,
        participant_id: S.participantId, chunk_id: ++S.chunkSeq, columns: COLUMNS, events: S.unsent.splice(0) }, extra || {});
      S.outbox.push(payload); saveOutbox(S); flush(S);
    }
    function flush(S) {
      gdjs.__PL_pending = S.outbox.length;
      if (!CONFIG.ENDPOINT_URL) { if (!S.noEndpointLogged) { S.noEndpointLogged = true; uploadLog({ ok: false, how: 'no_endpoint_configured' }); } gdjs.__PL_pending = 0; return; }
      if (S.sending || !S.outbox.length) return;
      const payload = S.outbox[0]; S.sending = true; let okSent = false;
      fetch(CONFIG.ENDPOINT_URL, { method: 'POST', body: JSON.stringify(payload), redirect: 'follow' })   // text/plain: no CORS preflight
        .then((r) => r.json())
        .then((j) => {
          if (!j || !j.ok) throw new Error((j && j.error) || 'not_ok');
          S.outbox.shift(); saveOutbox(S); okSent = true;
          uploadLog({ ok: true, kind: payload.kind, chunk_id: payload.chunk_id, duplicate: !!j.duplicate });
        })
        .catch((err) => { S.lastFail = Date.now(); uploadLog({ ok: false, kind: payload.kind, chunk_id: payload.chunk_id, how: String(err) }); })
        .finally(() => { S.sending = false; gdjs.__PL_pending = S.outbox.length; if (okSent && S.outbox.length) flush(S); });
    }

    // ------------------------------------------------------------ status
    // Returns component (S+/S-/CRF), relation (same/opposite) and status of the current stimulus
    function statusNow(S) {
      const T = S.trial;
      if (!T || T.state !== 'active') return { component: S.timeout ? 'timeout' : 'ITI', relation: '', status: 'none' };
      const relation = S.dinoFacing === T.stimFacing ? 'same' : 'opposite';
      if (S.phase.type === 'training') return { component: 'CRF', relation: relation, status: 'CRF' };
      const sp = relation === S.phase.rule;
      return { component: sp ? 'S+' : 'S-', relation: relation, status: sp ? 'S+' : 'S-' };
    }

    // Status of the stimulus as it would be for an avatar FACING it (forward-only weapon):
    // relation between the facing that points at the stimulus and the stimulus' own facing.
    // Side of the stimulus relative to the avatar, with hysteresis (keeps the last side inside the deadzone)
    function towardOf(T, dinoX) {
      const d = T.px - dinoX;
      if (Math.abs(d) < CONFIG.RELATION_DEADZONE_PX && T.lastToward) return T.lastToward;
      return d >= 0 ? 'R' : 'L';
    }
    function facedStatus(S, dino) {
      const T = S.trial; if (!T || !T.obj) return { relation: '', status: 'none' };
      const toward = towardOf(T, dino.getCenterXInScene());
      const relation = toward === T.stimFacing ? 'same' : 'opposite';
      if (S.phase.type === 'training') return { relation: relation, status: 'CRF' };
      return { relation: relation, status: relation === S.phase.rule ? 'S+' : 'S-' };
    }

    // ------------------------------------------------------------ objects
    function obj(rs, name) { const a = rs.getObjects(name); return a && a.length ? a[0] : null; }
    function setFacing(o, f, nativeRight) { if (o && o.flipX) o.flipX(nativeRight ? f === 'L' : f === 'R'); }
    function setDinoFacing(S, rs, f, why) {
      const changed = S.dinoFacing !== f;
      S.dinoFacing = f; setFacing(obj(rs, 'Dino_Doux'), f, CONFIG.DINO_NATIVE_FACES_RIGHT);
      if (changed && why) log(S, 'dino_flip', { info: why });
    }
    function dim(S, rs, on) { if (S.overlay) S.overlay.setOpacity(on ? CONFIG.TIMEOUT_OVERLAY_OPACITY : 0); }
    function z(o, k) { if (o && o.setZOrder) o.setZOrder(CONFIG.Z[k]); }
    // Matched-salience feedback: same duration and volume for S+ and S-
    function feedback(S, rs, kind, x, y, stimObj) {
      const add = (o, type, extra) => { if (!o) return; z(o, 'feedback'); setCenter(o, x, y); S.flashes.push(Object.assign({ o: o, t: CONFIG.FEEDBACK_S, type: type, x: x, y: y }, extra || {})); };
      if (kind === 'reinforced') {
        try { gdjs.evtTools.sound.playSound(rs, 'tone_up.wav', false, CONFIG.FEEDBACK_VOLUME, 1); } catch (e) { }
        add(rs.createObject('Burst'), 'burst');
        const t = rs.createObject('FeedbackText'); if (t) { setTxt(t, '+1'); add(t, 'rise'); }
      } else {
        try { gdjs.evtTools.sound.playSound(rs, 'clink.wav', false, CONFIG.FEEDBACK_VOLUME, 1); } catch (e) { }
        const sh = rs.createObject('Scutum_Shield'); if (sh && sh.setScale) sh.setScale(3); add(sh, 'shield');
        if (stimObj && stimObj.setColor) { stimObj.setColor('140;140;140'); S.flashes.push({ o: stimObj, t: CONFIG.FEEDBACK_S, type: 'tint' }); }
      }
    }
    function applyWalls(S, rs, idx) {
      const L = CONFIG.WALLS_ENABLED ? WALL_LAYOUTS[idx] : []; let walls = rs.getObjects('Wall');
      while (walls.length < L.length) { rs.createObject('Wall'); walls = rs.getObjects('Wall'); }
      walls.forEach((w, i) => {
        if (i >= L.length) { w.hide(true); return; }
        const [dx, cy, ww, hh] = L[i];
        w.hide(false); z(w, 'wall'); w.setWidth(ww); w.setHeight(hh); w.setX(S.midX + dx - ww / 2); w.setY(S.viewTop + cy - hh / 2);
      });
      const dino = obj(rs, 'Dino_Doux'); if (dino) dino.separateFromObjects(rs.getObjects('Wall').filter((w) => !w.isHidden()), true);
      S.wallLayout = idx; buildGrid(S, rs); if (S.trial && S.trial.state === 'active') S.trial.replan = 0;
      log(S, 'wall_layout', { value: idx });
    }
    function clearStim(rs) { ['Zombie', 'Chi_Chi_the_Bird'].forEach((n) => rs.getObjects(n).slice().forEach((o) => o.deleteFromScene(rs))); }

    // ------------------------------------------------------------ phases
    function buildPhases() {
      const P = [{ label: 'Training', type: 'training', rule: '' }];
      let rule = CONFIG.INITIAL_RULE;
      for (let i = 0; i < CONFIG.N_CONTINGENCY_PHASES; i++) {
        P.push({ label: i === 0 ? 'Discrimination' : 'Reversal ' + i, type: 'contingency', rule: rule });
        rule = rule === 'same' ? 'opposite' : 'same';
      }
      return P;
    }
    function startPhase(S, rs, idx) {
      S.phaseIdx = idx; S.phase = S.phases[idx];
      S.stage = S.phase.type === 'training' ? 'training' : 'baseline';
      S.phaseTrial = 0; S.blockNo = 1; S.consec = 0; S.trainRun = 0; S.mastered = false; S.trialsToCriterion = null;
      S.blocks = []; S.acc = newAcc(); S.win = []; S.probePlan = null; S.probeIdx = 0;
      S.counts = { trials: 0, kills: 0, deaths: 0, clicks: 0, turns: 0, stuck: 0, sminus_arrivals: 0, splus_hits: 0, sminus_hits: 0, crf_hits: 0, wall_blocked: 0, no_target: 0, cleared_at_timeout: 0, probe_trials: 0, probe_clicks_splus: 0, probe_clicks_sminus: 0, probe_hits_splus: 0, probe_hits_sminus: 0,
        relation_changes: 0, conversions: 0, conversions_by_avatar: 0, reversions: 0, converted_hits: 0, reorientations: 0, probe_resp: {}, probe_n: {} };
      log(S, 'phase_start', { info: S.phase.type });
    }
    function pushWindow(S, correct) { S.win.push(correct ? 1 : 0); if (S.win.length > CONFIG.CRITERION_WINDOW) S.win.shift(); }
    function newAcc() { return { clicksP: 0, clicksM: 0, expP: 0, expM: 0, hitsP: 0, hitsM: 0, turns: 0, correct: 0, n: 0, splusTrials: 0, splusKilled: 0, sminusTrials: 0, sminusFA: 0,
      onsetP: 0, onsetM: 0, onsetMConverted: 0, convertedHits: 0, onsetCorrect: 0 }; }
    function endPhase(S, rs, reason) {
      const summary = {
        phase_index: S.phaseIdx, phase: S.phase.label, type: S.phase.type, rule_splus: S.phase.rule, end_reason: reason,
        mastered: S.mastered, trials_to_criterion: S.trialsToCriterion, baseline_trials: S.phaseTrial, blocks: S.blocks, counts: S.counts,
      };
      S.summaries.push(summary);
      log(S, 'phase_end', { info: reason, value: S.mastered ? 1 : 0 });
      persist(S);
      sendChunk(S, 'phase', { phase: S.phase.label, phase_index: S.phaseIdx, summary: summary });
      const last = S.phaseIdx >= S.phases.length - 1;
      if (reason === 'cap' && S.phase.label === 'Discrimination' && CONFIG.STOP_IF_DISCRIMINATION_NOT_MASTERED) endSession(S, rs, 'nonlearner_discrimination');
      else if (last || (reason === 'cap' && !CONFIG.ADVANCE_ON_CAP)) endSession(S, rs, last ? 'completed' : 'cap_stop');
      else startPhase(S, rs, S.phaseIdx + 1);
    }
    function endSession(S, rs, reason) {
      S.ended = true;
      S.bullets.forEach((B) => { if (!B.passed) log(S, 'shot_outcome', { click_id: B.clickId, outcome: 'in_flight_at_session_end', status: B.status, relation: B.relation }); B.o.deleteFromScene(rs); });
      S.bullets = [];
      log(S, 'session_end', { info: reason });
      S.meta.end_reason = reason; S.meta.duration_s = Math.round(S.clock);
      persist(S);
      sendChunk(S, 'session_summary', { meta: Object.assign({}, S.meta, { config: undefined }), summaries: S.summaries });
      gdjs.evtTools.runtimeScene.replaceScene(rs, 'Game over', false);
    }

    // ------------------------------------------------------------ trials
    function nextTrialSpec(S) {
      if (S.stage === 'probe') {
        const it = S.probePlan.seq[S.probeIdx];
        if (it.kind === 'probe') {
          const rel = it.pstatus === 'S+' ? S.phase.rule : (S.phase.rule === 'same' ? 'opposite' : 'same');
          const side = Math.random() < 0.5 ? 'L' : 'R';
          return { kind: 'probe', ptype: it.ptype, stim: it.ptype === 'bird' ? 'bird' : 'zombie', order: it.pstatus === 'S+' ? 'P' : 'M', side: side, stimFacing: rel === 'same' ? side : opp(side) };
        }
        const cell = S.gen.cell();
        return { kind: 'probe_block_baseline', stim: 'zombie', order: S.gen.order(), side: cell.side, stimFacing: cell.facing };
      }
      const cell = S.gen.cell();
      if (S.stage === 'training') return { kind: 'training', stim: 'zombie', order: S.gen.order(), side: cell.side, stimFacing: cell.facing };
      return { kind: 'baseline', stim: 'zombie', order: S.gen.order(), side: cell.side, stimFacing: cell.facing };
    }
    function startTrial(S, rs) {
      const spec = nextTrialSpec(S);
      S.trialCounter++;
      const T = Object.assign(spec, { id: S.trialCounter, phaseTrial: S.stage === 'baseline' ? S.phaseTrial + 1 : '', block: S.stage === 'baseline' ? S.blockNo : (S.stage === 'probe' ? 'probe' : 'training'), t: 0, state: 'active', obj: null, path: null, replan: 0, turns: 0 });
      S.trial = T;
      // Facing is controlled by the cursor; the faced status of the stimulus is balanced by the side x facing generator.
      { const rule = S.phase.type === 'contingency' ? S.phase.rule : 'same';
        const sameFaced = T.side === T.stimFacing;   // stimulus on the right facing right = back to the avatar = 'same'
        T.order = (sameFaced === (rule === 'same')) ? 'P' : 'M'; }
      const dino = obj(rs, 'Dino_Doux'); const dx = dino.getCenterXInScene();
      const sideOK = (p) => p.getX() < S.viewLeft + CONFIG.SIDE_SPAWN_MARGIN_PX || p.getX() > S.viewRight - CONFIG.SIDE_SPAWN_MARGIN_PX;
      const pts = rs.getObjects('enemy_spawn_down').filter((p) => sideOK(p) && (T.side === 'L' ? p.getX() < dx : p.getX() >= dx));
      const pool = pts.length ? pts : rs.getObjects('enemy_spawn_down').filter(sideOK);
      let sp = pool[Math.floor(Math.random() * pool.length)];
      if (T.ptype === 'static' || T.ptype === 'lateral') {   // keep the probe on screen: switch side (and facing, so the relation is unchanged) if needed
        const D = T.ptype === 'static' ? CONFIG.PROBE_STATIC_DX : CONFIG.PROBE_LATERAL_DX, x = dx + (T.side === 'L' ? -D : D);
        if (x < S.viewLeft + 70 || x > S.viewRight - 70) { T.side = opp(T.side); T.stimFacing = opp(T.stimFacing); }
      }
      const sgn = T.side === 'L' ? -1 : 1, dy0 = dino.getCenterYInScene();
      if (T.ptype === 'static') sp = { getX: () => dx + sgn * CONFIG.PROBE_STATIC_DX, getY: () => Math.max(S.viewTop + 80, Math.min(S.viewBottom - 80, dy0 + rnd(-150, 150))) };
      if (T.ptype === 'lateral') { const top = Math.random() < 0.5; T.latTargetY = top ? S.viewBottom - 60 : S.viewTop + 60;
        sp = { getX: () => dx + sgn * CONFIG.PROBE_LATERAL_DX, getY: () => (top ? S.viewTop + 60 : S.viewBottom - 60) }; }
      const o = rs.createObject(T.stim === 'bird' ? 'Chi_Chi_the_Bird' : 'Zombie');
      if (o.setScale) o.setScale(T.stim === 'bird' ? CONFIG.BIRD_SCALE : CONFIG.ZOMBIE_SCALE);
      z(o, 'stim');
      setCenter(o, sp.getX(), sp.getY());
      setFacing(o, T.stimFacing, T.stim === 'bird' ? CONFIG.BIRD_NATIVE_FACES_RIGHT : CONFIG.ZOMBIE_NATIVE_FACES_RIGHT);
      T.obj = o; T.sx = sp.getX(); T.sy = sp.getY(); T.px = T.sx; T.py = T.sy; T.hop = Math.random();
      T.shadow = rs.createObject('Shadow'); if (T.shadow) { T.shadow.setScale(CONFIG.SHADOW_SCALE); z(T.shadow, 'shadow'); setCenter(T.shadow, T.px, T.py + o.getHeight() * 0.42); }
      try { o.pauseAnimation(); } catch (e) { }
      // Onset relation (programmed trial type) and tracking of participant-produced relation changes
      T.lastToward = null; T.lastToward = towardOf(T, dx);
      const fs0 = facedStatus(S, dino);
      T.onsetRelation = fs0.relation; T.onsetStatus = fs0.status; T.curStatus = fs0.status;
      T.relChanges = 0; T.conversions = 0; T.reversions = 0; T.reorients = 0; T.probeHits = 0; T.locoLogged = false; T.lastDinoX = dx; T.lastPx = T.px;
      log(S, 'trial_start', { x: Math.round(T.sx), y: Math.round(T.sy), relation: fs0.relation, status: fs0.status, info: 'onset' + (T.ptype ? ';ptype=' + T.ptype : '') });
    }
    function endTrial(S, rs, outcome) {
      const T = S.trial; if (!T) return;
      let gng = '', gngOnset = '', endStatus = '';
      if (S.phase.type === 'contingency' && T.obj) {
        const fs = facedStatus(S, obj(rs, 'Dino_Doux')); endStatus = fs.status;
        const sMinusHit = (T.sminusHits || 0) > 0;
        if (outcome === 'probe_kill') gng = fs.status === 'S+' ? 'hit' : 'false_alarm';
        else if (outcome === 'kill') gng = 'hit';
        else if (fs.status === 'S+') gng = 'miss';
        else gng = sMinusHit ? 'false_alarm' : 'correct_rejection';
        // Onset-based classification (programmed trial type), reported alongside the end-based one
        const killed = outcome === 'kill' || outcome === 'probe_kill';
        if (T.onsetStatus === 'S+') gngOnset = killed ? 'hit' : 'miss';
        else if (sMinusHit) gngOnset = 'false_alarm';
        else if (killed) gngOnset = 'converted_hit';          // S- at onset, eliminated after the participant changed the relation
        else if (endStatus === 'S+') gngOnset = 'converted_miss';  // S- at onset, turned into S+ by the participant, then not eliminated
        else gngOnset = 'correct_rejection';
        if (gngOnset === 'converted_hit' && T.kind === 'baseline') S.counts.converted_hits++;
        if (T.kind === 'baseline') {
          const a = S.acc; a.n++;
          if (gng === 'hit' || gng === 'miss') { a.splusTrials++; if (gng === 'hit') a.splusKilled++; }
          else { a.sminusTrials++; if (gng === 'false_alarm') a.sminusFA++; }
          if (gng === 'hit' || gng === 'correct_rejection') a.correct++;
          if (T.onsetStatus === 'S+') a.onsetP++; else { a.onsetM++; if (T.conversions > 0) a.onsetMConverted++; }
          if (gngOnset === 'converted_hit') a.convertedHits++;
          if (gngOnset === 'hit' || gngOnset === 'correct_rejection') a.onsetCorrect++;
          pushWindow(S, gng === 'hit' || gng === 'correct_rejection');
        }
      }
      log(S, 'trial_end', { outcome: outcome, value: Math.round(T.t * 1000), relation: T.onsetRelation || '', status: T.onsetStatus || '',
        info: 'turns=' + T.turns + (gng ? ';gng=' + gng + ';gng_onset=' + gngOnset + ';onset=' + T.onsetStatus + ';end=' + endStatus +
          ';rel_changes=' + T.relChanges + ';conversions=' + T.conversions + ';reversions=' + T.reversions + ';reorients=' + T.reorients : '') +
          (T.kind === 'probe' ? ';ptype=' + T.ptype + ';probe_resp=' + (T.probeHits > 0 ? 1 : 0) + ';probe_hits=' + T.probeHits : '') });
      if (T.kind === 'probe') { const k = T.ptype + '_' + (T.onsetStatus === 'S+' ? 'splus' : 'sminus');
        S.counts.probe_n[k] = (S.counts.probe_n[k] || 0) + 1; S.counts.probe_resp[k] = (S.counts.probe_resp[k] || 0) + (T.probeHits > 0 ? 1 : 0); }
      if (T.obj) { T.obj.deleteFromScene(rs); T.obj = null; }
      if (T.shadow) { T.shadow.deleteFromScene(rs); T.shadow = null; }
      T.state = 'done';
      if (T.kind === 'training') S.trainRun = outcome === 'kill' ? S.trainRun + 1 : 0;
      S.counts.trials++;
      if (T.kind === 'probe') S.counts.probe_trials++;
      if (S.counts.trials % CONFIG.SEND_EVERY_TRIALS === 0) sendChunk(S, 'chunk', {});
      S.iti = rnd(CONFIG.ITI_MIN_S, CONFIG.ITI_MAX_S);
      advanceSchedule(S, rs);
      persist(S);
    }
    function advanceSchedule(S, rs) {
      if (S.stage === 'training') {
        const n = S.counts.trials;
        if (n >= CONFIG.TRAINING_MIN && S.trainRun >= CONFIG.TRAINING_RUN) { S.pendingPhaseEnd = 'completed'; log(S, 'training_criterion', { value: n, info: 'run=' + S.trainRun }); }
        else if (n >= CONFIG.TRAINING_MAX) S.pendingPhaseEnd = 'completed';
        return;
      }
      if (S.stage === 'probe') {
        S.probeIdx++;
        if (S.probeIdx >= CONFIG.PROBE_BLOCK_TRIALS) S.pendingPhaseEnd = 'criterion';
        return;
      }
      // baseline
      S.phaseTrial++;
      if (S.phaseTrial % CONFIG.BLOCK_SIZE === 0) {
        const a = S.acc;
        const ratio = a.n > 0 ? a.correct / a.n : null;
        const met = ratio !== null && ratio >= CONFIG.CRITERION;
        const rP = a.expP > 0 ? a.clicksP / a.expP : 0, rM = a.expM > 0 ? a.clicksM / a.expM : 0;
        const b = { block: S.blockNo, accuracy: ratio === null ? null : +ratio.toFixed(4), splus_trials: a.splusTrials, splus_eliminated: a.splusKilled, hit_rate: a.splusTrials ? +(a.splusKilled / a.splusTrials).toFixed(4) : null, sminus_trials: a.sminusTrials, false_alarms: a.sminusFA, fa_rate: a.sminusTrials ? +(a.sminusFA / a.sminusTrials).toFixed(4) : null, hits_splus: a.hitsP, hits_sminus: a.hitsM, clicks_splus: a.clicksP, clicks_sminus: a.clicksM, exposure_splus_s: +a.expP.toFixed(3), exposure_sminus_s: +a.expM.toFixed(3), rate_splus: +rP.toFixed(4), rate_sminus: +rM.toFixed(4), turns: a.turns, ratio: ratio === null ? null : +ratio.toFixed(4), met: met,
          onset_splus_trials: a.onsetP, onset_sminus_trials: a.onsetM, onset_sminus_converted: a.onsetMConverted, converted_hits: a.convertedHits,
          accuracy_onset: a.n ? +(a.onsetCorrect / a.n).toFixed(4) : null };
        S.blocks.push(b);
        log(S, 'block_end', { block: S.blockNo, value: b.ratio === null ? '' : b.ratio, outcome: met ? 'met' : 'not_met', info: JSON.stringify(b) });
        S.acc = newAcc(); S.blockNo++;
      }
      {
        const wc = S.win.reduce((x, y) => x + y, 0);
        if (S.win.length >= CONFIG.CRITERION_WINDOW && wc >= CONFIG.CRITERION_CORRECT) {
          S.win = [];
          S.mastered = true; S.trialsToCriterion = S.phaseTrial;
          log(S, 'criterion_met', { value: S.phaseTrial, info: 'rolling_' + wc + '_of_' + CONFIG.CRITERION_WINDOW });
          const last = S.phaseIdx >= S.phases.length - 1;
          if (!last || CONFIG.PROBE_AFTER_FINAL_PHASE) {
            S.stage = 'probe'; S.probeIdx = 0;
            S.probePlan = { seq: probePlan() };
            log(S, 'probe_block_start', { info: S.probePlan.seq.map((it) => it.kind === 'probe' ? it.ptype[0] + (it.pstatus === 'S+' ? '+' : '-') : 'b').join('|') });
          } else S.pendingPhaseEnd = 'criterion';
          return;
        }
      }
      if (S.phaseTrial >= CONFIG.TRIAL_CAP) S.pendingPhaseEnd = 'cap';
    }

    // ------------------------------------------------------------ init
    function init(rs) {
      const gv = rs.getGame().getVariables();
      const S = {
        sessionId: gv.has('SessionID') ? gv.get('SessionID').getAsString() : '',
        participantId: gv.get('ParticipantID').getAsString(),
        clock: 0, wallT0: Date.now(), events: [], unsent: [], outbox: [], chunkSeq: 0, sending: false, lastFail: 0, summaries: [], trialCounter: 0, clickCounter: 0,
        dinoFacing: 'R', trial: null, iti: 1.5, timeout: 0, bullets: [], flashes: [], score: 0, ended: false, pendingPhaseEnd: null,
        gen: { order: makeOrderGen(), cell: makeCellGen(), probeOrder: makeOrderGen(), probeCell: makeCellGen() },
      };
      if (!S.sessionId || S.sessionId === '0') S.sessionId = 'S' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      S.meta = { session_id: S.sessionId, participant_id: S.participantId, schema: CONFIG.SCHEMA_VERSION, started_at: new Date().toISOString(), user_agent: (typeof navigator !== 'undefined' ? navigator.userAgent : ''), config: CONFIG };
      // Camera on floor centre; view geometry
      const floor = obj(rs, 'Floor'); const layer = rs.getLayer('');
      if (floor) { layer.setCameraX(floor.getCenterXInScene()); layer.setCameraY(floor.getCenterYInScene()); }
      const cw = rs.getGame().getGameResolutionWidth(), ch = rs.getGame().getGameResolutionHeight();
      S.midX = layer.getCameraX(); S.viewLeft = S.midX - cw / 2; S.viewRight = S.midX + cw / 2; S.viewTop = layer.getCameraY() - ch / 2; S.viewBottom = S.viewTop + ch;
      S.centerX = S.midX; S.centerY = S.viewTop + ch / 2;
      clearStim(rs); rs.getObjects('Main_Ship_Auto_Cannon_Bullet').slice().forEach((b) => b.deleteFromScene(rs));
      const dino = obj(rs, 'Dino_Doux');
      dino.setWidth(CONFIG.DINO_SIZE_PX); dino.setHeight(CONFIG.DINO_SIZE_PX); z(dino, 'dino');
      setCenter(dino, S.centerX, S.centerY);
      const gun = obj(rs, 'Gun'); if (gun) { gun.setWidth(CONFIG.GUN_W); gun.setHeight(CONFIG.GUN_H); gun.setOpacity(CONFIG.GUN_OPACITY); z(gun, 'gun'); }
      z(floor, 'floor');
      S.overlay = rs.createObject('Overlay');
      if (S.overlay) { S.overlay.setWidth(cw + 40); S.overlay.setHeight(ch + 40); S.overlay.setX(S.viewLeft - 20); S.overlay.setY(S.viewTop - 20); S.overlay.setOpacity(0); z(S.overlay, 'overlay'); }
      const score = obj(rs, 'Score'); z(score, 'hud');
      const vg = rs.createObject('Vignette'); if (vg) { vg.setWidth(cw); vg.setHeight(ch); vg.setX(S.viewLeft); vg.setY(S.viewTop); z(vg, 'vignette'); }
      S.hudPanel = rs.createObject('HudPanel'); if (S.hudPanel) { S.hudPanel.setX(S.viewRight - 220 - 18); S.hudPanel.setY(S.viewTop + 14); z(S.hudPanel, 'hudpanel'); }
      S.avShadow = rs.createObject('Shadow'); if (S.avShadow) { S.avShadow.setScale(CONFIG.SHADOW_SCALE); z(S.avShadow, 'shadow'); }
      S.phases = buildPhases();
      S.wallOrder = shuffle([0, 1, 2, 3]); S.wallPtr = 0; S.wallTimer = 0;
      try {
        S.meta.screen = { screen_w: screen.width, screen_h: screen.height, window_w: window.innerWidth, window_h: window.innerHeight, device_pixel_ratio: window.devicePixelRatio };
        S.meta.focus_losses = 0;
        window.addEventListener('blur', () => { if (!S.ended) { S.meta.focus_losses++; log(S, 'focus_lost', {}); } });
        window.addEventListener('focus', () => { if (!S.ended) log(S, 'focus_gained', {}); });
        document.addEventListener('visibilitychange', () => { if (!S.ended) log(S, document.hidden ? 'visibility_hidden' : 'visibility_visible', {}); });
      } catch (e) { }
      gdjs.__PL_flush = () => flush(S);
      const gvs = (k) => { try { return gv.has(k) ? gv.get(k).getAsString() : ''; } catch (e) { return ''; } };
      S.meta.input_device = gvs('InputDevice'); S.meta.sound_on = gvs('SoundOn'); S.meta.pid_source = gvs('PidSource') || 'typed';
      gdjs.__PL_redirect = (CONFIG.REDIRECT_URL_TEMPLATE && gdjs.__PL_hosted) ? CONFIG.REDIRECT_URL_TEMPLATE.replace('{pid}', encodeURIComponent(S.participantId)) : '';
      log(S, 'session_start', { info: S.meta.started_at + (S.meta.screen ? ';screen=' + JSON.stringify(S.meta.screen) : '') });
      log(S, 'device_report', { info: 'input=' + S.meta.input_device + ';sound=' + S.meta.sound_on + ';pid_source=' + S.meta.pid_source });
      applyWalls(S, rs, S.wallOrder[0]);
      startPhase(S, rs, 0);
      persist(S);
      return S;
    }

    // ------------------------------------------------------------ update
    function update(rs, S) {
      if (S.ended) return;
      if (S.outbox.length && !S.sending && Date.now() - S.lastFail > CONFIG.SEND_RETRY_S * 1000) flush(S);
      const dt = Math.min(rs.getElapsedTime() / 1000, 0.1);
      S.clock += dt;
      const input = gdjs.evtTools.input;
      const dino = obj(rs, 'Dino_Doux'), gun = obj(rs, 'Gun');
      const mv = dino.getBehavior('TopDownMovement');

      // Clamp dino inside the view
      const hw = dino.getWidth() / 2, hh = dino.getHeight() / 2;
      const cx = Math.max(S.viewLeft + hw, Math.min(S.viewRight - hw, dino.getCenterXInScene()));
      const cy = Math.max(S.viewTop + hh, Math.min(S.viewBottom - hh, dino.getCenterYInScene()));
      if (cx !== dino.getCenterXInScene() || cy !== dino.getCenterYInScene()) setCenter(dino, cx, cy);
      dino.separateFromObjects(rs.getObjects('Wall').filter((w) => !w.isHidden()), true);

      // ---- Facing follows the side of the cursor (with hysteresis) ----
      {
        const mxF = input.getCursorX(rs, '', 0), dxF = mxF - dino.getCenterXInScene();
        const want = dxF > CONFIG.FACING_DEADZONE_PX ? 'R' : (dxF < -CONFIG.FACING_DEADZONE_PX ? 'L' : S.dinoFacing);
        if (S.timeout <= 0 && want !== S.dinoFacing) {
          const before = statusNow(S);
          setDinoFacing(S, rs, want, null);
          const after = statusNow(S);
          S.counts.turns++; if (S.trial && S.trial.state === 'active') { S.trial.turns++; if (S.trial.kind === 'baseline') S.acc.turns++; }
          log(S, 'turn', { value: want, info: 'cursor;from_' + before.status + '_to_' + after.status, relation: after.relation, status: after.status });
        }
      }
      try { const moving = mv && mv.getSpeed && Math.abs(mv.getSpeed()) > 1; if (moving) dino.resumeAnimation(); else dino.pauseAnimation(); } catch (e) { }

      if (S.avShadow) setCenter(S.avShadow, dino.getCenterXInScene(), dino.getCenterYInScene() + dino.getHeight() * 0.44);

      // Gun follows the avatar and aims at the cursor (aim is independent of facing)
      const mx = input.getCursorX(rs, '', 0), my = input.getCursorY(rs, '', 0);
      const dcx = dino.getCenterXInScene(), dcy = dino.getCenterYInScene();
      const fwd = S.dinoFacing === 'R' ? 0 : Math.PI, sgn = S.dinoFacing === 'R' ? 1 : -1;
      const hx = dcx + sgn * CONFIG.HAND_DX, hy = dcy + CONFIG.HAND_DY;
      let rel = Math.atan2(my - hy, mx - hx) - fwd; rel = Math.atan2(Math.sin(rel), Math.cos(rel));
      const arc = CONFIG.AIM_ARC_DEG * Math.PI / 180; const clamped = Math.max(-arc, Math.min(arc, rel));
      const aim = fwd + clamped; S.aimClamped = clamped !== rel;
      setCenter(gun, hx + Math.cos(aim) * CONFIG.GUN_W * 0.35, hy + Math.sin(aim) * CONFIG.GUN_W * 0.35);
      gun.setAngle(aim * 180 / Math.PI);
      if (gun.flipY) gun.flipY(S.dinoFacing === 'L');

      // Wall layout rotation on a fixed timer, independent of phases
      S.wallTimer += dt;
      if (CONFIG.WALLS_ENABLED && S.wallTimer >= CONFIG.WALL_ROTATE_S) { S.wallTimer = 0; S.wallPtr = (S.wallPtr + 1) % S.wallOrder.length; applyWalls(S, rs, S.wallOrder[S.wallPtr]); }

      // ---- Responses (every click is a response) ----
      if (input.isMouseButtonReleased(rs, 'Left')) {
        S.clickCounter++;
        const st = statusNow(S);
        const T = S.trial && S.trial.state === 'active' ? S.trial : null;
        S.counts.clicks++;
        log(S, 'click', { click_id: S.clickCounter, component: st.component, relation: st.relation, status: st.status, x: Math.round(mx), y: Math.round(my), info: S.aimClamped ? 'aim_clamped_to_forward_arc' : '' });
        if (T && T.kind === 'baseline') { if (st.status === 'S+') S.acc.clicksP++; else if (st.status === 'S-') S.acc.clicksM++; }
        if (T && T.kind === 'probe') { if (st.status === 'S+') S.counts.probe_clicks_splus++; else if (st.status === 'S-') S.counts.probe_clicks_sminus++; }
        if (S.timeout > 0) {
          log(S, 'shot_outcome', { click_id: S.clickCounter, outcome: 'timeout_no_bullet' });
        } else {
          const b = rs.createObject('Main_Ship_Auto_Cannon_Bullet');
          const ang = gun.getAngle() * Math.PI / 180;
          const bx = gun.getPointX ? gun.getPointX('BulletPoint') : gun.getCenterXInScene();
          const by = gun.getPointY ? gun.getPointY('BulletPoint') : gun.getCenterYInScene();
          setCenter(b, bx, by); b.setAngle(gun.getAngle()); z(b, 'bullet');
          S.bullets.push({ o: b, vx: Math.cos(ang) * CONFIG.BULLET_SPEED, vy: Math.sin(ang) * CONFIG.BULLET_SPEED, d: 0, clickId: S.clickCounter, trialId: T ? T.id : null, status: st.status, relation: st.relation, kind: T ? T.kind : 'none' });
        }
      }

      // ---- Bullets: each resolves to exactly one outcome ----
      const walls = rs.getObjects('Wall').filter((w) => !w.isHidden());
      for (let i = S.bullets.length - 1; i >= 0; i--) {
        const B = S.bullets[i]; let outcome = null;
        for (let sub = 0; sub < 2 && !outcome; sub++) {
          B.o.setX(B.o.getX() + B.vx * dt / 2); B.o.setY(B.o.getY() + B.vy * dt / 2); B.d += CONFIG.BULLET_SPEED * dt / 2;
          if (walls.some((w) => overlap(B.o, w))) { outcome = 'wall_blocked'; break; }
          const T = S.trial;
          if (T && T.state === 'active' && T.obj && B.trialId === T.id && !B.passed && overlap(B.o, T.obj)) {
            if (T.kind === 'probe') {                       // extinction: the pellet is absorbed on contact; no sound, shield, points, or removal
              outcome = 'probe_hit_extinction'; break;
            }
            if (B.status === 'CRF' || B.status === 'S+') {
              outcome = B.status === 'CRF' ? 'crf_hit' : 'splus_hit';
            } else if (B.status === 'S-') {
              outcome = 'sminus_hit';
            }
          }
          if (B.d >= CONFIG.BULLET_RANGE) { outcome = 'no_target'; break; }
        }
        if (!outcome) continue;
        S.bullets.splice(i, 1); B.o.deleteFromScene(rs);
        if (B.passed) continue;
        if (outcome === 'probe_hit_extinction') {
          S.trial.probeHits++;
          if (B.status === 'S+') S.counts.probe_hits_splus++; else S.counts.probe_hits_sminus++;
          log(S, 'shot_outcome', { click_id: B.clickId, outcome: outcome, status: B.status, relation: B.relation, info: 'ptype=' + S.trial.ptype });
          continue;
        }
        if (outcome.indexOf('probe_hit_') === 0) {
          if (B.status === 'S+') S.counts.probe_hits_splus++; else S.counts.probe_hits_sminus++;
          S.counts.kills++; S.score++;
          feedback(S, rs, 'reinforced', S.trial.obj.getCenterXInScene(), S.trial.obj.getCenterYInScene(), null);
          log(S, 'shot_outcome', { click_id: B.clickId, outcome: outcome, status: B.status, relation: B.relation, info: 'nondifferential_reinforcement' });
          log(S, 'kill', { value: S.score, info: 'probe' });
          endTrial(S, rs, 'probe_kill');
        }
        else if (outcome === 'wall_blocked') { S.counts.wall_blocked++; log(S, 'shot_outcome', { click_id: B.clickId, outcome: outcome, status: B.status, relation: B.relation }); }
        else if (outcome === 'no_target') { S.counts.no_target++; log(S, 'shot_outcome', { click_id: B.clickId, outcome: outcome, status: B.status, relation: B.relation }); }
        else if (outcome === 'sminus_hit') {
          S.counts.sminus_hits++; if (B.kind === 'baseline') S.acc.hitsM++; S.trial.sminusHits = (S.trial.sminusHits || 0) + 1;
          log(S, 'shot_outcome', { click_id: B.clickId, outcome: outcome, status: B.status, relation: B.relation });
          feedback(S, rs, 'sminus', S.trial.obj.getCenterXInScene(), S.trial.obj.getCenterYInScene(), S.trial.obj);
        } else {                                              // splus_hit or crf_hit: reinforced
          if (outcome === 'crf_hit') S.counts.crf_hits++; else { S.counts.splus_hits++; if (B.kind === 'baseline') S.acc.hitsP++; }
          S.counts.kills++; S.score++;
          feedback(S, rs, 'reinforced', S.trial.obj.getCenterXInScene(), S.trial.obj.getCenterYInScene(), null);
          log(S, 'shot_outcome', { click_id: B.clickId, outcome: outcome, status: B.status, relation: B.relation });
          log(S, 'kill', { value: S.score });
          endTrial(S, rs, 'kill');
        }
      }
      for (let i = S.flashes.length - 1; i >= 0; i--) {
        const F = S.flashes[i]; F.t -= dt; const p = Math.max(0, Math.min(1, 1 - F.t / CONFIG.FEEDBACK_S));
        if (F.type === 'tint') { if (F.t <= 0) { if (F.o.setColor) F.o.setColor('255;255;255'); S.flashes.splice(i, 1); } continue; }
        if (F.type === 'burst' && F.o.setScale) { F.o.setScale(1 + 1.5 * p); setCenter(F.o, F.x, F.y); }
        if (F.type === 'rise') setCenter(F.o, F.x, F.y - 50 * p);
        if (F.o.setOpacity) F.o.setOpacity(255 * (1 - p));
        if (F.t <= 0) { F.o.deleteFromScene(rs); S.flashes.splice(i, 1); }
      }

      // ---- Timeout ----
      if (S.timeout > 0) {
        S.timeout -= dt;
        if (S.timeout <= 0) {
          S.timeout = 0; dim(S, rs, false); if (mv) mv.activate(true);
          setCenter(dino, S.centerX, S.centerY); dino.separateFromObjects(walls, true);
          log(S, 'timeout_end');
        }
      }

      // ---- Trial flow ----
      const T = S.trial;
      if (T && T.state === 'active') {
        T.t += dt;
        // exposure accumulation (baseline only) uses the status in effect during this frame
        if (T.kind === 'baseline') { const st = statusNow(S); if (st.status === 'S+') S.acc.expP += dt; else if (st.status === 'S-') S.acc.expM += dt; }
        // constant-speed approach along an A* path around the walls (replanned as the avatar moves)
        const o = T.obj;
        T.replan -= dt;
        if (T.replan <= 0) {
          T.replan = CONFIG.PATH_REPLAN_S;
          const p = findPath(S, T.px, T.py, dino.getCenterXInScene(), dino.getCenterYInScene());
          if (p) T.path = p; else if (!T.noPathLogged) { T.noPathLogged = true; log(S, 'no_path', {}); T.path = []; }
        }
        let step = CONFIG.STIM_SPEED * dt; let ox = T.px, oy = T.py;
        // static window: orientation visible without locomotion; static probes never move; lateral probes move vertically only
        if (T.t < CONFIG.STATIC_WINDOW_S || T.ptype === 'static') step = 0;
        else if (!T.locoLogged) { T.locoLogged = true; log(S, 'locomotion_start', { value: Math.round(T.t * 1000), info: T.ptype || '' }); }
        if (T.ptype === 'lateral' && step > 0) { const dyl = T.latTargetY - oy; oy += Math.sign(dyl) * Math.min(Math.abs(dyl), step); step = 0; }
        while (step > 0) {
          const wp = T.path && T.path.length ? T.path[0] : [dino.getCenterXInScene(), dino.getCenterYInScene()];
          const ddx = wp[0] - ox, ddy = wp[1] - oy, dist = Math.hypot(ddx, ddy);
          if (dist <= step) { ox = wp[0]; oy = wp[1]; step -= dist; if (T.path && T.path.length) T.path.shift(); else break; }
          else { ox += ddx / dist * step; oy += ddy / dist * step; step = 0; }
        }
        T.px = ox; T.py = oy; T.hop += dt * CONFIG.HOP_RATE;
        const lift = Math.abs(Math.sin(T.hop * Math.PI));
        setCenter(o, ox, oy - lift * CONFIG.HOP_HEIGHT);
        if (T.shadow) { T.shadow.setScale(CONFIG.SHADOW_SCALE * (1 - 0.15 * lift)); T.shadow.setOpacity(255 * (1 - 0.3 * lift)); setCenter(T.shadow, ox, oy + o.getHeight() * 0.42); }
        // Relation tracking: log every change of the stimulus' side relative to the avatar (who moved: avatar or stimulus)
        {
          const dX = dino.getCenterXInScene(), tw = towardOf(T, dX);
          if (tw !== T.lastToward && CONFIG.PRESERVE_RELATION) {
            // the stimulus turns around so that its relation to the avatar (facing toward/away from me) is unchanged
            const cause = Math.abs(dX - T.lastDinoX) >= Math.abs(T.px - T.lastPx) ? 'avatar' : 'stimulus';
            T.lastToward = tw; T.stimFacing = opp(T.stimFacing);
            setFacing(o, T.stimFacing, T.stim === 'bird' ? CONFIG.BIRD_NATIVE_FACES_RIGHT : CONFIG.ZOMBIE_NATIVE_FACES_RIGHT);
            T.reorients++; S.counts.reorientations++;
            log(S, 'stim_reorient', { stim_facing: T.stimFacing, x: Math.round(T.px), y: Math.round(T.py), value: Math.round(dX), info: 'cause=' + cause });
          } else if (tw !== T.lastToward) {
            const prev = T.curStatus;
            T.lastToward = tw;
            const fsN = facedStatus(S, dino);
            const cause = Math.abs(dX - T.lastDinoX) >= Math.abs(T.px - T.lastPx) ? 'avatar' : 'stimulus';
            T.relChanges++; S.counts.relation_changes++;
            if (prev === 'S-' && fsN.status === 'S+') { T.conversions++; S.counts.conversions++; if (cause === 'avatar') S.counts.conversions_by_avatar++; }
            if (prev === 'S+' && fsN.status === 'S-') { T.reversions++; S.counts.reversions++; }
            T.curStatus = fsN.status;
            log(S, 'relation_change', { relation: fsN.relation, status: fsN.status, outcome: prev + '_to_' + fsN.status, x: Math.round(T.px), y: Math.round(T.py), value: Math.round(dX), info: 'cause=' + cause });
          }
          T.lastDinoX = dX; T.lastPx = T.px;
        }
        const contact = overlapShrink(o, dino, CONFIG.CONTACT_SHRINK);
        if (T.ptype === 'static' && !contact && T.t >= CONFIG.PROBE_STATIC_S) { endTrial(S, rs, 'probe_static_end'); }
        else if (T.ptype === 'lateral' && !contact && T.t >= CONFIG.STATIC_WINDOW_S + CONFIG.PROBE_LATERAL_S) { endTrial(S, rs, 'probe_lateral_end'); }
        else if (!contact && T.t >= CONFIG.TRIAL_MAX_S) { S.counts.stuck++; endTrial(S, rs, 'stuck_timeout'); }
        else if (contact) {
          const fs = facedStatus(S, dino);
          log(S, 'contact', { relation: fs.relation, status: fs.status, info: 'faced_status' });
          if (T.kind === 'probe') { endTrial(S, rs, 'probe_arrival_fade'); }
          else if (fs.status === 'S-') { S.counts.sminus_arrivals = (S.counts.sminus_arrivals || 0) + 1; endTrial(S, rs, 'sminus_arrival_fade'); }
          else {
            S.counts.deaths++;
            log(S, 'death', { relation: statusNow(S).relation, status: statusNow(S).status });
            endTrial(S, rs, 'death');
            S.timeout = CONFIG.TIMEOUT_S; dim(S, rs, true); if (mv) mv.activate(false);
            S.bullets.forEach((B) => { B.o.deleteFromScene(rs); if (!B.passed) { S.counts.cleared_at_timeout++; log(S, 'shot_outcome', { click_id: B.clickId, outcome: 'cleared_at_timeout', status: B.status, relation: B.relation }); } });
            S.bullets = [];
            log(S, 'timeout_start');
          }
        }
      } else if (S.timeout <= 0) {
        if (S.pendingPhaseEnd) { const r = S.pendingPhaseEnd; S.pendingPhaseEnd = null; S.trial = null; endPhase(S, rs, r); if (S.ended) return; }
        S.iti -= dt;
        if (S.iti <= 0) startTrial(S, rs);
      }

      const sc = obj(rs, 'Score');
      if (sc) { setTxt(sc, 'Score  ' + S.score); const px0 = S.viewRight - 220 - 18; sc.setX(px0 + (220 - sc.getWidth()) / 2); sc.setY(S.viewTop + 14 + (56 - sc.getHeight()) / 2); }
    }

    return { init: init, update: update, CONFIG: CONFIG, COLUMNS: COLUMNS };
  })();
}
if (!runtimeScene.__PL) runtimeScene.__PL = gdjs.__PerspLab.init(runtimeScene);
gdjs.__PerspLab.update(runtimeScene, runtimeScene.__PL);

};
gdjs.ExperimentCode.eventsList0 = function(runtimeScene) {

{


gdjs.ExperimentCode.userFunc0xa0c460(runtimeScene);

}


};

gdjs.ExperimentCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.ExperimentCode.GDFloorObjects1.length = 0;
gdjs.ExperimentCode.GDDino_9595DouxObjects1.length = 0;
gdjs.ExperimentCode.GDGunObjects1.length = 0;
gdjs.ExperimentCode.GDMain_9595Ship_9595Auto_9595Cannon_9595BulletObjects1.length = 0;
gdjs.ExperimentCode.GDChi_9595Chi_9595the_9595BirdObjects1.length = 0;
gdjs.ExperimentCode.GDCenter_9595gameObjects1.length = 0;
gdjs.ExperimentCode.GDenemy_9595spawn_9595downObjects1.length = 0;
gdjs.ExperimentCode.GDScoreObjects1.length = 0;
gdjs.ExperimentCode.GDPixelHeartBarObjects1.length = 0;
gdjs.ExperimentCode.GDZombieObjects1.length = 0;
gdjs.ExperimentCode.GDScutum_9595ShieldObjects1.length = 0;
gdjs.ExperimentCode.GDWallObjects1.length = 0;
gdjs.ExperimentCode.GDTimerTextObjects1.length = 0;
gdjs.ExperimentCode.GDOverlayObjects1.length = 0;
gdjs.ExperimentCode.GDBurstObjects1.length = 0;
gdjs.ExperimentCode.GDFeedbackTextObjects1.length = 0;
gdjs.ExperimentCode.GDShadowObjects1.length = 0;
gdjs.ExperimentCode.GDVignetteObjects1.length = 0;
gdjs.ExperimentCode.GDHudPanelObjects1.length = 0;

gdjs.ExperimentCode.eventsList0(runtimeScene);
gdjs.ExperimentCode.GDFloorObjects1.length = 0;
gdjs.ExperimentCode.GDDino_9595DouxObjects1.length = 0;
gdjs.ExperimentCode.GDGunObjects1.length = 0;
gdjs.ExperimentCode.GDMain_9595Ship_9595Auto_9595Cannon_9595BulletObjects1.length = 0;
gdjs.ExperimentCode.GDChi_9595Chi_9595the_9595BirdObjects1.length = 0;
gdjs.ExperimentCode.GDCenter_9595gameObjects1.length = 0;
gdjs.ExperimentCode.GDenemy_9595spawn_9595downObjects1.length = 0;
gdjs.ExperimentCode.GDScoreObjects1.length = 0;
gdjs.ExperimentCode.GDPixelHeartBarObjects1.length = 0;
gdjs.ExperimentCode.GDZombieObjects1.length = 0;
gdjs.ExperimentCode.GDScutum_9595ShieldObjects1.length = 0;
gdjs.ExperimentCode.GDWallObjects1.length = 0;
gdjs.ExperimentCode.GDTimerTextObjects1.length = 0;
gdjs.ExperimentCode.GDOverlayObjects1.length = 0;
gdjs.ExperimentCode.GDBurstObjects1.length = 0;
gdjs.ExperimentCode.GDFeedbackTextObjects1.length = 0;
gdjs.ExperimentCode.GDShadowObjects1.length = 0;
gdjs.ExperimentCode.GDVignetteObjects1.length = 0;
gdjs.ExperimentCode.GDHudPanelObjects1.length = 0;


return;

}

gdjs['ExperimentCode'] = gdjs.ExperimentCode;
