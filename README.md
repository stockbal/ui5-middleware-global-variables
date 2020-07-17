# UI5 global variables middleware

Middleware for [ui5-server](https://github.com/SAP/ui5-server), for accessing globally injected variables.

## Install

```bash
npm install ui5-middleware-global-variables --save-dev
```

## Configuration options (in `$yourapp/ui5.yaml`)

- rootPath: `string`
  the root path to the static resources on your system

## Usage

1. Define the dependency in `$yourapp/package.json`:

```json
"devDependencies": {
    // ...
    "ui5-middleware-global-variables": "*"
    // ...
},
"ui5": {
  "dependencies": [
    // ...
    "ui5-middleware-global-variables",
    // ...
  ]
}
```

> As the devDependencies are not recognized by the UI5 tooling, they need to be listed in the `ui5 > dependencies` array. In addition, once using the `ui5 > dependencies` array you need to list all UI5 tooling relevant dependencies.

2. configure it in `$yourapp/ui5.yaml`:  

```yaml
server:
  customMiddleware:
  - name: ui5-middleware-global-variables
    afterMiddleware: compression
    configuration:
      debug: true
```

## How it works

You insert the following `script`-tag at the end of the `head`-tag of the `*.html` file you use for your dev server.

```html
<script src="/ui5-global-vars.js"></script>
```

The middleware will then inject the source code into the script which will convert all `.env` Variables that start with **`UI5_GLOBAL_VAR__`** into a global object called `$ui5GlobalVariables`.  
This object has only one method called `get` which expects the id of a global variable (defined in `.env`)

## License

This work is [licensed](../../LICENSE) under Apache 2.0.