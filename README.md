# Carryall Packer

Packer is a Node.js build tool which minifies and stringifies JavaScript source files for use with the [Carryall](https://github.com/bimech/carryall.js) script loader.

## Usage

Create a manifest.json file in the following format:

```javascript
{
    "name": "app",
    "srcDir": "/path/to/src",
    "outDir": "/path/to/out",
    "cargoList": ["foo.js"],
    "checks":[
        {
            "check": true,
            "checkPassed": ["foo.js"]
        }
    ]
}
```

Then pass the location of the manifest file to the command line tool:

```
$ carryall-packer --manifest='/path/to/manifest.json'
```