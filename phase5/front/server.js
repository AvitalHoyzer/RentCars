import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Setup PG connection
const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  user: 'moriya',
  password: 'mkalfon',
  database: 'integratedDB'
});

// Sync database sequences with maximum ID values to prevent duplicate key violations
async function syncSequences() {
  try {
    const client = await pool.connect();
    console.log('Synchronizing database sequences...');
    const res = await client.query(`
      SELECT 
        table_name, 
        column_name, 
        pg_get_serial_sequence('public.' || table_name, column_name) as seq
      FROM information_schema.columns
      WHERE table_schema = 'public' 
        AND column_default LIKE 'nextval%';
    `);

    for (const row of res.rows) {
      const { table_name, column_name, seq } = row;
      if (!seq) continue;
      
      const maxRes = await client.query(`SELECT COALESCE(MAX("${column_name}"), 0) AS max_val FROM public."${table_name}"`);
      const maxVal = maxRes.rows[0].max_val;
      const setVal = maxVal > 0 ? maxVal : 1;
      await client.query(`SELECT setval($1, $2, true)`, [seq, setVal]);
      console.log(`Synced sequence ${seq} to ${setVal}`);
    }
    client.release();
    console.log('Database sequences successfully synchronized.');
  } catch (err) {
    console.error('Error synchronizing database sequences:', err);
  }
}
syncSequences();

const PK_MAP = {
  car: 'car_id',
  car_booking: 'booking_id',
  city: 'city_id',
  country: 'country_id',
  rating: 'rate_num',
  rental_company: 'company_id',
  rest_booking: 'booking_id',
  restaurant: 'rest_id',
  review: 'review_id',
  tourist: 'tourist_id',
  vip_tourist: 'tourist_id'
};

// Helper to get next ID for primary key if table doesn't have an auto-increment sequence
async function getNextIdIfNeeded(tableName, pk, client) {
  const defaultRes = await client.query(`
    SELECT column_default 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = $1 
      AND column_name = $2
  `, [tableName, pk]);

  const colDefault = defaultRes.rows[0]?.column_default;
  if (colDefault && colDefault.includes('nextval')) {
    return null; // Has a sequence, DB auto-assigns
  }

  const maxRes = await client.query(`
    SELECT COALESCE(MAX("${pk}"), 0) + 1 AS next_id 
    FROM public.${tableName}
  `);
  return maxRes.rows[0].next_id;
}

// Generic list and search with optionally resolved Foreign Keys (IDs to Names)
app.get('/api/tables/:tableName', async (req, res) => {
  const { tableName } = req.params;
  const { resolve, tourist_id, limit, sort } = req.query;
  const pk = PK_MAP[tableName];
  const orderDir = sort === 'desc' ? 'DESC' : 'ASC';

  if (!pk) {
    return res.status(400).json({ error: `Table '${tableName}' not supported` });
  }

  try {
    let queryText = `SELECT * FROM public.${tableName}`;
    let queryParams = [];
    let whereClauses = [];

    // Filter by tourist_id on the server if provided
    if (tourist_id) {
      if (tableName === 'car_booking') {
        whereClauses.push(`cb.tourist_id = $${queryParams.length + 1}`);
        queryParams.push(Number(tourist_id));
      } else if (tableName === 'rest_booking') {
        whereClauses.push(`rb.tourist_id = $${queryParams.length + 1}`);
        queryParams.push(Number(tourist_id));
      } else if (tableName === 'review') {
        whereClauses.push(`rev.tourist_id = $${queryParams.length + 1}`);
        queryParams.push(Number(tourist_id));
      } else if (tableName === 'tourist') {
        whereClauses.push(`tourist_id = $${queryParams.length + 1}`);
        queryParams.push(Number(tourist_id));
      }
    }

    let limitVal = 100; // Default limit to prevent browser memory crashes
    if (limit) {
      if (limit === 'all') {
        limitVal = null;
      } else {
        limitVal = Number(limit);
      }
    }

    const limitStr = limitVal !== null ? `LIMIT ${limitVal}` : '';

    const resolvedTables = ['car', 'car_booking', 'rest_booking', 'restaurant', 'review', 'rating', 'rental_company', 'city'];
    if (resolve === 'true' && resolvedTables.includes(tableName)) {
      if (tableName === 'car') {
        const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        queryText = `
          SELECT c.*, rc.company_name AS resolved_company, rc.city_id AS resolved_city_id
          FROM public.car c
          LEFT JOIN public.rental_company rc ON c.company_id = rc.company_id
          ${whereStr}
          ORDER BY c.car_id ${orderDir}
          ${limitStr}
        `;
      } else if (tableName === 'car_booking') {
        const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        queryText = `
          SELECT cb.*, 
                 c.brand || ' ' || c.model AS resolved_car,
                 t.first_name || ' ' || t.last_name AS resolved_tourist,
                 pc.city_name AS resolved_pickup_city,
                 rc.city_name AS resolved_return_city
          FROM public.car_booking cb
          LEFT JOIN public.car c ON cb.car_id = c.car_id
          LEFT JOIN public.tourist t ON cb.tourist_id = t.tourist_id
          LEFT JOIN public.city pc ON cb.pickup_city_id = pc.city_id
          LEFT JOIN public.city rc ON cb.return_city_id = rc.city_id
          ${whereStr}
          ORDER BY cb.booking_id ${orderDir}
          ${limitStr}
        `;
      } else if (tableName === 'rest_booking') {
        const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        queryText = `
          SELECT rb.*,
                 t.first_name || ' ' || t.last_name AS resolved_tourist,
                 r.rest_name AS resolved_restaurant
          FROM public.rest_booking rb
          LEFT JOIN public.tourist t ON rb.tourist_id = t.tourist_id
          LEFT JOIN public.restaurant r ON rb.rest_id = r.rest_id
          ${whereStr}
          ORDER BY rb.booking_id ${orderDir}
          ${limitStr}
        `;
      } else if (tableName === 'restaurant') {
        const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        queryText = `
          SELECT r.*, c.city_name AS resolved_city
          FROM public.restaurant r
          LEFT JOIN public.city c ON r.city_id = c.city_id
          ${whereStr}
          ORDER BY r.rest_id ${orderDir}
          ${limitStr}
        `;
      } else if (tableName === 'review') {
        const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        queryText = `
          SELECT rev.*,
                 t.first_name || ' ' || t.last_name AS resolved_tourist,
                 c.brand || ' ' || c.model AS resolved_car,
                 r.rest_name AS resolved_restaurant,
                 rat.degree AS rating_score,
                 rat.rating_type AS resolved_rating_type
          FROM public.review rev
          LEFT JOIN public.tourist t ON rev.tourist_id = t.tourist_id
          LEFT JOIN public.car c ON rev.car_id = c.car_id
          LEFT JOIN public.restaurant r ON rev.rest_id = r.rest_id
          LEFT JOIN public.rating rat ON rev.review_id = rat.review_id
          ${whereStr}
          ORDER BY rev.review_id ${orderDir}
          ${limitStr}
        `;
      } else if (tableName === 'rating') {
        const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        queryText = `
          SELECT rat.*, rev.review_title AS resolved_review
          FROM public.rating rat
          LEFT JOIN public.review rev ON rat.review_id = rev.review_id
          ${whereStr}
          ORDER BY rat.rate_num ${orderDir}
          ${limitStr}
        `;
      } else if (tableName === 'rental_company') {
        const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        queryText = `
          SELECT rc.*, c.city_name AS resolved_city
          FROM public.rental_company rc
          LEFT JOIN public.city c ON rc.city_id = c.city_id
          ${whereStr}
          ORDER BY rc.company_id ${orderDir}
          ${limitStr}
        `;
      } else if (tableName === 'city') {
        const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
        queryText = `
          SELECT c.*, co.country_name AS resolved_country
          FROM public.city c
          LEFT JOIN public.country co ON c.country_id = co.country_id
          ${whereStr}
          ORDER BY c.city_id ${orderDir}
          ${limitStr}
        `;
      }
    } else {
      const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
      queryText = `SELECT * FROM public.${tableName} ${whereStr} ORDER BY "${pk}" ${orderDir} ${limitStr}`;
    }

    const { rows } = await pool.query(queryText, queryParams);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// Generic GET Single Row (For Fetching by ID during update)
app.get('/api/tables/:tableName/:id', async (req, res) => {
  const { tableName, id } = req.params;
  const pk = PK_MAP[tableName];

  if (!pk) {
    return res.status(400).json({ error: `Table '${tableName}' not supported` });
  }

  try {
    const { rows } = await pool.query(
      `SELECT * FROM public.${tableName} WHERE ${pk} = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: `Row not found in ${tableName}` });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generic CREATE Row
app.post('/api/tables/:tableName', async (req, res) => {
  const { tableName } = req.params;
  const pk = PK_MAP[tableName];

  if (!pk) {
    return res.status(400).json({ error: `Table '${tableName}' not supported` });
  }

  try {
    // Fetch actual columns in the table to filter out resolved fields
    const colsRes = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = $1
    `, [tableName]);
    const validCols = colsRes.rows.map(r => r.column_name);

    const bodyData = {};
    for (const key of Object.keys(req.body)) {
      if (validCols.includes(key)) {
        bodyData[key] = req.body[key];
      }
    }

    // Generate next ID if needed and not provided in bodyData
    if (bodyData[pk] === undefined || bodyData[pk] === null || bodyData[pk] === '') {
      const nextId = await getNextIdIfNeeded(tableName, pk, pool);
      if (nextId !== null) {
        bodyData[pk] = nextId;
      }
    }

    const columns = Object.keys(bodyData);
    const values = Object.values(bodyData);

    if (columns.length === 0) {
      return res.status(400).json({ error: 'No data provided' });
    }

    const colsStr = columns.map(c => `"${c}"`).join(', ');
    const valsStr = columns.map((_, i) => `$${i + 1}`).join(', ');

    const queryText = `
      INSERT INTO public.${tableName} (${colsStr})
      VALUES (${valsStr})
      RETURNING *
    `;

    const { rows } = await pool.query(queryText, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generic UPDATE Row (Save Changes)
app.put('/api/tables/:tableName/:id', async (req, res) => {
  const { tableName, id } = req.params;
  const pk = PK_MAP[tableName];

  if (!pk) {
    return res.status(400).json({ error: `Table '${tableName}' not supported` });
  }

  try {
    // Fetch actual columns in the table to filter out resolved fields
    const colsRes = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = $1
    `, [tableName]);
    const validCols = colsRes.rows.map(r => r.column_name);

    const bodyData = {};
    for (const key of Object.keys(req.body)) {
      if (validCols.includes(key) && key !== pk) {
        bodyData[key] = req.body[key];
      }
    }

    const columns = Object.keys(bodyData);
    const values = Object.values(bodyData);

    if (columns.length === 0) {
      return res.status(400).json({ error: 'No update data provided' });
    }

    const setsStr = columns.map((col, i) => `"${col}" = $${i + 1}`).join(', ');
    const queryText = `
      UPDATE public.${tableName}
      SET ${setsStr}
      WHERE ${pk} = $${columns.length + 1}
      RETURNING *
    `;

    const { rows } = await pool.query(queryText, [...values, id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Row not found or no change' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generic DELETE Row
app.delete('/api/tables/:tableName/:id', async (req, res) => {
  const { tableName, id } = req.params;
  const pk = PK_MAP[tableName];

  if (!pk) {
    return res.status(400).json({ error: `Table '${tableName}' not supported` });
  }

  try {
    const { rowCount } = await pool.query(
      `DELETE FROM public.${tableName} WHERE ${pk} = $1`,
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Row not found' });
    }

    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- Analytics Complex Queries ---

// Query 1: Available Cars in Jerusalem (Phase 2 Query 1)
app.get('/api/queries/jerusalem-cars', async (req, res) => {
  try {
    const queryText = `
      SELECT c.car_id, c.brand, c.model, c.price_per_day, rc.company_name, city.city_name
      FROM public.car c
      JOIN public.rental_company rc ON c.company_id = rc.company_id
      JOIN public.city city ON rc.city_id = city.city_id
      WHERE LOWER(city.city_name) = 'jerusalem' AND c.status = 'Available'
      ORDER BY c.price_per_day ASC
      LIMIT 100
    `;
    const { rows } = await pool.query(queryText);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Query 2: Recommended Cars with avg rating >= 4 (Phase 2 Query 3)
app.get('/api/queries/recommended-cars', async (req, res) => {
  try {
    const queryText = `
      SELECT c.car_id, c.brand, c.model, c.car_type, c.price_per_day, ROUND(AVG(rat.degree), 2) AS average_score
      FROM public.car c
      JOIN public.review rev ON c.car_id = rev.car_id
      JOIN public.rating rat ON rev.review_id = rat.review_id
      GROUP BY c.car_id, c.brand, c.model, c.car_type, c.price_per_day
      HAVING AVG(rat.degree) >= 4.0
      ORDER BY average_score DESC
      LIMIT 100
    `;
    const { rows } = await pool.query(queryText);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// --- Routines (Functions / Procedures) ---

// Procedure 1: Apply Strategic Discounts (Phase 4 Procedure 1)
app.post('/api/procedures/apply-discounts', async (req, res) => {
  const client = await pool.connect();
  const logs = [];

  try {
    client.on('notice', (msg) => {
      logs.push(msg.message);
    });

    await client.query('CALL public.pr_apply_strategic_discounts()');
    res.json({ success: true, logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, logs });
  } finally {
    client.release();
  }
});

// Function 1: Get Tourist Activity Cursor (Phase 4 Function 1)
app.get('/api/functions/tourist-activity/:id', async (req, res) => {
  const touristId = req.params.id;
  const client = await pool.connect();
  const logs = [];

  try {
    client.on('notice', (msg) => {
      logs.push(msg.message);
    });

    await client.query('BEGIN');
    
    const funcRes = await client.query('SELECT public.fn_get_tourist_activity($1)', [touristId]);
    const cursorName = funcRes.rows[0].fn_get_tourist_activity;

    if (!cursorName) {
      throw new Error("Function returned a null cursor name.");
    }

    const cursorRes = await client.query(`FETCH ALL IN "${cursorName}"`);
    
    await client.query('COMMIT');

    res.json({
      success: true,
      logs,
      rows: cursorRes.rows
    });
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error(err);
    res.status(500).json({ error: err.message, logs });
  } finally {
    client.release();
  }
});

// Function 2: Calculate City Health Index (Phase 4 Function 2)
app.get('/api/functions/city-health-index', async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City name parameter is required' });
  }

  const client = await pool.connect();
  const logs = [];

  try {
    client.on('notice', (msg) => {
      logs.push(msg.message);
    });

    const { rows } = await client.query(
      'SELECT public.fn_calculate_city_health_index($1) AS health_index',
      [city]
    );

    res.json({
      success: true,
      logs,
      healthIndex: rows[0].health_index
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, logs });
  } finally {
    client.release();
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
