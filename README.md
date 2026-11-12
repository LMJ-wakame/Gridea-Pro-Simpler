# Gridea Pro Simpler

Demo: <https://alkalitile.netlify.app>

为扩展版 Simple 主题定制的 Gridea Pro 升级版。基于 Gridea Pro 的 Windows 桌面写作工具，内置扩展版 Simple 主题。保留 Gridea Pro 和 Simple 的许可及作者信息；项目使用 GPL-3.0，源码见 `source/`。这是社区定制版本，并非官方发行版。

早期的修改由本人完成，可能会遗留bug。后期修改主要由 GPT-6 Astra 与 GPT-6.1 Terra 完成。

由于修改的 Gridea Pro 版本为历史版本，尽量不要选择更新，因为本人也不知道更新后的情况。感谢您的使用，如有问题欢迎提出。

## 开始使用

1. 下载 Release 中的 Windows ZIP，解压后运行 `Gridea Pro Simpler.exe`。Windows 需要 Microsoft Edge WebView2 Runtime。
2. 首次启动时选择或新建博客目录，进入主题设置选择 Simple。已有博客请先备份目录；已有 Simple 主题不会自动被替换，可从 `source/frontend/public/default-files/themes/simple` 复制主题到博客的 `themes/simple`（先备份旧主题）。
3. 在站点设置填写站名、网址等；写文章，点击预览检查，再使用程序的部署设置发布。

## 新增功能

- Collections：文章设置填写合集名称，也可在 Collections 页面管理。空值表示无合集；标签和分类独立。
- 多语言：文章设置 → Another version → Add another version，选择语言并手写标题和 Markdown；保存文章。生成页面在标题下显示语言切换，空正文不会发布。
- Links：在程序的链接管理中添加链接；Simple 显示分类。
- 搜索、文章目录、字数、相关内容、代码折叠、图片说明、KaTeX 公式和返回顶部。
- 可折叠侧栏和音乐播放器：在 Simple 主题设置填写网易云歌单 ID 或播放器地址。资源可用性取决于第三方服务与歌曲授权。
- Memos：可以设置密码。

## Zoomment 评论

在 Zoomment 服务中创建自己的站点并取得站点 ID；进入 Simple 的主题设置，在 **Zoomment site ID** 填入 ID。再在程序评论设置中启用评论，重新生成并部署网站。ID 留空时不加载评论。Zoomment 是第三方在线服务，服务可用性和评论数据由其提供。

## 编译源码

安装 Go 1.25.5+、Node.js 和 Wails 2.12；Windows 还需要 Wails 所需的 WebView2 与编译环境。进入 `source/frontend` 安装依赖并运行 `npm run build`，回到 `source` 执行 `wails build -m -nosyncgomod -s -skipbindings -o "Gridea Pro Simple.exe"`。`frontend/src/wailsjs` 包含本版本绑定；修改后端接口时需重新生成绑定并检查版本字段。

注意：构建过程中会安装开源依赖；应保留依赖各自的许可证。上游项目和 Simple 主题作者信息保留在源码与主题配置中。
