module.exports = function(theme, file) {
  var globby = require('globby'),
      fs     = require('fs');

  function findDependencies(file, dependencyTree) {
    var content = fs.readFileSync(file, 'utf8'),
        path    = file.replace(/(\/[^/]+\..*)/g, ''),
        regex   = /(?:\n@import )(?:'|")(.*)(?:'|")/g,
        result  = '',
        imports = [];

    while (result = regex.exec(content)) {
      var fullPath = '';
      if (result[1].match(/\.\.\//g)) {
        var parentPath = path,
            filePath   = result[1];

        while (filePath.match(/\.\.\//g)) {
          parentPath = parentPath.replace(/\/[^\/]+$/g, '');
          filePath = filePath.replace(/\.\.\//, '');
          fullPath = parentPath + '/' + filePath;
        }
      }
      else {
        fullPath = path + '/' + result[1];
      }
      imports.push(fullPath);
    }
    imports.forEach(el => {
      imports = imports.concat(findDependencies(el, dependencyTree));
    });

    dependencyTree = dependencyTree.concat(file);
    dependencyTree = dependencyTree.concat(imports);

    return dependencyTree;
  }

  if (theme.lang === 'less' || theme.lang === 'scss') {
    return findDependencies(file, []);
  }
  else {
    return [theme.src + '/**/*.' + theme.lang];
  }
};
