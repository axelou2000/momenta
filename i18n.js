(() => {
  'use strict';

  const strings = {
    'Momenta — un souvenir à la fois': 'Momenta — one memory at a time',
    'VOS SOUVENIRS RESTENT SUR CET APPAREIL': 'YOUR MEMORIES STAY ON THIS DEVICE',
    'Retrouvez vos photos,': 'Rediscover your photos,', 'à votre rythme.': 'at your own pace.',
    'Momenta a besoin de votre accord pour parcourir les images de votre photothèque. Les images restent sur votre téléphone.': 'Momenta needs your permission to browse your photo library. Your images stay on your phone.',
    'Continuer vers mes photos': 'Continue to my photos', 'Vous pourrez modifier cet accès à tout moment dans les réglages Android.': 'You can change this access at any time in Android settings.',
    '← Retour à la collection': '← Back to collection', 'VOTRE PAUSE SOUVENIR': 'YOUR DAILY MEMORY', 'Un instant retrouvé.': 'A moment rediscovered.',
    'souvenirs': 'memories', 'UN SOUVENIR POUR VOUS': 'A MEMORY FOR YOU', 'ÉTÉ 2021 · BORD DE MER': 'SUMMER 2021 · SEASIDE',
    'Là où le temps ralentit': 'Where time slows down', 'Glissez pour découvrir': 'Swipe to discover', 'Ajouter un mot': 'Add a note',
    'Commentaire et tags pour cette photo': 'Note and tags for this photo', 'Vos souvenirs restent sur cet appareil.': 'Your memories stay on this device.',
    'VOTRE ALBUM PERSONNEL': 'YOUR PERSONAL ALBUM', 'Souvenirs retrouvés': 'Memories rediscovered', '← Retour': '← Back',
    'Les photos que vous avez déjà redécouvertes.': 'Photos you have already rediscovered.', 'Votre album se remplit doucement.': 'Your album is taking shape.',
    'Les souvenirs découverts apparaîtront ici, avec vos petits mots.': 'Memories you discover will appear here, along with your notes.', 'Découvrir un souvenir': 'Discover a memory',
    'VOS SOUVENIRS, PAR THÈME': 'YOUR MEMORIES, BY THEME', 'Albums': 'Albums',
    'Ajoutez plusieurs tags à une photo ; chaque album correspondant se remplit automatiquement.': 'Add multiple tags to a photo; each matching album fills automatically.',
    'Vos albums commencent ici.': 'Your albums start here.', 'Ajoutez un tag à un souvenir ; son album apparaîtra ici. Une photo peut rejoindre plusieurs albums.': 'Add a tag to a memory and its album will appear here. A photo can belong to several albums.', '← Tous les albums': '← All albums',
    'VOTRE ESPACE, VOS RÈGLES': 'YOUR SPACE, YOUR RULES', 'Réglages & données': 'Settings & data',
    'Momenta garde vos souvenirs sur cet appareil. Voici les réglages qui accompagneront les prochaines étapes.': 'Momenta keeps your memories on this device. These settings will grow with the app.',
    'PHOTOTHÈQUE': 'PHOTO LIBRARY', 'Accès à vos photos': 'Photo access', 'APERÇU': 'PREVIEW', 'Accès complet · 842 photos disponibles': 'Full access · 842 photos available',
    'Complet': 'Full', 'Sélectionné': 'Selected', 'Refusé': 'Denied', 'Vide': 'Empty',
    'Les photos restent dans votre galerie. L’application lit uniquement les images auxquelles vous lui donnez accès.': 'Photos stay in your gallery. The app only reads images you allow it to access.',
    'Gérer l’accès aux photos': 'Manage photo access', 'Actualiser la photothèque': 'Refresh photo library', 'Voir l’écran sans photo': 'Preview the empty state',
    'UNE PAUSE, À VOTRE RYTHME': 'A MOMENT, AT YOUR PACE', 'Souvenir du jour': 'Memory of the day',
    'Recevez au plus un rappel par jour, à l’heure choisie. Vous pouvez le couper à tout moment.': 'Get at most one reminder a day at a time you choose. You can turn it off at any time.',
    'Rappel quotidien': 'Daily reminder', 'Facultatif · notification locale': 'Optional · local notification', 'Heure du rappel': 'Reminder time',
    'Sur Android, activez le rappel pour choisir l’heure et autoriser les notifications.': 'On Android, turn on the reminder to choose a time and allow notifications.',
    'SAUVEGARDE LOCALE': 'LOCAL BACKUP', 'Vos notes vous suivent': 'Take your notes with you',
    'Exportez vos commentaires et votre historique dans un fichier lisible. Les photos originales restent dans la galerie.': 'Export your notes and history to a readable file. Original photos stay in your gallery.',
    'Exporter mes données': 'Export my data', 'Fichier JSON · aperçu seulement': 'JSON file · preview only', 'Importer une sauvegarde': 'Import a backup',
    'Vérification avant toute fusion': 'Review before merging', 'Privé par défaut.': 'Private by default.',
    'Pas de compte, pas de transfert vers un serveur, pas d’analyse de vos images.': 'No account, no server uploads, no image analysis.',
    'Ces écrans sont une maquette. Les permissions système et les transferts ne sont pas activés.': 'These screens are a prototype. System permissions and transfers are not enabled.',
    'APERÇU · PHOTOTHÈQUE VIDE': 'PREVIEW · EMPTY PHOTO LIBRARY', 'Les souvenirs': 'Memories', 'prennent leur temps.': 'take their time.',
    'Aucune photo accessible pour le moment. Vos images restent dans votre galerie ; vous pourrez vérifier l’accès quand vous le souhaitez.': 'No photos are accessible right now. Your images stay in your gallery; you can check access whenever you like.',
    'Revenir à la découverte': 'Back to discovery', 'Voir l’aperçu de l’accès aux photos': 'Preview photo access',
    'État visuel de démonstration · aucune permission système n’est demandée.': 'Demo screen · no system permission is requested.',
    'UN PETIT VOYAGE DANS VOS IMAGES': 'A LITTLE JOURNEY THROUGH YOUR PHOTOS', 'UNE PENSÉE À CONSERVER': 'A THOUGHT TO KEEP',
    'Qu’aimeriez-vous': 'What would you', 'vous rappeler ?': 'like to remember?', 'Votre commentaire': 'Your note',
    'Tags': 'Tags', 'Plusieurs possibles': 'Add more than one', 'Ajouter un tag': 'Add a tag', 'Ajouter': 'Add', 'Garder ce mot': 'Save this note',
    'UN SOUVENIR À PARTAGER': 'A MEMORY TO SHARE', 'Partager ce moment': 'Share this moment', 'Choisissez où l’envoyer': 'Choose where to share it',
    'Choisir une application': 'Choose an app', 'Messages': 'Messages', 'À proximité': 'Nearby Share', 'E-mail': 'Email', 'Autres': 'More',
    'Aucune photo ne sera envoyée dans cet aperçu.': 'No photo will be shared in this preview.',
    'LANGUE': 'LANGUAGE', 'Langue de l’application': 'App language', 'Choisissez votre langue': 'Choose your language', '文': 'Aa',
    'Illustration d’un jardin fleuri dans la lumière du matin': 'Illustration of a flower garden in the morning light',
    'Le jardin après la pluie': 'The garden after the rain', 'Illustration de montagnes au soleil couchant': 'Illustration of mountains at sunset',
    'Le chemin des nuages': 'The path through the clouds', 'Illustration d’un marché de village en été': 'Illustration of a village market in summer',
    'Un matin de marché': 'A morning at the market', 'Illustration d’une fenêtre ouverte sur des collines': 'Illustration of an open window overlooking hills',
    'La chambre aux volets bleus': 'The room with blue shutters', 'DATE NON DISPONIBLE': 'DATE UNAVAILABLE',
    'Modifier mon mot': 'Edit my note', 'Dernier souvenir de la session': 'Last memory in this session',
    'Glissez pour découvrir le souvenir suivant': 'Swipe to discover the next memory', 'Dernière photo de la session': 'Last photo in this session',
    'Impossible de lire la photothèque. Vérifiez l’accès puis réessayez.': 'Could not read the photo library. Check access and try again.',
    'Vérification de l’accès…': 'Checking access…', 'La demande n’a pas abouti. Vous pouvez réessayer dans les réglages Android.': 'The request did not complete. You can try again in Android settings.',
    'SOUVENIR ÉTIQUETÉ': 'TAGGED MEMORY', 'Cette photo n’est plus accessible. Ses tags et son commentaire restent conservés.': 'This photo is no longer accessible. Its tags and note are still saved.',
    'Aucune photo accessible': 'No photos accessible', 'Autorisation refusée': 'Permission denied',
    'Seules les photos que vous sélectionnez apparaissent dans les souvenirs.': 'Only photos you select appear in your memories.',
    'Modifier les photos sélectionnées': 'Change selected photos', 'Voir la demande d’accès': 'View access request',
    'Ajoutez des photos à la galerie ou vérifiez l’accès accordé à Momenta.': 'Add photos to your library or check the access granted to Momenta.',
    'Vérifier l’accès aux photos': 'Check photo access',
    'Android ne donne accès qu’aux images choisies. Vous pouvez modifier cette sélection dans les réglages système.': 'Android only grants access to selected images. You can change your selection in system settings.',
    'Autorisez l’accès lorsque vous démarrez la découverte. Aucune image ne quitte votre téléphone.': 'Allow access when you start discovering. No images leave your phone.',
    'L’accès est bloqué pour le moment. Ouvrez les réglages Android pour l’autoriser.': 'Access is blocked for now. Open Android settings to allow it.',
    'Les photos de moins de 30 jours ou sans date fiable ne sont pas proposées. Elles restent dans votre galerie.': 'Photos less than 30 days old or without a reliable date are not offered. They stay in your library.',
    'Aucune image accessible n’a été trouvée. Vérifiez la sélection accordée à l’application.': 'No accessible images were found. Check which photos the app can access.',
    'Rappel désactivé.': 'Reminder is off.', 'Aperçu seulement dans le navigateur ; le rappel fonctionne dans l’application Android.': 'Browser preview only; reminders work in the Android app.',
    'Le réglage des notifications est indisponible pour le moment.': 'Notification settings are currently unavailable.',
    'Aperçu seulement dans le navigateur ; aucune notification n’a été programmée.': 'Browser preview only; no notification has been scheduled.',
    'Impossible de désactiver le rappel. Réessayez.': 'Could not turn off the reminder. Try again.',
    'Le rappel n’a pas pu être programmé. Vérifiez les notifications Android puis réessayez.': 'Could not schedule the reminder. Check Android notifications and try again.',
    'L’heure du rappel n’a pas pu être modifiée.': 'Could not change the reminder time.',
    'La photo originale sera partagée via Android.': 'The original photo will be shared through Android.',
    'Seules les applications compatibles installées sur cet appareil seront proposées.': 'Only compatible apps installed on this device will be offered.',
    'Aperçu uniquement · aucune photo ne sera envoyée.': 'Preview only · no photo will be shared.',
    'Aperçu uniquement · aucune permission Android n’a été demandée.': 'Preview only · no Android permission was requested.',
    'Aucune photo n’est actuellement accessible.': 'No photos are currently accessible.', 'L’accès à la galerie n’est pas autorisé.': 'Photo library access is not allowed.',
    'La galerie n’a pas pu être actualisée. Réessayez.': 'Could not refresh the photo library. Try again.', 'Une actualisation est déjà en cours.': 'A refresh is already in progress.',
    'Aperçu uniquement · l’export JSON sera ajouté plus tard.': 'Preview only · JSON export will be added later.',
    'Aperçu uniquement · aucune donnée n’a été importée.': 'Preview only · no data was imported.',
    'Impossible de partager cette photo. Vérifiez qu’elle est toujours accessible.': 'Could not share this photo. Check that it is still accessible.',
    'Une donnée n’a pas pu être enregistrée. Vérifiez le stockage de l’application.': 'A change could not be saved. Check the app storage.',
    'La base locale est indisponible. Les changements resteront temporaires pour cette session.': 'Local storage is unavailable. Changes will be temporary for this session.',
    'Cette photo n’est plus accessible. Actualisez l’accès dans les réglages.': 'This photo is no longer accessible. Refresh access in settings.',
    'Vérifier de nouveau': 'Check again', 'Gérer l’accès dans Android': 'Manage access in Android', 'PHOTOTHÈQUE': 'PHOTO LIBRARY',
    'VOTRE PHOTOTHÈQUE, VOTRE CHOIX': 'YOUR PHOTO LIBRARY, YOUR CHOICE', 'L’accès peut être<br>modifié à tout moment.': 'You can change<br>access at any time.',
    'Sans votre accord, Momenta ne lit aucune photo. Vous pourrez toujours autoriser l’accès plus tard.': 'Without your permission, Momenta cannot read any photos. You can allow access later.',
    'Android a bloqué la demande d’accès. Vous pouvez l’autoriser depuis les réglages de l’application.': 'Android blocked the access request. You can allow access in the app settings.',
    'Demander l’accès aux photos': 'Request photo access', 'Ouvrir les réglages Android': 'Open Android settings',
    'Aucune photo n’a été chargée.': 'No photos have been loaded.', 'Retrouvez vos photos,<br>à votre rythme.': 'Rediscover your photos,<br>at your own pace.',
    'Impossible de lire la photothèque. Vérifiez l’accès puis réessayez.': 'Could not read the photo library. Check access and try again.',
    'Photo de votre photothèque personnelle': 'Photo from your personal library', 'Un souvenir retrouvé': 'A memory rediscovered',
    'RÉCEMMENT': 'RECENTLY', 'Aperçu uniquement · aucune permission Android n’a été demandée.': 'Preview only · no Android permission was requested.',
    'Le partage Android sera disponible avec une photo de votre galerie.': 'Android sharing is available for photos from your library.',
    'Choisissez une application dans le menu Android.': 'Choose an app from the Android menu.',
    'Aperçu uniquement · l’export JSON sera ajouté plus tard.': 'Preview only · JSON export will be added later.',
    '12 tags maximum par photo.': 'Up to 12 tags per photo.',
    'Accès complet': 'Full access', 'Accès sélectionné': 'Selected access',
    'VOS SOUVENIRS RESTENT SUR CET APPAREIL': 'YOUR MEMORIES STAY ON THIS DEVICE',
    'Un jardin fleuri dans la lumière du matin': 'A flower garden in the morning light',
    'Le chemin des nuages': 'The path through the clouds', 'Aucun souvenir': 'No memories',
    'APERÇU · PHOTOTHÈQUE VIDE': 'PREVIEW · EMPTY PHOTO LIBRARY'
  };

  const attrs = {
    'Momenta, accueil': 'Momenta, home', 'Ouvrir l’historique': 'Open history', 'Historique': 'History', 'Ouvrir les albums': 'Open albums',
    'Ouvrir les réglages et données': 'Open settings and data', 'Réglages': 'Settings', 'Souvenir photo': 'Photo memory',
    'Partager cette photo': 'Share this photo', 'Partager': 'Share', 'Photo suivante': 'Next photo', 'Souvenir précédent': 'Previous memory',
    'Précédent': 'Previous', 'Souvenir suivant': 'Next memory', 'Suivant': 'Next', 'Progression des souvenirs du jour': 'Daily memory progress',
    'Fermer': 'Close', 'Tags de cette photo': 'Tags for this photo', 'Suggestions de tags': 'Tag suggestions',
    'Illustration d’un rivage calme au coucher du soleil': 'Illustration of a quiet shore at sunset',
    'Illustration d’un jardin fleuri dans la lumière du matin': 'Illustration of a flower garden in the morning light',
    'Illustration de montagnes au soleil couchant': 'Illustration of mountains at sunset',
    'Illustration d’un marché de village en été': 'Illustration of a village market in summer',
    'Illustration d’une fenêtre ouverte sur des collines': 'Illustration of an open window overlooking hills',
    'Une personne, un lieu, une sensation…': 'A person, a place, a feeling…', 'Ex. Famille, Voyage…': 'e.g. Family, Travel…'
  };

  const key = 'momenta-language';
  const reverseAttrs = Object.fromEntries(Object.entries(attrs).map(([source, target]) => [target, source]));
  const detectSystemLanguage = () => {
    const systemLocales = [...(navigator.languages || []), navigator.language || ''];
    const preferredSupportedLocale = systemLocales.find((locale) => /^(?:en|fr)(?:-|$)/i.test(locale));
    return /^en(?:-|$)/i.test(preferredSupportedLocale || '') ? 'en' : 'fr';
  };
  let hasSavedLanguage = false;
  let language = detectSystemLanguage();
  try {
    const savedLanguage = localStorage.getItem(key);
    if (savedLanguage === 'en' || savedLanguage === 'fr') {
      language = savedLanguage;
      hasSavedLanguage = true;
    }
  } catch { /* Follow the phone language if browser storage is unavailable. */ }
  const normalize = (value) => value.replace(/\s+/g, ' ').trim();
  function translate(value) {
    if (language === 'fr') return value;
    const text = normalize(value);
    if (strings[text] || attrs[text]) return strings[text] || attrs[text];
    let match;
    if ((match = text.match(/^(\d+)\/(\d+) souvenirs$/i))) return `${match[1]}/${match[2]} memories`;
    if ((match = text.match(/^(\d+) album(?:s)? · les photos apparaissent selon leurs tags\.$/i))) return `${match[1]} album${match[1] === '1' ? '' : 's'} · photos are grouped by their tags.`;
    if ((match = text.match(/^(\d+) souvenir(?:s)?$/i))) return `${match[1]} memor${match[1] === '1' ? 'y' : 'ies'}`;
    if ((match = text.match(/^(\d+) album(?:s)?$/i))) return `${match[1]} album${match[1] === '1' ? '' : 's'}`;
    if ((match = text.match(/^(\d+)\s*\/\s*280$/))) return `${match[1]} / 280`;
    if ((match = text.match(/^ÉTÉ (\d{4}) · BORD DE MER$/i))) return `SUMMER ${match[1]} · SEASIDE`;
    if ((match = text.match(/^MAI (\d{4}) · CHEZ MAMIE$/i))) return `MAY ${match[1]} · GRANDMA’S`;
    if ((match = text.match(/^OCTOBRE (\d{4}) · LES ALPES$/i))) return `OCTOBER ${match[1]} · THE ALPS`;
    if ((match = text.match(/^AOÛT (\d{4}) · LE VILLAGE$/i))) return `AUGUST ${match[1]} · THE VILLAGE`;
    if ((match = text.match(/^REDÉCOUVERT LE (.+)$/i))) return `REDISCOVERED ${match[1]}`;
    if ((match = text.match(/^(\d+) album(?:s)? · les photos apparaissent selon leurs tags\.$/i))) return `${match[1]} album${match[1] === '1' ? '' : 's'} · photos are grouped by their tags.`;
    if ((match = text.match(/^Rappel activé à (.+)\. Il peut arriver avec un léger décalage selon Android\.$/i))) return `Reminder set for ${match[1]}. Android may deliver it with a slight delay.`;
    if ((match = text.match(/^Rappel activé autour de (.+)\. Vous pouvez le désactiver ici\.$/i))) return `Reminder set for around ${match[1]}. You can turn it off here.`;
    if ((match = text.match(/^Heure mise à jour : rappel autour de (.+)\.$/i))) return `Time updated: reminder around ${match[1]}.`;
    if ((match = text.match(/^Galerie actualisée · (\d+) photo( s)? éligible( s)? sur (\d+) accessible( s)?\. La sélection du jour reste inchangée\.$/i))) return `Library refreshed · ${match[1]} eligible photo${match[1] === '1' ? '' : 's'} out of ${match[4]} accessible. Today’s selection stays the same.`;
    if ((match = text.match(/^(\d+) photo(?:s)? accessible?, mais aucune n’est éligible \(moins de 30 jours ou date inconnue\)\.$/i))) return `${match[1]} photo${match[1] === '1' ? '' : 's'} accessible, but none eligible (under 30 days old or date unknown).`;
    if ((match = text.match(/^(\d+) photo(?:s)? éligible(?:s)? sur (\d+) accessible(?:s)?\.$/i))) return `${match[1]} eligible photo${match[1] === '1' ? '' : 's'} out of ${match[2]} accessible.`;
    if ((match = text.match(/^(\d+) souvenir(?:s)? redécouvert(?:s)? · vos pensées restent ici\.$/i))) return `${match[1]} memor${match[1] === '1' ? 'y' : 'ies'} rediscovered · your notes stay here.`;
    if ((match = text.match(/^Accès complet · ([\d.,]+) éligibles? sur ([\d.,]+) photos?$/i))) return `Full access · ${match[1]} eligible out of ${match[2]} photos`;
    if ((match = text.match(/^Accès sélectionné · ([\d.,]+) éligibles? sur ([\d.,]+) photos?$/i))) return `Selected access · ${match[1]} eligible out of ${match[2]} photos`;
    if ((match = text.match(/^([\d.,]+) photos? non éligibles? · délai ou date inconnue$/i))) return `${match[1]} photos not eligible · too recent or date unknown`;
    if ((match = text.match(/^Galerie actualisée · ([\d.,]+) photos? éligibles? sur ([\d.,]+) accessibles?\. La sélection du jour reste inchangée\.$/i))) return `Library refreshed · ${match[1]} eligible photos out of ${match[2]} accessible. Today’s selection stays the same.`;
    if ((match = text.match(/^Aperçu uniquement · « (.+) » s’ouvrirait ici\.$/i))) return `Preview only · “${match[1]}” would open here.`;
    if (/^ÉTÉ /i.test(text)) return text.replace(/^ÉTÉ /i, 'SUMMER ').replace(/BORD DE MER/i, 'SEASIDE');
    if (/^MAI /i.test(text)) return text.replace(/^MAI /i, 'MAY ').replace(/CHEZ MAMIE/i, 'GRANDMA’S');
    if (/^OCTOBRE /i.test(text)) return text.replace(/^OCTOBRE /i, 'OCTOBER ').replace(/LES ALPES/i, 'THE ALPS');
    if (/^AOÛT /i.test(text)) return text.replace(/^AOÛT /i, 'AUGUST ').replace(/LE VILLAGE/i, 'THE VILLAGE');
    return strings[text] || value;
  }

  function apply(root = document) {
    if (!root?.createTreeWalker) return;
    const walker = document.createTreeWalker(root.body || root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement?.closest('input, textarea, select, .history-card p, .history-card .eyebrow, .album-card-copy strong, .tag-chip, #album-detail-title, #note-input, #tag-input')) continue;
      const original = node.__momentaSource || node.nodeValue;
      node.__momentaSource = original;
      const leading = original.match(/^\s*/)?.[0] || '';
      const trailing = original.match(/\s*$/)?.[0] || '';
      const translated = translate(original);
      if (translated !== original) node.nodeValue = leading + translated + trailing;
    }
    root.querySelectorAll?.('*').forEach((element) => {
      for (const name of ['aria-label', 'title', 'placeholder']) {
        const value = element.getAttribute(name);
        const source = element.dataset[`momenta${name}Source`] || reverseAttrs[value] || value;
        if (source && attrs[source]) {
          element.dataset[`momenta${name}Source`] = source;
          element.setAttribute(name, language === 'en' ? attrs[source] : source);
        }
      }
    });
    document.documentElement.lang = language;
    document.title = language === 'en' ? strings['Momenta — un souvenir à la fois'] : 'Momenta — un souvenir à la fois';
    const selector = document.getElementById('language-select');
    if (selector) selector.value = language;
  }

  function setLanguage(value) {
    language = value === 'en' ? 'en' : 'fr';
    hasSavedLanguage = true;
    try { localStorage.setItem(key, language); } catch { /* The selected language lasts for this visit. */ }
    apply();
    window.dispatchEvent(new CustomEvent('momenta-language-change', { detail: { language } }));
  }

  window.MomentaI18n = { apply, setLanguage, translate, get language() { return language; } };
  window.addEventListener('languagechange', () => {
    if (hasSavedLanguage) return;
    language = detectSystemLanguage();
    apply();
    window.dispatchEvent(new CustomEvent('momenta-language-change', { detail: { language } }));
  });
  document.addEventListener('DOMContentLoaded', () => apply());
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body) new MutationObserver(() => apply()).observe(document.body, { childList: true, subtree: true });
  });
})();
