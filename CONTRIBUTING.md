# 贡献指南

感谢你改进 Financial Report Dashboard。

## 提交问题

Issue 请尽量包含：

- 使用的 Codex 版本或运行环境；
- 输入财报的类型与数据单位；
- 期望行为和实际行为；
- 可复现步骤；
- 已脱敏的截图或最小示例数据。

请勿上传未获授权的财报、付费数据或包含个人信息的文件。

## 提交代码

1. Fork 仓库并创建主题分支。
2. 保持 `SKILL.md` 简洁，将条件性细节放入 `references/`。
3. 生成物模板放入 `assets/dashboard-template/`，不要将测试 PDF 放入仓库。
4. 可重复且需要确定性的操作放入 `scripts/`。
5. 确认脚手架不会覆盖非空目录。
6. 在提交说明中描述用户可见的变化和验证结果。

## 修改模板时的检查

```bash
node --check assets/dashboard-template/app.js
python3 scripts/scaffold_dashboard.py /tmp/financial-dashboard-contribution-test
```

还应确认：

- 桌面和移动页面没有空白图表或标签严重重叠；
- 涨跌变化使用红涨绿跌；
- 卡片、坐标轴、提示框和表格的单位一致；
- 桑基图财务流向可以勾稽；
- 示例数据、Skill 说明和适配文档同步更新；
- 若更换标准示例，更新 `references/dashboard-adaptation.md` 中的残留数据搜索词。

## 文档风格

- 面向用户的步骤应可直接执行；
- 明确区分必需条件和可选工具；
- 不承诺 Skill 无法稳定完成的自动化能力；
- 对推导数据、单位换算和会计口径保持透明。

