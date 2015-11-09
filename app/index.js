'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var DrupalVMGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.getDrupal(this.drupalVersion);
      }
    });
  },

  askFor: function () {
    var done = this.async();

    this.log(this.yeoman);
    this.log(chalk.magenta('You\'re using the Drupal generator'));

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

  getDrupalProject: function (drupalProjectRepoURL) {
    if(!drupalProjectRepoURL) return false;

    var repo = drupalProjectRepoURL;

    console.log('Instaling Drupal '+drupalVersion+'. Please wait...');

    require('simple-git')().clone('https://github.com/drupal/drupal.git -b '+drupalVersion+'.x', 'drupal', function(error) {
      if (error) {
        console.log('There was a problem during the installation. Please try again.');
      } else {
        console.log('Installed Drupal succesfully, enjoy it!');
      }
    });

    return false;
  },

  getDrupal: function (drupalVersion) {
    if (!drupalVersion) return false;

    var drupal7Repo = 'https://github.com/drupal/drupal.git -b 7.x',
        drupal8Repo = 'https://github.com/drupal/drupal.git -b 8.0.x';

    console.log('Instaling Drupal '+drupalVersion+'. Please wait...');

    require('simple-git')().clone('https://github.com/drupal/drupal.git -b '+drupalVersion+'.x', 'drupal', function(error) {
      if (error) {
        console.log('There was a problem during the installation. Please try again.');
      } else {
        console.log('Installed Drupal succesfully, enjoy it!');
      }
    });

    return false;
  }
});

module.exports = DrupalVMGenerator;
