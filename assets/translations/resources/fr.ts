export default {
  Hello: "Bonjour",
  ACCOUNT: "COMPTE",
  EDIT_PROFILE: "Modifier le profil",
  PERSONAL_INFO_BTN: "Informations personnelles",
  AAP: "Application", // Keeping user's typo AAP for consistency if used, or fixing to APP if unused key. User used AAP in profile.tsx. I will stick to their key if possible but wait, en.ts has APP. I should probably use APP in code and map AAP key if that's what they wanted, or correct it. User put AAP in fr.ts and APP in en.ts. I'll respect existing but add new ones.
  SETTING_BTN: "Paramètres",
  ABOUT_APP_BTN: "À propos de l'application",
  LOGOUT: "Déconnexion",

  // Auth
  WELCOME_BACK: "Bon retour",
  LOGIN_SUBTITLE: "Connectez-vous pour suivre la fraîcheur",
  EMAIL_PLACEHOLDER: "Adresse e-mail",
  PASSWORD_PLACEHOLDER: "Mot de passe",
  FORGOT_PASSWORD_BTN: "Mot de passe oublié ?",
  LOGIN_BTN: "Connexion",
  NO_ACCOUNT_TEXT: "Pas de compte ? ",
  SIGNUP_LINK: "S'inscrire",
  CREATE_ACCOUNT: "Créer un compte",
  REGISTER_SUBTITLE: "Suivez la fraîcheur intelligemment",
  FULL_NAME_PLACEHOLDER: "Nom complet",
  CREATE_ACCOUNT_BTN: "Créer un compte",
  ALREADY_HAVE_ACCOUNT_TEXT: "Déjà un compte ? ",
  LOGIN_LINK: "Connexion",
  FORGOT_PASSWORD_TITLE: "Mot de passe oublié",
  FORGOT_PASSWORD_SUBTITLE:
    "Entrez votre e-mail pour réinitialiser le mot de passe..",
  SEND_RESET_LINK_BTN: "Envoyer le lien",
  REMEMBER_PASSWORD_TEXT: "Mot de passe retrouvé ? ",

  // Home
  HOME_TITLE: "Smart Food Freshness",
  GUEST_USER: "Invité",
  LAST_SCAN_FRESHNESS: "Dernier scan",
  START_ANALYZING: "Commencer l'analyse",
  SCANNED_LABEL: "Scanné : ",
  TAKE_FIRST_PHOTO: "Prenez votre première photo",
  SCAN_NOW_BTN: "Scanner maintenant",
  RECENT_SCANS_TITLE: "Scans récents",
  VIEW_ALL_LINK: "Voir tout",
  STATUS_SPOILED: "Gâté",
  STATUS_FRESH: "Frais",
  NO_SCANS_TEXT: "Aucun scan. Essayez de scanner un fruit !",

  // List
  DELETE_PRODUCT_TITLE: "Supprimer le produit",
  DELETE_PRODUCT_MESSAGE: "Voulez-vous vraiment supprimer {{name}} ?",
  CANCEL: "Annuler",
  DELETE: "Supprimer",
  UNKNOWN: "Inconnu",
  STATUS_LABEL: "État : ",
  EMPTY_HISTORY_TITLE: "Aucun scan",
  EMPTY_HISTORY_SUBTITLE:
    "Capturez votre premier scan pour voir l'historique ici.",
  START_SCANNING_BTN: "Commencer à scanner",
  PRODUCTS_TITLE: "Produits",
  SEARCH_PLACEHOLDER: "Rechercher un produit...",

  // Notifications
  NOTIFICATIONS_TITLE: "Notifications",
  NO_NOTIFICATIONS_TEXT: "Pas encore de notifications",

  // Profile
  GUEST_EMAIL: "invite@example.com",

  // About
  ABOUT_TITLE: "À propos de l'application",
  VERSION: "Version 1.0.0",
  MISSION_TITLE: "Notre mission",
  MISSION_TEXT:
    "FoodFreshnessAI se consacre à la réduction du gaspillage alimentaire grâce à une intelligence artificielle de pointe. Nous permettons aux utilisateurs de suivre l'état de santé de leurs aliments et de prendre des décisions éclairées, garantissant que chacun tire le meilleur parti de ses courses tout en aidant la planète.",
  KEY_FEATURES_TITLE: "Principales fonctionnalités",
  FEATURE_SCAN_TITLE: "Scan de fraîcheur IA",
  FEATURE_SCAN_DESC:
    "Analysez instantanément la qualité des fruits et légumes à l'aide de votre caméra.",
  FEATURE_NOTIF_TITLE: "Notifications intelligentes",
  FEATURE_NOTIF_DESC:
    "Recevez des alertes avant que vos articles ne se gâtent.",
  FEATURE_THEME_TITLE: "Double thème",
  FEATURE_THEME_DESC:
    "Prise en charge complète des modes clair et sombre pour le confort visuel.",
  TECH_STACK_TITLE: "Stack technique",
  TECH_STACK_DESC:
    "Construit avec React Native et Expo. Propulsé par des modèles IA et l'infrastructure Firebase.",
  COPYRIGHT_1: "Conçu et développé avec ❤️ par SP22 Batch.",
  COPYRIGHT_2: "© 2025 Tous droits réservés.",

  // Edit Profile
  EDIT_PROFILE_TITLE: "Modifier le profil",
  AVATAR_SUBTEXT:
    "La photo de profil peut être modifiée à partir de la page principale du profil.",
  FULL_NAME_LABEL: "Nom complet",
  FULL_NAME_PLACEHOLDER_EDIT: "Entrez votre nom complet",
  EMAIL_LABEL: "Adresse e-mail",
  SAVE_CHANGES_BTN: "Enregistrer",
  SAVING_BTN: "Enregistrement...",
  UPDATE_SUCCESS_TITLE: "Succès",
  UPDATE_SUCCESS_MSG: "Profil mis à jour avec succès !",
  DELETE_ACCOUNT_BTN: "Supprimer le compte",
  DELETE_ACCOUNT_TITLE: "Supprimer le compte",
  DELETE_ACCOUNT_MSG:
    "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
  ACCOUNT_DELETED_TITLE: "Supprimé",
  ACCOUNT_DELETED_MSG: "Votre compte a été supprimé.",

  // Help & Support
  HELP_TITLE: "Aide et support",
  HELP_HERO_TITLE: "Comment pouvons-nous vous aider ?",
  HELP_HERO_SUBTITLE:
    "Recherchez dans notre centre d'aide ou contactez notre équipe d'assistance 24/7.",
  CONTACT_US_TITLE: "Contactez-nous",
  EMAIL_SUPPORT: "Support par e-mail",
  PHONE_SUPPORT: "Support téléphonique",
  COPIED_TITLE: "Copié !",
  COPIED_MSG: "{{label}} a été copié dans votre presse-papiers.",
  FAQ_TITLE: "Foire aux questions",
  FAQ_1_Q: "Comment l'IA détecte-t-elle la fraîcheur des aliments ?",
  FAQ_1_A:
    "Notre modèle d'IA analyse les motifs de couleur, la texture de surface et les signes de dégradation connus de fruits et légumes spécifiques capturés par votre caméra pour estimer les niveaux de fraîcheur.",
  FAQ_2_Q: "Quels fruits/légumes sont pris en charge ?",
  FAQ_2_A:
    "Actuellement, nous prenons en charge les pommes, les bananes, les tomates, les oranges et les légumes-feuilles. Nous mettons constamment à jour notre modèle pour inclure plus d'articles.",
  FAQ_3_Q: "Le résultat du scan est-il précis à 100 % ?",
  FAQ_3_A:
    "Bien que notre IA soit très avancée, les résultats du scan sont des estimations. Nous vous recommandons de les utiliser comme guide en plus de votre propre jugement et de vos vérifications olfactives/tactiles.",
  FAQ_4_Q: "Comment obtenir des notifications pour les articles qui expirent ?",
  FAQ_4_A:
    "Assurez-vous que les « notifications push » sont activées dans les paramètres. Vous pouvez également définir manuellement des alertes d'expiration pour les articles de votre liste.",
  FAQ_5_Q: "Puis-je utiliser l'application hors ligne ?",
  FAQ_5_A:
    "Le scan IA nécessite une connexion Internet pour traiter les images avec précision. Cependant, vous pouvez consulter votre historique et les articles précédemment scannés hors ligne.",

  // Product Details
  PRODUCT_DETAILS_TITLE: "Détails du produit",
  PRODUCT_NAME_ERROR_TITLE: "Erreur",
  PRODUCT_NAME_ERROR_MSG: "Le nom du produit ne peut pas être vide",
  DAYS_LEFT: "Jours restants",
  DAY_LEFT: "Jour restant",
  EXPIRED_LABEL: "Expiré",
  SCANNED_LABEL_DATE: "Scanné",
  EXPIRES_LABEL_DATE: "Expire",
  DESCRIPTION_TITLE: "Description",
  SPOILED_DESC: "Gâté. À consommer de préférence dès maintenant",
  FRESH_DESC: "Aliment frais et sain. À consommer de préférence frais.",
  UPDATE_ERROR_TITLE: "Erreur",
  UPDATE_ERROR_MSG: "Échec de la mise à jour du nom du produit",

  // Scan
  PERMISSION_MSG:
    "Nous avons besoin de votre permission pour afficher la caméra",
  GRANT_PERMISSION_BTN: "Donner la permission",
  SCAN_FOOD_TITLE: "Scanner un aliment",
  SCAN_SUCCESS_TITLE: "Scan réussi !",
  SCAN_FAILED_TITLE: "Échec du scan",
  SCAN_ERROR_MSG: "Une erreur s'est produite lors du scan.",

  // Settings
  PREFERENCES: "PRÉFÉRENCES",
  NOTIFICATIONS: "Notifications",
  HAPTIC_FEEDBACK: "Retour haptique",
  LANGUAGE: "Langue",
  THEME: "Thème",
  LIGHT: "Clair",
  DARK: "Sombre",
  SYSTEM: "Système",
  SELECT_LANGUAGE: "Sélectionner la langue",
  ENGLISH_US: "English (US)",
  FRENCH: "Français",
};
