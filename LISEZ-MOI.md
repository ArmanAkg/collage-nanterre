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
| `panneaux.json` | les 114 emplacements : n°, adresse, quartier, coordonnées, lien OSM, statut |
| `zones.json` | contours des 6 boucles des groupes Telegram et de la ville, copiés de l'outil Tractage ; tracés en pointillés sur la carte |
| `carte-panneaux.jpg` | la carte d'origine, calée géographiquement (archive, l'outil ne l'affiche plus) |
| `690d4825-….jfif` | l'image source d'origine |
| `panneaux_suppélementaires.txt` | la liste d'adresses d'origine |
| `img/logo.png` | logo du pôle collage, repris des visuels Telegram (`visus/logos_telegram/bandeau`), réduit à 128 px ; `img/icone-180.png`, le même sur fond blanc, sert d'icône sur l'écran d'accueil du téléphone |
| `index.html` | redirection vers l'outil, pour l'adresse racine du site |
| `README.md` | présentation du dépôt et procédure de publication |

## Utilisation

1. **Point de départ** — clic sur la carte, saisie d'une adresse, ou géolocalisation.
   Le marqueur « D » est déplaçable. Sans départ, le 1er panneau sert de départ/arrivée.
2. **Mode** — à pied / vélo / voiture. Le temps de collage par panneau (4 min par défaut)
   s'ajoute au temps de trajet.

   La case **« Revenir au point de départ »**, cochée par défaut, choisit entre une
   **boucle** et un **aller simple** qui s'arrête au dernier panneau. L'aller simple est
   souvent nettement plus court en voiture : l'optimisation place alors en fin de tournée
   le panneau le plus coûteux à quitter, au lieu de payer l'aller *et* le retour.
3. **Panneaux** — clic sur un point de la carte ou sur une ligne de la liste pour le
   sélectionner. `tout / rien` sélectionne un quartier entier ; le champ de filtre accepte
   un numéro, un nom de rue ou un quartier.
4. **Calculer** — trace la boucle, numérote les arrêts dans l'ordre, et affiche
   distance / durée / durée avec collage, puis le détail arrêt par arrêt.
5. **Exports** — **feuille de route** à imprimer
   (s'ouvre dans un nouvel onglet ; son bouton « Imprimer » donne aussi un PDF ; une case
   à cocher par emplacement pour suivre la tournée sur papier), ouverture dans Google Maps
   (limité à 10 étapes par Google).

6. **Onglet Suivi** (lien direct : `…/outil-collage.html#suivi`) — les panneaux prennent
    la couleur de leur dernier passage : moins de 7 jours, 7 à 14, 14 à 30, plus de 30 ou
    jamais. Le bouton `✓` d'une ligne marque d'un clic « affiché LFI ». Pour plusieurs
    panneaux : les choisir sur la carte ou dans la liste (`tout / rien` pour un quartier,
    `Tout` pour tout ce que le filtre affiche), puis **Affiché LFI** (collé ou toujours en
    place), **Déchiré** ou **Recouvert**. Un panneau recouvert passe en rouge, un panneau
    déchiré en orange, quelle que soit la date ; tous deux remontent en tête de leur quartier
    jusqu'au prochain passage. Les anciens « toujours collé » s'affichent comme « affiché LFI ». Une actualisation
    refusée par le service (par exemple si la page est plus récente que lui) est signalée sous
    les boutons au lieu d'être perdue en silence. La date est celle du jour, modifiable vers le passé ; une date ancienne ne
    remplace pas un passage plus récent. **Annuler** retire la dernière actualisation.
    Après un calcul, `✓ Marquer cette tournée dans le suivi` sélectionne ses panneaux.

    Le suivi est **partagé et ouvert à tous** : aucun compte, aucun code, aucun nom enregistré
    (panneau, type, date, numéro de lot). L'affichage se rafraîchit chaque minute. Sans réseau,
    les actualisations attendent dans le navigateur et partent au retour de la connexion ; un
    message « Hors ligne » le signale. Certains réseaux d'entreprise bloquent `workers.dev` :
    l'outil y reste en « Hors ligne ».

    Le service est dans `worker/` (Cloudflare Workers et base D1, offre gratuite), à l'adresse
    `https://collage-suivi.collage-nanterre.workers.dev/passages`. Pour le redéployer :
    `cd worker`, puis `npx wrangler@4 deploy`. Ouverte en `localhost`, la page parle au
    service local (port 8787) et jamais au vrai. Pour le tester sans réseau : `npx wrangler@4 d1
    execute collage-suivi --local --file=schema.sql`, puis `npx wrangler@4 dev --port 8787`.

Sélection, mode et départ sont mémorisés dans le navigateur.

Les panneaux ne se modifient plus depuis la page : ajouts, déplacements et retraits se font
dans `panneaux.json`, puis `git commit` et `git push`. L'ancien volet d'édition reste dans
l'historique git (`git show cf30235:outil-collage.html`).

## D'où viennent les données

**114 emplacements, 128 panneaux physiques**, sur 10 quartiers de Nanterre.

Ces chiffres sont ceux qui restent **après la campagne de vérification** de septembre 2026 :
20 emplacements ont été supprimés, 1 repositionné, et les 103 restants portent tous un
statut daté — 94 confirmés, 9 marqués introuvables. Les 7 emplacements encore introuvables
ont été retirés de la carte et du suivi le 4 novembre 2026 : voir « Emplacements retirés »
plus bas ; le `19` a depuis été retrouvé. Les décomptes par source ci-dessous décrivent l'origine des données avant
vérification.

Cinq sources :

- **`Carte` — 68 emplacements restants** extraits de la carte d'origine : détection des pastilles
  de couleur, puis calage de l'image sur le réseau routier OpenStreetMap
  (≈ 1,8 m/pixel). Les numéros 1–73 de la carte sont conservés.
  - `17` et `18` sont les deux repères triangulaires de la carte.
  - `58` était superposé à `57` : les deux ont été fusionnés en un emplacement à 2 panneaux.
  - `R` est la pastille rouge sans numéro, au nord de la carte.
- **`Liste` — 7 emplacements restants** (n° 74 à 80) issus de `panneaux_suppélementaires.txt`,
  géocodés via la Base Adresse Nationale.
- **`OSM seul` — 28 emplacements restants** (n° 82 et suivants) présents dans OpenStreetMap mais
  **absents de la carte d'origine**, dont **11 dans le quartier du Petit-Nanterre**, jamais
  traité jusqu'ici.
- **`Framacarte` — 2 emplacements** (n° 124 et 125) : `8 Rue Jacques Decour` et
  `56 Rue Abdelmalek Sayad`. **Non vérifiés**, à contrôler sur place.
- **`Terrain` — 17 emplacements** relevés directement sur place et
  confirmés d'office, sauf `137` (67 boulevard Jules Mansart, adresse absente de la Base
  Adresse Nationale : position approchée, près de l'école Miriam Makeba, à vérifier) :
  `133` sous le pont face à l'université (2 panneaux), `134` boulevard du 17 Octobre 1961
  et `135` 29 place Nelson Mandela aux Terrasses, `136` 2 allée d'Auvergne, `138` 31 terrasse
  de l'Université (African Fusion), `126` croisement rue de Metz / rue Buffon, `127` 8 Résidence des
  Glycines, `128` 9 Allée des Ajoncs, `129` rue du 11 Novembre 1918, `130` rue des
  Pâquerettes, `131` 1 rue du 1er Mai, `132` 5 avenue Vladimir Ilitch Lénine, et
  `123` 5 Résidence des Jonquilles — ce dernier
  remplaçant le point framacarte « 3 Résidence des Iris », déplacé de 87 m après relevé.
  Au Parc Sud : `139` allée des Demoiselles d'Avignon (avenue Pablo Picasso), `140` 25 rue
  de la Paix (de l'autre côté de l'avenue) et `141` mail de la Fraternité (limite Parc Sud /
  Champs-Pierreux).

Le **n° 112** (17 allée Etienne Cabet), marqué introuvable le 4 septembre, a été retrouvé
le 30 septembre à 11 m de sa position enregistrée : position corrigée et statut repassé à
confirmé, plutôt que de créer un doublon. De même, le **n° 19** (4 avenue Pablo Picasso),
retiré le 4 novembre, a été retrouvé le 9 novembre en face du théâtre des Amandiers, à
27 m de sa position enregistrée : remis sur la carte à la position relevée.

**Emplacements exclus définitivement.** Le champ `exclus` de `panneaux.json` conserve les
points dont l'absence a été constatée sur le terrain, avec leurs coordonnées et la date.
Ils ne doivent pas être réintroduits lors d'un recoupement avec une source extérieure.
À ce jour : `94 Rue de Sartrouville`.

**Emplacements retirés.** Le champ `retires` de `panneaux.json` garde, avec toutes leurs
données, les 6 emplacements marqués introuvables sur les photos de rue : `84`, `107`,
`115`, `117`, `120` et `R`. L'outil ne les affiche plus. Leur absence n'a pas été constatée
sur place : si l'un d'eux est retrouvé, il suffit de remettre sa ligne dans `panels`.

### Sources recoupées, sans apport

Trois autres sources ont été comparées aux données de l'outil en septembre 2026 :

- le PDF *Fi Nanterre — carte panneaux affichage* est la **version imprimable de la carte
  d'origine** (mêmes numéros 1 à 73) : rien de nouveau ;
- **absurdediffusion.eu/commune/nanterre** recense 42 entrées, soit 40 emplacements
  distincts : **tous déjà présents**, 39 à moins de 30 m d'un de nos points ;
- la **carte framacarte** (uMap anonyme du 17 avril 2023, jamais modifiée depuis, sans
  licence déclarée) contient 84 points : 68 déjà couverts, 3 retenus ci-dessus, 5 qui
  correspondent à des emplacements supprimés lors de la vérification terrain, et 8 écartés
  faute d'élément corroborant.

Les 5 en contradiction avec la vérification sont les anciens n° 3, 7, 31, 35 et 71. Pour
trois d'entre eux (71, 35, 31), un nœud OSM « Affichage Libre » existe encore à 5–37 m :
deux sources indépendantes signalent donc un panneau là où la vérification a conclu à son
absence. À trancher lors d'un prochain passage.

**Recalage sur OpenStreetMap** — OSM référence des nœuds `board_type=notice` nommés
« Affichage Libre », relevés sur le terrain. Chaque point de la carte situé à **70 m ou
moins** de l'un d'eux a été replacé exactement dessus (37 points, déplacement moyen 23 m).
Les emplacements ainsi calés (champ `osm`) sont fiables au mètre ; les
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
OSM, `admin_level=10`). Ils sont regroupés en **6 boucles**, celles des groupes Telegram
(champ `boucles` de `panneaux.json`) : chaque boucle a sa teinte, déclinée en nuances
proches pour ses quartiers (champ `qcol`), et la liste suit l'ordre des boucles.

## Sur téléphone

L'outil est prévu pour être utilisé sur le terrain, téléphone en main :

- la **carte occupe tout l'écran**, le panneau devient une **feuille coulissante** en bas,
  repliée par défaut ; on l'ouvre d'un appui sur la barre ;
- cette barre reste toujours visible et affiche le résumé — nombre d'emplacements et de
  panneaux sélectionnés, puis distance et durée une fois l'itinéraire calculé — avec un
  bouton **Calculer** directement accessible ;
- après le calcul, la feuille se replie automatiquement pour laisser voir le tracé, cadré
  au-dessus de la barre ; toucher la carte au-dessus de la feuille la replie aussi (toucher
  un point le sélectionne sans rien replier) ;
- le réglage départ + mode est lui aussi replié en une ligne de résumé
  (`Hôtel de ville · à vélo`), pour laisser la place à la liste ;
- cibles tactiles agrandies, champs en 16 px pour éviter le zoom automatique d'iOS,
  hauteur en `dvh` pour ne pas être coupé par la barre d'adresse ;
- **toute la feuille défile**, pas seulement la liste des panneaux. Sur ordinateur le
  panneau latéral est fixe et seule la liste défile ; sur téléphone cela rendait
  inaccessibles les champs situés sous une section dépliée. La barre de résumé reste collée en haut et le
  bouton de calcul en bas pendant le défilement.

Ajouter l'adresse à l'écran d'accueil du téléphone donne un accès en un geste.

## Statuts de vérification

Chaque emplacement peut porter un statut issu de la campagne de vérification, avec sa date
(champ `v` de `panneaux.json`). Dans l'outil, seuls les emplacements sans statut se signalent,
par la mention `à vérifier`. Le champ `rep`
donne un repère utile sur place, affiché sous l'adresse.

Le mode de vérification assisté par photos de rue qui a servi à produire ces statuts a été
retiré de l'interface une fois la campagne terminée. Il reste disponible dans l'historique
git (`git show facd6d5`) si une nouvelle campagne devient nécessaire.

## Comment l'itinéraire est calculé

1. Matrice des temps réels entre tous les points (service `table` d'OSRM, profil piéton /
   vélo / voiture — le profil voiture respecte les sens uniques).
2. Tournée initiale par plus proche voisin, puis amélioration **2-opt + Or-opt** sous
   budget de temps : c'est un problème du voyageur de commerce, la solution est très bonne
   mais pas prouvée optimale au-delà d'une dizaine de points.
3. Tracé réel de la boucle (service `route`), découpé par tronçons de 40 points.

En **aller simple**, le coût du retour vers le point de départ est mis à zéro dans la
matrice : optimiser un cycle revient alors à optimiser un chemin ouvert partant du départ.

Limite : **95 points maximum** (départ compris), imposée par le serveur de routage public.

**Attention aux points en impasse pour la voiture.** Un panneau peut être à 100 m à pied
d'un autre et à 3 km en voiture, si le point s'accroche à une voie que la circulation
n'atteint que par un long détour.

Le **n° 95 (rue des Saules)** en a été l'exemple : mal placé, il s'accrochait à 2 m d'une
bretelle d'autoroute, ce qui coûtait 1,7 à 3,7 km par trajet et faisait remonter
l'itinéraire jusqu'au nord de la commune. Il est désormais placé sur le passage sous l'A86
lui-même (`way/27817983`, `tunnel=yes`, entre la rue des Saules et la rue des Grands Prés),
c'est-à-dire à l'endroit réel des panneaux — et les trajets voiture tombent à **573 m de
moyenne** au lieu de 2 686 m.

Le réflexe, devant une tournée voiture anormalement longue : retirer les panneaux un par un
pour identifier le fautif, puis regarder à quelle voie son point s'accroche. Quelques mètres
de décalage avec le bouton `✥` suffisent en général à corriger.

## Services externes utilisés

Fonds de carte OpenStreetMap, routage OSRM hébergé par FOSSGIS
(`routing.openstreetmap.de`), géocodage Base Adresse Nationale (`api-adresse.data.gouv.fr`).
Tous gratuits et sans clé d'API — une connexion internet est nécessaire.
