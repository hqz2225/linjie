const { createClient } = require('@supabase/supabase-js');

// 从环境变量中获取 Supabase 连接信息
const supabaseUrl = 'https://nbxworfvxiufzvsbifnn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieHdvcmZ2eGl1Znp2c2JpZm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNTI2NjIsImV4cCI6MjA4NzcyODY2Mn0.HJHRKxCVC_CZgRJhvVNWcZhNODIwwlYiYbyj7w-HwZY';

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 测试连接和获取数据
async function testSupabase() {
  console.log('Testing Supabase connection...');
  
  try {
    // 测试获取所有小说
    const { data: novels, error: novelsError } = await supabase
      .from('novels')
      .select('*');
    
    if (novelsError) {
      console.error('Error getting novels:', novelsError);
    } else {
      console.log('Novels data:', novels);
      console.log('Total novels:', novels.length);
    }
    
    // 测试获取用户信息
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
    } else {
      console.log('User information:', user);
    }
    
  } catch (error) {
    console.error('General error:', error);
  }
}

testSupabase();
