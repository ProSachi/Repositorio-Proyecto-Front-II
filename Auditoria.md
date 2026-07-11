## Cambio realizado: Botón "Volver" en Navbar

### Objetivo
Se agregó un botón "← Volver" en la barra de navegación para permitir al usuario regresar a la página anterior de forma rápida.

---

### Archivos modificados

#### 1. Navbar.jsx
Se agregó un botón dentro del contenedor de acciones del navbar:

```jsx
<button
  className="btn-volver"
  onClick={() => navigate(-1)}
>
  ← Volver
</button>

