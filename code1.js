gdjs.InstructionsCode = {};
gdjs.InstructionsCode.localVariables = [];
gdjs.InstructionsCode.idToCallbackMap = new Map();
gdjs.InstructionsCode.GDNewTiledSpriteObjects1= [];
gdjs.InstructionsCode.GDTitle_9595nameObjects1= [];
gdjs.InstructionsCode.GDSubtitleTextObjects1= [];
gdjs.InstructionsCode.GDParticipantInputObjects1= [];
gdjs.InstructionsCode.GDGreenButtonWithStoneFrameObjects1= [];


gdjs.InstructionsCode.userFunc0xa0c460 = function GDJSInlineCode(runtimeScene) {
"use strict";
// INSTRUCTIONS — (1) input device, (2) sound, (3) topography-only instructions. Answers are logged as covariates.
const ob = (n) => runtimeScene.getObjects(n)[0];
const set = (o, v) => o && (o.setText || o.setString).call(o, v);
const t = ob('Title_name'), s = ob('SubtitleText');
const inp = gdjs.evtTools.input, gv = runtimeScene.getGame().getVariables();
const W = runtimeScene.getGame().getGameResolutionWidth();
const key = (k) => inp.wasKeyReleased(runtimeScene, k);
if (!runtimeScene.__stage) runtimeScene.__stage = 'q1';
const st = runtimeScene.__stage;
const show = (title, body) => {
  if (runtimeScene.__shown === st) return;
  runtimeScene.__shown = st; set(t, title); set(s, body);
  if (s && s.setWrapping) { s.setWrapping(true); s.setWrappingWidth(900); }
};
if (st === 'q1') {
  show('Before we start', 'What are you using to aim?\n\nPress  M  if you are using a mouse.\n\nPress  T  if you are using a trackpad.');
  if (key('m') || key('t')) { gv.get('InputDevice').setString(key('m') ? 'mouse' : 'trackpad'); runtimeScene.__stage = 'q2'; }
} else if (st === 'q2') {
  show('Before we start', 'Is your sound on?\n\nPress  Y  for yes.\n\nPress  N  for no.');
  if (key('y') || key('n')) { gv.get('SoundOn').setString(key('y') ? 'yes' : 'no'); runtimeScene.__stage = 'go'; }
} else {
  const recs = [];
  if (gv.get('InputDevice').getAsString() === 'trackpad') recs.push('A mouse is recommended if you have one.');
  if (gv.get('SoundOn').getAsString() === 'no') recs.push('Please turn your sound on if you can.');
  show('How to play', 'Use the arrow keys to move.\n\nAim with the mouse and click to shoot.\n\nEarn as many points as you can.' +
    (recs.length ? '\n\n' + recs.join('\n') : '') + '\n\n\nPress SPACE to begin.');
  if (key('Space')) gdjs.evtTools.runtimeScene.replaceScene(runtimeScene, 'Experiment', false);
}
[t, s].forEach((o) => { if (o) o.setX((W - o.getWidth()) / 2); });
if (t) t.setY(70); if (s) s.setY(190);

};
gdjs.InstructionsCode.eventsList0 = function(runtimeScene) {

{


gdjs.InstructionsCode.userFunc0xa0c460(runtimeScene);

}


};

gdjs.InstructionsCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.InstructionsCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.InstructionsCode.GDTitle_9595nameObjects1.length = 0;
gdjs.InstructionsCode.GDSubtitleTextObjects1.length = 0;
gdjs.InstructionsCode.GDParticipantInputObjects1.length = 0;
gdjs.InstructionsCode.GDGreenButtonWithStoneFrameObjects1.length = 0;

gdjs.InstructionsCode.eventsList0(runtimeScene);
gdjs.InstructionsCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.InstructionsCode.GDTitle_9595nameObjects1.length = 0;
gdjs.InstructionsCode.GDSubtitleTextObjects1.length = 0;
gdjs.InstructionsCode.GDParticipantInputObjects1.length = 0;
gdjs.InstructionsCode.GDGreenButtonWithStoneFrameObjects1.length = 0;


return;

}

gdjs['InstructionsCode'] = gdjs.InstructionsCode;
