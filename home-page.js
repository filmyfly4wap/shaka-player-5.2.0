
    if (window.shaka && shaka.ui && shaka.ui.Controls) {
      shaka.ui.Controls.prototype.onDoubleClick_ = function() {};
    }

    const DATA_URL = 'https://raw.githubusercontent.com/filmyfly4wap/json/refs/heads/main/livee.json';
    const allMatchesRow = document.getElementById('allMatchesRow');
    const loadingMessage = document.getElementById('loading-message');
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderIndicators = document.getElementById('sliderIndicators');
    const sliderContainer = document.getElementById('sliderContainer');
    const sliderElement = document.getElementById('slider');
    const allMatchesContainer = document.getElementById('allMatchesContainer');
    const categoryFilterContainer = document.getElementById('categoryFilterContainer');
    const categoryFilterButtons = document.getElementById('categoryFilterButtons');

    let countdownInterval;
    let allMatches = [];
    let sliderInterval;
    let currentSlide = 0;
    let totalSlides = 0;
    let currentCategory = 'ALL';
    let categories = [];

    let sliderTouchStartX = 0;
    let sliderTouchCurrentX = 0;
    let isSliderDragging = false;
    let sliderDidMove = false;

    const DEFAULT_LOGO = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRVScOHhjuxyM-bZpfN6mEM6Sg6L_ThbQSECFR2JhiZlt4CcO_72hRv2M&s=10';
    const STATUS_CONFIG = {
      live: { badgeClass: 'status-live', timerColor: '#dc2626' },
      upcoming: { badgeClass: 'status-upcoming', timerColor: '#2962ff' }
    };
    const DEFAULT_DURATION_HOURS = 8;

    const SVGS = {
      play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
      pause: '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>',
      volume: '<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>',
      mute: '<svg viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
      pip: '<svg viewBox="0 0 24 24"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>',
      fullscreen: '<svg viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>',
      fullscreenExit: '<svg viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>',
      settings: '<svg viewBox="0 0 24 24"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
      check: '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
      tv: '<svg viewBox="0 0 24 24"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"/></svg>',
      magic: '<svg viewBox="0 0 24 24"><path d="M7.5 5.6L10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29c-.39-.39-1.02-.39-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49l-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z"/></svg>',
      lang: '<svg viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg>',
      share: '<svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/></svg>'
    };

    const FIT_SVGS = {
      contain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="21" x2="22" y2="21"/></svg>',
      fill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
      cover: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M6 7l3 3m0 0H7m2 0V8m9-1l-3 3m0 0h2m-2 0V8M6 13l3-3m0 0H7m2 0v2m9 1l-3-3m0 0h2m-2 0v2"/></svg>'
    };

    const LOCK_ICON = '<svg viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>';
    const UNLOCK_ICON = '<svg viewBox="0 0 24 24"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/></svg>';

    let activeShakaPlayer = null;
    let currentActiveMatch = null;
    let currentActiveStreamIndex = 0;
    let streamExpiryTimer = null;

    const $pc = document.getElementById('pc');
    const $vid = document.getElementById('v');
    const $extFrame = document.getElementById('ext-frame');
    const $status = document.getElementById('status');
    const $closeBtn = document.getElementById('player-close-btn');
    let _stTmr = null;
    let isInterfaceLocked = false;
    let lockHideTimer = null;
    let currentFitIdx = 0;
    const FITS = ["contain", "fill", "cover"];

    /* SCREEN WAKE LOCK */
    let screenWakeLock = null;

    async function requestScreenWakeLock() {
      if ("wakeLock" in navigator) {
        try {
          if (!screenWakeLock || screenWakeLock.released) {
            screenWakeLock = await navigator.wakeLock.request("screen");
            screenWakeLock.addEventListener("release", () => {
              screenWakeLock = null;
            });
          }
        } catch (_) {}
      }
    }

    function releaseScreenWakeLock() {
      if (screenWakeLock !== null) {
        screenWakeLock.release().catch(() => {});
        screenWakeLock = null;
      }
    }

    $vid.addEventListener("play", requestScreenWakeLock);
    $vid.addEventListener("pause", releaseScreenWakeLock);
    $vid.addEventListener("ended", releaseScreenWakeLock);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && !$vid.paused) {
        requestScreenWakeLock();
      } else if (document.visibilityState === "hidden") {
        releaseScreenWakeLock();
      }
    });

    /* DEDICATED SHARE EVENT BANNER LOGIC */
    const $seb = document.getElementById('share-error-banner');
    const $sebIcon = document.getElementById('seb-icon');
    const $sebTitle = document.getElementById('seb-title');
    const $sebDesc = document.getElementById('seb-desc');
    const $sebClose = document.getElementById('seb-close');
    let sebTimer = null;

    function closeShareBanner() {
      if (sebTimer) clearTimeout(sebTimer);
      $seb.classList.remove('show');
    }

    $sebClose.onclick = (e) => {
      e.stopPropagation();
      closeShareBanner();
    };

    function showShareBanner(type, title, message, dur = 5000) {
      if (sebTimer) clearTimeout(sebTimer);
      
      $seb.className = '';
      let iconHtml = '<i class="fas fa-info-circle"></i>';

      if (type === 'upcoming') {
        $seb.classList.add('seb-upcoming');
        iconHtml = '<i class="fas fa-clock"></i>';
      } else if (type === 'ended') {
        $seb.classList.add('seb-ended');
        iconHtml = '<i class="fas fa-ban"></i>';
      } else if (type === 'notfound') {
        $seb.classList.add('seb-notfound');
        iconHtml = '<i class="fas fa-search"></i>';
      }

      $sebIcon.innerHTML = iconHtml;
      $sebTitle.textContent = title;
      $sebDesc.textContent = message;

      void $seb.offsetWidth;
      $seb.classList.add('show');

      if (dur > 0) {
        sebTimer = setTimeout(() => {
          $seb.classList.remove('show');
        }, dur);
      }
    }

    function toast(msg, type, dur) {
      $status.innerHTML = '<span class="st-dot"></span><span>' + msg + '</span>';
      $status.className = "show " + (type || "ok");
      if (_stTmr) clearTimeout(_stTmr);
      if (dur !== 0) {
        _stTmr = setTimeout(() => {
          $status.className = $status.className.replace("show", "").trim();
          _stTmr = null;
        }, dur || 3500);
      }
    }

    function getMatchShareSlug(match) {
      if (!match) return "";
      if (match.share) return String(match.share).trim();
      if (match.share_text) return String(match.share_text).trim();
      return `${match.team_1 || ''}-vs-${match.team_2 || ''}`.replace(/\s+/g, '-').trim();
    }

    function getMatchByQuery(matchId, shareParam) {
      if (matchId) {
        const cleanId = String(matchId).trim();
        const found = allMatches.find(m => String(m.match_id).trim() === cleanId);
        if (found) return found;
      }
      if (shareParam) {
        const cleanKey = decodeURIComponent(String(shareParam)).trim().toLowerCase();
        return allMatches.find(m => {
          const key = getMatchShareSlug(m).toLowerCase();
          return key === cleanKey || (m.match_id && String(m.match_id).toLowerCase() === cleanKey);
        });
      }
      return null;
    }

    function triggerShare(matchId, shareSlug, shareTitle, e) {
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      const currentOrigin = window.location.origin + window.location.pathname;
      const cleanId = encodeURIComponent(String(matchId).trim());
      const cleanSlug = encodeURIComponent(String(shareSlug).trim());

      const shareUrl = `${currentOrigin}?${cleanId}&share=${cleanSlug}`;
      const titleToShare = shareTitle || "Watch Live Match";

      if (navigator.share) {
        navigator.share({
          title: titleToShare,
          text: titleToShare,
          url: shareUrl
        }).catch(() => {});
      } else {
        const copyText = `${titleToShare}\n${shareUrl}`;
        navigator.clipboard.writeText(copyText).then(() => {
          toast("Link & Title copied!", "ok", 2500);
        }).catch(() => {
          toast("Failed to copy link", "err", 2000);
        });
      }
    }

    function checkDirectSharedStream() {
      const searchStr = window.location.search;
      if (!searchStr || searchStr.length <= 1) return;

      const urlParams = new URLSearchParams(searchStr);
      let detectedMatchId = urlParams.get('match_id');
      const shareParam = urlParams.get('share');

      if (!detectedMatchId) {
        for (const [key, value] of urlParams.entries()) {
          if (key !== 'share' && key !== 'match_id' && (!value || value === '')) {
            detectedMatchId = key;
            break;
          }
        }
      }

      if (!detectedMatchId && !shareParam) return;

      const foundMatch = getMatchByQuery(detectedMatchId, shareParam);
      if (!foundMatch) {
        showShareBanner('notfound', 'Match Not Found', 'Shared match link invalid hai ya data update ho chuka hai.', 4500);
        return;
      }

      const durationHours = foundMatch.durationHours || DEFAULT_DURATION_HOURS;
      const status = getMatchStatus(foundMatch);

      if (status === 'upcoming') {
        const timeLeft = formatTimeDifference(foundMatch.startTime, durationHours);
        const matchTitle = foundMatch.title || `${foundMatch.team_1} vs ${foundMatch.team_2}`;
        showShareBanner('upcoming', 'Streaming Soon', `${matchTitle} shuru hone me ${timeLeft} ka samay baki hai.`, 5500);

        const matchIndex = allMatches.indexOf(foundMatch);
        const targetCard = document.querySelector(`[data-idx-timer="${matchIndex}"]`);
        if (targetCard) {
          targetCard.closest('.match-card-item')?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
        return;
      }

      if (status === 'completed') {
        showShareBanner('ended', 'Stream Ended', 'Ye live match aur iska transmission samapt ho chuka hai.', 5000);
        return;
      }

      if (status === 'live') {
        openStreamPlayer(foundMatch, 0);
      }
    }

    function parseStartTime(startTimeStr) {
      try {
        const parts = startTimeStr.split(' ');
        if (parts.length !== 3) return NaN;
        const [time, ampm, date] = parts;
        const [HH, MM, SS] = time.split(':').map(n => parseInt(n, 10));
        const [DD, MM_date, YYYY] = date.split('-').map(n => parseInt(n, 10));
        let hours = HH;
        if (ampm === 'PM' && hours < 12) hours += 12;
        else if (ampm === 'AM' && hours === 12) hours = 0;
        if (isNaN(hours) || isNaN(MM) || isNaN(SS) || isNaN(DD) || isNaN(MM_date) || isNaN(YYYY)) return NaN;
        return new Date(YYYY, MM_date - 1, DD, hours, MM, SS).getTime();
      } catch (e) {
        return NaN;
      }
    }

    function formatTimeDifference(startTimeStr, durationHours = DEFAULT_DURATION_HOURS) {
      const matchTime = parseStartTime(startTimeStr);
      if (isNaN(matchTime)) return 'INVALID';
      const difference = matchTime - Date.now();

      if (difference < 0) {
        const hoursPassed = Math.abs(difference) / (1000 * 60 * 60);
        if (hoursPassed > durationHours) return 'COMPLETED';
        return 'LIVE';
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      let timeParts = [];
      if (days > 0) timeParts.push(`${days}d`);
      if (hours > 0 || days > 0) timeParts.push(`${hours}h`);
      if (minutes > 0 || hours > 0 || days > 0) timeParts.push(`${minutes}m`);
      timeParts.push(`${seconds}s`);
      return timeParts.slice(0, 3).join(' ');
    }

    function formatStartTime(startTimeStr) {
      const timestamp = parseStartTime(startTimeStr);
      if (isNaN(timestamp)) return 'Invalid Date/Time';
      const date = new Date(timestamp);
      return `${date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}, ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    }

    function getMatchStatus(match) {
      const durationHours = match.durationHours || DEFAULT_DURATION_HOURS;
      const timeDiff = formatTimeDifference(match.startTime, durationHours);
      if (timeDiff === 'LIVE') return 'live';
      if (timeDiff === 'COMPLETED') return 'completed';
      if (timeDiff !== 'INVALID') return 'upcoming';
      return 'unknown';
    }

    function filterMatches(matches) {
      return matches.filter(match => {
        const s = getMatchStatus(match);
        return s === 'live' || s === 'upcoming';
      });
    }

    function sortMatches(matches) {
      return matches.sort((a, b) => {
        const statusA = getMatchStatus(a);
        const statusB = getMatchStatus(b);
        if (statusA === 'live' && statusB !== 'live') return -1;
        if (statusA !== 'live' && statusB === 'live') return 1;
        const timeA = parseStartTime(a.startTime);
        const timeB = parseStartTime(b.startTime);
        if (isNaN(timeA) || isNaN(timeB)) return 0;
        return timeA - timeB;
      });
    }

    function getMatchStreams(match) {
      if (match.streams && Array.isArray(match.streams) && match.streams.length > 0) {
        return match.streams;
      }
      if (match.category && categories && categories.length > 0) {
        const parentCat = categories.find(c => c.id === match.category);
        if (parentCat && parentCat.streams && Array.isArray(parentCat.streams) && parentCat.streams.length > 0) {
          return parentCat.streams;
        }
      }
      if (match.stream_url) {
        return [{
          language: "Default",
          label: "Live Stream",
          stream_url: match.stream_url,
          cookie: match.cookie || "",
          cookie_expire: match.cookie_expire || "",
          key_id: match.key_id || "",
          key: match.key || ""
        }];
      }
      return [];
    }

    /* SLIDER */
    let activeSlides = [];
    function isSliderItemVisible(sliderItem) {
      if (!sliderItem.startTime || !sliderItem.durationHours) return true;
      const startTime = parseStartTime(sliderItem.startTime);
      if (isNaN(startTime)) return true;
      return Date.now() <= (startTime + (sliderItem.durationHours * 3600000));
    }

    function loadSlider(sliderData) {
      if (!sliderData || !Array.isArray(sliderData) || sliderData.length === 0) {
        sliderContainer.classList.add('hidden');
        return;
      }
      activeSlides = sliderData.filter(isSliderItemVisible);
      if (activeSlides.length === 0) {
        sliderContainer.classList.add('hidden');
        return;
      }
      sliderContainer.classList.remove('hidden');
      sliderTrack.innerHTML = '';
      sliderIndicators.innerHTML = '';
      totalSlides = activeSlides.length;
      currentSlide = 0;

      activeSlides.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        const link = document.createElement('a');
        if (item.link) {
          link.href = item.link;
          link.target = '_blank';
        } else {
          link.href = 'javascript:void(0)';
          link.style.pointerEvents = 'none';
        }

        link.addEventListener('click', (e) => {
          if (sliderDidMove) {
            e.preventDefault();
            e.stopPropagation();
          }
        });

        const img = document.createElement('img');
        img.src = item.img;
        img.onerror = () => { img.src = 'https://via.placeholder.com/800x300/1e3a8a/ffffff?text=LIVE+STREAM'; };
        link.appendChild(img);
        slide.appendChild(link);
        sliderTrack.appendChild(slide);

        const indicator = document.createElement('div');
        indicator.className = `slider-indicator ${index === 0 ? 'active' : ''}`;
        indicator.onclick = () => {
          currentSlide = index;
          updateSlider();
          startAutoSlide();
        };
        sliderIndicators.appendChild(indicator);
      });

      updateSlider();
      startAutoSlide();
      initSliderSwipe();
    }

    function startAutoSlide() {
      if (sliderInterval) clearInterval(sliderInterval);
      if (totalSlides <= 1) return;
      sliderInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
      }, 4000);
    }

    function updateSlider(customOffset = null) {
      if (totalSlides === 0) return;
      if (customOffset !== null) {
        sliderTrack.style.transition = 'none';
        sliderTrack.style.transform = `translateX(${customOffset}px)`;
      } else {
        sliderTrack.style.transition = 'transform 0.35s ease';
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        document.querySelectorAll('.slider-indicator').forEach((ind, i) => {
          ind.classList.toggle('active', i === currentSlide);
        });
      }
    }

    function initSliderSwipe() {
      if (sliderElement.dataset.swipeInitialized) return;
      sliderElement.dataset.swipeInitialized = "true";

      const handleStart = (clientX) => {
        if (totalSlides <= 1) return;
        clearInterval(sliderInterval);
        isSliderDragging = true;
        sliderDidMove = false;
        sliderTouchStartX = clientX;
        sliderTouchCurrentX = clientX;
      };

      const handleMove = (clientX) => {
        if (!isSliderDragging) return;
        sliderTouchCurrentX = clientX;
        const diffX = sliderTouchCurrentX - sliderTouchStartX;
        if (Math.abs(diffX) > 8) {
          sliderDidMove = true;
          const containerWidth = sliderElement.offsetWidth;
          const currentPos = -currentSlide * containerWidth;
          updateSlider(currentPos + diffX);
        }
      };

      const handleEnd = () => {
        if (!isSliderDragging) return;
        isSliderDragging = false;
        const diffX = sliderTouchCurrentX - sliderTouchStartX;
        const threshold = 40;

        if (diffX < -threshold) {
          currentSlide = (currentSlide + 1) % totalSlides;
        } else if (diffX > threshold) {
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        }

        updateSlider();
        startAutoSlide();
        setTimeout(() => { sliderDidMove = false; }, 100);
      };

      sliderElement.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX), { passive: true });
      sliderElement.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX), { passive: true });
      sliderElement.addEventListener('touchend', handleEnd);
      sliderElement.addEventListener('mousedown', (e) => handleStart(e.clientX));

      window.addEventListener('mousemove', (e) => {
        if (isSliderDragging) handleMove(e.clientX);
      });

      window.addEventListener('mouseup', () => {
        if (isSliderDragging) handleEnd();
      });
    }

    /* CATEGORIES */
    function renderCategories(cats) {
      categoryFilterButtons.innerHTML = '';
      const allBtn = document.createElement('button');
      allBtn.className = `category-btn active`;
      allBtn.innerHTML = `<div class="btn-icon"><i class="fas fa-globe"></i></div> ALL`;
      allBtn.onclick = (e) => filterByCategory('ALL', e.currentTarget);
      categoryFilterButtons.appendChild(allBtn);

      cats.forEach((cat) => {
        const btn = document.createElement('button');
        btn.className = `category-btn`;
        btn.innerHTML = `<div class="btn-icon"><i class="${cat.icon || 'fas fa-tag'}"></i></div> ${cat.title}`;
        btn.onclick = (e) => filterByCategory(cat.id, e.currentTarget);
        categoryFilterButtons.appendChild(btn);
      });
      categoryFilterContainer.style.display = 'block';
    }

    function filterByCategory(cat, targetBtn) {
      currentCategory = cat;
      document.querySelectorAll('#categoryFilterButtons .category-btn').forEach(b => b.classList.remove('active'));
      if (targetBtn) targetBtn.classList.add('active');

      const filtered = cat === 'ALL' ? allMatches : allMatches.filter(m => m.category === cat);
      displayAllMatchesInRow(sortMatches(filterMatches(filtered)));
    }

    function generateStreamSelector(match, matchIndex) {
      const fullStreams = getMatchStreams(match);
      if (fullStreams.length === 0) return '';

      let html = '<div class="stream-selector">';
      fullStreams.forEach((stream, index) => {
        const isActive = index === 0 ? 'active' : '';
        html += `
          <button class="stream-btn ${isActive}" onclick="openStreamPlayer(allMatches[${matchIndex}], ${index}); event.stopPropagation();">
            <div class="stream-icon"><i class="fas fa-play"></i></div>
            ${stream.language || stream.label || `Feed ${index + 1}`}
          </button>
        `;
      });
      html += '</div>';
      return html;
    }

    function generateMatchCard(match, status, matchIndex) {
      const team1_logo = match.src || DEFAULT_LOGO;
      const team2_logo = match.src_2 && match.src_2 !== 'Unavailable' ? match.src_2 : team1_logo;
      const isLive = status === 'live';
      const config = STATUS_CONFIG[status];
      const formattedTime = formatStartTime(match.startTime);
      const timerText = isLive ? 'LIVE NOW' : `Starts in: ${formatTimeDifference(match.startTime, match.durationHours || DEFAULT_DURATION_HOURS)}`;
      
      const rawMatchId = match.match_id ? String(match.match_id) : String(matchIndex);
      const rawShareSlug = getMatchShareSlug(match);
      const rawTitle = match.title ? String(match.title) : `${match.team_1} vs ${match.team_2}`;
      
      const escapedMatchId = rawMatchId.replace(/'/g, "\\'");
      const escapedShareSlug = rawShareSlug.replace(/'/g, "\\'");
      const escapedTitle = rawTitle.replace(/'/g, "\\'");

      const streamSelectorHTML = isLive ? generateStreamSelector(match, matchIndex) : '';

      let bottomHTML = '';
      if (isLive) {
        bottomHTML = `
          ${streamSelectorHTML}
          <div class="card-action-row">
            <button type="button" class="open-site-btn" onclick="openStreamPlayer(allMatches[${matchIndex}], 0); event.stopPropagation();">
              <div class="link-icon"><i class="fas fa-play"></i></div> Watch Now
            </button>
            <button type="button" class="share-icon-btn" title="Share Match" onclick="triggerShare('${escapedMatchId}', '${escapedShareSlug}', '${escapedTitle}', event);">
              ${SVGS.share}
            </button>
          </div>
        `;
      } else {
        bottomHTML = `
          <div class="upcoming-box">
            <i class="fas fa-broadcast-tower"></i> Live Streaming Starts Soon
          </div>
          <div class="card-action-row" style="margin-top: 6px;">
            <button type="button" class="share-icon-btn" title="Share Match" style="width: auto; padding: 4px 12px; gap: 6px; font-size: 11.5px; border-radius: 6px;" onclick="triggerShare('${escapedMatchId}', '${escapedShareSlug}', '${escapedTitle}', event);">
              ${SVGS.share} <span>Share</span>
            </button>
          </div>
        `;
      }

      return `
        <div class="match-card-item" onclick="openStreamPlayer(allMatches[${matchIndex}], 0);">
          <div class="card">
            <div>
              <div class="status-badge ${config.badgeClass}">${status.toUpperCase()}</div>
              <p class="des">${match.title}</p>
              <div class="card-des">
                <div class="team-container">
                  <img alt="${match.team_1}" class="t1" src="${team1_logo}" onerror="this.src='${DEFAULT_LOGO}'">
                  <div class="team-name">${match.team_1}</div>
                </div>
                <img alt="VS" class="vs" src="${isLive ? 'https://pix2.b442d6eefbd6173bad7ee5bde6cd31e8.com/uploads/2026-09-11/img_6aa3d3abec8f36.92285529.png' : 'https://pix2.b442d6eefbd6173bad7ee5bde6cd31e8.com/uploads/2026-09-11/img_6aa3d376ae3c58.27215875.png'}">
                <div class="team-container">
                  <img alt="${match.team_2}" class="t2" src="${team2_logo}" onerror="this.src='${DEFAULT_LOGO}'">
                  <div class="team-name">${match.team_2}</div>
                </div>
              </div>
            </div>
            <div class="time-wrapper">
              <span class="start-time-text">Start Time: ${formattedTime}</span>
              <span class="timer-display ${isLive ? 'live-timer' : ''}" data-idx-timer="${matchIndex}" style="color: ${config.timerColor}">
                ${timerText}
              </span>
              ${bottomHTML}
            </div>
          </div>
        </div>
      `;
    }

    function displayAllMatchesInRow(matches) {
      allMatchesRow.innerHTML = '';
      matches.forEach((m) => {
        const originalIndex = allMatches.indexOf(m);
        const s = getMatchStatus(m);
        if (s === 'live' || s === 'upcoming') {
          allMatchesRow.innerHTML += generateMatchCard(m, s, originalIndex);
        }
      });
      allMatchesContainer.style.display = matches.length > 0 ? 'block' : 'none';
    }

    function startCountdown() {
      if (countdownInterval) clearInterval(countdownInterval);
      countdownInterval = setInterval(() => {
        allMatches.forEach((match, index) => {
          const timerElement = document.querySelector(`[data-idx-timer="${index}"]`);
          if (timerElement) {
            const timeDiff = formatTimeDifference(match.startTime, match.durationHours || DEFAULT_DURATION_HOURS);
            if (timeDiff === 'LIVE') {
              timerElement.textContent = 'LIVE NOW';
              timerElement.style.color = STATUS_CONFIG.live.timerColor;
              timerElement.classList.add('live-timer');
            } else if (timeDiff === 'COMPLETED') {
              timerElement.textContent = 'MATCH ENDED';
              timerElement.style.color = '#94a3b8';
              timerElement.classList.remove('live-timer');
            } else if (timeDiff !== 'INVALID') {
              timerElement.textContent = `Starts in: ${timeDiff}`;
              timerElement.style.color = STATUS_CONFIG.upcoming.timerColor;
              timerElement.classList.remove('live-timer');
            }
          }
        });
      }, 1000);
    }

    /* COOKIE HELPERS */
    function rawCookie(c) {
      return c && c.startsWith("__hdnea__=") ? c.slice(10) : (c || "");
    }

    function withCookie(u, r) {
      if (!u || !r || u.indexOf("__hdnea__") !== -1) return u;
      return u + (u.indexOf("?") !== -1 ? "&" : "?") + "__hdnea__=" + r;
    }

    function isDirectPageUrl(url) {
      if (!url) return false;
      const cleanUrl = url.trim().toLowerCase();
      if (cleanUrl.endsWith('.mpd') || cleanUrl.endsWith('.m3u8') || cleanUrl.includes('.mpd?') || cleanUrl.includes('.m3u8?')) {
        return false;
      }
      return true;
    }

    function closePlayer() {
      releaseScreenWakeLock();

      // Video band hone par URL ko wapas original state me clean karna
      if (window.location.search) {
        window.history.replaceState({}, '', window.location.pathname);
      }

      if (streamExpiryTimer) {
        clearTimeout(streamExpiryTimer);
        streamExpiryTimer = null;
      }

      if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen().catch(() => {});
      }
      if ($extFrame) {
        $extFrame.src = "about:blank";
        $extFrame.style.display = "none";
      }
      if (activeShakaPlayer) {
        activeShakaPlayer.unload().catch(() => {});
      }
      $vid.pause();
      $vid.removeAttribute('src');
      $vid.load();
      $vid.style.display = "block";

      const controlsContainer = $pc.querySelector(".shaka-controls-container");
      if (controlsContainer) controlsContainer.style.display = "";

      $pc.style.display = "none";
      isInterfaceLocked = false;
      $pc.classList.remove("controls-locked");
      if (floatLockContainer) floatLockContainer.classList.remove("show");
      
      $closeBtn.classList.remove("force-visible");
      document.getElementById("custom-settings-modal").classList.remove("active");
    }

    async function openStreamPlayer(match, streamIdx = 0) {
      if (!match) return;

      const matchStatus = getMatchStatus(match);
      if (matchStatus === 'upcoming') {
        const timeLeft = formatTimeDifference(match.startTime, match.durationHours || DEFAULT_DURATION_HOURS);
        showShareBanner('upcoming', 'Streaming Soon', `${match.title || 'Match'} abhi live nahi hua hai. Baki samay: ${timeLeft}`, 4500);
        return;
      }
      if (matchStatus === 'completed') {
        showShareBanner('ended', 'Match Ended', 'Ye match aur streaming samapt ho chuki hai.', 4500);
        return;
      }

      const streams = getMatchStreams(match);
      if (streams.length === 0) return;

      currentActiveMatch = match;
      currentActiveStreamIndex = streamIdx;

      // Video play hote waqt address bar me auto share URL create karna
      const matchIndex = allMatches.indexOf(match);
      const rawMatchId = match.match_id ? String(match.match_id).trim() : String(matchIndex >= 0 ? matchIndex : 0);
      const rawShareSlug = getMatchShareSlug(match);
      const newQuery = `?${encodeURIComponent(rawMatchId)}&share=${encodeURIComponent(rawShareSlug)}`;
      
      if (window.location.search !== newQuery) {
        window.history.replaceState({ matchId: rawMatchId }, '', `${window.location.pathname}${newQuery}`);
      }

      if (streamExpiryTimer) clearTimeout(streamExpiryTimer);
      const matchStartTime = parseStartTime(match.startTime);
      const durationMs = (match.durationHours || DEFAULT_DURATION_HOURS) * 3600000;
      const expiryTime = matchStartTime + durationMs;
      const remainingPlayTime = expiryTime - Date.now();

      if (remainingPlayTime > 0) {
        streamExpiryTimer = setTimeout(() => {
          closePlayer();
          showShareBanner('ended', 'Stream Completed', 'Match samay pura ho gaya. Stream auto-closed.', 6000);
        }, remainingPlayTime);
      }

      $pc.style.display = "flex";

      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if ($pc.requestFullscreen) {
          $pc.requestFullscreen().catch(() => {});
        } else if ($pc.webkitRequestFullscreen) {
          $pc.webkitRequestFullscreen().catch(() => {});
        }
      }

      shaka.polyfill.installAll();

      if (!activeShakaPlayer) {
        activeShakaPlayer = new shaka.Player();
        await activeShakaPlayer.attach($vid);

        const ui = new shaka.ui.Overlay(activeShakaPlayer, $pc, $vid);
        ui.configure({
          controlPanelElements: [
            "play_pause", "mute", "time_and_duration", "spacer", "picture_in_picture", "fullscreen"
          ],
          doubleClickForFullscreen: false,
          fastForward: false,
          enableTooltips: false,
          seekBarColors: { base: "#4b5563", buffered: "#8e9bb0", played: "#2962ff" }
        });

        const preventDblClick = (e) => {
          e.stopPropagation();
          e.preventDefault();
        };
        $pc.addEventListener("dblclick", preventDblClick, true);

        const injectInterval = setInterval(() => {
          if (injectPlayerControls()) clearInterval(injectInterval);
        }, 100);

        initGestureAndDoubleTap();

        window.addEventListener("pointerdown", () => {
          $vid.muted = false;
        }, { once: true });

        $vid.addEventListener("waiting", () => { toast("Buffering…", "warn", 0); });
        $vid.addEventListener("playing", () => { toast("Live", "live", 2500); });

        document.addEventListener("visibilitychange", () => {
          if (!document.hidden && $vid.paused) {
            $vid.play().catch(() => {});
          }
        });
      }

      await playStreamDirect(streams[streamIdx]);
    }

    async function playStreamDirect(streamObj) {
      const url = (streamObj.stream_url || "").trim();

      if (isDirectPageUrl(url)) {
        if (activeShakaPlayer) await activeShakaPlayer.unload().catch(() => {});
        $vid.pause();
        $vid.style.display = "none";

        const controlsContainer = $pc.querySelector(".shaka-controls-container");
        if (controlsContainer) controlsContainer.style.display = "none";

        if ($closeBtn && $closeBtn.parentElement !== $pc) {
          $pc.appendChild($closeBtn);
        }

        $closeBtn.classList.add("force-visible");
        $extFrame.style.display = "block";
        $extFrame.src = url;

        toast(`Playing: ${streamObj.language || streamObj.label || 'Web Player'}`, "live", 2500);
        return;
      }

      $closeBtn.classList.remove("force-visible");
      $extFrame.style.display = "none";
      $extFrame.src = "about:blank";
      $vid.style.display = "block";

      const controlsContainer = $pc.querySelector(".shaka-controls-container");
      if (controlsContainer) {
        controlsContainer.style.display = "";
        if ($closeBtn && $closeBtn.parentElement !== controlsContainer) {
          controlsContainer.appendChild($closeBtn);
        }
      }

      const drmConfig = {};
      if (streamObj.key_id && streamObj.key) {
        drmConfig[streamObj.key_id.trim()] = streamObj.key.trim();
      }

      activeShakaPlayer.configure({
        drm: { clearKeys: drmConfig },
        manifest: { retryParameters: { maxAttempts: 4, timeout: 20000 } },
        streaming: {
          bufferingGoal: 6,
          rebufferingGoal: 1.5,
          bufferBehind: 15,
          retryParameters: { maxAttempts: 4, timeout: 20000 }
        },
        abr: { enabled: true }
      });

      const raw = rawCookie(streamObj.cookie || "");
      const T = shaka.net.NetworkingEngine.RequestType;
      activeShakaPlayer.getNetworkingEngine().clearAllRequestFilters();
      if (raw) {
        activeShakaPlayer.getNetworkingEngine().registerRequestFilter((type, req) => {
          if (type === T.MANIFEST || type === T.SEGMENT) {
            req.uris = req.uris.map(u => withCookie(u, raw));
          }
        });
      }

      try {
        await activeShakaPlayer.unload();
        await activeShakaPlayer.load(url);
        applyAspectRatio(currentFitIdx);
        await $vid.play().catch(() => {});
        toast(`Live: ${streamObj.language || streamObj.label || 'Stream'}`, "live", 2500);
      } catch (e) {
        console.error("Player load failure:", e);
        toast("Playback Error", "err", 3000);
      }
    }

    function applyAspectRatio(idx) {
      currentFitIdx = idx;
      const m = FITS[idx];
      $vid.className = m === "contain" ? "" : "mode-" + m;
      const fitBtn = document.querySelector(".sp-fit-btn");
      if (fitBtn) {
        fitBtn.className = "sp-fit-btn" + (m !== "contain" ? " mode-" + m : "");
        fitBtn.innerHTML = FIT_SVGS[m];
      }
    }

    function injectPlayerControls() {
      const panel = $pc.querySelector(".shaka-controls-button-panel");
      const controlsContainer = $pc.querySelector(".shaka-controls-container");
      const videoContainer = $pc.querySelector(".shaka-video-container");
      if (!panel || !controlsContainer) return false;

      if ($closeBtn && $closeBtn.parentElement !== controlsContainer && $extFrame.style.display !== "block") {
        controlsContainer.appendChild($closeBtn);
      }

      const modal = document.getElementById("custom-settings-modal");
      if (videoContainer && modal && modal.parentElement !== videoContainer) {
        videoContainer.appendChild(modal);
      }

      const playBtn = panel.querySelector(".shaka-play-button");
      if (playBtn && !playBtn.dataset.svgInjected) {
        playBtn.dataset.svgInjected = "true";
        const syncPlay = () => { playBtn.innerHTML = $vid.paused ? SVGS.play : SVGS.pause; };
        syncPlay();
        $vid.addEventListener("play", syncPlay);
        $vid.addEventListener("pause", syncPlay);
        $vid.addEventListener("playing", syncPlay);
      }

      const muteBtn = panel.querySelector(".shaka-mute-button");
      if (muteBtn && !muteBtn.dataset.svgInjected) {
        muteBtn.dataset.svgInjected = "true";
        const syncMute = () => { muteBtn.innerHTML = ($vid.muted || $vid.volume === 0) ? SVGS.mute : SVGS.volume; };
        syncMute();
        $vid.addEventListener("volumechange", syncMute);
      }

      const pipBtn = panel.querySelector(".shaka-pip-button");
      if (pipBtn && !pipBtn.dataset.svgInjected) {
        pipBtn.dataset.svgInjected = "true";
        pipBtn.innerHTML = SVGS.pip;
      }

      const fsBtn = panel.querySelector(".shaka-fullscreen-button");
      if (fsBtn && !fsBtn.dataset.svgInjected) {
        fsBtn.dataset.svgInjected = "true";
        const syncFs = () => {
          const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement);
          fsBtn.innerHTML = isFs ? SVGS.fullscreenExit : SVGS.fullscreen;
        };
        syncFs();
        document.addEventListener("fullscreenchange", syncFs);
        document.addEventListener("webkitfullscreenchange", syncFs);
      }

      let centerBtn = controlsContainer.querySelector("#center-play-btn");
      if (!centerBtn) {
        centerBtn = document.createElement("div");
        centerBtn.id = "center-play-btn";
        centerBtn.innerHTML = SVGS.play;
        controlsContainer.appendChild(centerBtn);

        const updateCenter = () => {
          centerBtn.innerHTML = $vid.paused ? SVGS.play : SVGS.pause;
          if ($vid.paused) {
            centerBtn.classList.add("show-btn");
          } else {
            centerBtn.classList.remove("show-btn");
          }
        };

        const togglePlayback = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isInterfaceLocked) return;
          if ($vid.paused) {
            $vid.play().then(updateCenter).catch(() => {});
          } else {
            $vid.pause();
            updateCenter();
          }
        };

        centerBtn.addEventListener("pointerdown", togglePlayback);
        centerBtn.addEventListener("click", togglePlayback);
        $vid.addEventListener("play", updateCenter);
        $vid.addEventListener("pause", updateCenter);
        $vid.addEventListener("playing", updateCenter);
        updateCenter();
      }

      if (!panel.querySelector(".sp-lock-btn")) {
        const lockBtn = document.createElement("button");
        lockBtn.className = "sp-btn sp-lock-btn";
        lockBtn.title = "Lock Controls";
        lockBtn.innerHTML = UNLOCK_ICON;
        lockBtn.onclick = (e) => {
          e.stopPropagation();
          if (isInterfaceLocked) unlockPlayer(lockBtn);
          else lockPlayer(lockBtn);
        };
        panel.insertBefore(lockBtn, panel.firstChild);
      }

      if (!panel.querySelector(".sp-fit-btn")) {
        const fitBtn = document.createElement("button");
        fitBtn.type = "button";
        fitBtn.className = "sp-fit-btn";
        fitBtn.innerHTML = FIT_SVGS.contain;
        fitBtn.onclick = (e) => {
          e.stopPropagation();
          applyAspectRatio((currentFitIdx + 1) % FITS.length);
        };
        panel.appendChild(fitBtn);
      }

      if (!panel.querySelector("#custom-settings-btn")) {
        const settingsBtn = document.createElement("button");
        settingsBtn.id = "custom-settings-btn";
        settingsBtn.type = "button";
        settingsBtn.title = "Settings";
        settingsBtn.innerHTML = SVGS.settings;
        settingsBtn.onclick = (e) => {
          e.stopPropagation();
          if (isInterfaceLocked) return;
          populateQualityTracks();
          renderLanguagesFromJSON();
          document.getElementById("custom-settings-modal").classList.add("active");
        };
        panel.appendChild(settingsBtn);
      }

      return true;
    }

    document.getElementById("modal-close-btn").onclick = () => {
      document.getElementById("custom-settings-modal").classList.remove("active");
    };

    document.querySelectorAll(".c-tab-btn").forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        document.querySelectorAll(".c-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".c-tab-panel").forEach(p => p.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
        btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      };
    });

    document.querySelectorAll("#speed-item-list .c-list-btn").forEach(btn => {
      btn.onclick = () => {
        const spd = parseFloat(btn.dataset.speed);
        $vid.playbackRate = spd;
        document.querySelectorAll("#speed-item-list .c-list-btn").forEach(b => {
          b.classList.remove("selected");
          const chk = b.querySelector(".check-indicator");
          if (chk) chk.remove();
        });
        btn.classList.add("selected");
        const ind = document.createElement("div");
        ind.className = "check-indicator";
        ind.innerHTML = SVGS.check;
        btn.appendChild(ind);
        toast(`Speed: ${spd}x`, "ok", 1500);
      };
    });

    function renderLanguagesFromJSON() {
      const container = document.getElementById("language-item-list");
      if (!container || !currentActiveMatch) return;
      const streams = getMatchStreams(currentActiveMatch);
      container.innerHTML = "";

      if (streams.length === 0) {
        container.innerHTML = '<div style="color:var(--text-meta);font-size:12px;padding:12px 0;text-align:center;">No streams configured.</div>';
        return;
      }

      streams.forEach((st, idx) => {
        const isSelected = idx === currentActiveStreamIndex;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `c-list-btn ${isSelected ? 'selected' : ''}`;
        btn.innerHTML = `
          <div class="btn-left">
            <div class="btn-icon-wrap">${SVGS.lang}</div>
            <div style="text-align:left;">
              <div style="font-weight:600;font-size:13.5px;line-height:1.2;">${st.language || `Stream ${idx + 1}`}</div>
              <div style="font-size:11px;color:var(--text-meta);margin-top:2px;">${st.label || 'Audio Feed'}</div>
            </div>
          </div>
          ${isSelected ? '<div class="check-indicator">' + SVGS.check + '</div>' : ''}
        `;

        btn.onclick = async () => {
          if (idx === currentActiveStreamIndex) return;
          currentActiveStreamIndex = idx;
          document.getElementById("custom-settings-modal").classList.remove("active");
          await playStreamDirect(st);
          populateQualityTracks();
        };

        container.appendChild(btn);
      });
    }

    function populateQualityTracks() {
      const container = document.getElementById("quality-item-list");
      if (!container || !activeShakaPlayer) return;

      const tracks = activeShakaPlayer.getVariantTracks() || [];
      const config = activeShakaPlayer.getConfiguration();
      const abrEnabled = config && config.abr ? config.abr.enabled : true;
      container.innerHTML = "";

      const autoBtn = document.createElement("button");
      autoBtn.type = "button";
      autoBtn.className = `c-list-btn ${abrEnabled ? 'selected' : ''}`;
      autoBtn.innerHTML = `
        <div class="btn-left">
          <div class="btn-icon-wrap">${SVGS.magic}</div>
          <span>Auto (Adaptive Bitrate)</span>
        </div>
        ${abrEnabled ? '<div class="check-indicator">' + SVGS.check + '</div>' : ''}
      `;
      autoBtn.onclick = () => {
        activeShakaPlayer.configure({ abr: { enabled: true } });
        populateQualityTracks();
        toast("Quality: Auto", "ok", 1500);
      };
      container.appendChild(autoBtn);

      const heights = [...new Set(tracks.map(t => t.height).filter(Boolean))].sort((a, b) => b - a);
      heights.forEach(h => {
        const activeTrack = tracks.find(t => t.active);
        const isCurrent = !abrEnabled && activeTrack && activeTrack.height === h;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `c-list-btn ${isCurrent ? 'selected' : ''}`;
        btn.innerHTML = `
          <div class="btn-left">
            <div class="btn-icon-wrap">${SVGS.tv}</div>
            <span>${h}p High Definition</span>
          </div>
          ${isCurrent ? '<div class="check-indicator">' + SVGS.check + '</div>' : ''}
        `;
        btn.onclick = () => {
          activeShakaPlayer.configure({ abr: { enabled: false } });
          const target = tracks.find(t => t.height === h);
          if (target) activeShakaPlayer.selectVariantTrack(target, true);
          populateQualityTracks();
          toast(`Quality: ${h}p`, "ok", 1500);
        };
        container.appendChild(btn);
      });
    }

    /* LOCK & UNLOCK SYSTEM */
    const floatLockContainer = document.getElementById("floating-lock-container");
    const floatLock = document.getElementById("floating-lock-btn");

    function toggleFloatingLock() {
      if (!floatLockContainer) return;
      if (lockHideTimer) {
        clearTimeout(lockHideTimer);
        lockHideTimer = null;
      }

      if (floatLockContainer.classList.contains("show")) {
        floatLockContainer.classList.remove("show");
      } else {
        floatLockContainer.classList.add("show");
        lockHideTimer = setTimeout(() => {
          floatLockContainer.classList.remove("show");
        }, 3000);
      }
    }

    function lockPlayer(lockBtn) {
      isInterfaceLocked = true;
      document.getElementById("custom-settings-modal").classList.remove("active");
      $pc.classList.add("controls-locked");
      if (lockBtn) lockBtn.innerHTML = LOCK_ICON;
      if (floatLock) floatLock.innerHTML = LOCK_ICON;
      
      floatLockContainer.classList.add("show");
      if (lockHideTimer) clearTimeout(lockHideTimer);
      lockHideTimer = setTimeout(() => floatLockContainer.classList.remove("show"), 3000);

      toast("Controls Locked", "ok", 2000);
    }

    function unlockPlayer(lockBtn) {
      isInterfaceLocked = false;
      $pc.classList.remove("controls-locked");
      floatLockContainer.classList.remove("show");
      if (lockHideTimer) clearTimeout(lockHideTimer);
      if (lockBtn) lockBtn.innerHTML = UNLOCK_ICON;
      toast("Controls Unlocked", "ok", 2000);
    }

    if (floatLock) {
      floatLock.onclick = (e) => {
        e.stopPropagation();
        unlockPlayer(document.querySelector(".sp-lock-btn"));
      };
    }

    $pc.addEventListener("click", (e) => {
      if (isInterfaceLocked) {
        if (e.target.closest("#floating-lock-container")) return;
        toggleFloatingLock();
      }
    });

    $closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closePlayer();
    });

    $closeBtn.addEventListener("touchend", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closePlayer();
    });

    /* GESTURES & DOUBLE TAP */
    function initGestureAndDoubleTap() {
      let touchStartX = 0, touchStartY = 0;
      let startBrightness = 1.0, startVolume = 1.0;
      let brightnessLevel = 1.0;
      let activeGesture = null, isSwiping = false;
      let lastTapTime = 0, accumulatedSeek = 0, lastSeekDirection = null, seekResetTimer = null;

      const overlay = document.getElementById("brightness-overlay");
      const hudB = document.getElementById("hud-brightness");
      const hudBFill = document.getElementById("hud-brightness-fill");
      const hudBTxt = document.getElementById("hud-brightness-txt");
      const hudV = document.getElementById("hud-volume");
      const hudVFill = document.getElementById("hud-volume-fill");
      const hudVTxt = document.getElementById("hud-volume-txt");
      let hudTimer = null;

      function updateB(val) {
        brightnessLevel = Math.max(0, Math.min(1, val));
        overlay.style.opacity = ((1 - brightnessLevel) * 0.85).toFixed(3);
        const pct = Math.round(brightnessLevel * 100);
        hudBFill.style.height = pct + "%";
        hudBTxt.textContent = pct + "%";
        hudB.classList.add("show");
        clearTimeout(hudTimer);
        hudTimer = setTimeout(() => { hudB.classList.remove("show"); hudV.classList.remove("show"); }, 900);
      }

      function updateV(val) {
        val = Math.max(0, Math.min(1, val));
        $vid.volume = val;
        $vid.muted = (val === 0);
        const pct = Math.round(val * 100);
        hudVFill.style.height = pct + "%";
        hudVTxt.textContent = pct + "%";
        hudV.classList.add("show");
        clearTimeout(hudTimer);
        hudTimer = setTimeout(() => { hudB.classList.remove("show"); hudV.classList.remove("show"); }, 900);
      }

      $pc.addEventListener("touchstart", (e) => {
        if (isInterfaceLocked || e.touches.length !== 1 || e.target.closest("#custom-settings-modal, .shaka-bottom-controls, #floating-lock-container, #player-close-btn, #center-play-btn")) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        startBrightness = brightnessLevel;
        startVolume = $vid.muted ? 0 : $vid.volume;
        activeGesture = null;
        isSwiping = false;
      }, { passive: true });

      $pc.addEventListener("touchmove", (e) => {
        if (isInterfaceLocked || e.touches.length !== 1 || e.target.closest("#custom-settings-modal, .shaka-bottom-controls, #floating-lock-container, #player-close-btn, #center-play-btn")) return;
        const dy = e.touches[0].clientY - touchStartY;
        const absX = Math.abs(e.touches[0].clientX - touchStartX);
        const absY = Math.abs(dy);

        if (!activeGesture && absY > 6 && absY > absX) {
          const rect = $pc.getBoundingClientRect();
          const relX = (touchStartX - rect.left) / rect.width;
          activeGesture = relX <= 0.45 ? "brightness" : (relX >= 0.55 ? "volume" : null);
        }

        if (activeGesture) {
          isSwiping = true;
          const delta = -dy / ($pc.clientHeight * 0.55);
          if (activeGesture === "brightness") updateB(startBrightness + delta);
          else if (activeGesture === "volume") updateV(startVolume + delta);
        }
      }, { passive: false });

      $pc.addEventListener("touchend", (e) => {
        if (isInterfaceLocked) return;
        if (isSwiping) { activeGesture = null; isSwiping = false; return; }
        activeGesture = null;
        if (e.target.closest("#custom-settings-modal, .shaka-bottom-controls, #floating-lock-container, #player-close-btn, #center-play-btn")) return;

        const now = Date.now();
        const interval = now - lastTapTime;
        const touch = e.changedTouches[0];
        const screenWidth = $pc.clientWidth;
        if (interval > 0 && interval < 350) {
          const dir = touch.clientX >= screenWidth / 2 ? "forward" : "backward";
          if (lastSeekDirection !== null && lastSeekDirection !== dir) accumulatedSeek = 0;
          lastSeekDirection = dir;
          accumulatedSeek += 10;
          if (dir === "forward") {
            $vid.currentTime = Math.min($vid.currentTime + 10,$vid.duration || Infinity);
            showSeekHud("forward", accumulatedSeek);
          } else {
            $vid.currentTime = Math.max($vid.currentTime - 10, 0);
            showSeekHud("backward", accumulatedSeek);
          }
          if (seekResetTimer) clearTimeout(seekResetTimer);
          seekResetTimer = setTimeout(() => {
            accumulatedSeek = 0;
            lastSeekDirection = null;
            document.getElementById("seek-left").style.display = "none";
            document.getElementById("seek-right").style.display = "none";
          }, 800);
        }
        lastTapTime = now;
      }, { passive: true });

      function showSeekHud(dir, sec) {
        const hud = dir === "forward" ? document.getElementById("seek-right") : document.getElementById("seek-left");
        const txt = dir === "forward" ? document.getElementById("seek-right-text") : document.getElementById("seek-left-text");
        document.getElementById(dir === "forward" ? "seek-left" : "seek-right").style.display = "none";
        txt.textContent = sec;
        hud.style.display = "none";
        void hud.offsetWidth;
        hud.style.display = "flex";
      }
    }

    /* FETCH DATA */
    async function fetchData() {
      try {
        loadingMessage.textContent = 'Loading match data...';
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error("HTTP error " + res.status);
        const data = await res.json();

        if (data.categories && Array.isArray(data.categories)) {
          categories = data.categories;
          renderCategories(categories);
        }

        if (data.slider && Array.isArray(data.slider)) {
          loadSlider(data.slider);
          setInterval(() => {
            activeSlides = data.slider.filter(isSliderItemVisible);
            loadSlider(activeSlides);
          }, 30000);
        }

        if (data.matches) {
          allMatches = data.matches;
          displayAllMatchesInRow(sortMatches(filterMatches(allMatches)));
          startCountdown();
          loadingMessage.style.display = 'none';

          checkDirectSharedStream();
        }
      } catch (err) {
        console.error(err);
        loadingMessage.textContent = 'Error loading matches data.';
      }
    }

    document.addEventListener("DOMContentLoaded", fetchData);
