const CHECK_I18_NAME = "namespaceIntl";
const DEFAULT_TRANSLATE_FILE = '../local/zh-cn.json';
const path = require('path');
const ejs = require('ejs')
const fs = require('fs')
class TranslateCheckPlugin {
    constructor(options) {
        // 需要传翻译的文件地址
        this.options = options;
    }
    apply(compiler) {
        compiler.hooks.emit.tapAsync('translate-check-plugin', (compilation, cb) => {
            const translateFile = this.options.translate || DEFAULT_TRANSLATE_FILE
            const trans = require(translateFile)
            compilation.chunks.forEach(function (chunk) {
                chunk.files.forEach(async (filename) => {
                    // compilation.assets 存放当前所有即将输出的资源
                    // 调用一个输出资源的 source() 方法能获取到输出资源的内容
                    let source = compilation.assets[filename].source();
                    // 暂时先写死namespaceIntl，好像没有其他方法
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
                    // 渲染结果
                    let renderTemp = await ejs.renderFile(
                        path.resolve(__dirname, './template.html'),
                        {
                            total: matchArr.length,
                            unResolve: unResolve.length,
                            unResolveLists: unResolve
                        }
                    )
                    // 这里生成路径直接使用终端目录./checkRes.html
                    fs.writeFile('./checkRes.html', renderTemp, e => {
                        if(e) {
                            throw new Error(e)
                        }
                    })
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
        compiler.hooks.done.tap('translate-check-plugin', (compilation) => {
            console.log('多语言检查完成，可在checkRes.html中查看未翻译的文案');
        });
    }
}
module.exports = TranslateCheckPlugin;
