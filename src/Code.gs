// <!-- START OF FILE: Code.gs -->
// FILENAME: Code.gs
// Version: 2.1.0 (FINAL)
// Date: 2025-07-16 11:45
// Author: Rolland MELET & AI Senior Coder
// Description: Modifie la valeur de retour en cas de succès pour ne renvoyer que la chaîne des doublons.

/**
 * Identifie les doublons dans la table enfant pour une référence de commande donnée
 * et inscrit le résultat dans la table parente.
 * Retourne la liste des doublons en cas de succès, ou un message d'erreur.
 *
 * @param {string} cmdRef La référence de commande (CMDREF) à traiter.
 * @returns {string} La chaîne des doublons (ex: "CODET_A, CODET_B") en cas de succès,
 *                   ou une chaîne préfixée par "ERREUR:" en cas d'échec.
 */
function identifierDoublonsPourCommande(cmdRef) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    // --- Configuration ---
    const SHEET_PARENT_NAME = "CommandeENEDISGeneral";
    const SHEET_ENFANT_NAME = "CommandeENEDISCodet";
    const COL_REF = "CMDREF";
    const COL_A_ANALYSER = "CMDCodet";
    const COL_RESULTAT = "Script_Resultat_Doublons";

    // --- 1. Accès et validation des données ---
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheetParent = spreadsheet.getSheetByName(SHEET_PARENT_NAME);
    const sheetEnfant = spreadsheet.getSheetByName(SHEET_ENFANT_NAME);

    if (!sheetParent) return `ERREUR: Impossible de trouver la feuille parente '${SHEET_PARENT_NAME}'.`;
    if (!sheetEnfant) return `ERREUR: Impossible de trouver la feuille enfant '${SHEET_ENFANT_NAME}'.`;

    const dataParent = sheetParent.getDataRange().getValues();
    const dataEnfant = sheetEnfant.getDataRange().getValues();

    const headersParent = dataParent.shift();
    const headersEnfant = dataEnfant.shift();

    const idx_ref_parent = headersParent.indexOf(COL_REF);
    const idx_resultat = headersParent.indexOf(COL_RESULTAT);
    const idx_ref_enfant = headersEnfant.indexOf(COL_REF);
    const idx_a_analyser = headersEnfant.indexOf(COL_A_ANALYSER);

    if (idx_ref_parent === -1) return `ERREUR: Colonne '${COL_REF}' introuvable dans '${SHEET_PARENT_NAME}'.`;
    if (idx_resultat === -1) return `ERREUR: Colonne '${COL_RESULTAT}' introuvable dans '${SHEET_PARENT_NAME}'.`;
    if (idx_ref_enfant === -1) return `ERREUR: Colonne '${COL_REF}' introuvable dans '${SHEET_ENFANT_NAME}'.`;
    if (idx_a_analyser === -1) return `ERREUR: Colonne '${COL_A_ANALYSER}' introuvable dans '${SHEET_ENFANT_NAME}'.`;

    // --- 2. Filtrage et comptage des doublons ---
    const lignesEnfantConcernees = dataEnfant.filter(row => row[idx_ref_enfant] === cmdRef);
    
    let resultatString = ""; // Initialisation à une chaîne vide par défaut

    if (lignesEnfantConcernees.length > 0) {
      const frequences = {};
      lignesEnfantConcernees.forEach(row => {
        const codet = row[idx_a_analyser];
        if (codet) { frequences[codet] = (frequences[codet] || 0) + 1; }
      });
      
      const doublons = Object.keys(frequences).filter(key => frequences[key] > 1);
      resultatString = doublons.join(', ');
    }

    // --- 3. Recherche de la ligne parente et écriture du résultat ---
    const numLigneParente = dataParent.findIndex(row => row[idx_ref_parent] === cmdRef);

    if (numLigneParente === -1) {
      return `ERREUR: Impossible de trouver la CMDREF '${cmdRef}' dans la feuille parente '${SHEET_PARENT_NAME}'.`;
    }
    
    const ligneSheet = numLigneParente + 2;
    const colonneSheet = idx_resultat + 1;
    sheetParent.getRange(ligneSheet, colonneSheet).setValue(resultatString);
    console.log(`Résultat '${resultatString}' écrit dans la cellule [${ligneSheet}, ${colonneSheet}].`);

    // --- 4. Message de retour final ---
    return resultatString;

  } catch (e) {
    console.error(`Erreur inattendue: ${e.message} \n Stack: ${e.stack}`);
    return `ERREUR SCRIPT: ${e.message}`;
  } finally {
    lock.releaseLock();
  }
}

/**
 * Fonction de test pour exécuter manuellement identifierDoublonsPourCommande
 * depuis l'éditeur Apps Script.
 */
function test_identifierDoublons() {
  const testCmdRef = "23cae24a"; // Votre CMDREF de test
  const resultat = identifierDoublonsPourCommande(testCmdRef);
  // Le log montrera maintenant la valeur de retour brute
  console.log(`Résultat de la fonction pour '${testCmdRef}': "${resultat}"`);
}
// <!-- END OF FILE: Code.gs -->