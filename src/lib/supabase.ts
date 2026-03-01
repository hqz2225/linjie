import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 只在客户端环境中创建 Supabase 客户端
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const supabase = () => {
  if (typeof window !== 'undefined' && !supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey)
  }
  return supabaseInstance
}

// 为了保持兼容性，导出一个默认实例（仅在客户端使用）
export default supabase()
