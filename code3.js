gdjs.Game_32overCode = {};
gdjs.Game_32overCode.localVariables = [];
gdjs.Game_32overCode.idToCallbackMap = new Map();
gdjs.Game_32overCode.GDNewTiledSpriteObjects1= [];
gdjs.Game_32overCode.GDNewTiledSprite2Objects1= [];
gdjs.Game_32overCode.GDEndTextObjects1= [];


gdjs.Game_32overCode.userFunc0xa0c460 = function GDJSInlineCode(runtimeScene) {
"use strict";
// GAME OVER — thank-you message with upload status; quits once data are sent (max 20 s wait). Ctrl+Shift+D downloads the CSV log.
if (runtimeScene.__go === undefined) runtimeScene.__go = 0;
runtimeScene.__go += runtimeScene.getElapsedTime() / 1000;
const W = runtimeScene.getGame().getGameResolutionWidth(), H = runtimeScene.getGame().getGameResolutionHeight();
const t = runtimeScene.getObjects('EndText')[0];
const set = (o, v) => o && (o.setText || o.setString).call(o, v);
// keep retrying uploads every 3 s while anything is pending
if (gdjs.__PL_flush && (gdjs.__PL_pending || 0) > 0 && runtimeScene.__go - (runtimeScene.__lastFlush || 0) > 3) { runtimeScene.__lastFlush = runtimeScene.__go; gdjs.__PL_flush(); }
const pending = gdjs.__PL_pending || 0;
const localOnly = (gdjs.__PL_uploadLog || []).some((u) => u.how === 'no_endpoint_configured');
let msg = 'Thank you!\n\nSaving your data…\nPlease keep this window open.';
const redirect = gdjs.__PL_redirect || '';
if (pending === 0) msg = localOnly ? 'Thank you!\n\nYour data were saved on this computer.\nPlease let the researcher know.'
  : (redirect ? 'Thank you!\n\nYour data have been saved.\nTaking you to the final questionnaire…' : 'Thank you!\n\nYour data have been saved.\nYou may now close this window.');
else if (runtimeScene.__go > 60) msg = 'Thank you!\n\nWe could not reach the server yet.\nPlease keep this window open and tell the researcher.';
if (runtimeScene.__goMsg !== msg) { set(t, msg); runtimeScene.__goMsg = msg; if (pending === 0 && runtimeScene.__doneAt === undefined) runtimeScene.__doneAt = runtimeScene.__go; }
if (t) { t.setX((W - t.getWidth()) / 2); t.setY((H - t.getHeight()) / 2); }
const inp = gdjs.evtTools.input;
if ((inp.isKeyPressed(runtimeScene, 'LControl') || inp.isKeyPressed(runtimeScene, 'RControl')) &&
    (inp.isKeyPressed(runtimeScene, 'LShift') || inp.isKeyPressed(runtimeScene, 'RShift')) && inp.wasKeyReleased(runtimeScene, 'd')) {
  let s = gdjs.__PL_lastSession;
  if (!s) { try { const ks = Object.keys(localStorage).filter((k) => k.indexOf('PerspectiveLab_S') === 0).sort(); if (ks.length) s = JSON.parse(localStorage.getItem(ks[ks.length - 1])); } catch (e) { } }
  if (s && s.events && s.events.length) {
    const cols = s.columns || Object.keys(s.events[0]);
    const esc = (v) => { v = v === null || v === undefined ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    const csv = [cols.join(',')].concat(s.events.map((e) => cols.map((c) => esc(e[c])).join(','))).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'PerspectiveLab_' + (s.meta ? s.meta.participant_id + '_' + s.meta.session_id : 'session') + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
    runtimeScene.__doneAt = runtimeScene.__go + 60; runtimeScene.__csv = true;   // give the RA time
  }
}
// quit only after everything is sent (or saved locally), 6 s after the final message
if (runtimeScene.__doneAt !== undefined && pending === 0 && !localOnly && redirect && runtimeScene.__go > runtimeScene.__doneAt + 3 && !runtimeScene.__redirected) {
  runtimeScene.__redirected = true; try { window.location.href = redirect; } catch (e) { }
} else if (runtimeScene.__doneAt !== undefined && pending === 0 && !redirect && runtimeScene.__go > runtimeScene.__doneAt + 6) gdjs.evtTools.runtimeScene.stopGame(runtimeScene);

};
gdjs.Game_32overCode.eventsList0 = function(runtimeScene) {

{


gdjs.Game_32overCode.userFunc0xa0c460(runtimeScene);

}


};

gdjs.Game_32overCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.Game_32overCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.Game_32overCode.GDNewTiledSprite2Objects1.length = 0;
gdjs.Game_32overCode.GDEndTextObjects1.length = 0;

gdjs.Game_32overCode.eventsList0(runtimeScene);
gdjs.Game_32overCode.GDNewTiledSpriteObjects1.length = 0;
gdjs.Game_32overCode.GDNewTiledSprite2Objects1.length = 0;
gdjs.Game_32overCode.GDEndTextObjects1.length = 0;


return;

}

gdjs['Game_32overCode'] = gdjs.Game_32overCode;
