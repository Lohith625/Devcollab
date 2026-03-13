const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const hostSandboxPath = process.env.SANDBOX_HOST_PATH;

const runCode = async (req, res) => {
  const { code, language } = req.body;

  try {
    const sandboxPath = path.join(__dirname, "../../sandbox");

    if (!fs.existsSync(sandboxPath)) {
      fs.mkdirSync(sandboxPath, { recursive: true });
    }

    if (language === "javascript") {
      const filePath = path.join(sandboxPath, "temp.js");
      fs.writeFileSync(filePath, code);

      exec(
        `docker run --rm -v ${hostSandboxPath}:/sandbox node:18 node /sandbox/temp.js`,
        (error, stdout, stderr) => {
          if (error) return res.json({ run: { stderr } });
          res.json({ run: { stdout } });
        }
      );
    }

    if (language === "python") {
      const filePath = path.join(sandboxPath, "temp.py");
      fs.writeFileSync(filePath, code);

      exec(
        `docker run --rm -v ${hostSandboxPath}:/sandbox python:3.11 python /sandbox/temp.py`,
        (error, stdout, stderr) => {
          if (error) return res.json({ run: { stderr } });
          res.json({ run: { stdout } });
        }
      );
    }

  } catch (error) {
    res.status(500).json({ message: "Execution failed" });
  }
};

module.exports = { runCode };