const { createClient } = require('@supabase/supabase-js');

// 从环境变量中获取 Supabase 连接信息
const supabaseUrl = 'https://nbxworfvxiufzvsbifnn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieHdvcmZ2eGl1Znp2c2JpZm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNTI2NjIsImV4cCI6MjA4NzcyODY2Mn0.HJHRKxCVC_CZgRJhvVNWcZhNODIwwlYiYbyj7w-HwZY';

// 创建 Supabase 客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 测试注册和登录功能
async function testAuth() {
  console.log('Testing authentication...');
  
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'password123';
  
  try {
    // 测试注册
    console.log('Testing sign up...');
    const { data: signUpData, error: signUpError } = await supabase
      .auth
      .signUp({ email: testEmail, password: testPassword });
    
    if (signUpError) {
      console.error('Error signing up:', signUpError);
      return;
    }
    
    console.log('Sign up successful:', signUpData.user);
    
    // 测试获取用户信息（注册后应该已经登录）
    console.log('Testing get user after sign up...');
    const { data: { user }, error: getUserError } = await supabase.auth.getUser();
    
    if (getUserError) {
      console.error('Error getting user:', getUserError);
    } else {
      console.log('User information after sign up:', user);
    }
    
    // 测试登出
    console.log('Testing sign out...');
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.error('Error signing out:', signOutError);
    } else {
      console.log('Sign out successful');
    }
    
    // 测试登录
    console.log('Testing sign in...');
    const { data: signInData, error: signInError } = await supabase
      .auth
      .signInWithPassword({ email: testEmail, password: testPassword });
    
    if (signInError) {
      console.error('Error signing in:', signInError);
    } else {
      console.log('Sign in successful:', signInData.user);
    }
    
  } catch (error) {
    console.error('General error:', error);
  }
}

testAuth();
