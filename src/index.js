/* eslint-disable global-require, import/no-dynamic-require */

const { execSync } = require('child_process')

/**
 * Returns a flat array of all Node module dependency names for the entire
 * dependency tree, optionally filtered by top-level modules. Requires NPM
 * and for dependencies to be installed.
 *
 * @param {Array} moduleFilter - An optional array of top-level module names
 *   whose dependencies should be included. If specified, any other modules'
 *   dependencies will be excluded.
 * @return {String[]} An array of module names
 */
const getAllDependencies = (moduleFilter = []) => {
  // Get the full dependency tree using NPM, excluding dev dependencies
  // and peer dependencies.
  const dependencyTree = JSON.parse(execSync('npm ls --prod --json').toString())

  // Only get dependencies for specific top-level modules, if specified.
  const dependencyTreeFiltered = moduleFilter.length
    ? {
        ...dependencyTree,
        dependencies: Object.keys(dependencyTree.dependencies)
          .filter((key) => moduleFilter.includes(key))
          .reduce((obj, key) => {
            // eslint-disable-next-line no-param-reassign
            obj[key] = dependencyTree.dependencies[key]
            return obj
          }, {}),
      }
    : dependencyTree

  const allChildDeps = []
  const getAllChildDependencies = (depTree) => {
    const nextDeps = depTree.dependencies
    if (!nextDeps || !Object.keys(nextDeps).length) {
      return []
    }
    Object.entries(nextDeps).forEach(([childDep, childDepTree]) => {
      allChildDeps.push(childDep)
      getAllChildDependencies(childDepTree)
    })
    return allChildDeps
  }

  return getAllChildDependencies(dependencyTreeFiltered)
}

module.exports = getAllDependencies
