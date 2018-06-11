/*global document */

module.exports = handle;

function handle(options) {
  var own;

  options = Object.assign({}, options);

  if (!options.el) {
    options.el = document.createElement('div');
    options.el.className = 'furkot-map-drag-handle';
    document.body.appendChild(options.el);
    own = true;
  }

  function destroy() {
    if (own) {
      options.el.parentNode.removeChild(options.el);
    }
  }

  return {
    destroy: destroy
  };
}
