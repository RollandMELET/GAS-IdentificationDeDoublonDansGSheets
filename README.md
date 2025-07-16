<!-- START OF FILE: README.md -->
<!-- 
# FILENAME: README.md
# Version: 1.2.0
# Date: 2025-07-16 12:00
# Author: Rolland MELET & AI Senior Coder
# Description: Ajout d'une section exhaustive sur les valeurs de retour de la fonction.
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
7.  Retourne une chaîne de caractères indiquant le résultat de l'opération (voir section 6 pour les détails).

## 4. Structure du Projet

├── .claspignore
├── .gitignore
├── README.md
├── InitialSpec.md
└── src/
├── appsscript.json
└── Code.gs

## 5. Instructions d'Installation (pour reprise du projet)

1.  Clonez le dépôt : `git clone https://github.com/RollandMELET/GAS-IdentificationDeDoublonDansGSheets.git`
2.  Naviguez dans le répertoire : `cd GAS-IdentificationDeDoublonDansGSheets`
3.  Authentifiez `clasp` : `clasp login`
4.  Trouvez l'ID du script à partir du conteneur Google Sheet (`Extensions > Apps Script > Paramètres du projet`).
5.  Clonez la configuration du projet de script : `clasp clone "ID_DU_SCRIPT_ICI" --rootDir ./src`.

## 6. Spécification des Valeurs de Retour

La fonction `identifierDoublonsPourCommande` retourne toujours une `String`. Le contenu de cette chaîne de caractères permet de savoir si l'opération a réussi ou échoué.

### Retours en Cas de Succès
Dans un scénario de succès, la fonction retourne directement la liste des doublons (ou une chaîne vide s'il n'y en a pas). C'est le format idéal pour une exploitation par AppSheet.

| Valeur de Retour (Exemple) | Scénario                                                                                                                              |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| `"7391440, 7391508"`       | **Doublons trouvés.** La chaîne contient la liste des `CMDCodet` en double, séparés par une virgule et un espace.                       |
| `""`                       | **Aucun doublon trouvé.** Une chaîne vide est retournée. Ce cas inclut les scénarios où aucun `CMDCodet` n'est en double, ou lorsqu'aucune ligne enfant n'a été trouvée pour la `CMDREF` donnée. |

### Retours en Cas d'Erreur
En cas d'erreur, la fonction retourne systématiquement une chaîne de caractères préfixée par `ERREUR:`. Cela permet de facilement filtrer et identifier les échecs dans les logs d'AppSheet.

| Valeur de Retour (Exemple)                                                | Scénario                                                                                      |
| :------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------- |
| `"ERREUR: Impossible de trouver la feuille parente 'CommandeENEDISGeneral'."` | L'un des onglets requis (`CommandeENEDISGeneral` ou `CommandeENEDISCodet`) est manquant ou mal orthographié. |
| `"ERREUR: Colonne 'CMDCodet' introuvable dans 'CommandeENEDISCodet'."`      | L'une des colonnes requises (`CMDREF`, `CMDCodet`, `Script_Resultat_Doublons`) est manquante dans les en-têtes. |
| `"ERREUR: Impossible de trouver la CMDREF 'CMD-XYZ' dans la feuille parente..."` | La `CMDREF` fournie en paramètre n'a pas été trouvée dans la feuille `CommandeENEDISGeneral`, rendant l'écriture du résultat impossible. |
| `"ERREUR SCRIPT: You do not have permission to call setValue."`             | Une erreur technique inattendue a été interceptée par le script (ex: problème de permissions, quota dépassé, etc.). |

<!-- END OF FILE: README.md -->