# Barrios Abogado

Sitio web del estudio jurídico Barrios Abogado (Chile). Sitio estático HTML/CSS/JS.

**Producción:** [https://barriosabogado.cl](https://barriosabogado.cl)  
**Repositorio:** [github.com/menguex/barrios-abogado](https://github.com/menguex/barrios-abogado)  
**Deploy:** Vercel (`barrios-abogado`)

## Páginas

- `index.html` — Inicio
- `filosofia.html` — Filosofía del estudio
- `reserva.html` — Reserva guiada
- `planes.html` — Honorarios

## Desarrollo local

```bash
python3 -m http.server 8765
```

Abrir `http://localhost:8765`

## Deploy

Compatible con Vercel como sitio estático (sin build). El dominio `barriosabogado.cl` apunta al proyecto `barrios-abogado`.

```bash
npx vercel --prod
```
