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
        '<link rel="stylesheet" href="/extras/patternfly/components/bootstrap/dist/css/bootstrap.css">' +
        '<link rel="stylesheet" href="/extras/patternfly/dist/css/patternfly.css">' +
        '<link rel="stylesheet" href="/extras/patternfly/dist/css/patternfly-additions.css">' +
        '<script type="text/javascript" src="/extras/patternfly/components/jquery/dist/jquery.js" ></script>' +
        '<script type="text/javascript" src="/extras/patternfly/components/bootstrap/dist/js/bootstrap.js" ></script>' +
        '<script type="text/javascript" src="/extras/patternfly/components/bootstrap/dist/js/bootstrap.js" ></script>' +
        '<script type="text/javascript" src="/extras/patternfly/dist/js/patternfly.js" ></script>';
      return headTag;
    } else {
      return '';
    }
  }
};
