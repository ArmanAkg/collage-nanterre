# Outil de tournée de collage — Nanterre

Sélectionner des panneaux d'affichage libre sur une carte, choisir un point de départ
et un mode de déplacement, et obtenir la **boucle optimale** qui passe devant chaque
panneau sélectionné et revient au départ.

## Lancer l'outil

En ligne : l'adresse GitHub Pages du dépôt (voir [README.md](README.md)). C'est la façon
normale de s'en servir — et la seule où « Ma position » fonctionne, la géolocalisation
exigeant `https`.

En local, pour développer :

```bash
python -m http.server 8777
```

puis <http://localhost:8777/outil-collage.html>. Le double-clic sur le fichier ne marche
pas : le navigateur bloque la lecture de `panneaux.json` en `file://`.

## Fichiers

| Fichier | Rôle |
|---|---|
| `outil-collage.html` | l'outil (page unique, aucune installation) |
| `panneaux.json` | les 124 emplacements : n°, adresse, quartier, coordonnées, lien OSM |
| `carte-panneaux.jpg` | la carte d'origine, calée géographiquement (calque optionnel) |
| `690d4825-….jfif` | l'image source d'origine |
| `panneaux_suppélementaires.txt` | la liste d'adresses d'origine |
| `index.html` | redirection vers l'outil, pour l'adresse racine du site |
| `README.md` | présentation du dépôt et procédure de publication |

## Utilisation

1. **Point de départ** — clic sur la carte, saisie d'une adresse, ou géolocalisation.
   Le marqueur « D » est déplaçable. Sans départ, le 1er panneau sert de départ/arrivée.
2. **Mode** — à pied / vélo / voiture. Le temps de collage par panneau (4 min par défaut)
   s'ajoute au temps de trajet.
3. **Panneaux** — clic sur un point de la carte ou sur une ligne de la liste pour le
   sélectionner. `tout / rien` sélectionne un quartier entier ; le champ de filtre accepte
   un numéro, un nom de rue ou un quartier. Les boutons `Carte` / `Liste` / `OSM seul`
   masquent ou affichent une source (le filtre s'applique aussi à `Tout` et `tout / rien`).
4. **Gestion des panneaux** — tous les outils d'édition sont regroupés dans le volet
   `⚙ Gestion des panneaux — réservé`, **replié par défaut** : filtres par source, mot de
   passe, verrou des positions, ajout, export/import, calque de la carte d'origine. Les
   boutons `✥` et `🗑` des lignes n'apparaissent qu'une fois le mot de passe saisi. Pour
   qui vient juste préparer une tournée, l'outil se limite donc à : départ, mode,
   sélection, calcul.

   **Mot de passe livré : `collage`.** Il est demandé à la première action de modification,
   puis retenu jusqu'à la fermeture de l'onglet ; `🔓 Modifications déverrouillées`
   reverrouille immédiatement. Voir « Changer le mot de passe » plus bas.
5. **Ajouter un panneau** — bouton « Ajouter un panneau » puis clic sur la carte, ou
   saisie d'une adresse. L'adresse est retrouvée automatiquement. Les panneaux ajoutés
   portent un numéro `P1`, `P2`…
6. **Corriger la position d'un panneau** — les positions sont **verrouillées par défaut**.
   Deux façons de déplacer un point, au choix :
   - `🔒 Positions verrouillées` → le bouton passe en orange, les points deviennent
     glissables sur la carte ;
   - bouton `✥` sur la ligne du panneau → l'outil zoome dessus et attend un clic sur la
     carte à la bonne position.

   Dans les deux cas une **confirmation apparaît dans le panneau** (pas de fenêtre du
   navigateur) en indiquant la distance : `Garder la nouvelle position` ou `Annuler`.
   Un point déplacé porte l'étiquette *déplacé*, son marqueur passe en pointillés, et le
   bouton `↺` le remet à sa position d'origine. Pensez à re-verrouiller ensuite.
7. **Supprimer un panneau** — bouton `🗑` sur la ligne, avec confirmation. Un panneau
   issu des données de base est masqué et récupérable : une ligne
   *« N panneau(x) supprimé(s) — tout restaurer »* apparaît en bas de la liste. Un panneau
   que vous avez ajouté vous-même est supprimé définitivement.
8. **Calculer** — trace la boucle, numérote les arrêts dans l'ordre, et affiche
   distance / durée / durée avec collage, puis le détail arrêt par arrêt.
9. **Exports** — GPX (montre GPS, OsmAnd, Komoot…), feuille de route texte à imprimer,
   ouverture dans Google Maps (limité à 10 étapes par Google).

Sélection, panneaux ajoutés, positions corrigées, suppressions, filtres, mode et départ sont
mémorisés dans le navigateur.

## D'où viennent les données

**123 emplacements, 138 panneaux physiques**, sur les 11 quartiers de Nanterre.

Trois sources, filtrables dans l'outil avec les boutons `Carte` / `Liste` / `OSM seul` :

- **`Carte` — 73 emplacements** extraits de la carte d'origine : détection des pastilles
  de couleur, puis calage de l'image sur le réseau routier OpenStreetMap
  (≈ 1,8 m/pixel). Les numéros 1–73 de la carte sont conservés.
  - `17` et `18` sont les deux repères triangulaires de la carte.
  - `58` était superposé à `57` : les deux ont été fusionnés en un emplacement à 2 panneaux.
  - `R` est la pastille rouge sans numéro, au nord de la carte.
- **`Liste` — 7 emplacements** (n° 74 à 80) issus de `panneaux_suppélementaires.txt`,
  géocodés via la Base Adresse Nationale.
- **`OSM seul` — 43 emplacements** (n° 82 et suivants) présents dans OpenStreetMap mais
  **absents de la carte d'origine**, dont **11 dans le quartier du Petit-Nanterre**, jamais
  traité jusqu'ici. Étiquetés `hors carte` dans la liste.

**Recalage sur OpenStreetMap** — OSM référence des nœuds `board_type=notice` nommés
« Affichage Libre », relevés sur le terrain. Chaque point de la carte situé à **70 m ou
moins** de l'un d'eux a été replacé exactement dessus (37 points, déplacement moyen 23 m).
Les emplacements ainsi calés portent l'étiquette `OSM` et sont fiables au mètre ; les
autres gardent la position déduite de la carte, à vérifier sur le terrain.

**Emplacements groupés** — certains points OSM sont distants de 2 à 5 m : ce sont des
batteries de plusieurs panneaux au même endroit. Ils sont fusionnés en un seul arrêt
portant l'étiquette `×2`, `×3` ou `×4`, pour ne pas produire quatre arrêts identiques dans
la tournée. Le total « panneaux » de l'en-tête compte les panneaux physiques.

**Positions fournies à la main** : `78` — 5 rue de l'Union · `79` — 5 rue du Bois Joly.

**93 bd du Général Leclerc** (angle rue des Acacias) est au même endroit que le n° 6 de la
carte : les deux sont fusionnés dans l'emplacement **n° 6**, qui compte donc `×2` panneaux.

Les **adresses** servent de nom de panneau ; pour les points non calés sur OSM c'est un
géocodage inverse (adresse la plus proche) : un repère, pas la position officielle du
panneau. Un suffixe `(1)`, `(2)` distingue deux emplacements distincts partageant la même
adresse la plus proche.

Les **quartiers** sont les 11 quartiers officiels de Nanterre (limites administratives
OSM, `admin_level=10`). La pastille de couleur à côté des adresses issues de la carte
rappelle la couleur du panneau sur la carte d'origine.

Le calque « Carte d'origine » permet de vérifier chaque point contre la carte de départ.

## Sur téléphone

L'outil est prévu pour être utilisé sur le terrain, téléphone en main :

- la **carte occupe tout l'écran**, le panneau devient une **feuille coulissante** en bas,
  repliée par défaut ; on l'ouvre d'un appui sur la barre ;
- cette barre reste toujours visible et affiche le résumé — nombre d'emplacements et de
  panneaux sélectionnés, puis distance et durée une fois l'itinéraire calculé — avec un
  bouton **Calculer** directement accessible ;
- après le calcul, la feuille se replie automatiquement pour laisser voir le tracé, cadré
  au-dessus de la barre ;
- le réglage départ + mode est lui aussi replié en une ligne de résumé
  (`Hôtel de ville · à vélo`), pour laisser la place à la liste ;
- cibles tactiles agrandies, champs en 16 px pour éviter le zoom automatique d'iOS,
  hauteur en `dvh` pour ne pas être coupé par la barre d'adresse.

Ajouter l'adresse à l'écran d'accueil du téléphone donne un accès en un geste.

## Mode vérification

`⚙ Gestion des panneaux → 🔍 Vérifier les panneaux` ouvre une file de contrôle : un
emplacement à l'écran, la carte centrée dessus avec un cercle rouge, une photo de rue, et
les décisions à portée de clic.

**L'ordre est calculé, pas alphabétique.** Passent en premier les emplacements les plus
douteux : ceux **sans nœud OpenStreetMap** (position déduite de la carte, à 10–50 m près),
puis ceux dont le relevé OSM est **sans date**, puis **2018 ou avant**, puis 2019-2022, et
enfin les relevés récents. L'en-tête indique la position dans la file et le nombre restant
à statuer.

**Les photos viennent de [Panoramax](https://panoramax.fr)**, la plateforme d'imagerie de
rue ouverte (IGN / OpenStreetMap France), licence CC-BY-SA. L'outil cherche les prises de
vue dans un rayon de 90 m, calcule pour chacune si le panneau tombe **dans le champ de la
caméra** (azimut de prise de vue contre azimut vers le panneau, comparés à l'angle de
champ), et affiche d'abord celles qui le voient, puis les plus proches. Le bandeau donne
la distance, la date, l'auteur et la licence ; `↻ Autre photo` fait défiler les autres
prises de vue, et un clic sur l'image ouvre le visualiseur Panoramax.

Couverture réelle sur Nanterre, mesurée sur les 8 177 photos disponibles :
**46 emplacements sur 123 ont une photo à moins de 90 m** (médiane 19 m), dont 40 datant
de 2025 ou 2026. Pour les **77 autres**, le bouton `🗺 Street View` ouvre Google Maps à la
bonne position dans un nouvel onglet.

Quatre décisions, toutes enregistrées avec la date :

| Action | Effet |
|---|---|
| `✅ Confirmé` | marque l'emplacement vérifié, passe au suivant |
| `❓ Introuvable` | marque l'emplacement douteux (il reste dans la liste, grisé sur la carte) |
| `✥ Repositionner` | attend un clic sur la carte, avec confirmation de la distance |
| `🗑 Supprimer` | retire l'emplacement, comme depuis la liste |

Le statut apparaît ensuite comme étiquette `✓ vérifié` ou `? introuvable` dans la liste, et
sur la carte par un liseré vert ou un point estompé. Il part dans `panneaux.json` à
l'export, donc **le travail de vérification se publie comme le reste** et profite à tout le
monde.

> **Pourquoi pas une détection automatique ?** Les conditions d'utilisation de Google Maps
> interdisent de passer leur imagerie dans un modèle d'IA et d'en faire du téléchargement
> de masse. Sur l'imagerie ouverte, où c'est permis, la couverture est partielle et
> distinguer un panneau d'affichage libre d'un abribus publicitaire ou d'un panneau
> municipal depuis une photo de rue produit trop d'erreurs pour éviter la revérification.
> L'outil automatise donc la logistique — ordre, cadrage, photo, suivi — et laisse le
> jugement à l'œil humain. Compter environ 10 secondes par emplacement.

## Publier ses corrections

Les modifications faites dans l'outil (déplacements, ajouts, suppressions) restent dans le
`localStorage` du navigateur : personne d'autre ne les voit. Pour les rendre officielles :

1. **⤓ Exporter panneaux.json** télécharge le fichier de données à jour — les positions
   corrigées y deviennent les positions de référence, les panneaux supprimés en sont
   retirés, les panneaux ajoutés y figurent avec leur quartier (calculé à partir des
   limites administratives embarquées dans le fichier) ;
2. remplacer `panneaux.json` du dépôt par ce fichier, puis `git commit` et `git push` ;
3. **↺** oublie ensuite les corrections locales du navigateur, désormais inutiles.

**⤒ Importer** recharge un `panneaux.json` sans passer par le dépôt : pratique pour
vérifier un export avant de le publier, ou pour intégrer le fichier d'un camarade.

Le fichier exporté est écrit **un emplacement par ligne**, pour que `git diff` montre
exactement ce qui a changé. Il porte une date (`maj`) et un numéro de `version`, tous deux
affichés en haut du panneau, ce qui permet de vérifier d'un coup d'œil que chacun travaille
sur la même version.

## Changer le mot de passe

Le fichier ne contient pas le mot de passe, seulement son empreinte SHA-256. Pour le
changer :

1. ouvrir l'outil, puis la console du navigateur (F12 → onglet *Console*) ;
2. taper `empreinte('votre-nouveau-mot-de-passe')` et copier la ligne affichée ;
3. dans `outil-collage.html`, remplacer la valeur de `PWD_HASH` (vers le début du
   `<script>`) par cette empreinte.

⚠️ **Ce mot de passe est un garde-fou, pas une sécurité.** L'outil est une page qui tourne
entièrement dans le navigateur : quelqu'un de motivé peut contourner la protection en
lisant le code source de la page. Le but est d'éviter les modifications par inadvertance
et de réserver l'édition à qui connaît le mot de passe — pas de protéger contre une
personne malveillante. Les modifications restent de toute façon locales au navigateur
(rien n'est envoyé nulle part) : la référence partagée reste `panneaux.json`.

## Comment l'itinéraire est calculé

1. Matrice des temps réels entre tous les points (service `table` d'OSRM, profil piéton /
   vélo / voiture — le profil voiture respecte les sens uniques).
2. Tournée initiale par plus proche voisin, puis amélioration **2-opt + Or-opt** sous
   budget de temps : c'est un problème du voyageur de commerce, la solution est très bonne
   mais pas prouvée optimale au-delà d'une dizaine de points.
3. Tracé réel de la boucle (service `route`), découpé par tronçons de 40 points.

Limite : **95 points maximum** (départ compris), imposée par le serveur de routage public.

## Services externes utilisés

Fonds de carte OpenStreetMap, routage OSRM hébergé par FOSSGIS
(`routing.openstreetmap.de`), géocodage Base Adresse Nationale (`api-adresse.data.gouv.fr`).
Tous gratuits et sans clé d'API — une connexion internet est nécessaire.
