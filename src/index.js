module.exports = function(packagePath, architectures) {
  // Be aware of not working live reload
  // Meteor is not watching files not included in package api
  // So because of using external files (files api definitions in /files)
  // watch mode is not able to see any changes
  // Tip? You can just change something in package.js file to run live reload
  var path = require('path');
  var fs = require('fs');
  var glob = require('glob');
  var filesPath = path.join(packagePath, 'files');
  var options = {
    encoding: 'utf8'
  };
  var archs = ['server', 'both', 'client'];
  var files = {};

  if (!architectures) {
    architectures = archs;
  }

  for (var i = 0; i < archs.length; i++) {
    if (architectures.indexOf(archs[i]) !== -1) {
      var definitions = JSON.parse(fs.readFileSync(path.join(filesPath, archs[i] + ".json"), options));
      files[archs[i]] = globDefinitions(definitions);
    }
  }

  function globDefinitions(definitions) {
    var files = [];

    for (var i = 0; i < definitions.length; i++) {
      files.push(glob.sync(definitions[i], {
        cwd: packagePath
      }));
    }
    return files.reduce(function(a, b) {
      return a.concat(b);
    });
  }

  return files;
};
