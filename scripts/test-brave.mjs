import dotenv from 'dotenv';
import path from 'path';

// Load .env.test by default if present
const envPath = path.join(process.cwd(), '.env.test');
dotenv.config({ path: envPath });

async function run() {
  try {
    const { searchBrave } = await import('../models/braveSearch.mjs');
    console.log('Using BRAVE_SEARCH_API_KEY:', process.env.BRAVE_SEARCH_API_KEY ? '*** set ***' : '(not set)');
    const results = await searchBrave('example query', 3, 800);
    console.log('Results length:', Array.isArray(results) ? results.length : 'unknown');
    console.log(JSON.stringify(results, null, 2));
  } catch (e) {
    console.error('Test failed:', e);
  }
}

run();
