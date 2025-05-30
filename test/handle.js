const test = require('node:test');
const jsdom = require('jsdom-global');

const handle = require('../');

test('handle', async t => {
  let cleanJsdom;

  t.before(() => {
    cleanJsdom = jsdom();
  });

  t.after(() => {
    cleanJsdom();
  });

  await t.test('create element', t => {
    const h = handle();
    t.assert.equal(document.querySelectorAll('.furkot-map-drag-handle').length, 1);
    h.destroy();
    t.assert.equal(document.querySelectorAll('.furkot-map-drag-handle').length, 0);
  });

  await t.test('use element', t => {
    document.body.innerHTML = '<div id="test">';
    const h = handle({
      el: document.getElementById('test')
    });
    t.assert.equal(document.querySelectorAll('.furkot-map-drag-handle').length, 0);
    h.destroy();
    t.assert.equal(document.querySelectorAll('.furkot-map-drag-handle').length, 0);
    t.assert.ok(document.getElementById('test'));
  });

  await t.test('attach element', t => {
    document.body.innerHTML = '<div id="test">';
    const el = document.getElementById('test');
    const h = handle({
      el: el,
      visibleClass: 'element-visible'
    });
    const handlers = {};
    h.attach({
      on(event, handler) {
        handlers[event] = handler;
      }
    });
    handlers.mouseenter({
      point: {
        x: 0,
        y: 0
      }
    });
    t.assert.equal(el.className, 'element-visible');

    handlers.mouseleave({});
    t.assert.equal(el.className, '');
  });
});
