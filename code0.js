gdjs.StartCode = {};
gdjs.StartCode.localVariables = [];
gdjs.StartCode.idToCallbackMap = new Map();
gdjs.StartCode.GDNewTiledSpriteObjects1= [];
gdjs.StartCode.GDTitle_9595nameObjects1= [];
gdjs.StartCode.GDSubtitleTextObjects1= [];
gdjs.StartCode.GDParticipantInputObjects1= [];
gdjs.StartCode.GDGreenButtonWithStoneFrameObjects1= [];
gdjs.StartCode.GDStartButtonObjects1= [];
gdjs.StartCode.GDButtonLabelObjects1= [];
gdjs.StartCode.GDErrorTextObjects1= [];


gdjs.StartCode.userFunc0xa0c460 = function GDJSInlineCode(runtimeScene) {
"use strict";
// START — no title; Participant ID field + own Start button (click or Enter). Validates ID, creates session ID.
const W = runtimeScene.getGame().getGameResolutionWidth();
if (!runtimeScene.__url) {
  runtimeScene.__url = true;
  try {
    const q = new URLSearchParams(window.location.search);
    const pidU = (q.get('pid') || q.get('participant') || q.get('PROLIFIC_PID') || '').trim();
    // Hosted study (GitHub Pages) or ?auto=1: no ID screen; the game generates the participant code itself.
    // In GDevelop previews the ID screen is shown and no redirect to QuestionPro happens.
    const hosted = /github\.io$/i.test(window.location.hostname) || q.get('auto') === '1';
    gdjs.__PL_hosted = hosted;
    let pid = '', src = '';
    if (/^[A-Za-z0-9_-]{1,40}$/.test(pidU)) { pid = pidU; src = 'url'; }
    else if (hosted) {
      const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; let r = '';
      const buf = (window.crypto && window.crypto.getRandomValues) ? window.crypto.getRandomValues(new Uint32Array(8)) : Array.from({ length: 8 }, () => Math.floor(Math.random() * 1e9));
      for (let i = 0; i < 8; i++) r += abc[buf[i] % abc.length];
      pid = 'P' + r; src = 'auto';
    }
    if (pid) {
      const gv0 = runtimeScene.getGame().getVariables();
      gv0.get('ParticipantID').setString(pid);
      gv0.get('SessionID').setString('S' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
      gv0.get('PidSource').setString(src);
      gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, 'Instructions', false);
    }
  } catch (e) { }
}
const ob = (n) => runtimeScene.getObjects(n)[0];
const set = (o, v) => o && (o.setText || o.setString).call(o, v);
const lbl = ob('SubtitleText'), inp = ob('ParticipantInput'), btn = ob('StartButton'), btnL = ob('ButtonLabel'), err = ob('ErrorText');
if (!runtimeScene.__st) {
  runtimeScene.__st = true;
  set(lbl, 'Participant ID'); set(btnL, 'Start'); set(err, '');
  if (inp) { inp.setWidth(420); inp.setHeight(56); inp.setX((W - 420) / 2); inp.setY(300); }
  if (btn) { btn.setX((W - btn.getWidth()) / 2); btn.setY(390); }
}
if (lbl) { lbl.setX((W - lbl.getWidth()) / 2); lbl.setY(255); }
if (btnL && btn) { btnL.setX(btn.getX() + (btn.getWidth() - btnL.getWidth()) / 2); btnL.setY(btn.getY() + (58 - btnL.getHeight()) / 2 + (btn.getAnimationName && btn.getAnimationName() === 'pressed' ? 4 : 0)); }
if (err) { err.setX((W - err.getWidth()) / 2); err.setY(480); }
const inputT = gdjs.evtTools.input;
const mx = inputT.getCursorX(runtimeScene, '', 0), my = inputT.getCursorY(runtimeScene, '', 0);
const over = btn && mx >= btn.getX() && mx <= btn.getX() + btn.getWidth() && my >= btn.getY() && my <= btn.getY() + btn.getHeight();
if (btn && btn.setAnimationName) btn.setAnimationName(over ? (inputT.isMouseButtonPressed(runtimeScene, 'Left') ? 'pressed' : 'hover') : 'idle');
const submit = (over && inputT.isMouseButtonReleased(runtimeScene, 'Left')) || inputT.wasKeyReleased(runtimeScene, 'Return');
if (submit) {
  const id = ((inp && inp.getString) ? inp.getString() : '').trim();
  if (!/^[A-Za-z0-9_-]{1,40}$/.test(id)) {
    set(err, 'Please enter a valid ID (letters, numbers, - or _)');
  } else {
    const gv = runtimeScene.getGame().getVariables();
    gv.get('ParticipantID').setString(id);
    gv.get('SessionID').setString('S' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
    gv.get('PidSource').setString('typed');
    gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, 'Instructions', false);
  }
}

};
gdjs.StartCode.eventsList0 = function(runtimeScene) {

{


gdjs.StartCode.userFunc0xa0c460(runtimeScene);

}


};

gdjs.StartCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.StartCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.StartCode.GDTitle_9595nameObjects1.length = 0;
gdjs.StartCode.GDSubtitleTextObjects1.length = 0;
gdjs.StartCode.GDParticipantInputObjects1.length = 0;
gdjs.StartCode.GDGreenButtonWithStoneFrameObjects1.length = 0;
gdjs.StartCode.GDStartButtonObjects1.length = 0;
gdjs.StartCode.GDButtonLabelObjects1.length = 0;
gdjs.StartCode.GDErrorTextObjects1.length = 0;

gdjs.StartCode.eventsList0(runtimeScene);
gdjs.StartCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.StartCode.GDTitle_9595nameObjects1.length = 0;
gdjs.StartCode.GDSubtitleTextObjects1.length = 0;
gdjs.StartCode.GDParticipantInputObjects1.length = 0;
gdjs.StartCode.GDGreenButtonWithStoneFrameObjects1.length = 0;
gdjs.StartCode.GDStartButtonObjects1.length = 0;
gdjs.StartCode.GDButtonLabelObjects1.length = 0;
gdjs.StartCode.GDErrorTextObjects1.length = 0;


return;

}

gdjs['StartCode'] = gdjs.StartCode;
