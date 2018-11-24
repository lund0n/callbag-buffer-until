const isTest = String(process.env.NODE_ENV) === 'test'
const isProd = String(process.env.NODE_ENV) === 'production'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      { loose: true, modules: isTest ? 'commonjs' : false },
    ],
  ],
}
