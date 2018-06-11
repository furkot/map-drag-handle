/*global document */

module.exports = handle;

function handle(options) {

  options = Object.assign({}, options);

  if (!options.el) {
    options.el = document.createElement('div');
    options.el.className = 'furkot-map-drag-handle';
    document.body.appendChild(options.el);
  }
}
