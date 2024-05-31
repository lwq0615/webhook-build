<h1 align="center">webhook-build 自动化部署工具</h1>


> 在使用之前请先确保 webProjects[projectName].url 中配置的git仓库地址已经配置了公钥并且可以正确拉取代码！！！

## 如何使用

```sh
npm i webhook-build
```

```js
import register from "webhook-build";


register({
  webHome: './web',
  webProjects: {
    "test": {
      url: 'https://gitee.com/test/test.git',
      access: 'test-access',
      // 项目打包命令
      buildCmds: [
        "npm install",
        "npm run build"
      ],
    }
  }
})
```

> webProjects 中配置了项目名称为 test，access 密钥为 "test-access" 的项目，则更新该项目的 webhook 地址为 ${你的域名}:8899/test?access=test-access，每当请求这个地址，webhook 会自动拉取最新代码并根据 buildCmds 配置的命令进行打包

## 配置项

```js
const webhookConfig = {
  // 启动端口
  port: 8899,
  // 项目目录
  webHome: './web',
  // 全局密钥
  access: '',
  // 项目配置
  webProjects: {
    [项目名称]: {
      // 代码所在仓库
      url: '',
      // 代码所在分支
      branch: 'master',
      // 项目打包命令
      buildCmds: [
        "npm install",
        "npm run build"
      ],
      // 项目密钥
      access: ''
    }
  }
}

register(webhookConfig)
```


