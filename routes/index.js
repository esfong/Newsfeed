var https = require('https');
var soundCloud = require('../lib/soundcloud');
var youTube = require('../lib/youtube');
var flickr = require('../lib/flickr');
var Post = require('../models/post');


module.exports = function(app) {
  /* Renders the newsfeed landing page. */
  app.get('/', function(request, response) {
    response.render('index.html');
  });
  
  /* Obtains search results from YouTube, Soundcloud, and Flickr and renders the results in a dropdown */
  app.get('/search', function(request, response) {
	  var query = request.query.query;
	  var results = [];
	  var counter = 0;
    if (!query) {
      response.send('You must specify a query.', 422);
    } else {
	  soundCloud.search(query, function(error, body) {
	  		  if (error) {
	  			  throw error;
	  		  } else {
	  			  if (counter === 2) {
					  if (body.length > 0) {
						  body[0].api = 'soundcloud';
						  results.push(body[0]);
					  }
					  response.send(results,200);
				  } else {
					  if (body.length > 0) {
						  body[0].api = 'soundcloud';
						  results.push(body[0]);
					  }
					  counter++;
				  }
	  		  }
	  });
	  youTube.search(query, function(error, body) {
	  		  if (error) {
	  			  throw error;
	  		  } else {
				  if (counter === 2) {
					  if (body.length > 0) {
		  				  body[0].api = 'youtube';
		  				  results.push(body[0]);
					  }
					  response.send(results,200);
				  } else {
	  				  if (body.length > 0) {
						  body[0].api = 'youtube';
		  				  results.push(body[0]);
	  				  }
					  counter++;
				  }
			  }
	  });
	  flickr.search(query, function(error, body) {
	  		  if (error) {
	  			  throw error;
	  		  } else {
				  if (counter === 2) {
					  if (body.length > 0) {
		  				  body[0].api = 'flickr';
		  				  results.push(body[0]);
					  }
					  response.send(results,200);
				  } else {
					  if (body.length > 0) {
		  				  body[0].api = 'flickr';
		  				  results.push(body[0]);				  	
					  }
					  counter++;
				  }
			  }
	  });
    }
  });

  /* Returns all posts */
  app.get('/posts', function(request, response) {
	  Post.find(function(error, posts) {
		  if (error) {
			  throw errror;
		  } else {
			  response.send(200, posts);
		  }
	  });
  });
  
  /* Creates a new post based on request information */
  app.post('/posts', function(request, response) {
	  var api = request.body.api;
	  var source = request.body.source;
	  var title = request.body.title;
	  var newPost = new Post({
		  api: api,
		  source: source,
		  title: title,
		  upvotes: 0
	  });
	  if (!api || !source || !title) {
		  response.send(422, 'Must provide api, source, and title parameter');
		  return;		
	  }
	  newPost.save(function(error) {
		  if (error) {
			  throw error;
		  } else {
			  response.send(200, newPost);
		  }
	  });
  });
  
  /* Removes a post based on request's ID */
  app.post('/posts/remove', function(request, response) {
	  var id = request.body.id;
	  if (!id) {
		  response.send(404, 'Must provide a valid id');
		  return;
	  }
	  Post.findByIdAndRemove(id, function(error) {
		  if (error) {
			  throw error;
		  } else {
			  response.send(200);
		  }
	  });
  });

  /* Upvotes a post based on request's ID */
  app.post('/posts/upvote', function(request, response) {
	  var id = request.body.id;
	  if (!id) {
		  response.send(404, 'Must provide a valid id');
		  return;
	  }
	  Post.findById(id, function(error, post) {
		  if (error) {
			  throw error;
		  } else {
			  post.upvotes++;
			  post.save(function(error) {
				  if(error) {
					  throw error;
				  }
			  });
			  response.send(200, post);
		  }
	  });
  });
};