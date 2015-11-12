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

    console.log("\n\n");
    console.log(chalk.green("   _____                         ___      ____  __    _____                           _            "));
    console.log(chalk.green("  |  __ \\                       | \\ \\    / /  \\/  |  / ____|                         | |            "));
    console.log(chalk.green("  | |  | |_ __ _   _ _ __   __ _| |\\ \\  / /| \\  / | | |  __  ___ _ __   ___ _ __ __ _| |_ ___  _ __ "));
    console.log(chalk.green("  | |  | | '__| | | | '_ \\ / _` | | \\ \\/ / | |\\/| | | | |_ |/ _ \\ '_ \\ / _ \\ '__/ _` | __/ _ \\| \\'__|"));
    console.log(chalk.green("  | |__| | |  | |_| | |_) | (_| | |  \\  /  | |  | | | |__| |  __/ | | |  __/ | | (_| | || (_) | |"));
    console.log(chalk.green("  |_____/|_|   \\__,_| .__/ \\__,_|_|   \\/   |_|  |_|  \\_____|\\___|_| |_|\\___|_|  \\__,_|\\__\\___/|_|"));
    console.log(chalk.green("                    | |"));
    console.log(chalk.green("                    |_|"));

    console.log("\n\n     Generator created by " + chalk.cyan("@kevinquillen") + " of " + chalk.green("Velir") + ".\n     Repo: https://github.com/kevinquillen/generator-drupalvm");
    console.log("\n     This is a tool helps you kickstart a new Drupal project with the DrupalVM.");
    console.log("\n     DrupalVM is by " + chalk.yellow("@geerlingguy") + "\n     http://drupalvm.com\n\n");

    var prompts = [
      {
        type: 'list',
        name: 'drupal_version',
        message: 'What version of Drupal do you want to install?',
        choices: [
          '7',
          '8'
        ],
        default: '7'
      },
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
        default: function(props) { return props.vagrant_hostname }.bind(this)
      },
      {
        type: 'input',
        name: 'vagrant_ip',
        message: 'What IP do you want to use for the VM?',
        default: '192.168.88.88'
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
      this.props = props;
      done();
    }.bind(this));
  },

  initializing: function() {
    //
  },

  configuring: function() {
    mkdirp.sync(this.destinationRoot() + '/tools/drupalvm');
  },

  writing: function() {
    var destination = this.destinationRoot() + '/tools/drupalvm';

    this.fs.copy(
      this.templatePath('drupalvm'),
      this.destinationPath(destination)
    );

    this.fs.copyTpl(
      this.templatePath('configuration'),
      this.destinationPath(destination),
      {
        drupal_version: this.props.drupal_version,
        drupal_core_branch: (this.props.drupal_version == 7) ? '7.x' : '8.0.x',
        vagrant_hostname: this.props.vagrant_hostname,
        vagrant_machine_name: this.props.vagrant_machine_name,
        vagrant_ip: this.props.vagrant_ip,
        sync_type: this.props.sync_type,
        vagrant_memory: this.props.vagrant_memory,
        vagrant_cpus: this.props.vagrant_cpus,
        packages: this.props.packages,
        php_version: this.props.php_version,
        php_memory_limit: this.props.php_memory_limit,
        solr_version: this._contains(this.props.packages, 'solr') ? this.props.solr_version : '4.10.4',
        enable_xdebug: this._contains(this.props.packages, 'xdebug') ? 1 : 0,
        install_adminer: this._contains(this.props.packages, 'adminer') ? '- adminer' : '#- adminer',
        install_mailhog: this._contains(this.props.packages, 'mailhog') ? '- mailhog' : '#- mailhog',
        install_memcached: this._contains(this.props.packages, 'memcached') ? '- memcached' : '#- memcached',
        install_nodejs: this._contains(this.props.packages, 'nodejs') ? '- nodejs' : '#- nodejs',
        install_pimpmylog: this._contains(this.props.packages, 'pimpmylog') ? '- pimpmylog' : '#- pimpmylog',
        install_ruby: this._contains(this.props.packages, 'ruby') ? '- ruby' : '#- ruby',
        install_selenium: this._contains(this.props.packages, 'selenium') ? '- selenium' : '#- selenium',
        install_solr: this._contains(this.props.packages, 'solr') ? '- solr' : '#- solr',
        install_varnish: this._contains(this.props.packages, 'varnish') ? '- varnish' : '#- varnish',
        install_xdebug: this._contains(this.props.packages, 'xdebug') ? '- xdebug' : '#- xdebug',
        install_xhprof: this._contains(this.props.packages, 'xhprof') ? '- xhprof' : '#- xhprof',
      }
    );
  },

  install: function() {
    //
  },

  end: function() {
    var destination = this.destinationRoot() + '/tools/drupalvm';
    console.log("\n" + chalk.green("Complete!"));
    console.log("\nNext steps:\n   -- Navigate to " + chalk.yellow(destination) + " and run the " + chalk.magenta("vagrant up") + " command.");
    console.log("   -- Read the README in (tbd).");
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
