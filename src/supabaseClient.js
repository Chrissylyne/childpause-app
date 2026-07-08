import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://duquuixdgwavbczfbohf.supabase.co'
const SUPABASE_KEY = 'sb_publishable_8-VH_2bEbUiskUm0Ox0j8A_-BSZz3_o'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
