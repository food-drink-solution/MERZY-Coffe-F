import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Simple request log
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// --- Health ---
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'merzy-api-server', time: new Date().toISOString() });
});

// --- Menu (placeholder: source of truth lives with the frontend service for now) ---
const menu = [
  { id: 'dirty-espresso', name: 'Dirty Espresso', category: 'coffee', price: 60 },
  { id: 'flat-white', name: 'Flat White', category: 'coffee', price: 55 },
  { id: 'london-cake', name: 'London Cake', category: 'desserts', price: 50 },
  { id: 'club-sandwich', name: 'Club Sandwich', category: 'bakery', price: 70 },
];

app.get('/api/menu', (req, res) => {
  const { category } = req.query;
  res.json({
    count: category ? menu.filter((i) => i.category === category).length : menu.length,
    items: category ? menu.filter((i) => i.category === category) : menu,
  });
});

// --- Orders ---
const orders = new Map();
const STATUSES = ['received', 'preparing', 'ready'];

app.post('/api/orders', (req, res) => {
  const { items, subtotal } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items are required to place an order.' });
  }
  const id = `MERZY-${Date.now().toString(36).toUpperCase()}`;
  const order = { id, status: STATUSES[0], items, subtotal: subtotal ?? null, createdAt: new Date().toISOString() };
  orders.set(id, order);
  res.status(201).json(order);
});

app.get('/api/orders/:id', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  res.json(order);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });
  const { status } = req.body ?? {};
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${STATUSES.join(', ')}` });
  }
  order.status = status;
  res.json(order);
});

// --- 404 ---
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(port, () => {
  console.log(`MERZY api-server listening on http://localhost:${port}`);
});
