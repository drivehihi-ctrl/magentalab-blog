
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xmisjoqjfnsnhcescuvx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaXNqb3FqZm5zbmhjZXNjdXZ4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU0MDk1OSwiZXhwIjoyMDkyMTE2OTU5fQ.58a1KGqbsp7uY2WbYVBm4S2eNayZgZ8uSEw1gRDbQGA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  console.log('--- Supabase Storage Setup ---');
  
  // 1. pet_profiles 버킷 생성 시도
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('Error listing buckets:', listError);
    return;
  }

  const bucketExists = buckets.find(b => b.name === 'pet_profiles');
  if (!bucketExists) {
    console.log('Creating "pet_profiles" bucket...');
    const { data, error } = await supabase.storage.createBucket('pet_profiles', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png'],
      fileSizeLimit: 1048576 // 1MB
    });
    if (error) console.error('Error creating bucket:', error);
    else console.log('Bucket "pet_profiles" created successfully!');
  } else {
    console.log('Bucket "pet_profiles" already exists.');
  }

  // 2. DB 컬럼 추가는 SQL Editor에서 하는 것이 안전하지만, 
  // 여기서는 photo_url 컬럼이 있는지 확인하는 용도로만 사용 (직접 수정은 권장 안 됨)
  console.log('Please make sure "photo_url" column exists in "pet_profiles" table.');
}

setupStorage();
