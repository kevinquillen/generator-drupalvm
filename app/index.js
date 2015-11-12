'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs-extra');
var mkdirp = require('mkdirp');

var DrupalVMGenerator = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    this.log(chalk.cyan('~~ Welcome to the DrupalVM generator! ~~'));
    this.log(chalk.yellow('This is a tool to help you get a DrupalVM configuration going for Windows or OSX/Linux rather quickly, with the VM contained in the same directory as the Drupal codebase.'));
    this.log('');
    this.log(chalk.magenta('Prerequisites: Vagrant'));
    this.log(chalk.magenta('  -- vagrant-cachier plugin'));
    this.log(chalk.magenta('  -- vagrant-hostsupdater plugin'));
    this.log(chalk.magenta('  -- vagrant-auto_network plugin'));
    this.log('');

    var prompts = [
      {
        type: 'input',
        name: 'vagrant_hostname',
        message: 'Enter a hostname for the VM. No spaces or symbols. Vagrant will automatically append your hostfile for you.',
        default: 'drupalvm.dev'
      },
      {
        type: 'input',
        name: 'vagrant_machine_name',
        message: 'Enter a machine name for the VM. No spaces or symbols.',
        default: 'drupalvm'
      },
      {
        type: 'input',
        name: 'vagrant_ip',
        message: 'What IP do you want to use for the VM? Enter 0.0.0.0 if you plan on allowing vagrant-auto_network plugin to select and assign one for you.',
        default: '192.168.88.88'
      },
      {
        type: 'input',
        name: 'local_path',
        message: 'What is the local path of this project? This is used when mounting the host machine drive to the virtual machine.',
        default: this.destinationRoot()
      },
      {
        type: 'input',
        name: 'destination',
        message: 'What is the remote path of this site? This directory is used in vhost conf files.',
        default: '/var/www/sites'
      },
      {
        type: 'list',
        name: 'sync_type',
        message: 'Select the method of file sync you want.',
        choices: [
          'nfs',
          'rsync',
          'smb'
        ],
        default: 'nfs'
      },
      {
        type: 'input',
        name: 'vagrant_memory',
        message: 'How much memory (in MB) do you want to allot to this virtual machine?',
        default: '2048'
      },
      {
        type: 'input',
        name: 'vagrant_cpus',
        message: 'How many CPUs for this virtual machine?',
        validate: function(input) {
          return (!isNaN(input) && (input < 5) && (input >= 1));
        },
        default: '2'
      },
      {
        type: 'checkbox',
        message: 'Which packages would you like to install?',
        name: 'packages',
        choices: [
          {
            name: 'adminer',
            checked: true
          },
          {
            name: 'mailhog',
            checked: true
          },
          {
            name: 'memcached',
            checked: false
          },
          {
            name: 'nodejs',
            checked: false
          },
          {
            name: 'pimpmylog',
            checked: false
          },
          {
            name: 'ruby',
            checked: false
          },
          {
            name: 'selenium',
            checked: false
          },
          {
            name: 'solr',
            checked: false
          },
          {
            name: 'varnish',
            checked: false
          },
          {
            name: 'xdebug',
            checked: false
          },
          {
            name: 'xhprof',
            checked: false
          }
        ]
      },
      {
        type: 'list',
        name: 'php_version',
        message: 'What version of PHP do you want to use?',
        choices: [
          '5.5',
          '5.6',
          '7.0'
        ],
        default: '5.6'
      },
      {
        type: 'input',
        name: 'php_memory_limit',
        message: 'How much memory do you want to allocated to PHP?',
        validate: function(input) {
          return (!isNaN(input) && (input < 1024) && (input >= 128));
        },
        default: '256'
      },
      {
        type: 'input',
        name: 'solr_version',
        message: 'What version of Solr do you want to install?',
        default: '4.10.4',
        when: function(props) {
          return this._contains(props.packages, 'solr');
        }.bind(this)
      }
    ];

    this.prompt(prompts, function (props) {
      this.vagrant_hostname = props.vagrant_hostname;
      this.vagrant_ip = props.vagrant_ip;
      this.vagrant_machine_name = props.vagrant_machine_name;
      this.local_path = props.local_path;
      this.destination = props.destination;
      this.sync_type = props.sync_type;
      this.vagrant_memory = props.vagrant_memory;
      this.vagrant_cpus = props.vagrant_cpus;
      this.packages = props.packages;
      this.php_version = props.php_version;
      this.php_memory_limit = props.php_memory_limit;
      this.solr_version = props.solr_version;
      done();
    }.bind(this));
  },

  initializing: function() {
    //
  },

  configuring: function() {
    mkdirp.sync(this.destinationRoot() + '/drupalvm');
  },

  writing: function() {
    var destination = this.destinationRoot() + '/drupalvm';

    this.fs.copy(
      this.templatePath('drupalvm'),
      this.destinationPath(destination)
    );

    this.fs.copyTpl(
      this.templatePath('configuration'),
      this.destinationPath(destination),
      {
        vagrant_hostname: this.vagrant_hostname,
        vagrant_machine_name: this.vagrant_machine_name,
        vagrant_ip: this.vagrant_ip,
        local_path: this.local_path,
        destination: this.destination,
        sync_type: this.sync_type,
        vagrant_memory: this.vagrant_memory,
        vagrant_cpus: this.vagrant_cpus,
        packages: this.packages,
        php_version: this.php_version,
        php_memory_limit: this.php_memory_limit,
        solr_version: this._contains(this.packages, 'solr') ? this.solr_version : '4.10.4',
        enable_xdebug: this._contains(this.packages, 'xdebug') ? 1 : 0,
      }
    );
  },

  install: function() {
    //
  },

  end: function() {
    // let user know next steps
  },

  _contains: function(ar, match) {
    for (var i = 0; i < ar.length; i++) {
      if (ar[i] === match) {
        return true;
      }
    }

    return false;
  }
});

module.exports = DrupalVMGenerator;
