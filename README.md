# Carryall Packer

Packer is a Node.js build tool which minifies and stringifies JavaScript source files for use with the [Carryall](https://github.com/bimech/carryall.js) script loader.

## Usage

Create a carryall.json file in the following format:

```javascript
{
    "name": "app",
    "outDir": "/path/to/out",
    "cargoList": [{ "name": "foo.js", "path": "/path/to/src" }],
    "checks":[
        {
            "check": true,
            "checkPassed": ["foo.js"]
        }
    ]
}
```

You can either change into the directory where the carryall.json file (which in this case should specify relative paths) is located and execute the packer command:

```
$ cd /path/to/carryall.json

$ carryall-packer
```

Or you can pass the absolute path of the carryall.json file (which in this case should specify absolute paths) to the packer command:

```
$ carryall-packer --manifest='/path/to/carryall.json'
```