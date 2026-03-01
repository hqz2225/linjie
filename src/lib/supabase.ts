import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 只在客户端环境中创建 Supabase 客户端
const supabase = typeof window !== 'undefined' ? createClient(supabaseUrl, supabaseKey) : null

export default supabase
