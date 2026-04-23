
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xmisjoqjfnsnhcescuvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaXNqb3FqZm5zbmhjZXNjdXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NDA5NTksImV4cCI6MjA5MjExNjk1OX0.ARvHCrjN-SF0_YhT-0UYtN4fvD08U87BUU--idcPGWc';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAndAddColumn() {
  console.log('--- Checking for is_weekly_pick column ---');
  
  // 1. 샘플 데이터 하나를 가져와서 컬럼 존재 여부 확인
  const { data, error } = await supabase.from('products').select('*').limit(1);
  
  if (error) {
    console.error('Error fetching products:', error.message);
    return;
  }

  if (data && data.length > 0) {
    if ('is_weekly_pick' in data[0]) {
      console.log('Success: "is_weekly_pick" column already exists!');
      
      // 혹시 PICK된 상품이 하나도 없는지 확인
      const { data: picks } = await supabase.from('products').select('name').eq('is_weekly_pick', true);
      console.log(`Current active PICKs: ${picks ? picks.length : 0}`);
      if (!picks || picks.length === 0) {
        console.log('Note: No products are currently marked as Weekly PICK. Please check them in Admin page.');
      }
    } else {
      console.log('Error: "is_weekly_pick" column is MISSING.');
      console.log('Please run the following SQL in Supabase SQL Editor:');
      console.log('ALTER TABLE products ADD COLUMN is_weekly_pick BOOLEAN DEFAULT false;');
    }
  } else {
    console.log('No products found in the table. Cannot check columns easily via select.');
  }
}

checkAndAddColumn();
