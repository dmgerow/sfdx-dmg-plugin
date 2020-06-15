sfdx-dmg-plugin
===============

[![Version](https://img.shields.io/npm/v/sfdx-dmg-plugin.svg)](https://npmjs.org/package/sfdx-dmg-plugin)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-dmg-plugin.svg)](https://npmjs.org/package/sfdx-dmg-plugin)
[![Known Vulnerabilities](https://snyk.io/test/github/dmgerow/sfdx-dmg-plugin/badge.svg)](https://snyk.io/test/github/dmgerow/sfdx-dmg-plugin)
[![License](https://img.shields.io/npm/l/sfdx-dmg-plugin.svg)](https://github.com/dmgerow/sfdx-dmg-plugin/blob/master/package.json)

<!-- installation -->
# Installation

```shell
sfdx plugins:install sfdx-dmg-plugin
```

<!-- usagestop -->
# Usage
<!-- commands -->
* [`sfdx dmg:attachments:getfromcsv -s <string> -t <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-dmgattachmentsgetfromcsv--s-string--t-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx dmg:attachments:uploadasfiles -s <string> -t <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-dmgattachmentsuploadasfiles--s-string--t-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx dmg:connectedapp:create -n <string> [-l <string>] [-r] [-c <string>] [-d <string>] [-s <string>] [-e <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-dmgconnectedappcreate--n-string--l-string--r--c-string--d-string--s-string--e-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx dmg:files:base64decode -s <string> -t <string> -c <string> -f <string> -p <string> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-dmgfilesbase64decode--s-string--t-string--c-string--f-string--p-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx dmg:knowledge:convert -s <string> -t <string> [-h <string>] [-f <string>] [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-dmgknowledgeconvert--s-string--t-string--h-string--f-string--c-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx dmg:source:cleanup [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-dmgsourcecleanup---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx dmg:source:retrieve -x <string> [-n] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-dmgsourceretrieve--x-string--n--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx dmg:workbench:open [-s <string> -t <string>] [-r <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-dmgworkbenchopen--s-string--t-string--r-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx dmg:attachments:getfromcsv -s <string> -t <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

get attachment binaries from Salesforce based on a CSV that contains the attachment metadata

```
USAGE
  $ sfdx dmg:attachments:getfromcsv -s <string> -t <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -s, --source=source                                                               (required) source file relative path
  -t, --target=target                                                               (required) target file relative path

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/dmg/attachments/getfromcsv.ts](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.2.0/src/commands/dmg/attachments/getfromcsv.ts)_

## `sfdx dmg:attachments:uploadasfiles -s <string> -t <string> [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

uploads attachments retrieved using the getfromcsv command as Salesforce files and relates them to the parent record

```
USAGE
  $ sfdx dmg:attachments:uploadasfiles -s <string> -t <string> [-u <string>] [--apiversion <string>] [--json] 
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -s, --source=source                                                               (required) source file relative path
  -t, --target=target                                                               (required) target file relative path

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/dmg/attachments/uploadasfiles.ts](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.2.0/src/commands/dmg/attachments/uploadasfiles.ts)_

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

_See code: [src/commands/dmg/connectedapp/create.ts](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.2.0/src/commands/dmg/connectedapp/create.ts)_

## `sfdx dmg:files:base64decode -s <string> -t <string> -c <string> -f <string> -p <string> [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

convert base64 csv to files

```
USAGE
  $ sfdx dmg:files:base64decode -s <string> -t <string> -c <string> -f <string> -p <string> [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --base64column=base64column                                                   (required) column header with base64
                                                                                    data in it

  -f, --filenamecolumn=filenamecolumn                                               (required) column header with file
                                                                                    name in it

  -p, --parentidcolumn=parentidcolumn                                               (required) column header that
                                                                                    contains the unique ID of the
                                                                                    attachment's parent

  -s, --source=source                                                               (required) source file relative path

  -t, --target=target                                                               (required) target file relative path

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/dmg/files/base64decode.ts](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.2.0/src/commands/dmg/files/base64decode.ts)_

## `sfdx dmg:knowledge:convert -s <string> -t <string> [-h <string>] [-f <string>] [-c <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

convert a csv with rich text to html

```
USAGE
  $ sfdx dmg:knowledge:convert -s <string> -t <string> [-h <string>] [-f <string>] [-c <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --base64column=base64column                                                   column header with base64 data in it
  -f, --filenamecolumn=filenamecolumn                                               column with base64 text for file

  -h, --htmlcolumns=htmlcolumns                                                     comma-separated list of columns with
                                                                                    rich text

  -s, --source=source                                                               (required) source file relative path

  -t, --target=target                                                               (required) target file relative path

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/dmg/knowledge/convert.ts](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.2.0/src/commands/dmg/knowledge/convert.ts)_

## `sfdx dmg:source:cleanup [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

clear directories

```
USAGE
  $ sfdx dmg:source:cleanup [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/dmg/source/cleanup.ts](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.2.0/src/commands/dmg/source/cleanup.ts)_

## `sfdx dmg:source:retrieve -x <string> [-n] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

retrieves source using the native command, with an option to clear out foldered directories first (objects and object translations)

```
USAGE
  $ sfdx dmg:source:retrieve -x <string> [-n] [-u <string>] [--apiversion <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -n, --nocleandirectory                                                            Specify this to prevent the
                                                                                    directory from being cleared before
                                                                                    retrieving. Clearing is done to
                                                                                    prevent deleted fields from being
                                                                                    deployed.

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -x, --manifest=manifest                                                           (required) The complete path for the
                                                                                    manifest (package.xml) file that
                                                                                    specifies the components to
                                                                                    retrieve.

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation
```

_See code: [src/commands/dmg/source/retrieve.ts](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.2.0/src/commands/dmg/source/retrieve.ts)_

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

_See code: [src/commands/dmg/workbench/open.ts](https://github.com/dmgerow/sfdx-dmg-plugin/blob/v0.2.0/src/commands/dmg/workbench/open.ts)_
<!-- commandsstop -->
