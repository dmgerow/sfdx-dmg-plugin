sfdx-dmg-plugin
===============



[![Version](https://img.shields.io/npm/v/sfdx-dmg-plugin.svg)](https://npmjs.org/package/sfdx-dmg-plugin)
[![CircleCI](https://circleci.com/gh/dmgerow/sfdx-dmg-plugin/tree/master.svg?style=shield)](https://circleci.com/gh/dmgerow/sfdx-dmg-plugin/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/dmgerow/sfdx-dmg-plugin?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-dmg-plugin/branch/master)
[![Codecov](https://codecov.io/gh/dmgerow/sfdx-dmg-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/dmgerow/sfdx-dmg-plugin)
[![Greenkeeper](https://badges.greenkeeper.io/dmgerow/sfdx-dmg-plugin.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/dmgerow/sfdx-dmg-plugin/badge.svg)](https://snyk.io/test/github/dmgerow/sfdx-dmg-plugin)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-dmg-plugin.svg)](https://npmjs.org/package/sfdx-dmg-plugin)
[![License](https://img.shields.io/npm/l/sfdx-dmg-plugin.svg)](https://github.com/dmgerow/sfdx-dmg-plugin/blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-dmg-plugin
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdx-dmg-plugin/0.0.1 darwin-x64 node-v12.7.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx dmg:connectedapp:create -n <string> [-l <string>] [-r] [-c <string>] [-d <string>] [-s <string>] [-e <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-dmgconnectedappcreate--n-string--l-string--r--c-string--d-string--s-string--e-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx dmg:workbench:open [-s <string> -t <string>] [-r <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-dmgworkbenchopen--s-string--t-string--r-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx dmg:connectedapp:create -n <string> [-l <string>] [-r] [-c <string>] [-d <string>] [-s <string>] [-e <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

create a connected app in your org. Credit sfdx-waw-plugin for base code https://github.com/wadewegner/sfdx-waw-plugin

```
USAGE
  $ sfdx dmg:connectedapp:create -n <string> [-l <string>] [-r] [-c <string>] [-d <string>] [-s <string>] [-e <string>] 
  [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --callbackurl=callbackurl
      callbackUrl (default is "sfdx://success")

  -d, --description=description
      connected app description

  -e, --contactemail=contactemail
      connected app contact email

  -l, --label=label
      connected app label

  -n, --name=name
      (required) connected app name

  -r, --certificate
      create and register a certificate

  -s, --scopes=scopes
      scopes separated by commas (defaut: Api, Web, RefreshToken; valid: Basic, Api, Web, Full, Chatter, 
      CustomApplications, RefreshToken, OpenID, CustomPermissions, Wave, Eclair)

  -u, --targetusername=targetusername
      username or alias for the target org; overrides default target org

  --apiversion=apiversion
      override the api version used for api requests made by this command

  --json
      format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)
      [default: warn] logging level for this command invocation
```

_See code: [lib/commands/dmg/connectedapp/create.js](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.0.1/lib/commands/dmg/connectedapp/create.js)_

## `sfdx dmg:workbench:open [-s <string> -t <string>] [-r <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

open workbench using the current target username (from waw plugin). Credit sfdx-waw-plugin for base code https://github.com/wadewegner/sfdx-waw-plugin

```
USAGE
  $ sfdx dmg:workbench:open [-s <string> -t <string>] [-r <string>] [-u <string>] [--apiversion <string>] [--json] 
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -r, --urlonly=urlonly                                                             urlonly
  -s, --setdefaultworkbenchurl=setdefaultworkbenchurl                               store the workbench url as default
  -t, --targetworkbenchurl=targetworkbenchurl                                       target workbench url

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [lib/commands/dmg/workbench/open.js](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.0.1/lib/commands/dmg/workbench/open.js)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
