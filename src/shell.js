
import process from "child_process"
import e from "express";


const Shell = function (cmds, options = {}) {
  const cds = []
  for (let cmd of cmds) {
    cmd = cmd.trim()
    if (cmd.startsWith('cd ')) {
      cds.push(cmd)
    } else {
      const cmdStr = cds.concat(cmd).join(' && ')
      try {
        process.execSync(cmdStr, { encoding: "utf-8" })
      } catch (err) {
        if (!options.errorContinue) {
          throw err
        } else {
          console.error(err)
        }
      }
    }
  }
};

export default Shell