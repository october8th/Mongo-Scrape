$(document).ready(function() {

$('.content').click(showContent);

function showContent(event) {

	var connector = event.target.dataset.content;

	switch (connector) {
		case "search":
			$('#search-form').removeClass('d-none');
			$('#main').addClass('d-none');
			$('#registration-form').addClass('d-none');
			$('#view-condo').addClass('d-none');
			$('#sign-up').addClass('d-none');
			break;

		case "post-prop":
			$('#registration-form').removeClass('d-none');
			$('#main').addClass('d-none');
			$('#search-form').addClass('d-none');
			$('#view-condo').addClass('d-none');
			$('#sign-up').addClass('d-none');
			break;

		case "create-acct":
			$('#sign-up').removeClass('d-none');
			$('#main').addClass('d-none');
			$('#registration-form').addClass('d-none');
			$('#search-form').addClass('d-none');
			$('#view-condo').addClass('d-none');
			break;

		case "home":
			$('#main').removeClass('d-none');
			$('#search-form').addClass('d-none');
			$('#registration-form').addClass('d-none');
			$('#view-condo').addClass('d-none');
			$('#sign-up').addClass('d-none');
	}
}
	
});