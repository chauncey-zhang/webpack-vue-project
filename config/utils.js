var path = require('path')
var glob = require('glob')
var fs = require('fs')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

// 获取项目地址
exports.getProjectPath = () => {
  console.log(fs.realpathSync(process.cwd()))
  return fs.realpathSync(process.cwd())
}

//获取模块路径
exports.getModule = () => {
  return exports.getProjectPath() + '/modules'
}

//获取子模块路径, 如modules/views/test/
exports.getModulePath = () => {
  var moduleName = process.argv[2]
  return exports.getProjectPath() + '/modules/src/' + moduleName
}

//获取子模块的入口文件，如modules/views/test/main.js
exports.getEntry = () => {
  return exports.getModulePath() + '/main.js'
}

//获取子模块的模板文件
exports.getModuleTemplate = (globPath) => {
  var moduleName = process.argv[2]
  globPath = globPath || 'modules/src/' + moduleName 
  var path = glob.sync(globPath + '/index.html')
  if(path.length > 0) {
    return path[0]
  } else {
    //取上级目录下的模板文件路径
    if(globPath.lastIndexOf('/') !== -1) {
      globPath = globPath.substr(0, globPath.lastIndexOf('/'))
      return exports.getModuleTemplate(globPath)
    }
  }
}
//获取生成的文件
exports.getOuputFileName = () => {
  var moduleName = process.argv[2]
  return exports.getProjectPath + `/../${moduleName}/index.html`
}
