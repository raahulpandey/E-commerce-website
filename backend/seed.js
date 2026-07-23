/**
 * ShopVault Database Seeder
 * Fetches 194 real products from DummyJSON API and seeds MongoDB.
 * Includes: products, categories, images, prices, ratings, stock info.
 *
 * Usage:
 *   node seed.js                     (seeds production DB from .env)
 *   MONGODB_URI=<uri> node seed.js   (seeds specific DB)
 */

require('dotenv').config();
const mongoose = require('mongoose');

// ─── Inline minimal models (avoid circular deps in seed context) ─────────────

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  icon: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  discountedPrice: { type: Number, min: 0 },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  categoryName: { type: String },
  brand: { type: String, trim: true },
  stock: { type: Number, default: 0, min: 0 },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  tags: [{ type: String }],
  sku: { type: String },
  weight: { type: Number },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

// Categories to EXCLUDE (not appropriate for a standard e-commerce store)
const EXCLUDED_CATEGORIES = new Set(['vehicle', 'motorcycle']);

const CATEGORY_META = {
  'smartphones': {
    icon: '📱',
    description: 'Latest smartphones and mobile devices from top brands',
    image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015/1.webp',
  },
  'laptops': {
    icon: '💻',
    description: 'High-performance laptops for work, gaming, and creativity',
    image: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.webp',
  },
  'tablets': {
    icon: '📟',
    description: 'Tablets and iPads for entertainment and productivity',
    image: 'https://cdn.dummyjson.com/products/images/tablets/Apple%20iPad%20Air/1.webp',
  },
  'mobile-accessories': {
    icon: '🎧',
    description: 'Cases, chargers, headphones and mobile accessories',
    image: 'https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20AirPods%20Max%20Silver/1.webp',
  },
  'beauty': {
    icon: '💄',
    description: 'Skincare, makeup and beauty essentials',
    image: 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/1.webp',
  },
  'fragrances': {
    icon: '🌸',
    description: 'Premium perfumes and fragrances for every occasion',
    image: 'https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20Noir%20Eau%20De/1.webp',
  },
  'furniture': {
    icon: '🛋️',
    description: 'Modern and classic furniture for every room',
    image: 'https://cdn.dummyjson.com/products/images/furniture/Annibale%20Colombo%20Bed/1.webp',
  },
  'groceries': {
    icon: '🛒',
    description: 'Fresh food, snacks, and everyday groceries',
    image: 'https://cdn.dummyjson.com/products/images/groceries/Apple/1.webp',
  },
  'home-decoration': {
    icon: '🏠',
    description: 'Decor and accessories to beautify your home',
    image: 'https://cdn.dummyjson.com/products/images/home-decoration/3D%20Embroidered%20Bee%20+%20Daisy%20Cushion%20Cover/1.webp',
  },
  'kitchen-accessories': {
    icon: '🍳',
    description: 'Cookware, utensils, and kitchen gadgets',
    image: 'https://cdn.dummyjson.com/products/images/kitchen-accessories/Bedside%20Table%20Slim%20Drawers%20Storage%20Tower/1.webp',
  },
  'mens-shirts': {
    icon: '👕',
    description: "Men's casual and formal shirts",
    image: 'https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20&%20Black%20Check%20Shirt/1.webp',
  },
  'mens-shoes': {
    icon: '👟',
    description: "Men's footwear — sneakers, boots, and formal shoes",
    image: 'https://cdn.dummyjson.com/products/images/mens-shoes/Casual%20Men%20Shoes/1.webp',
  },
  'mens-watches': {
    icon: '⌚',
    description: "Men's watches — classic, smart, and sport",
    image: 'https://cdn.dummyjson.com/products/images/mens-watches/Brown%20Leather%20Belt%20Watch/1.webp',
  },
  'womens-bags': {
    icon: '👜',
    description: "Women's handbags, clutches, and backpacks",
    image: 'https://cdn.dummyjson.com/products/images/womens-bags/Bag%20Set%203%20piece%20Faux%20Leather/1.webp',
  },
  'womens-dresses': {
    icon: '👗',
    description: "Women's dresses for every occasion",
    image: 'https://cdn.dummyjson.com/products/images/womens-dresses/Black%20Women%20Coat/1.webp',
  },
  'womens-jewellery': {
    icon: '💎',
    description: "Women's jewellery — necklaces, rings, earrings",
    image: 'https://cdn.dummyjson.com/products/images/womens-jewellery/Hoop%20Earrings/1.webp',
  },
  'womens-shoes': {
    icon: '👠',
    description: "Women's footwear — heels, flats, and boots",
    image: 'https://cdn.dummyjson.com/products/images/womens-shoes/Knitted%20Flat%20Sandals/1.webp',
  },
  'womens-watches': {
    icon: '⌚',
    description: "Women's watches — elegant and smart",
    image: 'https://cdn.dummyjson.com/products/images/womens-watches/Fastrack%20Reflex%20Beat%20Plus/1.webp',
  },
  'sports-accessories': {
    icon: '⚽',
    description: 'Sports equipment and fitness accessories',
    image: 'https://cdn.dummyjson.com/products/images/sports-accessories/Baseball%20Glove/1.webp',
  },
  'sunglasses': {
    icon: '🕶️',
    description: 'Sunglasses and eyewear for every style',
    image: 'https://cdn.dummyjson.com/products/images/sunglasses/Eyear%20Glasses/1.webp',
  },
  'tops': {
    icon: '👚',
    description: "Women's tops, blouses, and t-shirts",
    image: 'https://cdn.dummyjson.com/products/images/tops/Blouse/1.webp',
  },
  'vehicle': {
    icon: '🚗',
    description: 'Vehicle accessories and automotive products',
    image: 'https://cdn.dummyjson.com/products/images/vehicle/Bentley%20Bentayga/1.webp',
  },
  'motorcycle': {
    icon: '🏍️',
    description: 'Motorcycles and bike accessories',
    image: 'https://cdn.dummyjson.com/products/images/motorcycle/Kawasaki%20KX450/1.webp',
  },
  'skin-care': {
    icon: '🧴',
    description: 'Skincare products for all skin types',
    image: 'https://cdn.dummyjson.com/products/images/skin-care/Hyaluronic%20Acid%20Serum/1.webp',
  },
};

function slugify(text) {
  return text.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function getCategoryMeta(slug) {
  return CATEGORY_META[slug] || {
    icon: '🛍️',
    description: `Browse our ${slug.replace(/-/g, ' ')} collection`,
    image: '',
  };
}

// Convert USD to INR (approximate rate: 1 USD = 84 INR)
function toINR(usdPrice) {
  return Math.round(usdPrice * 84);
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is required');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  // ─── Step 1: Fetch all products from DummyJSON ──────────────────────────────
  console.log('📦 Fetching products from DummyJSON API...');
  const data = await fetchWithRetry('https://dummyjson.com/products?limit=194&select=id,title,description,price,discountPercentage,rating,stock,brand,category,thumbnail,images,tags,sku,weight');
  const rawProducts = data.products;
  console.log(`✅ Fetched ${rawProducts.length} products\n`);

  // ─── Step 2: Extract unique categories (excluding vehicles/motorcycles) ────────
  const filteredProducts = rawProducts.filter(p => !EXCLUDED_CATEGORIES.has(p.category));
  const uniqueCategories = [...new Set(filteredProducts.map(p => p.category))];
  console.log(`📂 Found ${uniqueCategories.length} categories (excluded: vehicles, motorcycles)`);
  console.log(`   Categories: ${uniqueCategories.join(', ')}\n`);

  // ─── Step 3: Clear existing data ────────────────────────────────────────────
  console.log('🗑️  Clearing existing products and categories...');
  await Product.deleteMany({});
  await Category.deleteMany({});
  console.log('✅ Cleared\n');

  // ─── Step 4: Create categories ──────────────────────────────────────────────
  console.log('📂 Creating categories...');
  const categoryMap = {};

  for (const catSlug of uniqueCategories) {
    const slug = slugify(catSlug);
    const meta = getCategoryMeta(slug);
    const name = catSlug
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const category = await Category.create({
      name,
      slug,
      description: meta.description,
      image: meta.image,
      icon: meta.icon,
      isActive: true,
    });

    categoryMap[catSlug] = category;
    process.stdout.write(`  ✅ ${name}\n`);
  }
  console.log(`\n✅ Created ${uniqueCategories.length} categories\n`);

  // ─── Step 5: Seed products ──────────────────────────────────────────────────
  console.log('🛍️  Seeding products...');

  // Mark some products as featured
  const featuredIds = new Set([1, 2, 3, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100]);

  const products = filteredProducts.map((p, idx) => {
    const priceINR = toINR(p.price);
    const discountedPriceINR = p.discountPercentage > 0
      ? Math.round(priceINR * (1 - p.discountPercentage / 100))
      : undefined;

    const category = categoryMap[p.category];

    return {
      title: p.title,
      description: p.description || `${p.title} — quality product from ${p.brand || 'ShopVault'}`,
      price: priceINR,
      discountedPrice: discountedPriceINR,
      images: p.images?.length ? p.images : [p.thumbnail],
      category: category?._id,
      categoryName: category?.name,
      brand: p.brand || 'ShopVault',
      stock: p.stock || Math.floor(Math.random() * 50) + 5,
      rating: {
        average: parseFloat((p.rating || 4.0).toFixed(1)),
        count: Math.floor(Math.random() * 1200) + 50,
      },
      tags: p.tags || [p.category],
      sku: p.sku || `SKU-${String(p.id).padStart(4, '0')}`,
      weight: p.weight,
      isActive: true,
      isFeatured: featuredIds.has(p.id) || idx < 12,
    };
  });

  // Batch insert for speed
  const BATCH = 50;
  let inserted = 0;
  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH);
    await Product.insertMany(batch, { ordered: false });
    inserted += batch.length;
    process.stdout.write(`  📦 Inserted ${Math.min(inserted, products.length)}/${products.length} products...\r`);
  }

  console.log(`\n✅ Seeded ${products.length} products\n`);

  // ─── Step 6: Summary ────────────────────────────────────────────────────────
  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();
  const featured = await Product.countDocuments({ isFeatured: true });

  console.log('═══════════════════════════════════════');
  console.log('🎉 DATABASE SEEDED SUCCESSFULLY!');
  console.log('═══════════════════════════════════════');
  console.log(`📦 Products:    ${totalProducts}`);
  console.log(`📂 Categories:  ${totalCategories}`);
  console.log(`⭐ Featured:    ${featured}`);
  console.log('═══════════════════════════════════════\n');

  await mongoose.disconnect();
  console.log('✅ MongoDB disconnected. Done!');
}

seed().catch(err => {
  console.error('❌ Seeder failed:', err.message);
  mongoose.disconnect();
  process.exit(1);
});
