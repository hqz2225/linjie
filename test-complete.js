const { createClient } = require('@supabase/supabase-js');

// 直接使用连接信息
const supabaseUrl = 'https://nbxworfvxiufzvsbifnn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ieHdvcmZ2eGl1Znp2c2JpZm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNTI2NjIsImV4cCI6MjA4NzcyODY2Mn0.HJHRKxCVC_CZgRJhvVNWcZhNODIwwlYiYbyj7w-HwZY';

if (!supabaseUrl || !supabaseKey) {
  console.error('请确保 Supabase 连接信息已设置');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 测试完整的注册流程
async function testCompleteRegistration(email, password, verificationCode) {
  console.log(`测试完整注册流程 for ${email}...`);
  
  try {
    // 1. 注册用户
    console.log('1. 开始注册用户...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password
    });
    
    if (signUpError) {
      console.error('注册失败:', signUpError);
      return false;
    }
    
    console.log('注册成功，用户数据:', signUpData);
    
    // 2. 发送验证码
    console.log('2. 发送验证码...');
    const { error: resendError } = await supabase.auth.resend({
      email: email,
      type: 'signup'
    });
    
    if (resendError) {
      console.error('发送验证码失败:', resendError);
      return false;
    }
    
    console.log('发送验证码成功');
    
    // 3. 验证验证码
    if (verificationCode) {
      console.log('3. 验证验证码...');
      const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
        email: email,
        token: verificationCode,
        type: 'signup'
      });
      
      if (verifyError) {
        console.error('验证验证码失败:', verifyError);
        return false;
      }
      
      console.log('验证验证码成功:', verifyData);
    }
    
    console.log('完整注册流程测试成功!');
    return true;
  } catch (err) {
    console.error('测试异常:', err);
    return false;
  }
}

// 运行测试
async function runTests() {
  console.log('开始测试 Supabase 邮箱验证功能...\n');
  
  // 测试连接
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
  
  console.log('\n---\n');
  
  // 测试完整注册流程
  const testEmail = 'test' + Date.now() + '@example.com';
  const testPassword = 'test123456';
  const testCode = '123456'; // 这里需要使用实际收到的验证码
  
  console.log(`测试邮箱: ${testEmail}`);
  console.log(`测试密码: ${testPassword}`);
  console.log(`测试验证码: ${testCode}`);
  console.log('');
  
  await testCompleteRegistration(testEmail, testPassword, testCode);
  
  console.log('\n测试完成!');
}

runTests();