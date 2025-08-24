// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const { Pool } = require('pg');
// const path = require('path');

// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use('/public', express.static(path.join(__dirname, 'public')));

// // PostgreSQL connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT || 5432,
// });

// // Test database connection
// pool.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err.stack);
//   } else {
//     console.log('Connected to PostgreSQL database');
//   }
// });

// // Helper function to convert to absolute URL
// function toAbsoluteUrl(imagePath, baseUrl) {
//   // Return empty string for missing images
//   if (!imagePath || imagePath.trim() === '') {
//     return '';
//   }
  
//   if (imagePath.startsWith('http')) {
//     return imagePath;
//   }
  
//   // Handle absolute paths in filesystem
//   if (imagePath.startsWith('/')) {
//     return `${baseUrl}${imagePath}`;
//   }
  
//   // Handle relative paths
//   return `${baseUrl}/${imagePath}`;
// }

// // API Endpoints

// // Unified product endpoint with source information
// app.get('/api/product/:id', async (req, res) => {
//   const productId = req.params.id;
//   const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
//   try {
//     // 1. Check new_arrivals table
//     const newArrivalsResult = await pool.query(
//       `SELECT 
//         na.*, 
//         c.name AS category_name,
//         'new_arrivals' AS source
//        FROM new_arrivals na
//        JOIN categories c ON na.category_id = c.id
//        WHERE na.id = $1`, 
//       [productId]
//     );
    
//     if (newArrivalsResult.rows.length > 0) {
//       const product = newArrivalsResult.rows[0];
//       product.image = toAbsoluteUrl(product.image, baseUrl);
//       return res.json(product);
//     }
    
//     // 2. Check best_sellers table
//     const bestSellerResult = await pool.query(
//       `SELECT 
//         bs.*, 
//         c.name AS category_name,
//         'best_sellers' AS source
//        FROM best_sellers bs
//        JOIN categories c ON bs.category_id = c.id
//        WHERE bs.id = $1`, 
//       [productId]
//     );
    
//     if (bestSellerResult.rows.length > 0) {
//       const product = bestSellerResult.rows[0];
//       product.image = toAbsoluteUrl(product.image, baseUrl);
//       return res.json(product);
//     }
    
//     // 3. Check deals table
//     const dealsResult = await pool.query(
//       `SELECT 
//         d.*, 
//         c.name AS category_name,
//         'deals' AS source
//        FROM deals d
//        JOIN categories c ON d.category_id = c.id
//        WHERE d.id = $1`, 
//       [productId]
//     );
    
//     if (dealsResult.rows.length > 0) {
//       const product = dealsResult.rows[0];
//       product.image = toAbsoluteUrl(product.image, baseUrl);
//       return res.json(product);
//     }
    
//     // Product not found in any table
//     res.status(404).json({ error: 'Product not found' });
//   } catch (err) {
//     console.error('Error fetching product:', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get all categories
// app.get('/api/categories', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM categories');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// //Get category by ID//
// app.get('/api/categories/:id', async (req, res) => {
//   const { id } = req.params;
  
//   if (!Number.isInteger(Number(id)) || id <= 0) {
//     return res.status(400).json({ error: 'Invalid category ID format' });
//   }

//   try {
//     const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ error: 'Category not found' });
//     }
    
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(`Error fetching category ${id}:`, err);
//     res.status(500).json({ 
//       error: 'Internal server error',
//       details: err.message,
//       suggestion: 'Verify the category exists in the database'
//     });
//   }
// });

// // Get products by category
// app.get('/api/category/:categoryId', async (req, res) => {
//   const { categoryId } = req.params;
  
//   try {
//     const allProducts = [];
    
//     const fetchProducts = async (table, type) => {
//       try {
//         const result = await pool.query(`
//           SELECT 
//             id, name, description, 
//             ${type === 'deals' ? 
//               'NULL AS price, original_price, discount_price, discount_percent' : 
//               'price, NULL AS original_price, NULL AS discount_price, NULL AS discount_percent'
//             },
//             image_url,
//             ${type === 'new_arrivals' ? 'release_date' : 'NULL AS release_date'},
//             ${type === 'best_sellers' ? 'units_sold' : 'NULL AS units_sold'},
//             $1 AS type
//           FROM ${table}
//           WHERE category_id = $2
//         `, [type, categoryId]);
        
//         return result.rows;
//       } catch (tableErr) {
//         console.error(`Error fetching ${type}:`, tableErr);
//         return [];
//       }
//     };

//     const [newArrivals, bestSellers, deals] = await Promise.all([
//       fetchProducts('new_arrivals', 'new_arrivals'),
//       fetchProducts('best_sellers', 'best_sellers'),
//       fetchProducts('deals', 'deals')
//     ]);

//     allProducts.push(...newArrivals, ...bestSellers, ...deals);
    
//     const typeOrder = { 'new_arrivals': 1, 'best_sellers': 2, 'deals': 3 };
//     allProducts.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);

//     res.json(allProducts);
//   } catch (err) {
//     console.error('Overall category products error:', err);
//     res.status(500).json({ 
//       error: 'Internal server error',
//       message: err.message,
//       suggestion: 'Check database connection and table structures'
//     });
//   }
// });




// // Get new arrivals
// app.get('/api/new-arrivals', async (req, res) => {
//   const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
//   try {
//     const result = await pool.query(`
//       SELECT na.*, c.name AS category_name 
//       FROM new_arrivals na
//       JOIN categories c ON na.category_id = c.id
//       ORDER BY release_date DESC
//       LIMIT 20
//     `);
    
//     const products = result.rows.map(product => ({
//       ...product,
//       image: toAbsoluteUrl(product.image, baseUrl)
//     }));
    
//     res.json(products);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get best sellers
// app.get('/api/best-sellers', async (req, res) => {
//   const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
//   try {
//     const result = await pool.query(`
//       SELECT bs.*, c.name AS category_name 
//       FROM best_sellers bs
//       JOIN categories c ON bs.category_id = c.id
//       ORDER BY units_sold DESC
//       LIMIT 20
//     `);
    
//     const products = result.rows.map(product => ({
//       ...product,
//       image: toAbsoluteUrl(product.image, baseUrl)
//     }));
    
//     res.json(products);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Get deals
// app.get('/api/deals', async (req, res) => {
//   const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
//   try {
//     const result = await pool.query(`
//       SELECT d.*, c.name AS category_name 
//       FROM deals d
//       JOIN categories c ON d.category_id = c.id
//       ORDER BY discount_percent DESC
//       LIMIT 20
//     `);
    
//     const products = result.rows.map(product => ({
//       ...product,
//       image: toAbsoluteUrl(product.image, baseUrl)
//     }));
    
//     res.json(products);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));


// // PostgreSQL connection
// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT || 5432,
// });

// PostgreSQL connection (Render uses DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" 
    ? { rejectUnauthorized: false }  // for Render
    : false                          // for local
});




// // ✅ Serve static files from Vite build
// app.use(express.static(path.join(__dirname, "../Frontend/vite-project/dist")));

// app.get(/.*/, (req, res) => {
//   res.sendFile(path.join(__dirname, "../Frontend/vite-project/dist", "index.html"));
// });


// Test database connection
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
  } else {
    console.log('Connected to PostgreSQL database');
  }
});

// Helper function to convert to absolute URL
function toAbsoluteUrl(imagePath, baseUrl) {
  if (!imagePath || imagePath.trim() === '') return '';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/')) return `${baseUrl}${imagePath}`;
  return `${baseUrl}/${imagePath}`;
}

// Helper function to process product data
function processProduct(row) {
  const product = {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.discount_price || row.base_price,
    image_url: row.image_url,
    category_id: row.category_id,
    category_name: row.category_name,
    tags: []
  };

  if (row.is_new_arrival) {
    product.release_date = row.release_date;
    product.tags.push('new_arrival');
  }
  if (row.is_best_seller) {
    product.units_sold = row.units_sold;
    product.tags.push('best_seller');
  }
  if (row.is_deal) {
    product.original_price = row.base_price;
    product.discount_price = row.discount_price;
    product.discount_percent = row.discount_percent;
    product.tags.push('deal');
  }

  return product;
}



// At the top of your index.js (or in a separate firebase-admin-config.js)
const admin = require('firebase-admin');


// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, 'firebase-admin.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommerce-ff3f4.firebaseio.com"
});

// Make sure this is exported if you're using it in multiple files
module.exports = admin;

// Function to migrate the database (create tables if not exist)
async function migrateDatabase() {
  try {
    const client = await pool.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(100) UNIQUE,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        description TEXT,
        price NUMERIC(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        total NUMERIC(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INT REFERENCES orders(id) ON DELETE CASCADE,
        product_id INT REFERENCES products(id) ON DELETE CASCADE,
        quantity INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Database migration completed");
    client.release();
  } catch (err) {
    console.error("❌ Migration error:", err);
  }
}



// // Create new tables and migrate data
// const migrateDatabase = async () => {
//   const client = await pool.connect();
//   try {
//     // Check if products table exists
//     const res = await client.query(`
//       SELECT EXISTS (
//         SELECT FROM information_schema.tables 
//         WHERE  table_schema = 'public'
//         AND    table_name   = 'products'
//       );
//     `);
    
//     if (res.rows[0].exists) {
//       console.log('Database already migrated');
//       return;
//     }

//     console.log('Starting database migration...');
    
//     // Create new tables
//     await client.query(`
//       CREATE TABLE products (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         description TEXT,
//         base_price DECIMAL NOT NULL,
//         image_url VARCHAR(255),
//         category_id INTEGER REFERENCES categories(id)
//       );
//     `);
    
//     await client.query(`
//       CREATE TABLE product_special_types (
//         product_id INTEGER PRIMARY KEY REFERENCES products(id),
//         is_new_arrival BOOLEAN DEFAULT false,
//         is_best_seller BOOLEAN DEFAULT false,
//         is_deal BOOLEAN DEFAULT false,
//         units_sold INTEGER,
//         release_date DATE,
//         discount_price DECIMAL,
//         discount_percent DECIMAL
//       );
//     `);
    
//     console.log('Created new tables');
    
//     // Migrate data from old tables
//     const migrateTable = async (tableName, specialType) => {
//       const rows = await client.query(`SELECT * FROM ${tableName}`);
      
//       for (const row of rows.rows) {
//         // Insert into products
//         const newProduct = await client.query(`
//           INSERT INTO products (name, description, base_price, image_url, category_id)
//           VALUES ($1, $2, $3, $4, $5)
//           RETURNING id
//         `, [
//           row.name,
//           row.description,
//           row.price || row.original_price || row.base_price,
//           row.image_url || row.image,
//           row.category_id
//         ]);
        
//         const productId = newProduct.rows[0].id;
        
//         // Insert into special types
//         const specialColumns = [];
//         const specialValues = [];
        
//         if (specialType === 'new_arrivals') {
//           specialColumns.push('is_new_arrival', 'release_date');
//           specialValues.push(true, row.release_date);
//         }
//         else if (specialType === 'best_sellers') {
//           specialColumns.push('is_best_seller', 'units_sold');
//           specialValues.push(true, row.units_sold);
//         }
//         else if (specialType === 'deals') {
//           specialColumns.push('is_deal', 'discount_price', 'discount_percent');
//           specialValues.push(true, row.discount_price, row.discount_percent);
//         }
        
//         if (specialColumns.length > 0) {
//           await client.query(`
//             INSERT INTO product_special_types 
//             (product_id, ${specialColumns.join(', ')})
//             VALUES ($1, ${specialValues.map((_, i) => `$${i + 2}`).join(', ')})
//           `, [productId, ...specialValues]);
//         }
//       }
      
//       console.log(`Migrated ${rows.rowCount} rows from ${tableName}`);
//     };
    
//     // Migrate each table
//     await migrateTable('new_arrivals', 'new_arrivals');
//     await migrateTable('best_sellers', 'best_sellers');
//     await migrateTable('deals', 'deals');
    
//     console.log('Database migration completed successfully');
//   } catch (err) {
//     console.error('Migration failed:', err);
//   } finally {
//     client.release();
//   }
// };

// // Run migration on startup
// migrateDatabase();

// API Endpoints

// Create reviews table and users table if they don't exist
const createReviewsTable = async () => {
  try {
    // Create users table first if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Then create reviews table with proper foreign keys
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_user_product_review UNIQUE (user_id, product_id)
      );
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
    `);
    
    console.log('Reviews table created successfully');
  } catch (err) {
    console.error('Error creating reviews table:', err);
  }
};
// Start server after migrations
(async () => {
  try {
    await migrateDatabase();      // creates users, products, orders, order_items
    await createReviewsTable();   // safe now, products already exists

    app.listen(port, () => {
      console.log(`✅ Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();


// Get reviews for a product with pagination
app.get('/api/product/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // First get the total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM reviews WHERE product_id = $1`,
      [id]
    );
    
    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);
    
    // Then get the paginated results
    const result = await pool.query(
      `SELECT r.*, u.name as user_name, u.email as user_email
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE product_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );
    
    res.json({
      reviews: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});
app.post('/api/product/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid; // This is the Firebase user ID

    // Validate input
    if (!rating) return res.status(400).json({ error: 'Rating is required' });
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user exists or create
    await pool.query(`
      INSERT INTO users (id, firebase_uid, email, name, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (id) DO UPDATE
      SET email = EXCLUDED.email, 
          name = EXCLUDED.name,
          firebase_uid = EXCLUDED.firebase_uid
    `, [
      firebaseUid, // Using Firebase UID as the primary ID
      firebaseUid, // Also storing in firebase_uid if you need it separately
      decodedToken.email || null,
      decodedToken.name || 'User'
    ]);

    // Check for existing review
    const existingReview = await pool.query(
      `SELECT id FROM reviews WHERE user_id = $1 AND product_id = $2`,
      [firebaseUid, id]
    );
    
    if (existingReview.rows.length > 0) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }
    
    // Insert review
    const result = await pool.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [id, firebaseUid, rating, comment]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Review submission error:', err);
    res.status(500).json({ 
      error: 'Failed to submit review',
      details: err.message 
    });
  }
});
  
  // Update a review
  app.put('/api/reviews/:reviewId', async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, comment, userId } = req.body;
      
      // Validate input
      if (!rating || !userId) {
        return res.status(400).json({ error: 'Rating and user ID are required' });
      }
      
      // Check if review belongs to user
      const reviewCheck = await pool.query(
        `SELECT user_id FROM reviews WHERE id = $1`,
        [reviewId]
      );
      
      if (reviewCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Review not found' });
      }
      
      if (reviewCheck.rows[0].user_id != userId) {
        return res.status(403).json({ error: 'You can only update your own reviews' });
      }
      
      // Update the review
      const result = await pool.query(
        `UPDATE reviews 
        SET rating = $1, comment = $2, updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *`,
        [rating, comment, reviewId]
      );
      
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update review' });
    }
  });

  // Delete a review
  app.delete('/api/reviews/:reviewId', async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }
      
      // Check if review belongs to user
      const reviewCheck = await pool.query(
        `SELECT user_id FROM reviews WHERE id = $1`,
        [reviewId]
      );
      
      if (reviewCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Review not found' });
      }
      
      if (reviewCheck.rows[0].user_id != userId) {
        return res.status(403).json({ error: 'You can only delete your own reviews' });
      }
      
      await pool.query(
        `DELETE FROM reviews WHERE id = $1`,
        [reviewId]
      );
      
      res.json({ message: 'Review deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  });


  // Unified product endpoint
  app.get('/api/product/:id', async (req, res) => {
    const productId = req.params.id;
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    
    try {
      const result = await pool.query(`
        SELECT 
          p.*, 
          c.name AS category_name,
          ps.is_new_arrival,
          ps.is_best_seller,
          ps.is_deal,
          ps.units_sold,
          ps.release_date,
          ps.discount_price,
          ps.discount_percent
        FROM products p
        JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_special_types ps ON p.id = ps.product_id
        WHERE p.id = $1
      `, [productId]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const product = processProduct(result.rows[0]);
      product.image = toAbsoluteUrl(product.image_url, baseUrl);
      
      // Get average rating
      const ratingResult = await pool.query(`
        SELECT AVG(rating) as average_rating, COUNT(*) as review_count
        FROM reviews
        WHERE product_id = $1
      `, [productId]);
      
      // Convert to simple number values instead of an object
      product.average_rating = parseFloat(ratingResult.rows[0].average_rating) || 0;
      product.review_count = parseInt(ratingResult.rows[0].review_count) || 0;
      
      res.json(product);
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });




  // Get all categories
  app.get('/api/categories', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM categories');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Get category by ID
app.get('/api/categories/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!Number.isInteger(Number(id)) || id <= 0) {
    return res.status(400).json({ error: 'Invalid category ID format' });
  }

  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error fetching category ${id}:`, err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message,
      suggestion: 'Verify the category exists in the database'
    });
  }
});

// Get products by category
app.get('/api/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name AS category_name,
        ps.is_new_arrival,
        ps.is_best_seller,
        ps.is_deal,
        ps.units_sold,
        ps.release_date,
        ps.discount_price,
        ps.discount_percent
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_special_types ps ON p.id = ps.product_id
      WHERE p.category_id = $1
    `, [categoryId]);
    
    const products = result.rows.map(row => {
      const product = processProduct(row);
      product.image = toAbsoluteUrl(product.image_url, baseUrl);
      return product;
    });
    
    res.json(products);
  } catch (err) {
    console.error('Error fetching category products:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message,
      suggestion: 'Check database connection and table structures'
    });
  }
});

app.get('/api/new-arrivals', async (req, res) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name AS category_name,
        ps.release_date
      FROM products p
      JOIN product_special_types ps ON p.id = ps.product_id
      JOIN categories c ON p.category_id = c.id
      WHERE ps.is_new_arrival = true
      ORDER BY ps.release_date DESC
      LIMIT 20
    `);
    
    console.log("DB Result:", result.rows); // 👈 log query results

    const products = result.rows.map(row => {
      console.log("Processing row:", row); // 👈 log each row
      const product = processProduct(row);
      product.image = toAbsoluteUrl(product.image_url, baseUrl);
      return product;
    });
    
    res.json(products);
  } catch (err) {
    console.error("❌ ERROR in /api/new-arrivals:", err); // 👈 log actual error
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


// // Get new arrivals
// app.get('/api/new-arrivals', async (req, res) => {
//   const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
//   try {
//     const result = await pool.query(`
//       SELECT 
//         p.*,
//         c.name AS category_name,
//         ps.release_date
//       FROM products p
//       JOIN product_special_types ps ON p.id = ps.product_id
//       JOIN categories c ON p.category_id = c.id
//       WHERE ps.is_new_arrival = true
//       ORDER BY ps.release_date DESC
//       LIMIT 20
//     `);
    
//     const products = result.rows.map(row => {
//       const product = processProduct(row);
//       product.image = toAbsoluteUrl(product.image_url, baseUrl);
//       return product;
//     });
    
//     res.json(products);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Get best sellers
app.get('/api/best-sellers', async (req, res) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name AS category_name,
        ps.units_sold
      FROM products p
      JOIN product_special_types ps ON p.id = ps.product_id
      JOIN categories c ON p.category_id = c.id
      WHERE ps.is_best_seller = true
      ORDER BY ps.units_sold DESC
      LIMIT 20
    `);
    
    const products = result.rows.map(row => {
      const product = processProduct(row);
      product.image = toAbsoluteUrl(product.image_url, baseUrl);
      return product;
    });
    
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get deals - updated version
app.get('/api/deals', async (req, res) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        c.name AS category_name,
        ps.discount_price,
        ps.discount_percent,
        p.base_price AS original_price
      FROM products p
      JOIN product_special_types ps ON p.id = ps.product_id
      JOIN categories c ON p.category_id = c.id
      WHERE ps.is_deal = true
      ORDER BY ps.discount_percent DESC
      LIMIT 20
    `);
    
    // Debug: log raw database results
    console.log("Raw DB results:", result.rows);
    
    const products = result.rows.map(row => {
      // Create product object with all needed fields
      const product = {
        ...row,
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.discount_price, // Use discount_price as current price
        original_price: row.original_price,
        discount_percent: row.discount_percent,
        image_url: toAbsoluteUrl(row.image_url, baseUrl),
        category_name: row.category_name
      };
      
      // Debug: log processed product
      console.log("Processed product:", product);
      return product;
    });
    
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Save new order with robust image handling
app.post('/api/orders', async (req, res) => {
  const { order, items } = req.body;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
  // Validate required fields
  if (!order.user_id) {
    return res.status(400).json({ 
      error: 'Missing required field: user_id' 
    });
  }

  try {
    const orderResult = await pool.query(
      `INSERT INTO orders (
        user_id, shipping_address, city, postal_code, country, phone,
        shipping_method, payment_method, subtotal, shipping_cost, tax, total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id`,
      [
        order.user_id, 
        order.shipping_address || '', 
        order.city || '', 
        order.postal_code || '', 
        order.country || '', 
        order.phone || '',
        order.shipping_method || 'standard', 
        order.payment_method || 'cod', 
        order.subtotal || 0, 
        order.shipping_cost || 0, 
        order.tax || 0, 
        order.total || 0
      ]
    );

    const orderId = orderResult.rows[0].id;
    
    // Insert order items with robust image handling
    for (const item of items) {
      // Get image from multiple possible properties
      const imageSource = item.image || item.product_image || '';
      
    await pool.query(
  `INSERT INTO order_items (
    order_id, product_id, product_name, product_image, price, quantity, source
  ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  [
    orderId, 
    item.product_id, 
    item.product_name || 'Unknown Product',
    // Preserve original URL without conversion
    item.product_image || '',
    item.price || 0, 
    item.quantity || 1, 
    item.source || 'unknown'
  ]
);    
    }

    res.status(201).json({ orderId, message: "Order created successfully" });
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: err.message,
      hint: "Check required fields and data types"
    });
  }
});

// Get user orders with image handling
app.get('/api/orders/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  
  try {
    const ordersResult = await pool.query(
      `SELECT * FROM orders 
       WHERE user_id = $1 
       ORDER BY order_date DESC`,
      [userId]
    );
    
    const orders = ordersResult.rows;
    
    // Get items for each order with image handling
    for (const order of orders) {
      const itemsResult = await pool.query(
        `SELECT 
          id, order_id, product_id,
          COALESCE(product_name, 'Unknown Product') AS product_name,
          COALESCE(product_image, '') AS product_image,
          COALESCE(price, 0) AS price,
          COALESCE(quantity, 1) AS quantity,
          COALESCE(source, 'unknown') AS source
         FROM order_items 
         WHERE order_id = $1`,
        [order.id]
      );
      
      order.items = itemsResult.rows.map(item => ({
        ...item,
        product_image: item.product_image.startsWith('http') 
    ? item.product_image 
    : toAbsoluteUrl(item.product_image, baseUrl)
      }));
    }
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single order by ID with image handling
app.get('/api/orders/order/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.query.userId;
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Fetch order
    const orderResult = await pool.query(
      `SELECT 
        id, user_id, order_date, status,
        shipping_address, city, postal_code, country, phone,
        shipping_method, payment_method,
        COALESCE(subtotal, 0) AS subtotal,
        COALESCE(shipping_cost, 0) AS shipping_cost,
        COALESCE(tax, 0) AS tax,
        COALESCE(total, 0) AS total
       FROM orders 
       WHERE id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];
    
    // Verify ownership
    if (order.user_id != userId) {
      return res.status(403).json({ error: 'Unauthorized to view this order' });
    }

    // Fetch order items
    const itemsResult = await pool.query(
      `SELECT 
        id, order_id, product_id,
        COALESCE(product_name, 'Unknown Product') AS product_name,
        COALESCE(product_image, '') AS product_image,
        COALESCE(price, 0) AS price,
        COALESCE(quantity, 1) AS quantity,
        COALESCE(source, 'unknown') AS source
       FROM order_items 
       WHERE order_id = $1`,
      [orderId]
    );
    
    order.items = itemsResult.rows.map(item => ({
      ...item,
      product_image: toAbsoluteUrl(item.product_image, baseUrl)
    }));
    
    res.json(order);
    
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete order
app.delete('/api/orders/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

