'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var helpers = yeoman.test;
var assert = yeoman.assert;

var expectedFiles = ['.gitignore', 'tools/drupalvm/config.yml'];

describe('drupalvm:app', function () {
  describe('generates a config.yml with user input', function () {
    it('creates config.yml with expected values', function (done) {
      var vm_root = path.join(__dirname, './temp') + '/tools/drupalvm';
      var vm_config = vm_root + '/config.yml';

      helpers.run(path.join(__dirname, '../app'))
        .inDir(path.join(__dirname, './temp'))
        .withOptions({
          'skip-install': false
        })
        .withPrompts({
          'install_drupal': true,
          'drupal_version': '7',
          'vagrant_hostname': 'mochatest',
          'vagrant_machine_name': 'mochatest',
          'drupalvm_webserver': 'nginx',
          'packages': ['adminer', 'pimpmylog', 'solr', 'xdebug'],
          'vagrant_ip': '0.0.0.0',
          'sync_type': 'rsync',
          'vagrant_memory': 1024,
          'vagrant_cpus': 1,
          'php_version': '5.6',
          'php_memory_limit': 128,
        })
        .on('end', function () {
          assert.file(expectedFiles);
          assert.fileContent(vm_config, /install_site: true/);
          assert.fileContent(vm_config, /vagrant_hostname: mochatest/);
          assert.fileContent(vm_config, /vagrant_machine_name: mochatest/);
          assert.fileContent(vm_config, /drupalvm_webserver: nginx/);
          assert.fileContent(vm_config, /vagrant_ip: 0.0.0.0/);
          assert.fileContent(vm_config, /type: rsync/);
          assert.fileContent(vm_config, /vagrant_memory: 1024/);
          assert.fileContent(vm_config, /vagrant_cpus: 1/);
          assert.fileContent(vm_config, /php_version: "5.6"/);
          assert.fileContent(vm_config, /- adminer/);
          assert.fileContent(vm_config, /- pimpmylog/);
          assert.fileContent(vm_config, /- solr/);
          assert.fileContent(vm_config, /- xdebug/);
          assert.fileContent(vm_config, /#- nodejs/);
          done();
        });
    });
  });
});
