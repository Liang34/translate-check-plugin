### 翻译检查插件

#### 背景

之前在部门开发时有多语言的需求，每次在开发时，需要产品将翻译文案选出来，由翻译团队翻译，再交由评审，研发录入文案，但是开发一个模块难免会有漏掉的文案，漏掉的文案会重新走一遍流程，并且有时候是提测还存在未翻译的内容，并且研发或者测试均需要通过肉眼来判断，效率较低，于是开发了这个插件，支持查看还存在哪些未翻译的文案。

#### 用法：

npm install translate-check-plugin

```js
// webpack.config.js
const TranslateCheckPlugin = require('./plugin/translate-check-plugin');
plugins: [
        new MyPlugin({
	    // 翻译文件的路径
            translate: path.resolve(__dirname, './local/zh-cn.json'),
        })
    ]
```
