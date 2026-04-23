
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xmisjoqjfnsnhcescuvx.supabase.co';
// 서비스 롤 키 사용 (마스터 권한)
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaXNqb3FqZm5zbmhjZXNjdXZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU0MDk1OSwiZXhwIjoyMDkyMTE2OTU5fQ.58a1KGqbsp7uY2WbYVBm4S2eNayZgZ8uSEw1gRDbQGA';
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkBuckets() {
  console.log('--- Checking Supabase Storage Buckets (Master Mode) ---');
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error fetching buckets:', error.message);
    return;
  }

  if (buckets.length === 0) {
    console.log('No buckets found even with Master Key.');
  } else {
    buckets.forEach(b => {
      console.log(`- Found Bucket: "${b.name}" (Public: ${b.public})`);
    });
  }
}

checkBuckets();
