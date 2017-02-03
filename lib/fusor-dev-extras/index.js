var fs = require('fs');
var path = require('path');
var spawnSync = require('child_process').spawnSync;

module.exports = {
  name: 'fusor-dev-extras',

  contentFor: function (type, config) {
    const extraSettings = require('../../extra-settings.json');

    // pass in serverLocation via config
    let serverLocation = extraSettings.fusorServer || "localhost";
    if (type === 'head') {
      let headTag =
        '<script type="text/javascript">' +
          'window.fusorServer = "' + serverLocation + '";' +
        '</script>' +
        '<link rel="stylesheet" href="/extras/bootstrap/css/bootstrap.css">' +
        '<link rel="stylesheet" href="/extras/patternfly/css/patternfly.css">' +
        '<link rel="stylesheet" href="/extras/patternfly/css/patternfly-additions.css">' +
        '<script type="text/javascript" src="/extras/bootstrap/js/bootstrap.js" ></script>' +
        '<script type="text/javascript" src="/extras/patternfly/js/patternfly.js" ></script>';
      return headTag;
    } else {
      return '';
    }
  }
};
