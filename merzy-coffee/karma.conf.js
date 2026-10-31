// Karma configuration — MERZY frontend.
// ChromeHeadlessNoSandbox: CI runners ship a SUID sandbox that fails inside
// unprivileged containers; this launcher runs Chrome with --no-sandbox only
// for the headless test runner (human browsers are unaffected).
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {},
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    jasmine: {},
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/merzy'),
      reportsDir: require('path').join(__dirname, './coverage/merzy'),
    },
    reporters: ['progress'],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
        ],
      },
    },
    restartOnFileChange: true,
  });
};
