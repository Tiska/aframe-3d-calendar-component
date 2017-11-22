/* global assert, setup, suite, test */
require('aframe');
require('../index.js');
var entityFactory = require('./helpers').entityFactory;

suite('aframe-3d-calendar-component component', function () {
  var component;
  var el;

  setup(function (done) {
    el = entityFactory();
    el.addEventListener('componentinitialized', function (evt) {
      if (evt.detail.name !== 'aframe-3d-calendar-component') { return; }
      component = el.components['aframe-3d-calendar-component'];
      done();
    });
    el.setAttribute('aframe-3d-calendar-component', {});
  });

  suite('foo property', function () {
    test('is good', function () {
      assert.equal(1, 1);
    });
  });
});
