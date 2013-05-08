

$(document).ready(function() {
    
    $('#tabTodo').click(function(evt) {
    	window.location = 'index.html';
    });
    
    $('#manageFamily').click(function(evt) {
        window.location = 'manage_family.html';
    });

    $('#titleButton').click(function(evt) {
    	window.location = 'index.html';
    });

    
    $('.profile').click(function(evt) {
        window.location = 'member_history.html?member=' + evt.target.id.slice(3);
    });
});