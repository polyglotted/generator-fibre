var _ = require('lodash'),
    chalk = require('chalk'),
    exec = require('child_process').exec,
    path = require('path'),
    yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    var done = this.async();

    this.folder = process.cwd();
    this.pkg = require('../package.json');

    require('git-remote-origin-url')(this.folder, function (err, url) {
      if (!err) {
        this.gitUrl = url;
      }

      done();
    }.bind(this));
  },

  prompting: function () {
    var done = this.async();

    var prompts = [{
      name: 'name',
      message: 'What would you like to call this fibre?',
      default: this.folder.split(path.sep).pop()
    }, {
      name: 'repoUrl',
      message: 'What is the git repo URL for this fibre?',
      default: this.gitUrl
    }];

    this.prompt(prompts, function (props) {
      this.props = {
        name: _.kebabCase(props.name),
        nameCamel: _.camelCase(props.name),
        repoUrl: props.repoUrl,
        userName: this.user.git.name(),
        userEmail: this.user.git.email()
      };

      if (!this.gitUrl) {
        exec('git init', {
          cwd: this.folder
        }, function (err) {
          if (err) {
            return done(err);
          }

          if (props.repoUrl) {
            exec('git remote add origin ' + props.repoUrl, {
              cwd: this.folder
            }, function (err) {
              done(err);
            });
          }
        }.bind(this));
      } else {
        done();
      }
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
    this.npmInstall();
  }
});
