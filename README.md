# ChatGPT Desktop Commander 
**Empower ChatGPT with unprecedented control over your computer.**

This project is an exploration into granting ChatGPT unparalleled capabilities on your system. Built upon the foundation of the [electron-quick-start](https://github.com/electron/electron-quick-start) repository. This application not only launches ChatGPT but also registers itself as a plugin, thereby unlocking a suite of powerful features:

- **Terminal Access**: ChatGPT can execute terminal commands, write files, run scripts, and more.
- **JavaScript Execution**: ChatGPT can run JavaScript within its own context, enabling functionalities like blurring the sidebar.
<img src="https://github.com/wonderwhy-er/ChatGPTElectron/assets/1150639/b12b4eca-b93e-43c2-99d4-98d3798017ea.png" height="500">

- **Web Interaction**: ChatGPT can open other websites in a secondary window, extract content, and even summarize comments([example](https://chat.openai.com/share/cedd5e72-0cd0-4376-848e-58c53b84212f)) or request a documentation for API or library in to its context
- **Self-Modification**: ChatGPT can edit its own application files, offering a unique self modification capability([example](https://chat.openai.com/share/fe383b99-7ba1-4fed-8cba-578dbff4b356))

## Getting Started

To experience this project, ensure you have [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (bundled with [npm](http://npmjs.com)) installed on your system. Then, follow these steps:

```bash
# Clone the repository
git clone https://github.com/wonderwhy-er/ChatGPTElectron/
# Navigate into the repository
cd ChatGPTElectron
# Install necessary dependencies
npm install
# Launch the application
npm run start
```
Upon launching, the application will open ChatGPT. You'll need to log in, after which the app will automatically register itself as a plugin. Once registered, you can begin your exploration.

## Caution
Please note that this is an ongoing project and is still in its early stages. As we continue to experiment and refine the application, I appreciate your patience and feedback.
**It also uses ChatGPT Plugin API which only works for GPT4/ChatGPT Pro. Not for free version.**
