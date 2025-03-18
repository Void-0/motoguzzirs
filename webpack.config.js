const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fs = require('fs');

module.exports = module.exports = (env, argv) => {
  // Detect environment
  const isProduction = argv.mode === "production"; // Still rely on argv.mode for logic

  // Gather HTML files in src/pages
  const pages = fs.readdirSync('./src/pages').filter(fileName => fileName.endsWith('.html'));

  // Generate Webpack entry points dynamically
  function generateEntries() {
    const entries = {
      main: ['./src/js/main.js', './src/css/styles.css'],
    };

    pages.forEach(page => {
      const name = page.replace('.html', '');
      const jsFile = `./src/js/pages/${name}.js`;
      const cssFile = `./src/css/pages/${name}.css`;

      if (fs.existsSync(jsFile)) {
        entries[name] = entries[name] || [];
        entries[name].push(jsFile);
      }
      if (fs.existsSync(cssFile)) {
        entries[name] = entries[name] || [];
        entries[name].push(cssFile);
      }
    });

    return entries;
  }

  // Generate HtmlWebpackPlugin instances for each page
  const htmlPlugins = [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      chunks: ['main'],
      filename: 'index.html',
    }),
    ...pages.map(page => {
      const name = page.replace('.html', '');
      return new HtmlWebpackPlugin({
        template: `./src/pages/${page}`,
        chunks: ['main', name], // Include 'main' chunk for global styles
        filename: page,
      });
    }),
  ];

  // Webpack configuration
  return {
    mode: isProduction ? 'production' : 'development',
    entry: generateEntries(),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].[contenthash].bundle.js',
      publicPath: '/',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            // Keep the folder structure intact and file names unchanged
            filename: 'assets/images/[name][ext][query]',
          },
        },
      ],
    },
    plugins: [
      ...htmlPlugins,
      ...(isProduction
        ? [
          new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
          }),
        ]
        : []),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
      hot: true,
    },
  };
}
