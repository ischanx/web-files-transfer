const path = require("path");

function resolve (dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  publicPath: "/",
  outputDir: "dist",
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set("@", resolve("src"));
  },
  devServer: {

    open: false, // 自动打开浏览
  },
  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",
      // 模板来源
      template: "index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "轻传 - 网页文件传输工具",
    },
  },
};
