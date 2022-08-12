const path = require("path");
const webpack = require("webpack");

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "./static/frontend"),
		filename: "[name].js",
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: "file-loader",
					},
				],
			},
			{
				test: /\.js$/,
				enforce: "pre",
				use: ["source-map-loader"],
			},
		],
	},
	optimization: {
		minimize: true,
	},
	plugins: [
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				// Can change "development" to "production" but causes error
				NODE_ENV: JSON.stringify("development"),
			},

			// "process.env.NODE_ENV": JSON.stringify("production"),
		}),
		// new HtmlWebpackPlugin({
		// 	template: "./src/index.html",
		// }),
	],
};
