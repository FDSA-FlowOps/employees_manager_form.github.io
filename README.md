# FDSA - Sistema de Gestión de Empleados

Webapp desarrollada con Next.js, TypeScript y Tailwind CSS para gestionar empleados mediante formularios que realizan llamadas a la API de Factorial y flujos de n8n. Incluye tres módulos: Alta de Nuevo Compañero, Entrada Nuevo Compañero y Salida Compañero.

## 🚀 Características

- **Sistema de navegación por tabs** entre tres formularios:
  - Alta Nuevo Compañero
  - Entrada Nuevo Compañero (próximamente)
  - Salida Compañero
- Formularios completos con validación de campos obligatorios
- Integración con API de Factorial para cargar datos dinámicos:
  - Entidades Legales
  - Roles
  - Responsables de Equipo
  - Tipos de Contrato
  - Empleados Activos
- Integración con n8n para:
  - Usuarios de Google Workspace
  - Usuarios de Jira
- Interfaz moderna e intuitiva con colores corporativos
- Tooltips informativos en campos importantes
- Modales de confirmación y resultados
- Validación en tiempo real
- Diseño responsive

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- API Key de Factorial

## 🛠️ Instalación

1. Clona el repositorio o navega al directorio del proyecto

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env y añade tus credenciales
# Autenticación
AUTH_USERNAME=tu_usuario
AUTH_PASSWORD=tu_contraseña

# Factorial API
FACTORIAL_API_KEY=tu_api_key_aqui

# n8n Webhooks
N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/alta-empleado
N8N_EMPLOYEE_EXIT_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/salida-empleado
N8N_GOOGLE_USERS_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/google-users
N8N_JIRA_USERS_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/jira-users
N8N_MASTERS_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/masters
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 🔐 Configuración de Variables de Entorno

Las credenciales se gestionan a través de variables de entorno:

1. Crea un archivo `.env` en la raíz del proyecto
2. Añade las siguientes variables:
   ```
   # Autenticación (requerido)
   AUTH_USERNAME=tu_usuario
   AUTH_PASSWORD=tu_contraseña
   
   # Factorial API
   FACTORIAL_API_KEY=tu_api_key_de_factorial
   N8N_WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/alta-empleado
   ```
3. Reinicia el servidor de desarrollo

**Nota:** El archivo `.env` está en `.gitignore` y no se subirá al repositorio por seguridad.

### Variables de Entorno

- **FACTORIAL_API_KEY**: API key de Factorial para obtener datos de entidades legales, roles, empleados y tipos de contrato
- **N8N_MASTERS_WEBHOOK_URL**: URL del webhook unificado de n8n que devuelve todos los maestros (calendarios, grupos, usuarios Google, usuarios Jira) en una única llamada. Estructura esperada: `{ root: { calendarios: [], grupos: [], usuarios_google: [], usuarios_jira: [] } }`
- **N8N_WEBHOOK_URL**: URL del webhook de n8n donde se enviarán los datos del nuevo empleado (Alta Nuevo Compañero)
- **N8N_EMPLOYEE_EXIT_WEBHOOK_URL**: URL del webhook de n8n donde se enviarán los datos de salida del empleado (Salida Compañero)

**Nota:** Las variables `N8N_GOOGLE_USERS_WEBHOOK_URL` y `N8N_JIRA_USERS_WEBHOOK_URL` ya no son necesarias si usas el webhook unificado `N8N_MASTERS_WEBHOOK_URL`.

## 📝 Uso

1. Al abrir la aplicación, se solicitará la API Key de Factorial
2. Introduce tu API Key de Factorial
3. Completa el formulario con los datos del nuevo empleado
4. Los campos marcados con * son obligatorios
5. Los selectores se cargarán automáticamente desde Factorial
6. Revisa la información y confirma el alta

## 🎨 Campos del Formulario

### Información Personal
- **Nombre***: Nombre de pila del empleado
- **Primer Apellido***: Primer apellido
- **Segundo Apellido**: Segundo apellido (opcional)
- **Email***: Correo electrónico corporativo
- **Nacionalidad**: Nacionalidad del empleado (opcional)
- **Género**: Género (opcional)

### Información Laboral
- **Entidad Legal***: Seleccionada desde Factorial
- **Rol***: Seleccionado desde Factorial
- **Responsable de Equipo***: Seleccionado desde Factorial
- **Inicio del Contrato***: Fecha de inicio (formato DD/MM/AAAA)
- **Tiene Periodo de Prueba**: Checkbox (false por defecto)
- **Importe Salario***: Salario bruto anual en euros
- **Tipo de Contrato***: Seleccionado desde Factorial

### Onboarding
- **Activar Espacio de OnBoarding**: Checkbox (false por defecto)
- **Espacio de OnBoarding**: Selector (se implementará más adelante)

### Accesos y Perfil
- **Username de Google***: Usuario de Google Workspace (sin dominio)
- **Perfil***: Empleado FDSA, Freelance o Global Talent

## 🔧 Tecnologías Utilizadas

- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utilitarios
- **React Hook Form**: Manejo de formularios
- **Zod**: Validación de esquemas
- **Lucide React**: Iconos
- **React Hot Toast**: Notificaciones

## 🎨 Colores Corporativos

- **Primary**: #d6007f (rosa/magenta)
- **Secondary**: #2b1f60 (azul oscuro)

## 📡 API Endpoints

La aplicación utiliza los siguientes endpoints de Factorial:

- `GET /api/2026-01-01/resources/companies/legal_entities` - Entidades legales
- `GET /api/2026-01-01/resources/job_catalog/roles` - Roles
- `GET /api/2026-01-01/resources/employees/employees?only_active=true` - Empleados activos
- `GET /api/2026-01-01/resources/contracts/es_contract_type_ids` - Tipos de contrato

## 🔐 Seguridad

- **Autenticación**: Sistema de login con credenciales configuradas en variables de entorno
  - Las credenciales se validan contra `AUTH_USERNAME` y `AUTH_PASSWORD`
  - Las sesiones se mantienen mediante cookies httpOnly seguras
  - Todas las rutas están protegidas por middleware (excepto `/login` y endpoints de autenticación)
- **API Key de Factorial**: Se mantiene en memoria durante la sesión
- No se almacena la API Key en localStorage ni cookies
- Las llamadas a la API se realizan a través de endpoints Next.js para mayor seguridad

## 🔄 Integración con n8n

Al completar el formulario, los datos se envían automáticamente a n8n mediante un webhook POST. Los datos se transforman al formato requerido:

- **first_name**: Nombre con primera letra mayúscula
- **last_name**: Apellidos separados por comas con primera letra mayúscula
- **email**: Email del empleado
- **company_id**: ID de la entidad legal seleccionada
- **nationality**: Nacionalidad (opcional)
- **gender**: Género (opcional)
- **role**: ID del rol seleccionado
- **manager_id**: ID del responsable de equipo
- **timeoff_manager_id**: ID del responsable de equipo (mismo que manager_id)
- **contract_starts_on**: Fecha de inicio del contrato (formato YYYY-MM-DD)
- **has_trial_period**: Boolean indicando si tiene periodo de prueba
- **salary_amount**: Importe del salario
- **es_contract_type_id**: ID del tipo de contrato
- **username**: Username de Google
- **profile**: Perfil del empleado (Empleado FDSA, Freelance, Global Talent)

## 🚧 Próximas Implementaciones

- Carga de espacios de onboarding desde Factorial
- Historial de altas realizadas
- Exportación de datos

## 📄 Licencia

Este proyecto es de uso interno de FDSA.

