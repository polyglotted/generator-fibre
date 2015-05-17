var _ = require('lodash'),
    chalk = require('chalk'),
    path = require('path'),
    yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async(),
        folder = process.cwd();

    var prompts = [{
      name: 'name',
      message: 'What would you like to call this fibre?',
      default: folder.split(path.sep).pop()
    }, {
      name: 'repoUrl',
      message: 'What is the git repo URL for this fibre?',
      default: function () {
        var done = this.async(),
            originUrl = require('git-remote-origin-url');

        originUrl(folder, function (err, url) {
          if (err) {
            done(err);
          } else {
            done(url);
          }
        });
      }
    }];

    this.prompt(prompts, function (props) {
      this.props = {
        name: _.kebabCase(props.name),
        nameCamel: _.camelCase(props.name),
        repoUrl: props.repoUrl,
        userName: this.user.git.name(),
        userEmail: this.user.git.email()
      };

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      [
        '.editorconfig',
        '.gitignore',
        '.travis.yml',
        'gulpfile.js',
        'package.json',
        'README.md'
      ]
        .forEach(function (file) {
          this.fs.copyTpl(
            this.templatePath(file),
            this.destinationPath(file),
            this.props
          );
        }.bind(this));
    },

    projectfiles: function () {
      this.fs.copyTpl(
        this.templatePath('test.spec.es6'),
        this.destinationPath('test/spec/' + this.props.name + '.spec.es6'),
        this.props
      );
      this.fs.write(this.destinationPath('src/' + this.props.name + '.es6'), '');
    }
  },

  install: function () {
    this.installDependencies();
  }
});
