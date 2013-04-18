(function( $ ){
    $.fn.blur_reset = function( method ) {
        return this.each(function() {
            var $this = $(this);
            $this.val($this.data('default_value.default'));
        });
    };
    
    $.fn.blur_default = function( method ) {
        return this.each(function() {
            var $this = $(this);
            var def = $this.val();
            $this.data('default_value.default', def);
            $this.css('color', '#AAA');
            $this.bind('click.default', function() {
                if ($this.val() == def) {
                    $this.val('');
                    $this.css('color', 'black');
                }
            });
            $this.bind('blur.default', function() {
                if ($this.val().trim().length == 0) {
                    $this.val(def);
                    $this.css('color', '#AAA');
                }
            });
        });
    };
})( jQuery );