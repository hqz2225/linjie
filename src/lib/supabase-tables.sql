-- 创建 novels 表
CREATE TABLE IF NOT EXISTS novels (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建 bookshelf 表
CREATE TABLE IF NOT EXISTS bookshelf (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  novel_id VARCHAR(255) NOT NULL REFERENCES novels(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, novel_id)
);

-- 创建 reading_progress 表
CREATE TABLE IF NOT EXISTS reading_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  novel_id VARCHAR(255) NOT NULL REFERENCES novels(id),
  chapter INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, novel_id)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bookshelf_user_id ON bookshelf(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);

-- 插入示例数据
INSERT INTO novels (id, title, author, description, category) VALUES
('1', '平凡的世界', '路遥', '这是一部全景式地表现中国当代城乡社会生活的长篇小说。该书以中国70年代中期到80年代中期十年间为背景，通过复杂的矛盾纠葛，以孙少安和孙少平两兄弟为中心，刻画了当时社会各阶层众多普通人的形象。', '现实主义'),
('2', '三体', '刘慈欣', '文化大革命如火如荼地进行，天文学家叶文洁在运动中遭受迫害，被送到青海支援建设。她在荒无人烟的雷达站接收到了一段来自宇宙深处的信息。这段信息改变了人类的命运。', '科幻'),
('3', '活着', '余华', '《活着》是作家余华的代表作之一，讲述了在大时代背景下，随着内战、三反五反，大跃进，文化大革命等社会变革，徐福贵的人生和家庭不断经受着苦难，到了最后所有亲人都先后离他而去，仅剩下年老的他和一头老牛相依为命。', '现实主义'),
('4', '围城', '钱钟书', '《围城》是钱钟书所著的一部现代文学长篇杰作，被誉为"新儒林外史"。第一版于1947年由上海晨光出版公司出版。故事主要写抗战初期知识分子的群相。', '讽刺小说'),
('5', '红楼梦', '曹雪芹', '《红楼梦》是一部百科全书式的长篇小说，以宝黛爱情悲剧为主线，以四大家族的荣辱兴衰为背景，描绘了18世纪中国封建社会的方方面面。', '古典文学');
