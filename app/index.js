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
      }
    ];

    this.prompt(prompts, function (props) {
      this.vagrant_hostname = props.vagrant_hostname;
      this.vagrant_ip = props.vagrant_ip;
      this.vagrant_machine_name = props.vagrant_machine_name;
      this.local_path = props.local_path;
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
        vagrant_machine_name: this.vagrant_machine_name,
        vagrant_ip: this.vagrant_ip,
      }
    );
  },

  install: function() {
    //
  },

  end: function() {
    // let user know next steps
  },
});

module.exports = DrupalVMGenerator;
