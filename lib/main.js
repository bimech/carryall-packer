(function() {
    var fs, Packer, argv, manifest, isRelative;
    fs = require('fs');
    argv = require('optimist').argv;
    if(argv.manifest) {
        manifest = argv.manifest;
        isRelative = false;
    }
    else {
        manifest = process.cwd() + '/carryall.json';
        isRelative = true;
    }
    Packer = require('../lib/packer');
    Packer.setManifest(manifest, isRelative);
    Packer.generateCarryall();
}).call(this);