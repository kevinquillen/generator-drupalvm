'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var DrupalVMGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.on('end', function () {
      if (!this.options['skip-install']) {
        //this.getDrupal(this.drupalVersion);
        this.getDrupalVM();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    this.log(this.yeoman);
    this.log(chalk.magenta('Welcome to the DrupalVM generator!'));

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

    require('simple-git')().clone(repo, 'drupalvm', function(error) {
      if (error) {
        console.log('There was a problem fetching DrupalVM from the repository.');
      } else {
        console.log('DrupalVM fetched, proceeding.');
      }
    });

    return false;
  },
});

module.exports = DrupalVMGenerator;
