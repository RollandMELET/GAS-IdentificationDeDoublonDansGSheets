### **Fichier de Spécifications : Script Google Apps pour l'Identification de Doublons**

**1. Contexte du Projet**

- **Système :** Google Apps Script.
    
- **Environnement :** Le script sera lié à un fichier Google Sheets qui sert de source de données pour une application Google AppSheet.
    
- **Déclenchement :** Le script sera appelé depuis une Automation AppSheet (via une tâche "Call a script"). Il ne s'exécutera pas sur un déclencheur temporel (onEdit, onOpen, etc.).
    
- **Objectif :** Automatiser l'identification des valeurs dupliquées dans une table enfant et inscrire le résultat dans la table parente correspondante.
    

**2. Objectif Principal du Script**

Le script doit exposer une fonction unique qui, lorsqu'elle reçoit une clé de référence (CMDREF), effectue les opérations suivantes :

1. Identifie toutes les lignes dans une table "enfant" (CommandeENEDISCodet) qui partagent cette CMDREF.
    
2. Analyse la colonne CMDCodet de ces lignes pour trouver les valeurs qui apparaissent plus d'une fois (les doublons).
    
3. Formate la liste de ces doublons en une chaîne de caractères unique.
    
4. Trouve la ligne correspondante dans la table "parente" (CommandeENEDISGeneral) et écrit cette chaîne de caractères dans une colonne dédiée.
    
5. Retourne un message de statut clair à AppSheet pour indiquer le succès ou l'échec de l'opération.
    

**3. Schéma des Données Pertinentes**

Le script interagira avec deux onglets (feuilles) dans le fichier Google Sheets actif :

- **Feuille 1 (Parente) : CommandeENEDISGeneral**
    
    - Colonne de clé primaire : CMDREF (Type: Texte)
        
    - Colonne de destination du résultat : Script_Resultat_Doublons (Type: Texte)
        
- **Feuille 2 (Enfant) : CommandeENEDISCodet**
    
    - Colonne de clé étrangère : CMDREF (Type: Texte, lie à la table parente)
        
    - Colonne à analyser pour les doublons : CMDCodet (Type: Texte)
        

**4. Spécifications Fonctionnelles Détaillées**

Le script DOIT implémenter une fonction principale nommée identifierDoublonsPourCommande.

- **4.1. Interface de la fonction (Signature)**
    
    - La fonction doit accepter un seul argument : cmdRef (une chaîne de caractères).
        
    - function identifierDoublonsPourCommande(cmdRef) { ... }
        
- **4.2. Accès aux données et robustesse**
    
    - Le script DOIT obtenir dynamiquement l'accès au classeur Google Sheets actif (SpreadsheetApp.getActiveSpreadsheet()).
        
    - Le script DOIT accéder aux feuilles par leur nom textuel : "CommandeENEDISGeneral" et "CommandeENEDISCodet".
        
    - Le script DOIT lire l'intégralité des données des deux feuilles en une seule fois (getDataRange().getValues()) pour minimiser les appels d'API.
        
    - Le script NE DOIT PAS utiliser de numéros de colonne codés en dur (ex: row[2]). Il DOIT trouver dynamiquement l'index de chaque colonne requise (CMDREF, CMDCodet, Script_Resultat_Doublons) en lisant la première ligne (en-têtes) de chaque feuille (headers.indexOf("ColumnName")).
        
- **4.3. Algorithme de détection des doublons**
    
    1. Le script DOIT filtrer les données de la feuille CommandeENEDISCodet pour ne conserver que les lignes où la valeur de la colonne CMDREF correspond exactement au paramètre cmdRef reçu.
        
    2. Si aucune ligne n'est trouvée, le script peut s'arrêter et retourner un message approprié.
        
    3. Le script DOIT ensuite utiliser un algorithme de comptage de fréquence sur les valeurs de la colonne CMDCodet des lignes filtrées. Un objet JavaScript (utilisé comme une "hash map" ou un dictionnaire) est la méthode préférée.
        
        - Exemple : { "CODET_A": 2, "CODET_B": 1, "CODET_C": 3 }
            
    4. Le script DOIT itérer sur cet objet de fréquence et construire une liste (Array) de toutes les clés (CMDCodet) dont la valeur (le compte) est strictement supérieure à 1.
        
- **4.4. Formatage et écriture du résultat**
    
    1. La liste des doublons obtenue DOIT être transformée en une seule chaîne de caractères, avec les valeurs séparées par une virgule et un espace (", ").
        
        - Exemple de sortie : "CODET_A, CODET_C"
            
    2. Si aucun doublon n'est trouvé, la chaîne de caractères doit être vide ("").
        
    3. Le script DOIT ensuite parcourir les données de la feuille CommandeENEDISGeneral pour trouver la ligne où la valeur de la colonne CMDREF correspond au paramètre cmdRef.
        
    4. Une fois la ligne trouvée, le script DOIT écrire la chaîne de caractères résultante dans la cellule correspondante de la colonne Script_Resultat_Doublons.
        

**5. Spécifications Non-Fonctionnelles**

- **5.1. Gestion des erreurs**
    
    - Le script DOIT gérer les erreurs de manière robuste. Si une feuille ou une colonne requise n'est pas trouvée, le script doit s'arrêter et retourner un message d'erreur explicite.
        
    - Toute l'opération doit être encapsulée dans un bloc try...catch pour capturer les erreurs inattendues et les retourner à AppSheet.
        
- **5.2. Concurrence**
    
    - Le script DOIT utiliser le LockService de Google Apps Script (LockService.getScriptLock()) pour s'assurer qu'une seule instance du script modifie la feuille de calcul à un instant T, évitant ainsi les corruptions de données si plusieurs utilisateurs déclenchent l'action simultanément. Le verrou doit être libéré à la fin de l'exécution, même en cas d'erreur (utiliser un bloc finally).
        
- **5.3. Performance**
    
    - L'utilisation de getValues() pour lire les données en masse et getRange().setValue() pour écrire une seule cellule est requise pour garantir une bonne performance.
        
- **5.4. Documentation du code**
    
    - Le code doit être commenté en utilisant le format JSDoc pour expliquer le but de la fonction principale, de ses paramètres et de sa valeur de retour.
        

**6. Spécification des Entrées/Sorties**

- **Entrée (Paramètre de la fonction) :**
    
    - cmdRef
        
        - **Type :** String
            
        - **Description :** La valeur de la colonne CMDREF de la ligne CommandeENEDISGeneral à traiter.
            
        - **Exemple :** "CMD-00123"
            
- **Sortie (Valeur de retour de la fonction) :**
    
    - **Type :** String
        
    - **En cas de succès :** Un message clair indiquant le résultat. Exemple : "Succès. Doublons trouvés : CODET_A, CODET_C" ou "Succès. Aucun doublon trouvé."
        
    - **En cas d'erreur :** Un message préfixé par "ERREUR:" pour une identification facile dans les logs AppSheet. Exemple : "ERREUR: Impossible de trouver la feuille 'CommandeENEDISCodet'." ou "ERREUR SCRIPT: [message de l'exception]".
        

**7. Scénario de Test (Exemple)**

- **Données initiales :**
    
    - **Feuille CommandeENEDISGeneral :**  
        | CMDREF | ... | Script_Resultat_Doublons |  
        | :--- | :-: | :--- |  
        | CMD-001 | ... | |
        
    - **Feuille CommandeENEDISCodet :**  
        | ID | CMDREF | CMDCodet |  
        | :- | :--- | :--- |  
        | 1 | CMD-001 | CODET_X |  
        | 2 | CMD-001 | CODET_Y |  
        | 3 | CMD-001 | CODET_X |  
        | 4 | CMD-002 | CODET_Z |  
        | 5 | CMD-001 | CODET_Y |  
        | 6 | CMD-001 | CODET_Z |
        
- **Appel :** identifierDoublonsPourCommande("CMD-001")
    
- **Résultat attendu :**
    
    - **Feuille CommandeENEDISGeneral (après exécution) :**  
        | CMDREF | ... | Script_Resultat_Doublons |  
        | :--- | :-: | :--- |  
        | CMD-001 | ... | CODET_X, CODET_Y |
        
    - **Valeur de retour de la fonction :** "Succès. Doublons trouvés : CODET_X, CODET_Y"