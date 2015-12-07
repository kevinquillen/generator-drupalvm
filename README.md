### DrupalVM Generator

This is a Yeoman generator for quickly spawning configured VMs or new projects using [DrupalVM by Jeff Geerling](http://www.drupalvm.com).

#### Getting started

This generator can either jump start a new Drupal project with a Vagrant build for you, or add a Vagrant build to an existing project.

First, you must have npm and yeoman installed. [Follow the docs on the npm site to install Node and NPM](https://docs.npmjs.com/getting-started/installing-node).

Install Yeoman with NPM:
    
    npm install -g yo

Grab this generator with the following command:

    npm install -g generator-drupalvm

Either create or navigate to your project directory, and run the following command to start the generator:

    yo drupalvm

The generator assumes your Drupal application root sits at projectname/docroot.

After running the generator, the Vagrant configuration will live in projectname/tools/drupalvm - at which point you can navigate to that directory and run:

    vagrant up

From here, commit the tools directory to provide the configuration to other people involved on the project. It is intended to provide immediate configuration and unified development environment for project participants, whether they be on Windows, OSX or Linux.

#### Recommended Vagrant Plugins

Before running Vagrant, you might want to install these extra plugins:

* [vagrant-cachier](https://github.com/fgrehm/vagrant-cachier)
* [vagrant-hostsupdater](https://github.com/cogitatio/vagrant-hostsupdater)
* [vagrant-auto\_network](https://github.com/oscar-stack/vagrant-auto_network)
