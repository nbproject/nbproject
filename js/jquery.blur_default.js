(function( $ ){
    $.fn.setCursorPosition = function(pos) {
        if ($(this).get(0).setSelectionRange) {
                $(this).get(0).setSelectionRange(pos, pos);
        } else if ($(this).get(0).createTextRange) {
            var range = $(this).get(0).createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }

    $.fn.blur_reset = function( method ) {
        return this.each(function() {
            var $this = $(this);
            $this.val($this.data('default_value.blur_default'));
            $this.css('color', '#AAA');
        });
    };

    $.fn.get_default = function( method ) {
        return $(this).data('default_value.blur_default');
    };
    
    $.fn.blur_default = function( method ) {
        return this.each(function() {
            var $this = $(this);
            var def = $this.val();
            $this.data('default_value.blur_default', def);
            $this.css('color', '#AAA');
            $this.bind('click.blur_default', function() {
                console.log('click');
                if ($this.val() == def) {
                    $this.setCursorPosition(0);
                }
            });
            $this.bind('keypress.blur_default', function() {
                console.log('keypress');
                if ($this.val() == def) {
                    $this.val('');
                    $this.css('color', 'black');
                    $this.css('font-weight', 'normal');
                }
            });
            $this.bind('blur.blur_default', function() {
                console.log('blur');
                if ($this.val().trim().length == 0) {
                    $this.val(def);
                    $this.css('color', '#AAA');
                }
            });
        });
    };
})( jQuery );