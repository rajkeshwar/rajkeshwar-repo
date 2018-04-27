Script for ng ejected webpack

```ts
"scripts": {
  "build": "webpack --config webpack.dev.config",
  "watch": "webpack --watch --config webpack.dev.config",
  "build:prod": "webpack --config webpack.prod.config",
  "start": "webpack-dev-server --port=4200 --config webpack.dev.config",
  "test": "karma start ./karma.conf.js",
  "pree2e": "webdriver-manager update --standalone false --gecko false --quiet",
  "e2e": "protractor ./protractor.conf.js"
}
```

# find and delete all .DS_store recursively
https://jonbellah.com/articles/recursively-remove-ds-store/
