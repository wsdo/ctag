/*
 * @Author: starkwang
 * @Contact me: https://shudong.wang/about
 * @Date: 2019-07-26 16:23:02
 * @LastEditors: starkwang
 * @LastEditTime: 2019-11-20 17:22:25
 * @Description: file content
 */
module.exports = class Service {
  constructor(context, { inlineOptions } = {}) {
    this.initialized = false;
    this.context = context;
    this.inlineOptions = inlineOptions;
  }
  init() {
    const semver = require("semver");
    const inquirer = require("inquirer");
    const { execSync } = require("child_process");
    // const curVersion = require('../package.json').version // get package version
    let curVersion = "1.0.0";

    const tagInit = () => {
      let msg = "varsion init";
      execSync(
        `git tag -a 'v${curVersion}' -m 'curVersion v${curVersion} : ${msg}'`
      );
      execSync(`git push --tags`);
      curVersion = execSync(`git describe --abbrev=0 --tags`, {
        encoding: "utf8"
      }).trim();
    };
    try {
      execSync(`git fetch --tags`);
      curVersion = execSync(`git describe --abbrev=0 --tags`, {
        // curVersion = execSync(`git describe --abbrev=0 --tags`, {
        encoding: "utf8"
      }).trim();
    } catch (error) {
      tagInit();
    }

    const release = async () => {
      console.log(`Current version: ${curVersion}`);
      const bumps = ["patch", "minor", "major", "prerelease"];
      const versions = {};
      bumps.forEach(b => {
        versions[b] = semver.inc(curVersion, b);
      });
      const bumpChoices = bumps.map(b => ({
        name: `${b} (${versions[b]})`,
        value: b
      }));

      const { bump, customVersion } = await inquirer.prompt([
        {
          name: "bump",
          message: "Select release type:",
          type: "list",
          choices: [...bumpChoices, { name: "custom", value: "custom" }]
        },
        {
          name: "customVersion",
          message: "Input version:",
          type: "input",
          when: answers => answers.bump === "custom"
        }
      ]);

      const version = customVersion || versions[bump];

      const { msg } = await inquirer.prompt([
        {
          name: "msg",
          message: "Input message:",
          type: "input"
        }
      ]);

      const { yes } = await inquirer.prompt([
        {
          name: "yes",
          message: `Confirm releasing ${version}?`,
          type: "confirm"
        }
      ]);

      if (yes) {
        try {
          console.log("version", version);
          console.log("pushing tag", version);
          // const GIT_COMMIT = execSync(`git rev-parse HEAD`);
          // const NEEDS_TAG = execSync(`git describe --contains ${curHEAD}`);
          execSync(
            `git tag -a 'v${version}' -m 'version v${version} : ${msg}'`
          );
          execSync(`git push --tags`);
        } catch (e) {
          console.log(e);
        }
      }
    };

    release().catch(err => {
      console.error(err);
      process.exit(1);
    });
  }
  async run() {
    this.init();
  }
};
