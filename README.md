# Crowd Guardian

Crowd Guardian monitors crowded areas using a camera-to-cloud workflow. Cameras send visual data to the cloud. The cloud service analyzes each frame, estimates crowd density, and marks locations that need attention. Police officers access the data through a login-protected web application. When any location crosses a critical threshold, the system pushes alerts and provides navigation to the affected spot.

## How It Works
- Cameras capture visual data and transmit it to the cloud service.  
- Cloud analysis identifies density levels and flags high-priority zones.  
- Backend serves processed results to the web application.  
- Police personnel log in to access the dashboard.  
- Dashboard displays crowd status and issues alerts.  
- Navigation guidance directs officers to critical locations.

## Tech Stack
- React  
- TypeScript  
- Tailwind CSS  
- shadcn-ui  
- Vite  
- Supabase

## Structure
- `src/` — frontend logic and UI  
- `supabase/` — backend configuration  
- `index.html` — entry point  
- Config files for TypeScript, Tailwind, and Vite
