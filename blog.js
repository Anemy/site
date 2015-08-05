/*
This just holds the Javascript for the blog page
@author Rhys
*/

console.log('JS loaded.');

$(document).ready(function() {

	// handle scrolling to articles from quick links on the left
	$('.pastArticle').click(function (event) {
		var articleID = event.target.id.substr(1);
		$('html, body').animate({
        	scrollTop: $('#' + articleID).offset().top - 20
    }, 'slow');
	});
});