define('templates_dir/helpers/equal', ['hbs/handlebars'], function ( Handlebars ) {
  // Get the size of an object. Source: http://doginthehat.com.au/2012/02/comparison-block-helper-for-handlebars-templates/
  function equal (lvalue, rvalue, options) {
    if (arguments.length < 3) {
      throw new Error("Handlebars Helper equal needs 2 parameters");
    }
    if(lvalue != rvalue ) {
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  }
  Handlebars.registerHelper('equal', equal);
  return equal;
});