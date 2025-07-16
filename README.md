<!-- START OF FILE: README.md -->
<!-- 
# FILENAME: README.md
# Version: 1.0.0
# Date: 2025-07-16 09:30
# Author: Rolland MELET & AI Senior Coder
# Description: Initial README file for the project.
-->

# Identification de Doublons dans Google Sheets pour AppSheet

## 1. Objectif du Projet

Ce projet contient un script Google Apps Script conçu pour être appelé par une automation Google AppSheet. Son objectif principal est d'identifier les valeurs dupliquées dans une table "enfant" (un onglet de Google Sheet) et d'inscrire le résultat de cette analyse dans une ligne correspondante de la table "parente" (un autre onglet).

## 2. Contexte Technique

- **Système :** Google Apps Script
- **Conteneur :** Google Sheets
- **Déclencheur :** Externe, via un appel d'API depuis une automation AppSheet (Tâche : "Call a script").
- **Développement Local :** Géré avec `clasp` pour la synchronisation entre l'environnement de développement local (VSCode) et l'éditeur Google Apps Script.

## 3. Fonctionnalités Clés

Le script expose une fonction unique `identifierDoublonsPourCommande(cmdRef)` qui :

1.  Accepte une référence de commande (`cmdRef`) en paramètre.
2.  Filtre les lignes pertinentes dans la feuille enfant `CommandeENEDISCodet`.
3.  Analyse la colonne `CMDCodet` de ces lignes pour trouver les valeurs qui apparaissent plus d'une fois.
4.  Formate la liste des doublons trouvés en une chaîne de caractères (ex: `"VAL_A, VAL_B"`).
5.  Trouve la ligne parente correspondante dans la feuille `CommandeENEDISGeneral` via la `cmdRef`.
6.  Écrit la chaîne des doublons dans la colonne `Script_Resultat_Doublons`.
7.  Retourne un message de statut clair (`Succès` ou `ERREUR`) à AppSheet.

## 4. Structure du Projet
├── .claspignore
├── .gitignore
├── README.md
└── src/
├── appsscript.json
└── Code.gs (sera créé ultérieurement)


## 5. Instructions d'Installation (pour reprise du projet)

1.  Clonez le dépôt : `git clone https://github.com/RollandMELET/GAS-IdentificationDeDoublonDansGSheets.git`
2.  Naviguez dans le répertoire : `cd GAS-IdentificationDeDoublonDansGSheets`
3.  Authentifiez `clasp` : `clasp login`
4.  Trouvez l'ID du script à partir du conteneur Google Sheet (`Extensions > Apps Script > Paramètres du projet`).
5.  Clonez la configuration du projet de script : `clasp clone "ID_DU_SCRIPT_ICI" --rootDir ./src`.

<!-- END OF FILE: README.md -->
