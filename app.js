(() => {
  'use strict';

  const demoMemories = [
    { id: 'coast', image: 'assets/coast.svg', alt: 'Illustration d’un rivage calme au coucher du soleil', date: 'ÉTÉ 2021 · BORD DE MER', title: 'Là où le temps ralentit' },
    { id: 'garden', image: 'assets/garden.svg', alt: 'Illustration d’un jardin fleuri dans la lumière du matin', date: 'MAI 2022 · CHEZ MAMIE', title: 'Le jardin après la pluie' },
    { id: 'mountain', image: 'assets/mountain.svg', alt: 'Illustration de montagnes au soleil couchant', date: 'OCTOBRE 2020 · LES ALPES', title: 'Le chemin des nuages' },
    { id: 'market', image: 'assets/market.svg', alt: 'Illustration d’un marché de village en été', date: 'AOÛT 2019 · LE VILLAGE', title: 'Un matin de marché' },
    { id: 'window', image: 'assets/window.svg', alt: 'Illustration d’une fenêtre ouverte sur des collines', date: '', title: 'La chambre aux volets bleus' }
  ];
  let memories = demoMemories.slice();
  const sessionSize = 5;
  const keys = { index: 'momenta-prototype-index', comments: 'momenta-prototype-comments', photoTags: 'momenta-prototype-photo-tags', history: 'momenta-prototype-history', reminder: 'momenta-daily-reminder', nativePhotos: 'momenta-native-session-photos', nativeDay: 'momenta-native-session-day', nativeSeen: 'momenta-native-seen-photos' };
  const load = (key, fallback) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch { return fallback; }
  };
  let index = Math.min(Math.max(Number(load(keys.index, 0)) || 0, 0), sessionSize - 1);
  const storedComments = load(keys.comments, {});
  let comments = storedComments && typeof storedComments === 'object' && !Array.isArray(storedComments) ? storedComments : {};
  const storedPhotoTags = load(keys.photoTags, {});
  let photoTags = storedPhotoTags && typeof storedPhotoTags === 'object' && !Array.isArray(storedPhotoTags) ? storedPhotoTags : {};
  let editingTags = [];
  let collectionReturn = '';
  const storedHistory = load(keys.history, []);
  let history = Array.isArray(storedHistory) ? storedHistory : [];
  const storedSeenPhotoIds = load(keys.nativeSeen, []);
  let seenPhotoIds = Array.isArray(storedSeenPhotoIds) ? storedSeenPhotoIds : [];
  let nativeSessionDay = load(keys.nativeDay, '');
  const storedSessionPhotoIds = load(keys.nativePhotos, []);
  let nativeSessionPhotoIds = Array.isArray(storedSessionPhotoIds) ? storedSessionPhotoIds : [];
  const isNativeAndroid = window.Capacitor?.getPlatform?.() === 'android';
  const photoLibrary = isNativeAndroid ? window.Capacitor.Plugins?.PhotoLibrary : null;
  const localData = isNativeAndroid ? window.Capacitor.Plugins?.LocalData : null;
  const dailyReminder = isNativeAndroid ? window.Capacitor.Plugins?.DailyReminder : null;
  let localDataReady = false;
  let databaseErrorShown = false;
  let persistenceQueue = Promise.resolve();
  let historicalPreview = false;
  let savedDiscoverSession = null;
  let nativePhotos = false;
  let nativeAccess = { state: 'denied', canRequest: true };
  let nativePhotoCount = 0;
  let nativeGalleryPhotoCount = 0;
  let loadingNativeGallery = false;
  const initialReminder = load(keys.reminder, { enabled: false, time: '19:00' });
  let reminderState = { enabled: Boolean(initialReminder?.enabled), time: /^([01]\d|2[0-3]):[0-5]\d$/.test(initialReminder?.time || '') ? initialReminder.time : '19:00', permissionGranted: false };

  const $ = (id) => document.getElementById(id);
  const translate = (value) => window.MomentaI18n?.translate(value) || value;
  const locale = () => window.MomentaI18n?.language === 'en' ? 'en-US' : 'fr-FR';
  const image = $('memory-image');
  const frame = $('photo-frame');
  const progress = $('progress-track');
  const noteDialog = $('note-dialog');
  const shareDialog = $('share-dialog');
  const noteInput = $('note-input');
  let pointerStart = null;
  let toastTimer = null;

  function save(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Prototype still works for this visit if storage is unavailable. */ } }

  function queueDatabaseWrite(method, data) {
    if (!localData || !localDataReady) return Promise.resolve(false);
    persistenceQueue = persistenceQueue.catch(() => false).then(() => localData[method](data)).then(() => true).catch((error) => {
      console.error(`Local database operation failed: ${method}`, error);
      if (!databaseErrorShown) {
        databaseErrorShown = true;
        showToast('Une donnée n’a pas pu être enregistrée. Vérifiez le stockage de l’application.');
      }
      return false;
    });
    return persistenceQueue;
  }

  async function initializeLocalData() {
    if (!localData) return;
    try {
      await localData.migrateLegacyData({
        data: {
          comments: load(keys.comments, {}),
          photoTags: load(keys.photoTags, {}),
          history: load(keys.history, []),
          seenIds: Array.isArray(load(keys.nativeSeen, [])) ? load(keys.nativeSeen, []) : [],
          session: {
            day: load(keys.nativeDay, ''),
            photoIds: Array.isArray(load(keys.nativePhotos, [])) ? load(keys.nativePhotos, []) : [],
            index: Math.max(0, Number(load(keys.index, 0)) || 0)
          }
        }
      });
      const snapshot = await localData.getSnapshot();
      comments = snapshot.comments && typeof snapshot.comments === 'object' ? snapshot.comments : {};
      photoTags = snapshot.photoTags && typeof snapshot.photoTags === 'object' ? snapshot.photoTags : {};
      history = Array.isArray(snapshot.history) ? snapshot.history : [];
      seenPhotoIds = Array.isArray(snapshot.seenIds) ? snapshot.seenIds : [];
      nativeSessionDay = snapshot.sessionDay || '';
      nativeSessionPhotoIds = Array.isArray(snapshot.sessionPhotoIds) ? snapshot.sessionPhotoIds : [];
      index = Math.max(0, Number(snapshot.sessionIndex) || 0);
      localDataReady = true;
      [keys.comments, keys.photoTags, keys.history, keys.nativeSeen, keys.nativeDay, keys.nativePhotos, keys.index].forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Local database initialization failed', error);
      showToast('La base locale est indisponible. Les changements resteront temporaires pour cette session.');
    }
  }

  function persistSession() {
    if (!nativePhotos || historicalPreview) return;
    nativeSessionDay = nativeSessionDay || currentLocalDay();
    nativeSessionPhotoIds = memories.map((photo) => photo.id);
    if (localDataReady) {
      queueDatabaseWrite('saveSession', { day: nativeSessionDay, photoIds: nativeSessionPhotoIds, index });
    } else {
      save(keys.nativeDay, nativeSessionDay);
      save(keys.nativePhotos, nativeSessionPhotoIds);
      save(keys.index, index);
    }
  }

  function currentLocalDay() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  function remember(memory) {
    const found = history.find((item) => item.id === memory.id);
    if (!found) {
      const discoveredAt = new Date().toISOString();
      history.unshift({ id: memory.id, discoveredAt });
      if (localDataReady) queueDatabaseWrite('recordDiscovery', { photoId: memory.id, discoveredAt });
      else save(keys.history, history);
    }
  }

  function rememberNativeSeen(memory) {
    if (!nativePhotos) return;
    if (!Array.isArray(seenPhotoIds)) seenPhotoIds = [];
    if (!seenPhotoIds.includes(memory.id)) {
      seenPhotoIds.push(memory.id);
      if (localDataReady) queueDatabaseWrite('markSeen', { photoId: memory.id });
      else save(keys.nativeSeen, seenPhotoIds);
    }
  }

  function render() {
    const memory = memories[index];
    if (!memory) return;
    if (memory.image) image.src = memory.image;
    else if (photoLibrary) {
      image.src = 'assets/coast.svg';
      photoLibrary.getThumbnail({ id: memory.id }).then((result) => {
        if (memories[index]?.id === memory.id && result?.dataUrl) {
          memory.image = result.dataUrl;
          image.src = result.dataUrl;
        }
      }).catch(() => showToast('Cette photo n’est plus accessible. Actualisez l’accès dans les réglages.'));
    }
    image.alt = translate(memory.alt);
    $('photo-title').textContent = memory.title;
    $('photo-date').textContent = memory.date || translate('DATE NON DISPONIBLE');
    $('photo-number').textContent = String(index + 1).padStart(2, '0');
    const visibleSessionSize = Math.min(sessionSize, memories.length);
    $('session-count').innerHTML = `${index + 1}/${visibleSessionSize} <span>${translate('souvenirs')}</span>`;
    progress.setAttribute('aria-valuenow', String(index + 1));
    progress.setAttribute('aria-valuemax', String(visibleSessionSize));
    $('progress-fill').style.width = `${((index + 1) / visibleSessionSize) * 100}%`;
    $('note-button-title').textContent = translate(comments[memory.id] ? 'Modifier mon mot' : 'Ajouter un mot');
    $('previous-button').disabled = index === 0;
    $('previous-button').style.opacity = index === 0 ? '.42' : '1';
    $('next-button').disabled = index === visibleSessionSize - 1;
    $('next-button').style.opacity = index === visibleSessionSize - 1 ? '.42' : '1';
    $('swipe-hint').setAttribute('aria-label', translate(index === visibleSessionSize - 1 ? 'Dernier souvenir de la session' : 'Glissez pour découvrir le souvenir suivant'));
    if (!historicalPreview) {
      remember(memory);
      rememberNativeSeen(memory);
      if (nativePhotos) persistSession();
      else save(keys.index, index);
    }
  }

  function move(direction) {
    const next = Math.min(Math.max(index + direction, 0), Math.min(sessionSize, memories.length) - 1);
    if (next === index) return;
    index = next;
    frame.classList.remove('slide-next', 'slide-prev');
    frame.classList.add(direction > 0 ? 'slide-next' : 'slide-prev');
    window.setTimeout(() => { render(); frame.classList.remove('slide-next', 'slide-prev'); }, 110);
  }

  function showNativeGate(kind = 'permission') {
    $('discover-view').hidden = true;
    $('history-view').hidden = true;
    $('albums-view').hidden = true;
    $('tools-view').hidden = true;
    $('empty-preview-view').hidden = true;
    $('access-gate-view').hidden = false;
    const heading = $('access-gate-heading');
    const copy = $('access-gate-copy');
    const action = $('access-gate-action');
    const status = $('access-gate-status');
    if (kind === 'empty') {
      $('access-gate-eyebrow').textContent = 'PHOTOTHÈQUE';
      heading.innerHTML = nativeGalleryPhotoCount ? 'Vos photos attendent<br>un peu avant le souvenir.' : 'Aucun souvenir<br>accessible pour le moment.';
      copy.textContent = nativeGalleryPhotoCount
        ? 'Les photos restent dans votre galerie. Celles de moins de 30 jours ou sans date fiable ne sont pas proposées. Vérifiez aussi la sélection autorisée dans Android.'
        : 'Aucune photo accessible n’a été trouvée. Ajoutez des images à votre galerie ou modifiez la sélection autorisée dans Android.';
      action.textContent = nativeAccess.canRequest ? 'Vérifier de nouveau' : 'Gérer l’accès dans Android';
      status.textContent = `${nativePhotoCount} photo${nativePhotoCount === 1 ? '' : 's'} éligible${nativePhotoCount === 1 ? '' : 's'} sur ${nativeGalleryPhotoCount} accessible${nativeGalleryPhotoCount === 1 ? '' : 's'}.`;
    } else if (kind === 'denied') {
      $('access-gate-eyebrow').textContent = 'VOTRE PHOTOTHÈQUE, VOTRE CHOIX';
      heading.innerHTML = 'L’accès peut être<br>modifié à tout moment.';
      copy.textContent = nativeAccess.canRequest ? 'Sans votre accord, Momenta ne lit aucune photo. Vous pourrez toujours autoriser l’accès plus tard.' : 'Android a bloqué la demande d’accès. Vous pouvez l’autoriser depuis les réglages de l’application.';
      action.textContent = nativeAccess.canRequest ? 'Demander l’accès aux photos' : 'Ouvrir les réglages Android';
      status.textContent = 'Aucune photo n’a été chargée.';
    } else {
      $('access-gate-eyebrow').textContent = 'VOS SOUVENIRS RESTENT SUR CET APPAREIL';
      heading.innerHTML = 'Retrouvez vos photos,<br>à votre rythme.';
      copy.textContent = 'Momenta a besoin de votre accord pour parcourir les images de votre photothèque. Les images restent sur votre téléphone.';
      action.textContent = 'Continuer vers mes photos';
      status.textContent = '';
    }
  }

  function formatCaptureDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'long', year: 'numeric' }).format(date).toLocaleUpperCase(locale());
  }

  async function refreshNativeGallery() {
    if (!photoLibrary || loadingNativeGallery || historicalPreview) return 'skipped';
    const keepToolsVisible = !$('tools-view').hidden;
    loadingNativeGallery = true;
    try {
      nativeAccess = await photoLibrary.getAccessState();
      if (nativeAccess.state === 'denied') {
        nativePhotos = false;
        nativePhotoCount = 0;
        nativeGalleryPhotoCount = 0;
        if (keepToolsVisible) updateAccessState('denied');
        else showNativeGate('denied');
        return 'denied';
      }
      const localDay = currentLocalDay();
      const sameDay = nativeSessionDay === localDay;
      const previousIds = sameDay ? (nativePhotos ? memories.map((photo) => photo.id) : nativeSessionPhotoIds) : [];
      const seenIds = Array.isArray(seenPhotoIds) ? seenPhotoIds : [];
      let result = await photoLibrary.getMemories({ previousIds, seenIds });
      if (result.cycleComplete && !sameDay) {
        seenPhotoIds = [];
        if (localDataReady) await queueDatabaseWrite('resetSeenPhotos', {});
        else save(keys.nativeSeen, []);
        result = await photoLibrary.getMemories({ previousIds: [], seenIds: [] });
      }
      nativeAccess = result.access || nativeAccess;
      nativePhotoCount = Number(result.totalCount) || 0;
      nativeGalleryPhotoCount = Number(result.galleryCount) || 0;
      if (!Array.isArray(result.photos) || result.photos.length === 0) {
        nativeAccess = { ...nativeAccess, state: 'empty' };
        nativePhotos = false;
        if (keepToolsVisible) updateAccessState('empty');
        else showNativeGate('empty');
        return 'empty';
      }
      memories = result.photos.map((photo) => ({
        id: photo.id,
        image: null,
        alt: 'Photo de votre photothèque personnelle',
        date: formatCaptureDate(photo.dateTaken),
        title: 'Un souvenir retrouvé'
      }));
      nativeSessionDay = localDay;
      nativeSessionPhotoIds = memories.map((photo) => photo.id);
      nativePhotos = true;
      index = sameDay ? Math.min(Math.max(Number(index) || 0, 0), memories.length - 1) : 0;
      $('access-gate-view').hidden = true;
      $('discover-view').hidden = keepToolsVisible;
      if (keepToolsVisible) updateAccessState(nativeAccess.state);
      render();
      return 'updated';
    } catch (error) {
      nativePhotos = false;
      if (keepToolsVisible) updateAccessState('denied');
      else showNativeGate('denied');
      $('access-gate-status').textContent = 'Impossible de lire la photothèque. Vérifiez l’accès puis réessayez.';
      return 'error';
    } finally {
      loadingNativeGallery = false;
    }
  }

  async function requestNativeAccess() {
    if (!photoLibrary) return;
    const action = $('access-gate-action');
    action.disabled = true;
    $('access-gate-status').textContent = 'Vérification de l’accès…';
    try {
      if (nativeAccess.state === 'denied' && nativeAccess.canRequest) nativeAccess = await photoLibrary.requestAccess();
      else if (nativeAccess.state === 'denied') await photoLibrary.openAppSettings();
      await refreshNativeGallery();
    } catch (error) {
      showNativeGate('denied');
      $('access-gate-status').textContent = 'La demande n’a pas abouti. Vous pouvez réessayer dans les réglages Android.';
    } finally {
      action.disabled = false;
    }
  }

  function hideCollectionViews() {
    $('history-view').hidden = true;
    $('albums-view').hidden = true;
    $('tools-view').hidden = true;
    $('empty-preview-view').hidden = true;
  }

  function showAlbums() {
    $('discover-view').hidden = true;
    $('access-gate-view').hidden = true;
    hideCollectionViews();
    $('albums-view').hidden = false;
    $('album-detail').hidden = true;
    $('album-list').hidden = false;
    const albums = [...new Set(Object.values(photoTags).flat().filter((tag) => typeof tag === 'string' && tag.trim()))]
      .sort((a, b) => a.localeCompare(b, locale(), { sensitivity: 'base' }));
    $('albums-subtitle').textContent = `${albums.length} album${albums.length === 1 ? '' : 's'} · les photos apparaissent selon leurs tags.`;
    $('album-empty').hidden = albums.length > 0;
    $('album-list').replaceChildren();
    albums.forEach((tag) => {
      const ids = Object.keys(photoTags).filter((id) => photoTags[id].some((item) => item.toLocaleLowerCase(locale()) === tag.toLocaleLowerCase(locale())));
      const card = document.createElement('button');
      card.type = 'button'; card.className = 'album-card';
      const preview = document.createElement('span'); preview.className = 'album-card-art'; preview.textContent = '✳';
      const copy = document.createElement('span'); copy.className = 'album-card-copy';
      const title = document.createElement('strong'); title.textContent = tag;
      const count = document.createElement('small'); count.textContent = `${ids.length} souvenir${ids.length === 1 ? '' : 's'}`;
      copy.append(title, count); const arrow = document.createElement('span'); arrow.className = 'history-card-arrow'; arrow.textContent = '↗';
      card.append(preview, copy, arrow); card.addEventListener('click', () => showAlbum(tag)); $('album-list').append(card);
    });
  }

  function memoryForId(id) {
    return memories.find((item) => item.id === id) || demoMemories.find((item) => item.id === id) || {
      id, image: null, alt: 'Photo de votre photothèque personnelle', date: '', title: 'Un souvenir retrouvé'
    };
  }

  function showAlbum(tag) {
    const ids = Object.keys(photoTags).filter((id) => photoTags[id].some((item) => item.toLocaleLowerCase(locale()) === tag.toLocaleLowerCase(locale())));
    $('album-list').hidden = true; $('album-empty').hidden = true; $('album-detail').hidden = false;
    $('album-detail-title').textContent = tag;
    $('album-photo-list').replaceChildren();
    ids.forEach((id) => {
      const memory = memoryForId(id);
      const card = document.createElement('button'); card.type = 'button'; card.className = 'history-card';
      const thumb = document.createElement('img'); thumb.alt = ''; thumb.src = memory.image || 'assets/coast.svg';
      if (photoLibrary && !memory.image) photoLibrary.getThumbnail({ id }).then((result) => { if (card.isConnected && result?.dataUrl) thumb.src = result.dataUrl; }).catch(() => thumb.classList.add('history-photo-unavailable'));
      const copy = document.createElement('span'); copy.className = 'history-card-copy';
      const date = document.createElement('span'); date.className = 'eyebrow'; date.textContent = memory.date || 'SOUVENIR ÉTIQUETÉ';
      const title = document.createElement('strong'); title.textContent = memory.title;
      copy.append(date, title);
      if (comments[id]) { const note = document.createElement('p'); note.textContent = `« ${comments[id]} »`; copy.append(note); }
      const arrow = document.createElement('span'); arrow.className = 'history-card-arrow'; arrow.textContent = '↗';
      card.append(thumb, copy, arrow); card.addEventListener('click', () => openCollectionMemory(memory, true)); $('album-photo-list').append(card);
    });
  }

  async function openCollectionMemory(memory, fromAlbum = false) {
    if (photoLibrary) {
      let imageData = memory.image;
      if (!imageData || imageData.startsWith('assets/')) {
        try { imageData = (await photoLibrary.getThumbnail({ id: memory.id }))?.dataUrl; }
        catch { showToast('Cette photo n’est plus accessible. Ses tags et son commentaire restent conservés.'); return; }
      }
      if (!imageData) return;
      collectionReturn = fromAlbum ? 'albums' : 'history'; $('collection-back').hidden = false;
      if (!savedDiscoverSession) savedDiscoverSession = { memories, index, nativePhotos };
      memories = [{ ...memory, image: imageData }]; index = 0; historicalPreview = true;
      hideCollectionViews(); $('discover-view').hidden = false; $('access-gate-view').hidden = true; render(); return;
    }
    index = memories.findIndex((item) => item.id === memory.id);
    if (index >= 0) {
      collectionReturn = fromAlbum ? 'albums' : 'history'; $('collection-back').hidden = false;
      save(keys.index, index);
      $('history-view').hidden = true; $('albums-view').hidden = true;
      $('discover-view').hidden = false; $('access-gate-view').hidden = true;
      render();
    }
  }

  function showHistory() {
    $('discover-view').hidden = true;
    $('access-gate-view').hidden = true;
    $('history-view').hidden = false;
    $('albums-view').hidden = true;
    $('tools-view').hidden = true;
    $('empty-preview-view').hidden = true;
    $('history-list').replaceChildren();
    const entries = history.map((entry) => ({
      ...entry,
      memory: memories.find((memory) => memory.id === entry.id) || {
        id: entry.id,
        image: null,
        alt: 'Photo de votre photothèque personnelle',
        date: '',
        title: 'Un souvenir retrouvé'
      }
    }));
    $('history-empty').hidden = entries.length !== 0;
    $('history-list').hidden = entries.length === 0;
    $('history-subtitle').textContent = `${entries.length} souvenir${entries.length === 1 ? '' : 's'} redécouvert${entries.length === 1 ? '' : 's'} · vos pensées restent ici.`;
    entries.forEach(({ memory, discoveredAt }) => {
      const card = document.createElement('button');
      card.className = 'history-card';
      card.type = 'button';
      card.setAttribute('aria-label', `Revoir ${memory.title}`);
      const thumb = document.createElement('img'); thumb.src = memory.image || 'assets/coast.svg'; thumb.alt = '';
      if (photoLibrary && !memory.image) {
        photoLibrary.getThumbnail({ id: memory.id }).then((result) => {
          if (card.isConnected && result?.dataUrl) thumb.src = result.dataUrl;
        }).catch(() => { thumb.classList.add('history-photo-unavailable'); });
      }
      const copy = document.createElement('span'); copy.className = 'history-card-copy';
      const date = document.createElement('span'); date.className = 'eyebrow';
      const when = new Date(discoveredAt);
      date.textContent = `${translate('REDÉCOUVERT LE')} ${Number.isNaN(when.getTime()) ? translate('RÉCEMMENT') : new Intl.DateTimeFormat(locale(), { day: 'numeric', month: 'long' }).format(when).toLocaleUpperCase(locale())}`;
      const title = document.createElement('strong'); title.textContent = memory.title;
      copy.append(date, title);
      if (comments[memory.id]) { const note = document.createElement('p'); note.textContent = `« ${comments[memory.id]} »`; copy.append(note); }
      const arrow = document.createElement('span'); arrow.className = 'history-card-arrow'; arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↗';
      card.append(thumb, copy, arrow);
      card.addEventListener('click', () => openCollectionMemory(memory));
      $('history-list').append(card);
    });
  }

  function hideHistory() {
    $('history-view').hidden = true;
    if (historicalPreview && savedDiscoverSession) {
      memories = savedDiscoverSession.memories;
      index = savedDiscoverSession.index;
      nativePhotos = savedDiscoverSession.nativePhotos;
      historicalPreview = false;
      savedDiscoverSession = null;
      render();
    }
    $('discover-view').hidden = nativePhotos ? false : true;
    $('access-gate-view').hidden = nativePhotos;
    if (collectionReturn === 'albums') { collectionReturn = ''; showAlbums(); }
    else if (collectionReturn === 'history') { collectionReturn = ''; $('collection-back').hidden = true; }
  }

  function showTools() {
    $('discover-view').hidden = true;
    $('access-gate-view').hidden = true;
    $('history-view').hidden = true;
    $('albums-view').hidden = true;
    $('tools-view').hidden = false;
    $('empty-preview-view').hidden = true;
    updateAccessState(photoLibrary ? nativeAccess.state : 'full');
  }

  function hideTools() { $('tools-view').hidden = true; $('discover-view').hidden = nativePhotos ? false : true; $('access-gate-view').hidden = nativePhotos; }

  function showEmptyPreview() {
    $('discover-view').hidden = true;
    $('access-gate-view').hidden = true;
    $('history-view').hidden = true;
    $('albums-view').hidden = true;
    $('tools-view').hidden = true;
    $('empty-preview-view').hidden = false;
  }

  function updateAccessState(state) {
    const states = {
      full: { summary: 'Accès complet · 842 photos disponibles', meter: '100%', explanation: 'Les photos restent dans votre galerie. L’application lit uniquement les images auxquelles vous lui donnez accès.', action: 'Gérer l’accès aux photos' },
      limited: { summary: 'Accès à une sélection · 12 photos', meter: '18%', explanation: 'Seules les photos que vous sélectionnez apparaissent dans les souvenirs.', action: 'Modifier les photos sélectionnées' },
      denied: { summary: 'Autorisation refusée', meter: '0%', explanation: 'Vous pourrez autoriser l’accès plus tard dans les réglages Android. Rien n’est lu tant que vous n’avez pas donné votre accord.', action: 'Voir la demande d’accès' },
      empty: { summary: 'Aucune photo accessible', meter: '0%', explanation: 'Ajoutez des photos à la galerie ou vérifiez l’accès accordé à Momenta.', action: 'Vérifier l’accès aux photos' }
    };
    if (photoLibrary) {
      state = nativeAccess.state;
      const countLabel = new Intl.NumberFormat(locale()).format(nativePhotoCount);
      const galleryCountLabel = new Intl.NumberFormat(locale()).format(nativeGalleryPhotoCount);
      states.full.summary = `Accès complet · ${countLabel} éligible${nativePhotoCount === 1 ? '' : 's'} sur ${galleryCountLabel} photo${nativeGalleryPhotoCount === 1 ? '' : 's'}`;
      states.limited.summary = `Accès sélectionné · ${countLabel} éligible${nativePhotoCount === 1 ? '' : 's'} sur ${galleryCountLabel} photo${nativeGalleryPhotoCount === 1 ? '' : 's'}`;
      states.empty.summary = nativeGalleryPhotoCount
        ? `${galleryCountLabel} photo${nativeGalleryPhotoCount === 1 ? '' : 's'} non éligible${nativeGalleryPhotoCount === 1 ? '' : 's'} · délai ou date inconnue`
        : 'Aucune photo accessible';
      states.full.meter = states.limited.meter = nativePhotoCount ? '100%' : '0%';
      states.limited.explanation = 'Android ne donne accès qu’aux images choisies. Vous pouvez modifier cette sélection dans les réglages système.';
      states.denied.explanation = nativeAccess.canRequest ? 'Autorisez l’accès lorsque vous démarrez la découverte. Aucune image ne quitte votre téléphone.' : 'L’accès est bloqué pour le moment. Ouvrez les réglages Android pour l’autoriser.';
      states.empty.explanation = nativeGalleryPhotoCount
        ? 'Les photos de moins de 30 jours ou sans date fiable ne sont pas proposées. Elles restent dans votre galerie.'
        : 'Aucune image accessible n’a été trouvée. Vérifiez la sélection accordée à l’application.';
      document.querySelector('.access-card .preview-pill').hidden = true;
      document.querySelector('.access-state-row').hidden = true;
      $('empty-state-preview').hidden = true;
      $('refresh-photos').hidden = false;
      document.querySelector('.tools-view .prototype-caption').textContent = 'Les photos restent dans la galerie. Seules les images âgées d’au moins 30 jours sont proposées. Les sauvegardes restent à venir.';
      states.full.explanation = 'Les photos restent dans votre galerie. Seules les images âgées d’au moins 30 jours et accessibles à l’application peuvent être proposées.';
      states.limited.explanation = 'Android ne donne accès qu’aux images choisies. Seules celles âgées d’au moins 30 jours peuvent être proposées.';
    }
    const view = states[state] || states.denied;
    $('access-summary').textContent = view.summary;
    $('access-meter-fill').style.width = view.meter;
    $('access-explanation').textContent = view.explanation;
    $('access-action').firstChild.textContent = `${view.action} `;
    document.querySelectorAll('[data-access-state]').forEach((button) => {
      const selected = button.dataset.accessState === state;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
  }

  function showToast(message) {
    const toast = $('prototype-toast');
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2600);
  }

  function renderReminderSettings(message) {
    $('reminder-enabled').checked = reminderState.enabled;
    $('reminder-enabled').setAttribute('aria-checked', String(reminderState.enabled));
    $('reminder-time').value = reminderState.time;
    $('reminder-time').disabled = !reminderState.enabled;
    $('reminder-status').textContent = message || (dailyReminder
      ? reminderState.enabled ? `Rappel activé à ${reminderState.time}. Il peut arriver avec un léger décalage selon Android.` : 'Rappel désactivé.'
      : 'Aperçu seulement dans le navigateur ; le rappel fonctionne dans l’application Android.');
  }

  async function initializeReminder() {
    if (dailyReminder) {
      try {
        const state = await dailyReminder.getStatus();
        reminderState = { enabled: Boolean(state.enabled && state.permissionGranted), time: `${String(state.hour).padStart(2, '0')}:${String(state.minute).padStart(2, '0')}`, permissionGranted: Boolean(state.permissionGranted) };
      } catch (error) {
        console.error('Daily reminder status failed', error);
        renderReminderSettings('Le réglage des notifications est indisponible pour le moment.');
        return;
      }
    }
    renderReminderSettings();
  }

  async function setReminderEnabled(enabled) {
    if (!dailyReminder) {
      reminderState.enabled = enabled;
      save(keys.reminder, { enabled, time: reminderState.time });
      renderReminderSettings('Aperçu seulement dans le navigateur ; aucune notification n’a été programmée.');
      return;
    }
    if (!enabled) {
      try {
        await dailyReminder.cancel();
        reminderState.enabled = false;
        renderReminderSettings('Rappel désactivé.');
      } catch (error) { $('reminder-enabled').checked = true; showToast('Impossible de désactiver le rappel. Réessayez.'); }
      return;
    }
    try {
      const permission = await dailyReminder.requestPermission();
      if (!permission.permissionGranted) {
        reminderState.enabled = false;
        renderReminderSettings('Autorisez les notifications dans Android pour activer le rappel.');
        return;
      }
      const [hour, minute] = reminderState.time.split(':').map(Number);
      await dailyReminder.schedule({ hour, minute });
      reminderState.enabled = true; reminderState.permissionGranted = true;
      renderReminderSettings(`Rappel activé autour de ${reminderState.time}. Vous pouvez le désactiver ici.`);
    } catch (error) {
      console.error('Daily reminder schedule failed', error);
      reminderState.enabled = false;
      renderReminderSettings('Le rappel n’a pas pu être programmé. Vérifiez les notifications Android puis réessayez.');
    }
  }

  async function updateReminderTime() {
    const time = $('reminder-time').value;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return;
    reminderState.time = time;
    if (dailyReminder && reminderState.enabled) {
      try {
        const [hour, minute] = time.split(':').map(Number);
        await dailyReminder.schedule({ hour, minute });
        renderReminderSettings(`Heure mise à jour : rappel autour de ${time}.`);
      } catch (error) { showToast('L’heure du rappel n’a pas pu être modifiée.'); }
    } else {
      save(keys.reminder, { enabled: reminderState.enabled, time });
      renderReminderSettings(dailyReminder ? undefined : 'Aperçu seulement dans le navigateur ; aucune notification n’a été programmée.');
    }
  }

  function showShare() {
    const memory = memories[index];
    const canShareOriginal = Boolean(photoLibrary && nativePhotos && memory?.id);
    $('share-preview-image').src = memory.image || image.src;
    $('share-preview-title').textContent = memory.title;
    $('share-preview-date').textContent = memory.date || 'DATE NON DISPONIBLE';
    $('share-native-action').hidden = !canShareOriginal;
    document.querySelector('.share-targets').hidden = canShareOriginal;
    $('share-prompt').textContent = canShareOriginal ? 'La photo originale sera partagée via Android.' : 'Choisissez où l’envoyer';
    $('share-footnote').textContent = canShareOriginal
      ? 'Seules les applications compatibles installées sur cet appareil seront proposées.'
      : 'Aperçu uniquement · aucune photo ne sera envoyée.';
    shareDialog.showModal();
  }

  function renderTagEditor() {
    const selected = $('selected-tags'); selected.replaceChildren();
    editingTags.forEach((tag) => {
      const chip = document.createElement('button'); chip.type = 'button'; chip.className = 'tag-chip is-selected';
      chip.setAttribute('aria-label', `Retirer le tag ${tag}`); chip.textContent = `${tag} ×`;
      chip.addEventListener('click', () => { editingTags = editingTags.filter((item) => item !== tag); renderTagEditor(); }); selected.append(chip);
    });
    const suggestions = [...new Set(Object.values(photoTags).flat())].filter((tag) => !editingTags.some((item) => item.toLocaleLowerCase(locale()) === tag.toLocaleLowerCase(locale()))).sort((a, b) => a.localeCompare(b, locale()));
    const list = $('tag-suggestions'); list.replaceChildren();
    suggestions.slice(0, 12).forEach((tag) => { const chip = document.createElement('button'); chip.type = 'button'; chip.className = 'tag-chip'; chip.textContent = `+ ${tag}`; chip.addEventListener('click', () => addEditingTag(tag)); list.append(chip); });
  }

  function addEditingTag(value = $('tag-input').value) {
    const tag = value.trim().replace(/\s+/g, ' ');
    if (!tag || tag.length > 24) return;
    if (!editingTags.some((item) => item.toLocaleLowerCase(locale()) === tag.toLocaleLowerCase(locale()))) {
      if (editingTags.length >= 12) { showToast('12 tags maximum par photo.'); return; }
      editingTags.push(tag);
    }
    $('tag-input').value = ''; renderTagEditor();
  }

  $('next-button').addEventListener('click', () => move(1));
  $('previous-button').addEventListener('click', () => move(-1));
  $('swipe-hint').addEventListener('click', () => move(1));
  $('history-toggle').addEventListener('click', showHistory);
  $('albums-toggle').addEventListener('click', showAlbums);
  $('collection-back').addEventListener('click', () => {
    if (photoLibrary && historicalPreview) { hideHistory(); $('collection-back').hidden = true; return; }
    $('collection-back').hidden = true; $('discover-view').hidden = true;
    if (collectionReturn === 'albums') { collectionReturn = ''; showAlbums(); }
    else { collectionReturn = ''; showHistory(); }
  });
  $('albums-back').addEventListener('click', () => { $('albums-view').hidden = true; $('discover-view').hidden = nativePhotos ? false : true; $('access-gate-view').hidden = nativePhotos; });
  $('album-list-back').addEventListener('click', showAlbums);
  $('back-to-discover').addEventListener('click', hideHistory);
  $('empty-back').addEventListener('click', hideHistory);
  $('tools-toggle').addEventListener('click', showTools);
  $('reminder-enabled').addEventListener('change', (event) => setReminderEnabled(event.currentTarget.checked));
  $('reminder-time').addEventListener('change', updateReminderTime);
  $('tools-back').addEventListener('click', hideTools);
  $('empty-state-preview').addEventListener('click', showEmptyPreview);
  $('empty-return').addEventListener('click', () => { $('empty-preview-view').hidden = true; $('discover-view').hidden = false; });
  $('empty-access-link').addEventListener('click', showTools);
  document.querySelectorAll('[data-access-state]').forEach((button) => button.addEventListener('click', () => updateAccessState(button.dataset.accessState)));
  $('access-action').addEventListener('click', () => photoLibrary ? requestNativeAccess() : showToast('Aperçu uniquement · aucune permission Android n’a été demandée.'));
  $('refresh-photos').addEventListener('click', async () => {
    const button = $('refresh-photos');
    const status = $('refresh-status');
    if (!photoLibrary || loadingNativeGallery) return;
    button.disabled = true;
    status.hidden = false;
    status.textContent = 'Actualisation de la galerie…';
    const result = await refreshNativeGallery();
    status.textContent = result === 'updated'
      ? `Galerie actualisée · ${nativePhotoCount} photo${nativePhotoCount === 1 ? '' : 's'} éligible${nativePhotoCount === 1 ? '' : 's'} sur ${nativeGalleryPhotoCount} accessible${nativeGalleryPhotoCount === 1 ? '' : 's'}. La sélection du jour reste inchangée.`
      : result === 'empty'
        ? nativeGalleryPhotoCount
          ? `${nativeGalleryPhotoCount} photo${nativeGalleryPhotoCount === 1 ? '' : 's'} accessible${nativeGalleryPhotoCount === 1 ? '' : 's'}, mais aucune n’est éligible (moins de 30 jours ou date inconnue).`
          : 'Aucune photo n’est actuellement accessible.'
        : result === 'denied'
          ? 'L’accès à la galerie n’est pas autorisé.'
          : result === 'error'
            ? 'La galerie n’a pas pu être actualisée. Réessayez.'
            : 'Une actualisation est déjà en cours.';
    button.disabled = false;
  });
  $('access-gate-action').addEventListener('click', requestNativeAccess);
  $('export-preview').addEventListener('click', () => showToast('Aperçu uniquement · l’export JSON sera ajouté plus tard.'));
  $('import-preview').addEventListener('click', () => showToast('Aperçu uniquement · aucune donnée n’a été importée.'));
  $('share-button').addEventListener('click', showShare);
  $('close-share').addEventListener('click', () => shareDialog.close());
  $('share-native-action').addEventListener('click', async () => {
    const memory = memories[index];
    if (!photoLibrary || !nativePhotos || !memory?.id) {
      showToast('Le partage Android sera disponible avec une photo de votre galerie.');
      return;
    }
    const button = $('share-native-action');
    button.disabled = true;
    try {
      await photoLibrary.sharePhoto({ id: memory.id });
      shareDialog.close();
      showToast('Choisissez une application dans le menu Android.');
    } catch (error) {
      console.error('Photo sharing failed', error);
      showToast('Impossible de partager cette photo. Vérifiez qu’elle est toujours accessible.');
    } finally {
      button.disabled = false;
    }
  });
  document.querySelectorAll('[data-target]').forEach((button) => button.addEventListener('click', () => {
    $('share-footnote').textContent = `Aperçu uniquement · « ${button.dataset.target} » s’ouvrirait ici.`;
  }));
  $('note-button').addEventListener('click', () => { noteInput.value = comments[memories[index].id] || ''; editingTags = Array.isArray(photoTags[memories[index].id]) ? photoTags[memories[index].id].slice(0, 12) : []; $('character-count').textContent = `${noteInput.value.length} / 280`; $('tag-input').value = ''; renderTagEditor(); noteDialog.showModal(); noteInput.focus(); });
  $('add-tag-button').addEventListener('click', () => addEditingTag());
  $('tag-input').addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); addEditingTag(); } });
  noteInput.addEventListener('input', () => { $('character-count').textContent = `${noteInput.value.length} / 280`; });
  $('note-form').addEventListener('submit', async (event) => {
    if (event.submitter?.value !== 'save') return;
    event.preventDefault();
    const id = memories[index].id;
    const note = noteInput.value.trim();
    if (localDataReady) {
      const saved = await queueDatabaseWrite('saveMemoryDetails', { photoId: id, body: note, tags: editingTags });
      if (!saved) return;
    }
    if (note) comments[id] = note; else delete comments[id];
    if (editingTags.length) photoTags[id] = editingTags.slice(); else delete photoTags[id];
    if (!localDataReady) { save(keys.comments, comments); save(keys.photoTags, photoTags); }
    noteDialog.close();
    render();
  });
  $('memory-stage').addEventListener('pointerdown', (event) => { pointerStart = { x: event.clientX, y: event.clientY }; });
  $('memory-stage').addEventListener('pointerup', (event) => {
    if (!pointerStart) return;
    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    pointerStart = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.2) move(dx < 0 ? 1 : -1);
  });
  $('memory-stage').addEventListener('pointercancel', () => { pointerStart = null; });
  document.addEventListener('keydown', (event) => {
    if (noteDialog.open || shareDialog.open || !$('history-view').hidden || !$('tools-view').hidden || !$('empty-preview-view').hidden) return;
    if (event.key === 'ArrowRight') move(1);
    if (event.key === 'ArrowLeft') move(-1);
  });

  async function startApp() {
    await initializeReminder();
    if (photoLibrary) {
      $('discover-view').hidden = true;
      showNativeGate();
      $('access-gate-action').disabled = true;
    }
    if (localData) await initializeLocalData();
    const today = new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    $('today-label').textContent = `${translate('VOTRE PAUSE SOUVENIR')} · ${today.toLocaleUpperCase(locale())}`;
    if (photoLibrary) {
      $('discover-view').hidden = true;
      showNativeGate();
      $('access-gate-action').disabled = false;
      await refreshNativeGallery();
      document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshNativeGallery(); });
    } else {
      $('access-gate-view').hidden = true;
      render();
    }
  }

  $('language-select').addEventListener('change', (event) => {
    window.MomentaI18n?.setLanguage(event.currentTarget.value);
    const today = new Intl.DateTimeFormat(locale(), { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    $('today-label').textContent = `${translate('VOTRE PAUSE SOUVENIR')} · ${today.toLocaleUpperCase(locale())}`;
    render();
    renderReminderSettings();
    if (!$('tools-view').hidden) updateAccessState(photoLibrary ? nativeAccess.state : 'full');
    if (!$('history-view').hidden) showHistory();
    if (!$('albums-view').hidden) showAlbums();
    if (!$('access-gate-view').hidden && photoLibrary) showNativeGate(nativeAccess.state === 'empty' ? 'empty' : nativeAccess.state === 'denied' ? 'denied' : 'permission');
    if (window.MomentaI18n) window.MomentaI18n.apply();
  });

  startApp();
})();
