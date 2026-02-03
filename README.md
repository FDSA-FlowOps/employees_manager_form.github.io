# FDSA - Sistema de Gestión de Empleados

Webapp desarrollada con Next.js, TypeScript y Tailwind CSS para gestionar empleados mediante formularios que realizan llamadas a la API de Factorial y flujos de n8n. Incluye dos módulos principales: **Alta de Nuevo Compañero** y **Salida Compañero**.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Despliegue](#-despliegue)
- [Seguridad](#-seguridad)
- [API Endpoints](#-api-endpoints)
- [Integración con n8n](#-integración-con-n8n)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 🚀 Características

### Módulos Disponibles

- **Alta Nuevo Compañero**: Formulario completo para dar de alta nuevos empleados en el sistema
- **Salida Compañero**: Proceso de salida de empleados con gestión de usuarios de Google, Jira y Factorial

### Funcionalidades Principales

- ✅ **Sistema de autenticación** con credenciales configuradas en variables de entorno
- ✅ **Formularios completos** con validación de campos obligatorios en tiempo real
- ✅ **Integración con API de Factorial** para cargar datos dinámicos:
  - Entidades Legales
  - Roles
  - Responsables de Equipo
  - Tipos de Contrato
  - Empleados Activos
  - Niveles (para desarrolladores)
- ✅ **Integración con n8n** para:
  - Usuarios de Google Workspace
  - Usuarios de Jira
  - Calendarios de Google
  - Grupos de Google
- ✅ **Interfaz moderna e intuitiva** con colores corporativos
- ✅ **Tooltips informativos** en campos importantes
- ✅ **Modales de confirmación y resultados** con feedback visual
- ✅ **Validación en tiempo real** con mensajes de error claros
- ✅ **Diseño responsive** para diferentes dispositivos
- ✅ **Carga de imágenes** para perfiles de empleados (opcional)

## 📋 Requisitos Previos

- **Node.js** 18 o superior
- **npm** o **yarn**
- **API Key de Factorial**
- **Instancia de n8n** con webhooks configurados
- **Cuenta de Google Workspace** (para usuarios y calendarios)
- **Cuenta de Jira** (para usuarios)

## 🛠️ Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/fdsa_new_employee.git
cd fdsa_new_employee
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

⚠️ **IMPORTANTE:** El archivo `.env` contiene credenciales sensibles y **NUNCA** debe subirse al repositorio.

#### Para Desarrollo Local:

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` y añade tus credenciales reales:

```env
# Autenticación (requerido)
AUTH_USERNAME=tu_usuario
AUTH_PASSWORD=tu_contraseña

# Factorial API
FACTORIAL_API_KEY=tu_api_key_de_factorial

# n8n Webhooks
N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/alta-empleado
N8N_EMPLOYEE_EXIT_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/salida-empleado
N8N_MASTERS_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/masters
```

#### Para Producción:

**GitHub Actions:**
- Ve a Settings → Secrets and variables → Actions
- Añade cada variable como un secret
- Ver [docs/SECURITY.md](docs/SECURITY.md) para más detalles

**Vercel/Netlify:**
- Configura las variables en el dashboard de la plataforma
- Ver [docs/SECURITY.md](docs/SECURITY.md) para más detalles

📚 **Ver [docs/SECURITY.md](docs/SECURITY.md) para una guía completa de seguridad de variables de entorno.**

### 4. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `AUTH_USERNAME` | Usuario para el sistema de login | ✅ Sí |
| `AUTH_PASSWORD` | Contraseña para el sistema de login | ✅ Sí |
| `FACTORIAL_API_KEY` | API key de Factorial | ✅ Sí |
| `N8N_WEBHOOK_URL` | URL del webhook de n8n para alta de empleados | ✅ Sí |
| `N8N_EMPLOYEE_EXIT_WEBHOOK_URL` | URL del webhook de n8n para salida de empleados | ✅ Sí |
| `N8N_MASTERS_WEBHOOK_URL` | URL del webhook unificado de n8n para maestros | ✅ Sí |

**⚠️ IMPORTANTE:** El archivo `.env` está en `.gitignore` y **NUNCA** debe subirse al repositorio. Ver [docs/SECURITY.md](docs/SECURITY.md) para mejores prácticas de seguridad.

## 📝 Uso

### Inicio de Sesión

1. Al abrir la aplicación, serás redirigido a la página de login
2. Introduce las credenciales configuradas en las variables de entorno
3. Una vez autenticado, accederás al dashboard principal

### Alta de Nuevo Compañero

1. Selecciona el tab **"Alta Nuevo Compañero"**
2. Completa el formulario con los datos del nuevo empleado
3. Los campos marcados con * son obligatorios
4. Los selectores se cargarán automáticamente desde Factorial y n8n
5. Revisa la información en el modal de confirmación
6. Confirma el alta y espera los resultados del proceso

### Salida de Compañero

1. Selecciona el tab **"Salida Compañero"**
2. Completa el formulario con:
   - Empleado a dar de baja
   - Perfil del empleado
   - Usuario de Google
   - Usuario de Jira
   - Responsable del traspaso (opcional)
   - Fecha de finalización
3. Confirma la salida y espera los resultados del proceso

## 📁 Estructura del Proyecto

```
fdsa_new_employee/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/             # Endpoints de autenticación
│   │   ├── factorial/        # Endpoints de Factorial
│   │   └── n8n/              # Endpoints de n8n
│   ├── login/                # Página de login
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Página principal
├── components/               # Componentes React
│   ├── AltaNuevoCompanero.tsx
│   ├── EmployeeExitForm.tsx
│   ├── EmployeeForm.tsx
│   ├── SalidaCompanero.tsx
│   ├── ResultsModal.tsx
│   └── ...
├── hooks/                    # Custom Hooks
│   ├── useActiveEmployees.ts
│   ├── useFactorialData.ts
│   ├── useMasters.ts
│   └── ...
├── lib/                      # Utilidades y helpers
│   ├── factorial.ts
│   └── n8n.ts
├── types/                    # Definiciones de TypeScript
│   └── index.ts
├── middleware.ts             # Middleware de Next.js (autenticación)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔧 Tecnologías Utilizadas

- **[Next.js 14](https://nextjs.org/)** - Framework React con App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilos utilitarios
- **[React Hook Form](https://react-hook-form.com/)** - Manejo de formularios
- **[Zod](https://zod.dev/)** - Validación de esquemas
- **[Lucide React](https://lucide.dev/)** - Iconos
- **[React Hot Toast](https://react-hot-toast.com/)** - Notificaciones

## 🚀 Despliegue

### Vercel (Recomendado)

Vercel es la plataforma recomendada para desplegar aplicaciones Next.js:

1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Vercel detectará automáticamente Next.js y desplegará la aplicación

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Netlify

1. Conecta tu repositorio de GitHub con Netlify
2. Configura las variables de entorno
3. Establece el comando de build: `npm run build`
4. Establece el directorio de publicación: `.next`

### Otras Opciones

- **Railway**: Soporta Next.js nativamente
- **Render**: Ofrece soporte para aplicaciones Next.js
- **AWS Amplify**: Soporta Next.js con SSR

### GitHub Pages

⚠️ **ADVERTENCIA IMPORTANTE**: GitHub Pages solo sirve archivos estáticos. Esto significa que:
- ❌ **NO funcionarán** las API routes (`/api/*`)
- ❌ **NO funcionará** el middleware de autenticación
- ❌ **NO funcionará** el SSR (Server-Side Rendering)
- ❌ **NO funcionará** la autenticación basada en cookies del servidor

Si necesitas estas funcionalidades, **NO uses GitHub Pages**. Considera Vercel, Netlify u otras plataformas.

#### Configuración para GitHub Pages

1. **Configura el repositorio en GitHub Pages:**
   - Ve a Settings → Pages en tu repositorio
   - Source: selecciona la rama (generalmente `main` o `gh-pages`)
   - Folder: selecciona `/ (root)` o `/docs` según tu configuración

2. **Ajusta `basePath` en `next.config.js` si es necesario:**
   - Si tu repositorio es `employees_manager_form.github.io` y está en la raíz: `basePath: ''`
   - Si está en un subdirectorio: `basePath: '/employees_manager_form'`

3. **Crea un script de build para GitHub Pages:**
   ```bash
   npm run build:gh-pages
   ```

4. **Despliega:**
   - Opción A: Usar GitHub Actions (recomendado)
     - Crea `.github/workflows/deploy.yml` (ver ejemplo abajo)
   - Opción B: Build manual
     ```bash
     npm run build:gh-pages
     # Copia el contenido de 'out' a la rama gh-pages o a la carpeta /docs
     ```

#### GitHub Actions Workflow (Recomendado)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build:gh-pages
        env:
          # Añade aquí tus variables de entorno si es necesario
          # AUTH_USERNAME: ${{ secrets.AUTH_USERNAME }}
          # AUTH_PASSWORD: ${{ secrets.AUTH_PASSWORD }}
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 🔐 Seguridad

### Autenticación

- Sistema de login con credenciales configuradas en variables de entorno
- Las credenciales se validan contra `AUTH_USERNAME` y `AUTH_PASSWORD`
- Las sesiones se mantienen mediante cookies httpOnly seguras (7 días de duración)
- Todas las rutas están protegidas por middleware (excepto `/login` y endpoints de autenticación)
- Redirección automática para usuarios no autenticados

### API Key de Factorial

- Se mantiene en memoria durante la sesión
- No se almacena en localStorage ni cookies
- Las llamadas a la API se realizan a través de endpoints Next.js para mayor seguridad

### Variables de Entorno

- Todas las credenciales sensibles se gestionan mediante variables de entorno
- El archivo `.env` está en `.gitignore` y no se sube al repositorio

## 📡 API Endpoints

### Endpoints Internos

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/check` - Verificar estado de autenticación
- `GET /api/n8n/masters` - Obtener maestros (calendarios, grupos, usuarios)
- `POST /api/n8n/send-employee` - Enviar datos de alta de empleado
- `POST /api/n8n/send-employee-exit` - Enviar datos de salida de empleado

### Endpoints de Factorial

- `GET /api/factorial/legal-entities` - Entidades legales
- `GET /api/factorial/roles` - Roles
- `GET /api/factorial/employees` - Empleados
- `GET /api/factorial/active-employees` - Empleados activos
- `GET /api/factorial/contract-types` - Tipos de contrato
- `GET /api/factorial/levels` - Niveles

## 🔄 Integración con n8n

### Formato de Datos para Alta de Empleado

Los datos se transforman automáticamente al formato requerido por n8n:

```json
{
  "first_name": "Juan",
  "last_name": "Pérez García",
  "email": "juan.perez@fdsa.es",
  "company_id": 123,
  "legal_entity_id": 123,
  "nationality": "Española",
  "gender": "male",  // "male" o "female" (otros valores no se envían)
  "role": 456,
  "job_level_id": 789,
  "manager_id": 101,
  "timeoff_manager_id": 101,
  "contract_starts_on": "2026-01-16",  // Formato YYYY-MM-DD
  "has_trial_period": true,
  "salary_amount": 30000,
  "es_contract_type_id": 1,
  "username": "juan.perez",
  "profile": "Empleado FDSA",
  "calendars": ["cal1", "cal2"],
  "groups": ["group1", "group2"]
}
```

### Formato de Datos para Salida de Empleado

```json
{
  "id_factorial": "123",
  "userKey": "juan.perez@fdsa.es",
  "manager_mail": "responsable@fdsa.es",
  "accountId": "jira-account-id",
  "terminated_on": "2026-01-16"  // Formato YYYY-MM-DD
}
```

### Respuestas Esperadas de n8n

#### Alta de Empleado

```json
{
  "empleado_creado": true,
  "mail_creado": true,
  "grupos_asignados": true,
  "calendarios_asignados": true,
  "jira_gestionado": true,
  "mail_acceso_enviado": true,
  "registrada_nueva_incorporacion": true
}
```

#### Salida de Empleado

```json
{
  "factorial_gestionado": true,
  "google_gestionado": true,
  "jira_gestionado": true
}
```

## 🎨 Colores Corporativos

- **Primary**: `#d6007f` (rosa/magenta)
- **Secondary**: `#2b1f60` (azul oscuro)

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo en http://localhost:3000

# Producción
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint para verificar el código
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de uso interno de FDSA. Todos los derechos reservados.

## 👥 Autores

- **FDSA Team** - Desarrollo y mantenimiento

## 📞 Soporte

Para soporte, contacta al equipo de desarrollo de FDSA.

---

**Desarrollado con ❤️ por FDSA**
