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
    buildCmds: []
  }, config)
}

let webhookConfig = {
  port: 8899,
  webHome: '',
  webProjects: {}
}

app.get('/:projectName', (req, res) => {
  const projectName = req.params.projectName
  const projectConfig = webhookConfig.webProjects[projectName]
  if (!projectConfig) {
    res.send('project not found')
    return
  }
  // 项目已存在
  const projectDir = path.resolve(webhookConfig.webHome, projectName)
  if (fs.existsSync(projectDir)) {
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
  if(!config.webHome) {
    throw new Error('webHome is required')
  }
  if(!config.webProjects) {
    throw new Error('webProjects is required')
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


