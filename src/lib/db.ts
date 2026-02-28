import { supabase } from './supabase'

// 获取所有小说
export async function getNovels() {
  const { data, error } = await supabase
    .from('novels')
    .select('*')
  
  if (error) {
    console.error('Error getting novels:', error)
    return []
  }
  
  return data
}

// 获取单本小说
export async function getNovelById(id: string) {
  const { data, error } = await supabase
    .from('novels')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error getting novel:', error)
    return null
  }
  
  return data
}

// 获取小说的章节列表
export async function getChapters(novelId: string) {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('novel_id', novelId)
    .order('chapter_number')
  
  if (error) {
    console.error('Error getting chapters:', error)
    return []
  }
  
  return data
}

// 获取单个章节
export async function getChapter(novelId: string, chapterNumber: number) {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('novel_id', novelId)
    .eq('chapter_number', chapterNumber)
    .single()
  
  if (error) {
    console.error('Error getting chapter:', error)
    return null
  }
  
  return data
}

// 注册
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase
    .auth
    .signUp({ email, password })
  
  if (error) {
    console.error('Error signing up:', error)
    return { success: false, error: error.message }
  }
  
  return { success: true, user: data.user, session: data.session }
}

// 发送验证码
export async function resendVerificationCode(email: string) {
  const { error } = await supabase
    .auth
    .resend({ email, type: 'signup' })
  
  if (error) {
    console.error('Error resending verification code:', error)
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

// 验证邮箱验证码
export async function verifyEmail(email: string, token: string) {
  const { data, error } = await supabase
    .auth
    .verifyOtp({ email, token, type: 'signup' })
  
  if (error) {
    console.error('Error verifying email:', error)
    return { success: false, error: error.message }
  }
  
  return { success: true, user: data.user, session: data.session }
}

// 登录
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase
    .auth
    .signInWithPassword({ email, password })
  
  if (error) {
    console.error('Error signing in:', error)
    return { success: false, error: error.message }
  }
  
  return { success: true, user: data.user }
}

// 加入或移除书架
export async function addToBookshelf(novel_id: string) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }
  
  // 检查小说是否已经在书架中
  const { data: existingItem } = await supabase
    .from('bookshelf')
    .select('id')
    .eq('user_id', user.id)
    .eq('novel_id', novel_id)
    .single()
  
  let result
  
  if (existingItem) {
    // 如果已存在，从书架中移除
    result = await supabase
      .from('bookshelf')
      .delete()
      .eq('id', existingItem.id)
      .select()
  } else {
    // 如果不存在，添加到书架
    result = await supabase
      .from('bookshelf')
      .insert({ user_id: user.id, novel_id })
      .select()
  }
  
  const { data, error } = result
  
  if (error) {
    console.error('Error modifying bookshelf:', error)
    return { success: false, error: error.message }
  }
  
  return { success: true, data }
}

// 获取当前用户书架
export async function getBookshelf() {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }
  
  const { data, error } = await supabase
    .from('bookshelf')
    .select('novels(*)')
    .eq('user_id', user.id)
  
  if (error) {
    console.error('Error getting bookshelf:', error)
    return { success: false, error: error.message }
  }
  
  // 提取小说数据
  const novels = data.map(item => item.novels)
  return { success: true, data: novels }
}

// 更新阅读进度
export async function updateReadingProgress(novel_id: string, chapter: number) {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: 'User not authenticated' }
  }
  
  // 检查是否已存在阅读记录
  const { data: existingRecord } = await supabase
    .from('reading_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('novel_id', novel_id)
    .single()
  
  let result
  
  if (existingRecord) {
    // 更新现有记录
    result = await supabase
      .from('reading_progress')
      .update({ chapter })
      .eq('id', existingRecord.id)
      .select()
  } else {
    // 创建新记录
    result = await supabase
      .from('reading_progress')
      .insert({ user_id: user.id, novel_id, chapter })
      .select()
  }
  
  const { data, error } = result
  
  if (error) {
    console.error('Error updating reading progress:', error)
    return { success: false, error: error.message }
  }
  
  return { success: true, data }
}
