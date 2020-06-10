// 发布阶段的插件
const prodPlugins = []
// 发布模式
if (process.env.NODE_ENV === 'production') {
    prodPlugins.push(['transform-remove-console'])
}

module.exports = {
    presets: ['@vue/cli-plugin-babel/preset'],
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ],
        // 发布产品时候发布的插件数组
        ...prodPlugins,
        ['@babel/plugin-syntax-dynamic-import']
    ]
}
