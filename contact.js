/* Configuración de contacto — actualice el correo o endpoint cuando esté listo */
const CONTACT_CONFIG = {
  email: 'contacto@barriosabogado.cl',
  endpoint: '', // ej: 'https://formsubmit.co/contacto@barriosabogado.cl'
};

function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  if (!form) return;

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

    const consent = fd.get('consent');
    if (!data.name || !data.email || !data.message || !consent) {
      if (!data.name) form.querySelector('[name="name"]')?.closest('.form-field')?.classList.add('has-error');
      if (!data.email) form.querySelector('[name="email"]')?.closest('.form-field')?.classList.add('has-error');
      if (!data.message) form.querySelector('[name="message"]')?.closest('.form-field')?.classList.add('has-error');
      if (!consent) form.querySelector('.contact-pro-consent')?.classList.add('has-error');
      return;
    }

    form.querySelectorAll('.form-field, .contact-pro-consent').forEach((f) => f.classList.remove('has-error'));

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
}

function showSuccess(form, success) {
  form.hidden = true;
  success.hidden = false;
  success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  lucide.createIcons();
}
