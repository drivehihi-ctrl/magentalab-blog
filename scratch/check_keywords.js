const { createClient } = require('@supabase/supabase-client');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, health_keywords');
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }
  
  console.log('Products and their health keywords:');
  data.forEach(p => {
    console.log(`- ${p.name}: ${JSON.stringify(p.health_keywords)}`);
  });
}

checkProducts();
