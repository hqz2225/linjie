const { createClient } = require('@supabase/supabase-js');

// 直接使用连接信息
const supabaseUrl = 'https://nbxworfvxiufzvsbifnn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieHdvcmZ2eGl1Znp2c2JpZm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNTI2NjIsImV4cCI6MjA4NzcyODY2Mn0.HJHRKxCVC_CZgRJhvVNWcZhNODIwwlYiYbyj7w-HwZY';

if (!supabaseUrl || !supabaseKey) {
  console.error('请确保 Supabase 连接信息已设置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 测试 Supabase 连接
async function testConnection() {
  console.log('测试 Supabase 连接...');
  try {
    const { data, error } = await supabase.from('novels').select('*').limit(1);
    if (error) {
      console.error('连接测试失败:', error);
    } else {
      console.log('连接测试成功!');
      console.log('获取到的数据:', data);
    }
  } catch (err) {
    console.error('连接测试异常:', err);
  }
}

// 测试发送验证码
async function testSendVerificationCode(email) {
  console.log(`测试发送验证码到 ${email}...`);
  try {
    const { error } = await supabase.auth.resend({
      email: email,
      type: 'signup'
    });
    if (error) {
      console.error('发送验证码失败:', error);
    } else {
      console.log('发送验证码成功!');
    }
  } catch (err) {
    console.error('发送验证码异常:', err);
  }
}

// 运行测试
async function runTests() {
  await testConnection();
  console.log('\n---\n');
  await testSendVerificationCode('test@example.com');
}

runTests();