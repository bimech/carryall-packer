var Packer = (function() {
    var fs = require('fs');
    var UglifyJS = require('uglify-js');
    var jsStringEscape = require('js-string-escape');
    var _manifest = {};
    var _template = '';
    var _manifestKeys = ['name', 'srcDir', 'outDir', 'cargoList', 'checks'];

    var setManifest = function(fileName) {
        var manifestStr = '';
        var manifestJSON = '';
        try { manifestStr = fs.readFileSync(fileName, 'utf8'); }
        catch(e) { throw new ManifestNotFound('Could not locate a manifest file at: ' + fileName); }
        try { manifestJSON = JSON.parse(manifestStr); }
        catch(e) { throw new InvalidManifestFormat('The manifest must be a valid JSON structure.'); }
        _detectValidManifest(manifestJSON);
        _manifest = manifestJSON;
        console.log("Set manifest: " + _manifest.name);
    };
    var getManifest = function() {
        return _manifest;
    };
    var _detectValidManifest = function(manifest) {
        for(var i = 0; i < _manifestKeys.length; i++) {
            if(!(_manifestKeys[i] in manifest)) {
                throw new InvalidManifestFormat('Missing manifest key: ' + _manifestKeys[i]);
            }
        }
        if(!(manifest.cargoList instanceof Array)) {
            throw new InvalidManifestFormat('cargoList must be specified as an array.');
        }
        if(!(manifest.checks instanceof Array)) {
            throw new InvalidManifestFormat('checks must be specified as an array.');
        }
    };
    var _readTemplate = function() {
        _template = fs.readFileSync("./lib/carryallTemplate.js", 'utf8');
        console.log("Read carryallTemplate.js");
    };
    var _insertIntoTemplate = function(token, value) {
        _template = _template.replace(token, value);
    };
    var _minifyEscape = function(src) {
        var miniSrc = UglifyJS.minify(src, {fromString: true}).code;
        return jsStringEscape(miniSrc);
    };
    var _insertCarryallSrc = function() {
        var src = fs.readFileSync("./lib/carryall.js", 'utf8');
        var miniSrc = UglifyJS.minify(src, {fromString: true}).code;
        _insertIntoTemplate("'{{carryall.js}}';", miniSrc);
        console.log("Inserted carryall.js source into template.");
    };
    var _insertManifestChecks = function() {
        var checksJSON = JSON.stringify(_manifest.checks);
        _insertIntoTemplate("'{{carryallManifestChecks}}'", checksJSON);
    };
    var _insertCargo = function() {
        var cargo = [];
        for(var i = 0; i < _manifest.cargoList.length; i++) {
            var cargoItem = _manifest.cargoList[i];
            var srcPath = _manifest.srcDir + '/' + cargoItem;
            var src = '';
            try { src = fs.readFileSync(srcPath, 'utf8'); }
            catch(e) { throw new CargoNotFound("Could not locate the following source file: " + srcPath); }
            cargo.push("{'name': '" + cargoItem + "', 'payload': '" + _minifyEscape(src) + "'}");
        }
        _insertIntoTemplate("'{{carryallCargo}}'", '[' + cargo.join(',') + ']');
    };
    var _writeCarryallFile = function() {
        var carryallFileName = _manifest.outDir + '/' + _manifest.name +'.carryall.js';
        fs.writeFileSync(carryallFileName, _template);
        console.log("Generated Carryall file: " + carryallFileName);
    };
    var generateCarryall = function() {
        _readTemplate();
        _insertCarryallSrc();
        _insertManifestChecks();
        _insertCargo();
        _writeCarryallFile();
    };

    // Exceptions
    function ManifestNotFound(message) {
        this.message = message;
        this.name = 'ManifestNotFound';
        this.toString = function() {
            return this.message;
        }
    }
    function InvalidManifestFormat(message) {
        this.message = message;
        this.name = 'ManifestNotFound';
        this.toString = function() {
            return this.message;
        }
    }
    function CargoNotFound(message) {
        this.message = message;
        this.name = 'ManifestNotFound';
        this.toString = function() {
            return this.message;
        }
    }

    return {
        setManifest: setManifest,
        getManifest: getManifest,
        generateCarryall: generateCarryall
    };
})();
module.exports = Packer;