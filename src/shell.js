
import child_process from "child_process"
import chalk from 'chalk'


const Shell = function (cmds, options = {}) {
  const cds = []
  for (let cmd of cmds) {
    cmd = cmd.trim()
    console.log(chalk.yellow('--' + cmd + '--'))
    const cmdNames = cmd.split('.')
    if (cmdNames.pop() === 'bat') {
      if (cmdNames.pop() === 'sync') {
        BatSync(cmd)
      } else {
        Bat(cmd)
      }
    } else if (cmd.startsWith('cd ')) {
      cds.push(cmd)
    } else {
      const cmdStr = cds.concat(cmd).join(' && ')
      child_process.execSync(cmdStr, { encoding: "utf-8" })
    }
  }
};

export const Bat = (filepath) => child_process.execFile(filepath, null, { shell: true, encoding: 'utf-8', cwd: process.cwd() })
export const BatSync = (filepath) => child_process.execFileSync(filepath, null, { shell: true, encoding: 'utf-8', cwd: process.cwd() })

export default Shell