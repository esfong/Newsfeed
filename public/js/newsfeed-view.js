(function(window, document, undefined) {
  var NewsfeedView = {};

  /* Renders the newsfeed into the given $newsfeed element. */
  NewsfeedView.render = function($newsfeed) {
    PostModel.loadAll(function(error, posts) {
			posts.forEach(function(post) {
				NewsfeedView.renderPost($newsfeed, post, false);
			});
    });
	$newsfeed.imagesLoaded(function() {
		$newsfeed.masonry({
	      columnWidth: '.post',
	      itemSelector: '.post'
	    });
	});	  
  };

  /* Given post information, renders a post element into $newsfeed. */
  NewsfeedView.renderPost = function($newsfeed, post, updateMasonry) {
	var $newsFeedTemplate = $('#newsfeed-post-template');
	var newsFeedTemplate = $newsFeedTemplate[0];
    var renderNewsFeedTemplate = Handlebars.compile(newsFeedTemplate.innerHTML);
	var $post = $(renderNewsFeedTemplate(post));

	$newsfeed.prepend($post);

	$post.click(function(event) {
		if ($(event.target).attr('class') === 'fa fa-trash') {
			PostModel.remove(post._id,function(error) {
				if (error) {
					var errorDiv = document.querySelector('div.error');
					errorDiv.innerHTML = error;
				} else {
					$newsfeed.masonry('remove', $post);
					$newsfeed.masonry();
				}
			});
		} else if ($(event.target).attr('class') === 'upvote-count' || $(event.target).attr('class') === 'fa fa-chevron-up' || $(event.target).attr('class') === 'upvote') {
			PostModel.upvote(post._id,function(error) {
				if (error) {
					var errorDiv = document.querySelector('div.error');
					errorDiv.innerHTML = error;
				} else {
					var $upvoteCount = $post.find('.upvote-count');
					var upvoteCount = $upvoteCount.html();
					upvoteCount++;
					$upvoteCount.html(upvoteCount);	
				}
			});
		}	
	});
	
	if (updateMasonry) {
      $newsfeed.imagesLoaded(function() {
        $newsfeed.masonry('prepended', $post);
	});
  }
};

  window.NewsfeedView = NewsfeedView;
})(this, this.document);
