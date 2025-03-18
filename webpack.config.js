const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  // Gather HTML files in src/pages
  const pages = fs.readdirSync('./src/pages').filter((fileName) => fileName.endsWith('.html'));

  // Generate Webpack entry points dynamically
  function generateEntries() {
    const entries = {
      main: [ './src/js/main.js', './src/css/styles.scss' ],
    };

    pages.forEach((page) => {
      const name = page.replace('.html', '');
      const jsFile = `./src/js/pages/${name}.js`;
      const cssFile = `./src/css/pages/${name}.scss`;

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
      chunks: [ 'main' ],
      filename: 'index.html',
    }),
    ...pages.map((page) => {
      const name = page.replace('.html', '');
      return new HtmlWebpackPlugin({
        template: `./src/pages/${page}`,
        chunks: [ 'main', name ], // Include 'main' chunk for global styles
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
      filename: 'js/[name].[contenthash].js', // Hashing remains for JS files
      publicPath: './',
      assetModuleFilename: 'assets/[name][ext]', // Ensure NO hash for assets in assets folder
      clean: true, // Clears old build files
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isProduction ? {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: '../', // Ensure correct path for extracted CSS
              },
            } : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: {
                  // Only process `url()` in CSS that are NOT in the `assets` folder
                  filter: (url) => !url.includes('assets/'),
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('postcss-url')({
                      url: (asset) => {
                        // Ensure paths stay absolute or relative to `assets/`
                        if (asset.url.includes('assets/')) {
                          return asset.url;
                        }
                        return asset.relative;
                      },
                    }),
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                url: {
                  filter: (url) => !url.includes('assets/'),
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            // Ensure no hashing for assets in `assets/` folder
            filename: (pathData) => {
              const filePath = pathData.filename.replace('src/', '');
              if (filePath.startsWith('assets/')) {
                return filePath; // Maintain `assets/...`
              }
              return 'assets/[name].[contenthash][ext]'; // Apply hashing elsewhere
            },
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
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'src/assets'),
            to: 'assets', // Copy `assets/` folder exactly as it is
          },
          {
            from: path.resolve(__dirname, 'CNAME'),
            to: '.', // Optional for GitHub Pages
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'docs'),
      },
      compress: true,
      port: 9000,
      hot: true,
    },
  };
};
