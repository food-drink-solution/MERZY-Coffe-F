# MERZY API server

Backend for the MERZY site — ready for development, currently serving the
endpoints the frontend needs (menu, orders) with placeholder data.

## Run

```bash
npm install     # first time
npm run dev     # watch mode, http://localhost:4000
npm start       # plain run
```

Health check: `GET http://localhost:4000/api/health`

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Service health probe |
| GET | `/api/menu?category=coffee` | Menu items, optional category filter |
| POST | `/api/orders` | Place an order (`{ items, subtotal }`) → `201 { id, status, ... }` |
| GET | `/api/orders/:id` | Fetch an order by id |
| PATCH | `/api/orders/:id/status` | Update status: `received` \| `preparing` \| `ready` |

## Connecting the frontend

The Angular app (in `../merzy-coffee`) still uses its local mock
services (`core/services/menu.service.ts`, `order.service.ts`). To consume
this API, add a dev proxy to it:

1. Create `proxy.conf.json` in `merzy-coffee`:

   ```json
   {
     "/api": {
       "target": "http://localhost:4000",
       "secure": false
     }
   }
   ```

2. Serve with `npx.cmd ng serve --proxy-config proxy.conf.json`
3. Replace the service methods' mock data with `HttpClient` calls to `/api/...`

Statuses intentionally mirror the frontend's order tracking
(Received → Preparing → Ready).
