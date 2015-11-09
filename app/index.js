'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs-extra');

var DrupalVMGenerator = yeoman.generators.Base.extend({
  askFor: function () {
    var done = this.async();

    this.log(chalk.cyan('~~ Welcome to the DrupalVM generator! ~~'));
    this.log(chalk.yellow('This is a tool to help you get a DrupalVM configuration going for Windows or OSX/Linux rather quickly, with the VM contained in the same directory as the Drupal codebase.'));
    this.log('');

    var prompts = [{
      type: 'list',
      name: 'drupalVersion',
      message: 'What version of Drupal would you like to install?',
      choices: ['7', '8'],
      default: '7'
    }];

    this.prompt(prompts, function (props) {
      this.drupalVersion = props.drupalVersion;
      done();
    }.bind(this));
  },

  getDrupalVM: function () {
    var repo = "https://github.com/geerlingguy/drupal-vm.git";

    console.log('Fetching DrupalVM. Please wait...');

    require('simple-git')().clone(repo, './drupalvm', function(error) {
      if (error) return console.error(error);

      fs.copy('./drupalvm/example.config.yml', './drupalvm/config.yml', function (error) {
        if (error) return console.error(error)
      });

      fs.copy('./drupalvm/example.drupal.make.yml', './drupalvm/drupal.make.yml', function (error) {
        if (error) return console.error(error)
      });

      console.log('DrupalVM fetched, proceeding.');
    });

    return false;
  },
});

module.exports = DrupalVMGenerator;
