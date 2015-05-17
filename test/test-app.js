var _ = require('lodash'),
    assert = require('yeoman-generator').assert,
    helpers = require('yeoman-generator').test,
    path = require('path'),
    os = require('os');

describe('fibre:app', function () {
  var name = 'foo bar',
      slug = _.kebabCase(name);

  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .withOptions({ skipInstall: true })
      .withPrompts({ 
        name: name,
        repoUrl: 'foobar'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      '.editorconfig',
      '.gitignore',
      '.travis.yml',
      'gulpfile.js',
      'package.json',
      'README.md',
      'src/' + slug + '.es6',
      'test/spec/' + slug + '.spec.es6'
    ]);
  });

  it('templates files', function () {
      assert.fileContent('package.json', '"name": "' + slug + '"');
      assert.fileContent('README.md', '# ' + slug);
      assert.fileContent('test/spec/' + slug + '.spec.es6', 'describe(\'' + slug + '\'');
      assert.fileContent('test/spec/' + slug + '.spec.es6', 'import ' + _.camelCase(name));
  });
});
