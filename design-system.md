# Design system — Landing NewARA (Damac)

Doc de référence pour toute évolution UI de la landing (méthodo : tokens dans 1 fichier, plan-avant-code, boucle de vérif screenshot→diff). Tokens réels dans `assets/style.css` (`:root`).

## Sujet → parti pris
Produit de confiance à ~2000 € (anti-calcaire **magnétique**, efficacité contestée → **sobriété crédible**, pas de flashy). Cible 40+, FR, Belgique. Objectif = **conversion lead** (1 CTA : être rappelé). Parti pris : **eau + inox + héritage/qualité** (fabricant depuis +40 ans).

## Tokens (dans style.css :root)
- **Couleurs** : `--bleu #0a6fb5`, `--bleu-fonce #08344f` (navy hero), `--vert #1f9d57` / `--vert-fonce #15793f` (CTA/action), `--eyebrow #56c79b`, `--surface #f6f9fb`, `--bord #dbe5ec`, `--texte #16242e`, `--gris #566571`.
- **Typo** : `--font-display 'Fraunces'` (serif, titres = âme qualité/héritage) · `--font-body 'Public Sans'` (corps, lisible, ≠ Inter défaut). Via Google Fonts, `display=swap`.
- **Layout** : `--radius 16px` / `--radius-sm 10px`, `--max 1120px`, `--ombre` / `--ombre-sm`.

## Principes (encodés)
- **Hero = thèse** : eyebrow message-match (mot-clé annonce + géo) → H1 Fraunces → bénéfice → CTA → render produit. Fond **radial profond** (PAS de dégradé linéaire 135° = AI-slop).
- **Audace à un seul endroit** : le hero (typo serif + visuel produit). Le reste = calme, discipliné.
- **Anti-AI-slop** : pas de tout-centré (titres de section à **gauche**, éditorial) ; **vraies icônes SVG** (jamais d'emoji) ; cartes avec élévation/hover, pas toutes plates et identiques.
- **Copie = matériau** : voix active, message-match annonce↔page, libellés CTA orientés bénéfice (« Recevoir mon devis », pas « Envoyer »).
- **Conformité** : aucun claim non substantiable (CE/CSTC retirés) — cf. enquête conformité. « +40 ans » pas « éprouvé 46 ans ».
- **Plancher** : responsive mobile (callbar fixe), focus clavier visible, `prefers-reduced-motion` respecté, images compressées.

## CRO (ce qui fait convertir, au-delà du beau)
Message-match annonce↔landing (levier n°1) · 1 seul CTA répété · preuve/réassurance concrète · vitesse mobile · friction formulaire minimale (tél obligatoire) · objections levées près du CTA.

## Itérations
- **v1 (22/06/2026)** : tokens + Fraunces/Public Sans + hero radial + dé-centrage + hover + icônes SVG + eyebrow. Vérifié au rendu (hero).
- **À tester (A/B dès trafic)** : variantes de hero/CTA (dont via **GLM 5.2 / OpenRouter** comme 2e regard, Claude arbitre le rendu).
