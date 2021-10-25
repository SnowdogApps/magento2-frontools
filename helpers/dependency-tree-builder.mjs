import fs from 'fs-extra'
import path from 'path'

function findDependencies(file, dependencyTree) {
  if (!fs.existsSync(file)) {
    return dependencyTree
  }

  const content = fs.readFileSync(file, 'utf8')
  const srcPath = file.replace(/(.*)\/.*/g, '$1')
  const regex = /^(?:\s*@import )(?:'|")(.*)(?:'|")/gm

  let result = regex.exec(content)
  let imports = []

  while (result) {
    let fullPath = ''
    if (result[1].includes('../')) {
      let parentPath = srcPath
      let filePath = result[1]

      while (filePath.includes('../')) {
        parentPath = parentPath.replace(/\/[^/]+$/g, '')
        filePath = filePath.replace(/\.\.\//, '')
        const filePathParts = /(.*)\/(.*)/g.exec(filePath)
        if (filePathParts) {
          fullPath = path.join(parentPath, filePathParts[1], `_${filePathParts[filePathParts.length - 1]}.scss`)
        }
        else {
          fullPath = path.join(parentPath, `_${filePath}.scss`)
        }
      }
    }
    else {
      if (result[1].includes('/')) {
        const filePath = /(.*)\/(.*)/g.exec(result[1])
        fullPath = path.join(srcPath, filePath[1], `_${filePath[filePath.length - 1]}.scss`)
      }
      else {
        fullPath = path.join(srcPath, `_${result[1]}.scss`)
      }
    }
    imports.push(fullPath)
    result = regex.exec(content)
  }

  imports.forEach(el => {
    imports = imports.concat(findDependencies(el, dependencyTree))
  })

  dependencyTree = dependencyTree.concat(file)
  dependencyTree = dependencyTree.concat(imports)

  return dependencyTree
}

export default file => {
  return findDependencies(file, [])
}
