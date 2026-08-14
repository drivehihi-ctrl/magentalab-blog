import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clean() {
    console.log("Deleting revisions for 5800...");
    const { data, error } = await supabase
        .from('ai_revisions')
        .delete()
        .eq('wordpress_id', 5800)
        .select();
        
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Deleted:", data);
    }
}

clean();
