(function() {
    var fs, Packer, argv, manifest;
    fs = require('fs');
    argv = require('optimist').argv;
    manifest = argv.manifest;
    Packer = require('../lib/packer');
    Packer.setManifest(manifest);
    Packer.generateCarryall();
}).call(this);