import register from "./index.js";


register({
  webHome: './web',
  webProjects: {
    "se-backend": {
      url: 'https://gitee.com/weald339/se-backend.git',
      buildCmds: ['test.bat']
    }
  }
})