var fs, argv, packer, manifest, isRelative;
fs = require('fs');
argv = require('optimist').argv;
packer = require('../lib/packer');

if(argv.manifest) {
    manifest = argv.manifest;
    isRelative = false;
}
else {
    manifest = process.cwd() + '/carryall.json';
    isRelative = true;
}

var main = {
    manifest: manifest,
    isRelative: isRelative,
    packer: packer,
    run: function() {
        packer.setManifest(manifest, isRelative);
        packer.generateCarryall();
    }

};
module.exports = main;