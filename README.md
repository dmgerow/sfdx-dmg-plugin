sfdx-dmg-plugin
===============

<!-- installation -->
# Installation

```shell
sfdx plugins:install sfdx-dmg-plugin
```

<!-- usagestop -->
# Usage
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

_See code: [lib/commands/dmg/connectedapp/create.js](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.0.0/lib/commands/dmg/connectedapp/create.js)_

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

_See code: [lib/commands/dmg/workbench/open.js](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.0.0/lib/commands/dmg/workbench/open.js)_
<!-- commandsstop -->
