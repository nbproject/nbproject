define('templates_dir/helpers/size', ['hbs/handlebars'], function ( Handlebars ) {
  // Get the size of an object. Source: https://gist.github.com/tracend/71e3cb5069edaa0bceae
  function size ( context, options ) {
    // prerequisite
    if( typeof context != "object" ) return;
    var size = 0, key;
    for (key in context) {
      if (context.hasOwnProperty(key)){
        size++;
      }
    }
    return size;
  }
  Handlebars.registerHelper('size', size);
  return size;
});