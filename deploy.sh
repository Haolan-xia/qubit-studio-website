#!/bin/bash

# 量子工作室网站部署脚本
# 使用方法: ./deploy.sh

echo "🚀 开始部署量子工作室网站..."

# 检查Git是否已初始化
if [ ! -d ".git" ]; then
    echo "📁 初始化Git仓库..."
    git init
fi

# 添加所有文件到Git
echo "📝 添加文件到Git..."
git add .

# 提交更改
echo "💾 提交更改..."
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"

# 检查是否已设置远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  请先设置GitHub远程仓库:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/qubit-studio-website.git"
    echo "   然后运行: git push -u origin main"
    exit 1
fi

# 推送到GitHub
echo "📤 推送到GitHub..."
git push origin main

echo "✅ 部署完成！"
echo ""
echo "🌐 你的网站应该可以在以下地址访问:"
echo "   https://YOUR_USERNAME.github.io/qubit-studio-website"
echo ""
echo "📋 下一步:"
echo "   1. 在GitHub仓库设置中启用GitHub Pages"
echo "   2. 等待几分钟让网站生效"
echo "   3. 测试网站功能"
echo ""
echo "📖 详细部署指南请查看: 部署指南.md" 