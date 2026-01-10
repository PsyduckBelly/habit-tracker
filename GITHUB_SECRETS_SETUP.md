# GitHub Secrets 配置指南

## 快速配置步骤（2分钟）

### 步骤 1：打开 Secrets 设置页面
直接访问：https://github.com/PsyduckBelly/habit-tracker/settings/secrets/actions

### 步骤 2：添加第一个 Secret
1. 点击 **"New repository secret"** 按钮
2. Name（名称）输入：`VITE_SUPABASE_URL`
3. Secret（值）输入：`https://nrmqsvzwmgehwfwawpyg.supabase.co`
4. 点击 **"Add secret"**

### 步骤 3：添加第二个 Secret
1. 再次点击 **"New repository secret"** 按钮
2. Name（名称）输入：`VITE_SUPABASE_ANON_KEY`
3. Secret（值）输入：
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybXFzdnp3bWdlaHdmd2F3cHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNTcxNDgsImV4cCI6MjA4MzYzMzE0OH0.LXNw2FGjAr9944f29dKCUdfFXixATpj200eKvJT2t0w
   ```
4. 点击 **"Add secret"**

### 步骤 4：重新触发部署
配置完成后，访问：https://github.com/PsyduckBelly/habit-tracker/actions

点击最新的 workflow，然后点击 **"Re-run all jobs"** 按钮。

或者等待下一次代码推送自动触发部署。

## 验证配置
部署完成后（约 1-2 分钟），访问：
https://psyduckbelly.github.io/habit-tracker/

如果看到登录界面（而不是"Supabase is not configured"的提示），说明配置成功！

## 注意事项
- Secrets 配置后，只有 GitHub Actions 可以访问
- 这些值不会显示在代码中，保证安全
- 如果修改了 Supabase 凭证，需要在这里更新 Secrets

