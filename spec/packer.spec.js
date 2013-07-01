var Packer = require('../lib/packer');

describe('Packer', function() {
    describe('.setManifest', function() {
        it('throws ManifestNotFound if file cannot be located', function() {
            expect(function() { Packer.setManifest(''); }).toThrow('Could not locate a manifest file at: ');
        });
    });
    describe('manifest validation', function() {
        it('throws InvalidManifestFormat format for corrupt JSON', function() {
            expect(function() { Packer.setManifest('./spec/data/manifest.invalid.corrupt.json'); })
                .toThrow('The manifest must be a valid JSON structure.');
        });
        it('throws InvalidManifestFormat format for missing keys', function() {
            expect(function() { Packer.setManifest('./spec/data/manifest.invalid.missing_keys.json'); })
                .toThrow('Missing manifest key: name');
        });
        it('throws InvalidManifestFormat format if cargo list is not an array', function() {
            expect(function() { Packer.setManifest('./spec/data/manifest.invalid.cargoList.json'); })
                .toThrow('cargoList must be specified as an array.');
        });
        it('throws InvalidManifestFormat format if checks is not an array', function() {
            expect(function() { Packer.setManifest('./spec/data/manifest.invalid.checks.json'); })
                .toThrow('checks must be specified as an array.');
        });
    });
    describe('cargo validation', function() {
        it('throws CargoNotFound for missing source files', function() {
            expect(function() {
                Packer.setManifest('./spec/data/manifest.invalid.noSrcFile.json');
                Packer.generateCarryall();
            })
                .toThrow("Could not locate the following source file: ./spec/data/src/qux.js");
        });
    });
    describe('with valid manifest', function() {
        it('generates a Carryall file', function() {
            Packer.setManifest('./spec/data/manifest.json');
            Packer.generateCarryall();
        });
    });
});