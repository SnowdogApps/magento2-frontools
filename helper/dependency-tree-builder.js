'use strict';
module.exports = function(plugins, file) { // eslint-disable-line func-names
  function findDependencies(file, dependencyTree) {
    if (plugins.fs.existsSync(file)) {
      const content = plugins.fs.readFileSync(file, 'utf8'),
            path    = file.replace(/(.*)\/.*/g, '$1'),
            regex   = /^(?:\s*@import )(?:'|")(.*)(?:'|")/gm;

      let result  = regex.exec(content),
          imports = [];

      while (result) {
        let fullPath = '';
        if (result[1].includes('../')) {
          let parentPath = path,
              filePath   = result[1];

          while (filePath.includes('../')) {
            parentPath = parentPath.replace(/\/[^/]+$/g, '');
            filePath = filePath.replace(/\.\.\//, '');
            const filePathParts = /(.*)\/(.*)/g.exec(filePath);
            if (filePathParts) {
              fullPath = parentPath + '/' + filePathParts[1] + '/_' + filePathParts[filePathParts.length - 1] + '.scss';
            }
            else {
              fullPath = parentPath + '/_' + filePath + '.scss';
            }
          }
        }
        else {
          if (result[1].includes('/')) {
            const filePath = /(.*)\/(.*)/g.exec(result[1]);
            fullPath = path + '/' + filePath[1] + '/_' + filePath[filePath.length - 1] + '.scss';
          }
          else {
            fullPath = path + '/_' + result[1] + '.scss';
          }
        }
        imports.push(fullPath);
        result = regex.exec(content);
      }

      imports.forEach(el => {
        imports = imports.concat(findDependencies(el, dependencyTree));
      });

      dependencyTree = dependencyTree.concat(file);
      dependencyTree = dependencyTree.concat(imports);
    }
    return dependencyTree;
  }

  return findDependencies(file, []);
};
