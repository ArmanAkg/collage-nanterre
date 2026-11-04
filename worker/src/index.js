// Suivi des passages sur les panneaux : un historique partagé, sans nom ni compte.
//   GET    /passages       tout l'historique
//   POST   /passages       {t, d, b, ids} : un lot de passages
//   DELETE /passages/<b>   annule un lot

const TYPES = new Set(['colle', 'ok', 'recouvert']);
const MAX_PAR_LOT = 200;
const ORIGINES = /^(https:\/\/armanakg\.github\.io|http:\/\/localhost(:\d+)?)$/;

function entetes(req) {
  const o = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ORIGINES.test(o) ? o : 'https://armanakg.github.io',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}
function json(req, corps, statut = 200) {
  return new Response(JSON.stringify(corps), {
    status: statut,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...entetes(req) },
  });
}

// Le navigateur peut avoir un jour d'avance sur le serveur selon le fuseau : un jour de marge.
function dateValide(d) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || isNaN(Date.parse(d))) return false;
  return Date.parse(d) <= Date.now() + 864e5;
}
function lotValide({ t, d, b, ids }) {
  return TYPES.has(t) && typeof d === 'string' && dateValide(d) &&
    typeof b === 'string' && /^[a-z0-9]{1,24}$/.test(b) &&
    Array.isArray(ids) && ids.length > 0 && ids.length <= MAX_PAR_LOT &&
    ids.every(id => typeof id === 'string' && id.length > 0 && id.length <= 12);
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: entetes(req) });
    const chemin = new URL(req.url).pathname.split('/').filter(Boolean);
    if (chemin[0] !== 'passages' || chemin.length > 2) return json(req, { erreur: 'introuvable' }, 404);

    if (req.method === 'GET' && chemin.length === 1) {
      const { results } = await env.DB.prepare('SELECT p,t,d,b FROM passages ORDER BY id').all();
      return json(req, results);
    }
    if (req.method === 'POST' && chemin.length === 1) {
      let lot;
      try { lot = await req.json(); } catch { return json(req, { erreur: 'json' }, 400); }
      if (!lot || !lotValide(lot)) return json(req, { erreur: 'lot invalide' }, 400);
      // Renvoyer un lot déjà reçu (réseau coupé juste après l'envoi) ne le double pas.
      const deja = await env.DB.prepare('SELECT 1 FROM passages WHERE b=? LIMIT 1').bind(lot.b).first();
      if (!deja) {
        const ins = env.DB.prepare('INSERT INTO passages (p,t,d,b) VALUES (?,?,?,?)');
        await env.DB.batch(lot.ids.map(id => ins.bind(id, lot.t, lot.d, lot.b)));
      }
      return json(req, { ok: true });
    }
    if (req.method === 'DELETE' && chemin.length === 2) {
      await env.DB.prepare('DELETE FROM passages WHERE b=?').bind(chemin[1]).run();
      return json(req, { ok: true });
    }
    return json(req, { erreur: 'méthode' }, 405);
  },
};
