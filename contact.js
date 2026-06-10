/* Perfil y contacto — alineado con barriosabogado.cl */
const COUNSEL_CONFIG = {
  fullName: 'Felipe Barrios Callejas',
  legalName: 'Felipe Andrés Barrios Callejas',
  firstName: 'Felipe',
  title: 'CEO y socio fundador',
  roleLine: 'CEO · Barrios Abogado',
  tagline: 'CEO · Barrios Abogado · Ovalle',
  firm: 'Barrios Abogado',
  website: 'https://barriosabogado.cl',
  linkedin: 'https://cl.linkedin.com/in/felipe-andr%C3%A9s-barrios-callejas-4b3897a8',
  photo: 'assets/felipe-barrios-portrait.jpg',
  photoThumb: 'assets/felipe-barrios-thumb.jpg',
  whatsapp: '56958104264',
  phoneDisplay: '+56 9 5810 4264',
  shortBio:
    'Titulado en la Universidad del Mar (La Serena), diplomatura en Derecho medioambiental en la U. de Chile. Trayectoria en civil, herencias, expropiaciones, contratos, derecho registral y minería.',
  stripBio:
    'Abogado con base en Ovalle. Experiencia en juicios civiles, herencias, expropiaciones, contratos, derecho registral y minería. Estrategias para la zona norte con rigor y cercanía humana.',
  practiceTags: ['Civil y herencias', 'Derecho registral', 'Minería'],
  signatureMeta: 'Ovalle, Chile · barriosabogado.cl',
  quote: {
    text: '«Rigor profesional, decisiones informadas y un acompañamiento humano cuando la situación es exigente.»',
    cite: '— Felipe Barrios Callejas',
  },
};

const CONTACT_CONFIG = {
  email: 'contacto@barriosabogado.cl',
  endpoint: '', // ej: 'https://formsubmit.co/contacto@barriosabogado.cl'
  location: {
    city: 'Ovalle',
    region: 'Región de Coquimbo',
    street: 'Av. Manuel Peñafiel 1480',
    office: 'Of. 316 A, 3er piso',
    building: 'Edificio Arenas',
    address:
      'Manuel Peñafiel #1480, oficina 316 A, 3er piso · Edificio Arenas · Ovalle, Chile',
    lat: -30.5773804,
    lon: -71.1887003,
    zoom: 17,
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Manuel%20Pe%C3%B1afiel%201480%2C%20Of.%20316%20A%2C%203er%20piso%2C%20Ovalle%2C%20Chile',
  },
};

function getAbogadoFichaPopup() {
  const c = COUNSEL_CONFIG;
  const loc = CONTACT_CONFIG.location;
  return {
    icon: 'scale',
    title: c.fullName,
    tagline: c.tagline,
    dossier: true,
    image: c.photo,
    intro: `Soy ${c.legalName}, abogado con base en ${loc.city}, ${c.title.toLowerCase()} de ${c.firm}. ${c.shortBio}`,
    signature: { logo: 'logo-barrios.png', firm: c.firm, meta: c.signatureMeta },
    metrics: [
      { icon: 'map-pin', value: loc.city, label: 'Base de atención' },
      { icon: 'scale', value: 'Civil', label: 'Herencias y contratos' },
      { icon: 'gem', value: 'Registral', label: 'CBRS y propiedad' },
      { icon: 'pickaxe', value: 'Minería', label: 'Concesiones y contratos' },
    ],
    practiceTags: c.practiceTags,
    blocks: [
      {
        icon: 'graduation-cap',
        title: 'Formación',
        text: 'Titulado en la Universidad del Mar, sede La Serena. Diplomatura en Derecho medioambiental en la Universidad de Chile.',
      },
      {
        icon: 'landmark',
        title: 'Experiencia judicial y civil',
        text: 'Amplia experiencia en juicios civiles, herencias, expropiaciones y contratos.',
      },
      {
        icon: 'mountain',
        title: 'Registral y minería',
        text: 'Experto en Derecho registral. En minería: concesiones mineras, contratos mineros, corretaje minero, pedimentos, mensuras, entre otros.',
      },
      {
        icon: 'building-2',
        title: 'Atención presencial',
        text: `${loc.street}, ${loc.office}, ${loc.city}. ${loc.building}.`,
      },
    ],
    quote: c.quote,
    ctas: [
      { label: 'Agendar conversación', href: 'reserva.html', style: 'primary', icon: 'calendar-check' },
      {
        label: 'WhatsApp directo',
        href: `https://wa.me/${c.whatsapp}?text=${encodeURIComponent('Hola Felipe, quisiera conversar sobre mi caso.')}`,
        style: 'wa',
        icon: 'message-circle',
        external: true,
      },
      { label: 'LinkedIn', href: c.linkedin, style: 'ghost', icon: 'linkedin', external: true },
      { label: 'Ver ubicación', href: '#footer-map', style: 'ghost', icon: 'map-pin' },
    ],
  };
}

function syncCounselProfile() {
  const c = COUNSEL_CONFIG;
  const loc = CONTACT_CONFIG.location;

  document.querySelectorAll('[data-counsel="role"]').forEach((el) => {
    el.textContent = c.roleLine;
  });
  document.querySelectorAll('[data-counsel="fullName"]').forEach((el) => {
    el.textContent = c.fullName;
  });
  document.querySelectorAll('[data-counsel="stripBio"]').forEach((el) => {
    el.textContent = c.stripBio;
  });
  document.querySelectorAll('[data-counsel="signatureMeta"]').forEach((el) => {
    el.textContent = c.signatureMeta;
  });
  document.querySelectorAll('[data-counsel="officeLine"]').forEach((el) => {
    el.textContent = `${loc.street}, ${loc.office}`;
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  if (!form) return;

  const progressFill = document.getElementById('contact-progress-fill');
  const progressPct = document.getElementById('contact-progress-pct');
  const progressLabel = document.getElementById('contact-progress-label');
  const progressBar = document.getElementById('contact-progress-bar');
  const submitBtn = document.getElementById('contact-submit');
  const submitText = submitBtn?.querySelector('.contact-submit-text');
  const charCount = document.getElementById('contact-char-count');
  const areaInput = document.getElementById('contact-area');
  const consent = document.getElementById('contact-consent');

  const fields = {
    name: form.querySelector('[name="name"]'),
    email: form.querySelector('[name="email"]'),
    phone: form.querySelector('[name="phone"]'),
    message: form.querySelector('[name="message"]'),
  };

  function setFloatState(wrap) {
    const input = wrap.querySelector('input, textarea');
    if (!input) return;
    wrap.classList.toggle('has-value', Boolean(input.value.trim()));
  }

  form.querySelectorAll('.form-field--float').forEach((wrap) => {
    const input = wrap.querySelector('input, textarea');
    if (!input) return;
    setFloatState(wrap);
    input.addEventListener('focus', () => wrap.classList.add('is-focused'));
    input.addEventListener('blur', () => {
      wrap.classList.remove('is-focused');
      setFloatState(wrap);
      validateField(wrap, input);
    });
    input.addEventListener('input', () => {
      setFloatState(wrap);
      validateField(wrap, input, false);
      updateProgress();
    });
  });

  function validateField(wrap, input, showError = true) {
    let valid = true;
    if (input.required && !input.value.trim()) {
      valid = false;
      if (showError) wrap.classList.remove('has-error');
    } else if (input.type === 'email' && input.value.trim()) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (showError && !valid) wrap.classList.add('has-error');
      else wrap.classList.remove('has-error');
    } else {
      wrap.classList.remove('has-error');
    }
    wrap.classList.toggle('is-valid', valid && Boolean(input.value.trim()));
    return valid;
  }

  function updateProgress() {
    const checks = [
      Boolean(fields.name?.value.trim()),
      Boolean(fields.email?.value.trim()) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim()),
      Boolean(fields.message?.value.trim()),
      Boolean(consent?.checked),
    ];
    const done = checks.filter(Boolean).length;
    const pct = Math.round((done / checks.length) * 100);

    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressPct) progressPct.textContent = `${pct}%`;
    if (progressBar) progressBar.setAttribute('aria-valuenow', String(pct));

    const labels = ['Comience su consulta', 'Cuéntenos su situación', 'Casi listo', 'Listo para enviar'];
    if (progressLabel) {
      progressLabel.textContent = labels[Math.min(done, labels.length - 1)];
    }

    const ready = done === checks.length;
    if (submitBtn) {
      submitBtn.disabled = !ready;
      submitBtn.classList.toggle('is-ready', ready);
    }
    if (submitText) {
      submitText.textContent = ready ? 'Enviar consulta' : 'Complete los campos obligatorios';
    }
  }

  if (fields.message && charCount) {
    const updateCount = () => {
      const len = fields.message.value.length;
      charCount.textContent = `${len} / 500`;
      updateProgress();
    };
    fields.message.addEventListener('input', updateCount);
    updateCount();
  }

  document.querySelectorAll('.contact-area-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.contact-area-chip').forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      if (areaInput) areaInput.value = chip.dataset.area || chip.textContent;
    });
  });

  consent?.addEventListener('change', () => {
    form.querySelector('.contact-pro-consent')?.classList.remove('has-error');
    updateProgress();
  });

  document.querySelector('.contact-map-to-form')?.addEventListener('click', (e) => {
    e.preventDefault();
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    fields.name?.focus();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = {
      name: fd.get('name')?.toString().trim(),
      email: fd.get('email')?.toString().trim(),
      phone: fd.get('phone')?.toString().trim(),
      area: fd.get('area')?.toString(),
      message: fd.get('message')?.toString().trim(),
    };

    const consentVal = fd.get('consent');
    let hasError = false;

    form.querySelectorAll('.form-field--float').forEach((wrap) => {
      const input = wrap.querySelector('input, textarea');
      if (input && !validateField(wrap, input)) hasError = true;
    });

    if (!data.name || !data.email || !data.message || !consentVal) {
      if (!data.name) form.querySelector('[name="name"]')?.closest('.form-field')?.classList.add('has-error');
      if (!data.email) form.querySelector('[name="email"]')?.closest('.form-field')?.classList.add('has-error');
      if (!data.message) form.querySelector('[name="message"]')?.closest('.form-field')?.classList.add('has-error');
      if (!consentVal) form.querySelector('.contact-pro-consent')?.classList.add('has-error');
      updateProgress();
      return;
    }

    if (hasError) return;

    submitBtn?.classList.add('is-loading');
    if (submitText) submitText.textContent = 'Enviando…';

    if (CONTACT_CONFIG.endpoint) {
      try {
        const res = await fetch(CONTACT_CONFIG.endpoint, {
          method: 'POST',
          body: fd,
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error('send failed');
        showSuccess(form, success);
        return;
      } catch {
        /* fallback a mailto */
      }
    }

    const subject = encodeURIComponent(`Consulta web — ${data.area}`);
    const body = encodeURIComponent(
      `Nombre: ${data.name}\nEmail: ${data.email}\nTeléfono: ${data.phone || '—'}\nÁrea: ${data.area}\n\nMensaje:\n${data.message}`
    );
    window.location.href = `mailto:${CONTACT_CONFIG.email}?subject=${subject}&body=${body}`;
    setTimeout(() => showSuccess(form, success), 400);
  });

  updateProgress();
}

function scheduleFooterMap() {
  const boot = () => {
    if (document.body.classList.contains('is-loading')) {
      requestAnimationFrame(boot);
      return;
    }
    initFooterMap();
  };
  boot();
}

function initFooterMap() {
  const el = document.getElementById('footer-map-canvas');
  if (!el || typeof L === 'undefined' || el._leaflet_id) return;

  const { lat, lon, zoom, street, office, building, mapsUrl } = CONTACT_CONFIG.location;

  const map = L.map(el, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  }).setView([lat, lon], zoom);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" rel="noopener noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" rel="noopener noreferrer">CARTO</a>',
  }).addTo(map);

  const pinIcon = L.divIcon({
    className: 'footer-map-leaflet-pin',
    html: '<span class="footer-map-leaflet-pin-inner" aria-hidden="true"><span class="footer-map-leaflet-pin-dot"></span></span>',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -40],
  });

  const marker = L.marker([lat, lon], { icon: pinIcon }).addTo(map);
  marker.bindPopup(
    `<strong>Barrios Abogado</strong><br>${street}, ${office}<br><em>${building}</em><br><a href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Abrir en Google Maps</a>`
  ).openPopup();

  const refresh = () => {
    map.invalidateSize();
    map.setView([lat, lon], zoom, { animate: false });
  };

  setTimeout(refresh, 400);
  setTimeout(refresh, 2600);

  const observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) refresh();
  }, { threshold: 0.15 });
  observer.observe(el);

  window.addEventListener('resize', refresh);
}

function showSuccess(form, success) {
  const submitBtn = document.getElementById('contact-submit');
  submitBtn?.classList.remove('is-loading');
  form.hidden = true;
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  lucide.createIcons();
}
