import { createClient } from '@supabase/supabase-js'

// TEMPORÁRIO: URLs hardcoded até resolver problema Vite
const supabaseUrl = 'https://febic.ibicsc.com.br/api'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

// FORÇAR VITE A INCLUIR AS URLs
console.log('SUPABASE_URL:', supabaseUrl);
console.log('SUPABASE_KEY:', supabaseAnonKey);

// Forçar uso em runtime
if (typeof window !== 'undefined') {
  window.SUPABASE_CONFIG = { url: supabaseUrl, key: supabaseAnonKey };
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export { supabaseUrl, supabaseAnonKey }
