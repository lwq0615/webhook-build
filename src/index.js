import express from "express";
import fs from 'fs'
import path from 'path'
import ora from 'ora'
import Shell from "./shell.js";

const app = express()

function defaultProjectConfig(config) {
  if (!config.url) {
    throw new Error('project url is required')
  }
  return Object.assign({
    // 代码所在仓库
    url: '',
    // 代码所在分支
    branch: 'master',
    // 项目打包命令
    buildCmds: [],
    // 项目密钥
    access: ''
  }, config)
}

let webhookConfig = {
  // 启动端口
  port: 8899,
  // 项目目录
  webHome: '',
  // 项目配置
  webProjects: {},
  // 全局密钥
  access: ''
}

app.get('/:projectName', (req, res) => {
  const access = req.query.access
  const projectName = req.params.projectName
  const projectConfig = webhookConfig.webProjects[projectName]
  if (
    (projectConfig.access && projectConfig.access !== access) ||
    (!projectConfig.access && webhookConfig.access && webhookConfig.access !== access)
  ) {
    res.send("access error")
    return
  }
  if (!projectConfig) {
    res.send('project not found')
    return
  }
  const projectDir = path.resolve(webhookConfig.webHome, projectName)
  if (fs.existsSync(projectDir)) {
    // 项目已存在 pull
    const spinner = ora('pull and building...\n')
    try {
      spinner.start()
      Shell([`cd ${projectDir}`, `git pull origin ${projectConfig.branch}`, ...projectConfig.buildCmds])
      spinner.succeed('pull and build success\n')
      res.send('project pull and build success')
    } catch (err) {
      spinner.fail('pull and build error\n')
      res.send(err)
    }
  } else {
    // 项目不存在 clone
    const spinner = ora('clone and building...\n')
    try {
      spinner.start()
      Shell([`cd ${webhookConfig.webHome}`, `git clone ${projectConfig.url}`, `cd ${projectName}`, ...projectConfig.buildCmds])
      spinner.succeed('clone and build success\n')
      res.send('project clone and build success')
    } catch (err) {
      spinner.fail('clone and build error\n')
      res.send(err)
    }
  }
})

const register = (config) => {
  if (!config.webHome) {
    throw new Error('webHome is required')
  }
  if (!config.webProjects) {
    throw new Error('webProjects is required')
  }
  if (!fs.existsSync(config.webHome)) {
    fs.mkdirSync(config.webHome)
  }
  Object.keys(config.webProjects).forEach(projectName => {
    config.webProjects[projectName] = defaultProjectConfig(config.webProjects[projectName])
  })
  webhookConfig = Object.assign(webhookConfig, config)
  app.listen(webhookConfig.port, () => {
    console.log(`Server running at http://localhost:${webhookConfig.port}`);
  });
}

export default register


