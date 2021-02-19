module.exports = {
	mode: "development",
	target: "electron-renderer", // 打包 electron 时可调用模块化
	entry: {
		main: __dirname + "/source/main.ts",
		config: __dirname + "/source/config.ts"
	},
	output: {
		path: __dirname + "/dist/web",
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: {
					loader: "ts-loader"
				}
			}
		]
	},
	resolve: {
		extensions: [".ts"],
	}
}