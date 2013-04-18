(function( $ ){
    function setSelectionRange(input, selectionStart, selectionEnd) {
      if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
      }
      else if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
      }
    }

    function setCaretToPos (input, pos) {
      setSelectionRange(input, pos, pos);
    }
    $.fn.blur_reset = function( method ) {
        return this.each(function() {
            var $this = $(this);
            $this.val($this.data('default_value.blur_default'));
        });
    };
    
    $.fn.blur_default = function( method ) {
        return this.each(function() {
            var $this = $(this);
            var def = $this.val();
            $this.data('default_value.blur_default', def);
            $this.css('color', '#AAA');
            $this.bind('click.blur_default', function() {
                if ($this.val() == def) {
                    setCaretToPos($this, 1);
                }
            });
            $this.bind('keypress.blur_default', function() {
                if ($this.val() == def) {
                    $this.val(String.fromCharCode(event.which));
                    $this.css('color', 'black');
                }
            });
            $this.bind('blur.blur_default', function() {
                if ($this.val().trim().length == 0) {
                    $this.val(def);
                    $this.css('color', '#AAA');
                }
            });
        });
    };
})( jQuery );