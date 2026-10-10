const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

/** Standalone UT motion: all information remains available without this module. */
export function initMotion() {
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const cleanups = [];
  const visible = new Set();
  const visibilityListeners = new Map();
  let destroyed = false;
  let scrollFrame = 0;
  let pointerFrame = 0;
  let pointerTime = 0;
  let progressive = [];

  const listen = (target, event, handler, options) => {
    target.addEventListener(event, handler, options);
    cleanups.push(() => target.removeEventListener(event, handler, options));
  };
  const observe = (element, callback) => {
    if (!element) return;
    if (!visibilityListeners.has(element)) visibilityListeners.set(element, []);
    if (callback) visibilityListeners.get(element).push(callback);
    if (observer) observer.observe(element);
    else { visible.add(element); callback?.(true); }
  };
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
      visibilityListeners.get(entry.target)?.forEach(callback => callback(entry.isIntersecting));
    });
    requestScrollFrame();
  }, { rootMargin: '12% 0px', threshold: 0 }) : null;

  const revealItems = [...document.querySelectorAll('[data-reveal]')];
  revealItems.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(Number(element.dataset.revealDelay) || (index % 3) * 60, 220)}ms`);
    observe(element, inView => {
      if (inView || reduced.matches) {
        element.classList.add('is-visible', 'is-in');
      }
    });
    if (reduced.matches) element.classList.add('is-visible', 'is-in');
  });

  const parallax = [...document.querySelectorAll('[data-parallax]')].map(element => ({
    element,
    host: element.closest('section, [data-chapter]') || element.parentElement,
    speed: clamp(parseFloat(element.dataset.parallax) || .12, -.4, .4),
    originalTranslate: element.style.translate,
  }));
  parallax.forEach(item => observe(item.host));

  // The original canopy renderer owns its real foliage. These optional fallback
  // leaves retain restrained depth when that renderer cannot start.
  const leaves = [...document.querySelectorAll('[data-leaf]')].map((element, index) => ({
    element,
    host: element.closest('section, [data-chapter]') || element.parentElement,
    amount: 9 + (index % 5) * 6,
    sign: index % 2 ? 1 : -1,
    baseAngle: parseFloat(getComputedStyle(element).rotate) || 0,
    originalTranslate: element.style.translate,
    originalRotate: element.style.rotate,
  }));
  leaves.forEach(item => observe(item.host));

  function splitWords(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: node => {
        if (!node.nodeValue?.trim() || node.parentElement.closest('.ut-word, script, style, [aria-hidden="true"]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      node.nodeValue.match(/\S+|\s+/g)?.forEach(token => {
        if (/^\s+$/.test(token)) fragment.append(document.createTextNode(token));
        else {
          const word = document.createElement('span');
          word.className = 'ut-word';
          word.textContent = token;
          fragment.append(word);
        }
      });
      node.replaceWith(fragment);
    });
    return [...element.querySelectorAll('.ut-word')];
  }

  function refreshText() {
    if (destroyed) return;
    progressive = [...document.querySelectorAll('[data-progressive]')].map(element => ({
      element,
      words: splitWords(element),
      progress: element.classList.contains('is-complete') ? 1 : 0,
    }));
    progressive.forEach(item => observe(item.element));
    requestScrollFrame();
  }

  function updateScroll() {
    scrollFrame = 0;
    if (destroyed || document.hidden) return;
    const height = window.innerHeight;
    parallax.forEach(item => {
      if (reduced.matches) { item.element.style.translate = item.originalTranslate; return; }
      if (!visible.has(item.host)) return;
      const rect = item.host.getBoundingClientRect();
      const position = clamp((height - rect.top) / (height + rect.height), 0, 1) - .5;
      const offset = position * Math.min(height, 1000) * item.speed;
      item.element.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
      item.element.style.translate = `0 ${offset.toFixed(2)}px`;
    });
    leaves.forEach(item => {
      if (reduced.matches) {
        item.element.style.translate = item.originalTranslate;
        item.element.style.rotate = item.originalRotate;
        return;
      }
      if (!visible.has(item.host)) return;
      const rect = item.host.getBoundingClientRect();
      const position = clamp((height - rect.top) / (height + rect.height), 0, 1) - .5;
      const offset = position * item.amount;
      item.element.style.translate = `${(offset * item.sign * .5).toFixed(2)}px ${offset.toFixed(2)}px`;
      item.element.style.rotate = `${(item.baseAngle + position * 7 * item.sign).toFixed(2)}deg`;
    });
    progressive.forEach(item => {
      if (!visible.has(item.element) && !reduced.matches) return;
      const rect = item.element.getBoundingClientRect();
      const next = reduced.matches ? 1 : clamp((height * .86 - rect.top) / (rect.height + height * .27), 0, 1);
      item.progress = Math.max(item.progress, next);
      item.words.forEach((word, index) => {
        // Keep unread words legible on both the paper and navy surfaces.
        const opacity = clamp(item.progress * (item.words.length + 1) - index, .64, 1);
        word.style.opacity = opacity.toFixed(3);
      });
      if (item.progress >= 1) item.element.classList.add('is-complete');
    });
  }

  function requestScrollFrame() {
    if (!scrollFrame && !destroyed) scrollFrame = requestAnimationFrame(updateScroll);
  }

  const magnets = [...document.querySelectorAll('[data-magnetic]')].map(element => ({
    element, x: 0, y: 0, targetX: 0, targetY: 0,
    originalTranslate: element.style.translate,
  }));
  magnets.forEach(item => observe(item.element));
  const tilts = [...document.querySelectorAll('[data-tilt]')].map(element => ({
    element,
    originalRotate: element.style.rotate,
    layers: [...element.querySelectorAll('[data-tilt-layer]')].map(layer => ({ element: layer, originalTranslate: layer.style.translate })),
    x: 0, y: 0, targetX: 0, targetY: 0,
  }));
  tilts.forEach(item => observe(item.element));

  function pointerEnabled() { return !reduced.matches && finePointer.matches && !document.hidden; }

  function resetPointer() {
    magnets.forEach(item => {
      item.x = item.y = item.targetX = item.targetY = 0;
      item.element.style.translate = item.originalTranslate;
    });
    tilts.forEach(item => {
      item.x = item.y = item.targetX = item.targetY = 0;
      item.element.style.setProperty('--tilt-x', '0deg');
      item.element.style.setProperty('--tilt-y', '0deg');
      item.element.style.rotate = item.originalRotate;
      item.layers.forEach(layer => { layer.element.style.translate = layer.originalTranslate; });
    });
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
  }

  function updatePointer(time) {
    pointerFrame = 0;
    if (!pointerEnabled() || destroyed) { resetPointer(); return; }
    const delta = pointerTime ? clamp((time - pointerTime) / 1000, .001, .05) : 1 / 60;
    pointerTime = time;
    const ease = 1 - Math.exp(-delta * 15);
    let unsettled = false;
    magnets.forEach(item => {
      item.x += (item.targetX - item.x) * ease;
      item.y += (item.targetY - item.y) * ease;
      if (Math.abs(item.x) + Math.abs(item.y) < .04 && !item.targetX && !item.targetY) {
        item.x = item.y = 0;
        item.element.style.translate = item.originalTranslate;
      } else item.element.style.translate = `${item.x.toFixed(2)}px ${item.y.toFixed(2)}px`;
      if (Math.abs(item.targetX - item.x) + Math.abs(item.targetY - item.y) > .03) unsettled = true;
    });
    tilts.forEach(item => {
      item.x += (item.targetX - item.x) * ease;
      item.y += (item.targetY - item.y) * ease;
      item.element.style.setProperty('--tilt-x', `${(-item.y * 8).toFixed(2)}deg`);
      item.element.style.setProperty('--tilt-y', `${(item.x * 11).toFixed(2)}deg`);
      const pitch = -item.y * 8;
      const yaw = item.x * 11;
      const angle = Math.hypot(pitch, yaw);
      // Individual rotate composes with authored transforms (the laptop's
      // resting angle, for example) instead of replacing that composition.
      item.element.style.rotate = angle > .025 ? `${pitch.toFixed(3)} ${yaw.toFixed(3)} 0 ${angle.toFixed(3)}deg` : item.originalRotate;
      item.layers.forEach((layer, index) => {
        const depth = Number(layer.element.dataset.tiltLayer) || 9 + index * 7;
        layer.element.style.translate = `${(item.x * depth).toFixed(2)}px ${(item.y * depth).toFixed(2)}px`;
      });
      if (Math.abs(item.targetX - item.x) + Math.abs(item.targetY - item.y) > .003) unsettled = true;
    });
    if (unsettled) pointerFrame = requestAnimationFrame(updatePointer);
  }

  function requestPointerFrame() {
    if (!pointerFrame && pointerEnabled()) { pointerTime = 0; pointerFrame = requestAnimationFrame(updatePointer); }
  }

  listen(window, 'pointermove', event => {
    if (!pointerEnabled() || event.pointerType === 'touch') return;
    magnets.forEach(item => {
      if (!visible.has(item.element) || item.element.closest('[hidden], [inert]')) { item.targetX = item.targetY = 0; return; }
      const rect = item.element.getBoundingClientRect();
      // Subtract our own displacement to keep a stable attraction point.
      const left = rect.left - item.x;
      const top = rect.top - item.y;
      const distance = Math.hypot(event.clientX - clamp(event.clientX, left, left + rect.width), event.clientY - clamp(event.clientY, top, top + rect.height));
      const pull = clamp(1 - distance / 55, 0, 1);
      item.targetX = clamp((event.clientX - left - rect.width / 2) * .25 * pull, -11, 11);
      item.targetY = clamp((event.clientY - top - rect.height / 2) * .25 * pull, -11, 11);
    });
    tilts.forEach(item => {
      if (!visible.has(item.element) || item.element.closest('[hidden], [inert]')) { item.targetX = item.targetY = 0; return; }
      const rect = item.element.getBoundingClientRect();
      const near = event.clientX >= rect.left - 80 && event.clientX <= rect.right + 80 && event.clientY >= rect.top - 80 && event.clientY <= rect.bottom + 80;
      item.targetX = near ? clamp((event.clientX - rect.left - rect.width / 2) / Math.max(rect.width / 2, 1), -1, 1) : 0;
      item.targetY = near ? clamp((event.clientY - rect.top - rect.height / 2) / Math.max(rect.height / 2, 1), -1, 1) : 0;
    });
    requestPointerFrame();
  }, { passive: true });

  listen(document.documentElement, 'pointerleave', () => {
    magnets.forEach(item => { item.targetX = item.targetY = 0; });
    tilts.forEach(item => { item.targetX = item.targetY = 0; });
    requestPointerFrame();
  });
  listen(window, 'scroll', requestScrollFrame, { passive: true });
  listen(window, 'resize', requestScrollFrame, { passive: true });
  listen(document, 'visibilitychange', () => {
    resetPointer();
    if (!document.hidden) requestScrollFrame();
    else { cancelAnimationFrame(scrollFrame); scrollFrame = 0; }
  });
  const preferenceChanged = () => {
    resetPointer();
    if (reduced.matches) revealItems.forEach(element => element.classList.add('is-visible', 'is-in'));
    root.classList.toggle('ut-reduced-motion', reduced.matches);
    requestScrollFrame();
  };
  listen(reduced, 'change', preferenceChanged);
  listen(finePointer, 'change', preferenceChanged);
  root.classList.add('ut-motion-ready');
  root.classList.toggle('ut-reduced-motion', reduced.matches);
  refreshText();

  return {
    refreshText,
    destroy() {
      destroyed = true;
      cleanups.forEach(cleanup => cleanup());
      observer?.disconnect();
      cancelAnimationFrame(scrollFrame);
      resetPointer();
      parallax.forEach(item => { item.element.style.translate = item.originalTranslate; });
      leaves.forEach(item => { item.element.style.translate = item.originalTranslate; item.element.style.rotate = item.originalRotate; });
      progressive.forEach(item => item.words.forEach(word => { word.style.opacity = '1'; }));
      root.classList.remove('ut-motion-ready');
    },
  };
}
