/*
This just holds the Javascript for the blog page
@author Rhys
*/


// Opens passed URL in a new tab
var openURL = function (URL) {
	var redirectWindow = window.open(URL, '_blank');
	redirectWindow.location;
};

$(document).ready(function() {

	// handle scrolling to articles from quick links on the left
	$('.pastArticle').click(function (event) {
		var articleID = event.target.id.substr(1);
		$('html, body').animate({
        	scrollTop: $('#' + articleID).offset().top - 20
    }, 'slow');
	});

	// handle clicking on article images (opens raw source in new tab)
	$('.articleImage').click(function (event) {
		var articleSRC = $(event.target).attr('src');

		var redirectWindow = window.open(articleSRC, '_blank');
		redirectWindow.location;
	});

	console.log('JS loaded.');
});