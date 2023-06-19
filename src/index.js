const CHECK_I18_NAME = "namespaceIntl";
const trans = require('../local/zh-cn.json')
class MyPlugin {
    apply(compiler) {
        compiler.hooks.emit.tapAsync('myplugin', (compilation, cb) => {
            //可遍历出所有的资源名
            // for (var filename in compilation.assets) {
            //     console.log('name==', filename) 
            // }
            // console.log(compilation.assets)
            compilation.chunks.forEach(function (chunk) {
                chunk.files.forEach(function (filename) {
                    // compilation.assets 存放当前所有即将输出的资源
                    // 调用一个输出资源的 source() 方法能获取到输出资源的内容
                    let source = compilation.assets[filename].source();
                    const reg = new RegExp(/namespaceIntl\((.+?)\)/g);
                    // 匹配到的内容
                    const matchArr = source.match(reg);
                    const unResolve = matchArr.reduce((pre, cur) => {
                        const str = cur.match(/"(.*)\\/)[1];
                        if(!trans.hasOwnProperty(str)) {
                            pre.push(str)
                        }
                        return pre;
                    }, []);
                    const translateRate = unResolve.length / matchArr.length;
                    
                    compilation.assets[filename] = {
                        source: function () {
                            return source
                        },
                        size: function () {
                            return source.length
                        }
                    }
                });
            })
            cb()
        });
        compiler.hooks.done.tap('myplugin', (compilation) => {
            console.log('webpack 构建完毕！');
        });
    }
}
module.exports = MyPlugin;