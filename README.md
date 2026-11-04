# Collage Nanterre — tournée des panneaux d'affichage libre

Outil de préparation des tournées de collage à Nanterre : on sélectionne des panneaux
d'affichage libre sur une carte, un point de départ et un mode de déplacement, et l'outil
calcule la **boucle la plus courte** qui passe devant chacun et revient au départ.

## 👉 Ouvrir l'outil

**<https://armanakg.github.io/collage-nanterre/>**

Rien à installer, ça marche depuis un téléphone. Le bouton « Ma position » ne fonctionne
que sur cette adresse en `https`, pas sur un fichier ouvert en local.

## Ce qu'on peut faire

- Choisir les panneaux un par un, ou tout un quartier d'un clic.
- Départ au clic sur la carte, par adresse, ou par géolocalisation.
- Trois modes : **à pied**, **vélo**, **voiture** (les sens uniques sont respectés).
- Distance, durée de trajet et durée totale avec le temps de collage.
- Export **GPX** (montre GPS, OsmAnd, Komoot), **feuille de route** à imprimer, ouverture
  dans **Google Maps**.
- Onglet **Suivi** : la carte colorée selon le dernier passage (moins de 7 jours, 7 à 14,
  14 à 30, plus de 30 ou jamais), et un clic pour actualiser un panneau, un quartier ou
  toute une tournée : **collé**, **toujours collé** ou **recouvert** (en rouge, à refaire). Le suivi est
  partagé entre tous, sans compte ni nom, par un petit service Cloudflare (dossier `worker/`).

**110 emplacements, 124 panneaux**, sur 10 quartiers de Nanterre. 107 sont confirmés ; 2
viennent d'une carte tierce et 1 a une position approchée : ces 3 restent à vérifier sur
place. Les 7 emplacements introuvables ont été retirés de la carte et sont conservés dans le
champ `retires` de `panneaux.json`.

## Modifier les panneaux

Déplacer, ajouter ou supprimer un panneau demande un **mot de passe** et ne change les
données que dans **votre** navigateur : les autres ne voient rien.

Pour qu'une correction devienne officielle, il faut la publier dans ce dépôt :

1. faire les corrections dans l'outil ;
2. cliquer sur **⤓ Exporter panneaux.json** — le fichier se télécharge ;
3. remplacer `panneaux.json` du dépôt par celui qui vient d'être téléchargé ;
4. `git add panneaux.json && git commit -m "maj panneaux" && git push` ;
5. de retour dans l'outil, cliquer sur **↺** pour oublier les corrections locales
   (elles sont désormais dans le fichier publié).

Une minute après le `push`, tout le monde a la nouvelle version au rechargement de la page.
La date des données est affichée en haut du panneau.

## Publier / mettre à jour le site

Le site est une page statique servie par **GitHub Pages** depuis la branche `main`.

Première mise en ligne, une fois le dépôt créé sur GitHub :

```bash
git remote add origin https://github.com/ArmanAkg/collage-nanterre.git
git push -u origin main
```

Puis, sur github.com : **Settings → Pages → Source : Deploy from a branch →
Branch : `main` / `(root)` → Save**. L'adresse apparaît au bout d'une minute.

Ensuite, chaque `git push` met le site à jour automatiquement.

## Développer en local

```bash
python -m http.server 8777
```

puis <http://localhost:8777/outil-collage.html>. Ouvrir le fichier par double-clic ne
marche pas : le navigateur refuse de lire `panneaux.json` en `file://`.

## Documentation détaillée

[LISEZ-MOI.md](LISEZ-MOI.md) — mode d'emploi complet, provenance et fiabilité des données,
méthode de calcul de l'itinéraire, changement du mot de passe.

## Données et services

Fond de carte et données panneaux : **OpenStreetMap** (ODbL) · routage : **OSRM** hébergé
par **FOSSGIS** · géocodage : **Base Adresse Nationale**. Tous gratuits, sans clé d'API.
Usage raisonnable attendu : cet outil est prévu pour un usage militant local, pas pour une
diffusion de masse.
