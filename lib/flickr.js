var request = require('request');

var FLICKR_URL = 'https://api.flickr.com/services/rest/?';
var FLICKR_API_KEY = '3cffcc97867ea6aaf3d7fa2690f0ae10';
var STATUS_OK = 200;

/**
 * Queries Flickr for photos that match the given query.
 *
 * @param query -- the search query to send to Flickr
 *
 * Calls @param callback(error, results):
 *  error -- the error that occurred or null if no error
 *  results -- if error is null, contains the search results
 */
exports.search = function(query, callback) {
    var params = {
		api_key: FLICKR_API_KEY,
		text: query,
		method: 'flickr.photos.search',
		format: 'json',
		media: 'photos',
		sort: 'relevance',
		nojsoncallback: 1
    };

    request.get({
      url: FLICKR_URL,
      qs: params
    }, function(error, response, body) {
      if (error) {
        callback(error);
      } else if (response.statusCode != 200) {
        callback(new Exception('Received bad status code: ' + response.statusCode));
      } else {
		  var flickrResults = JSON.parse(body).photos.photo;
		  var flickrPhotos = [];
		  flickrResults.forEach(function(result) {
			  var flickrPhoto = {};
			  flickrPhoto.title = result.title;
			  flickrPhoto.source = 'https://farm' + result.farm + '.staticflickr.com/' + result.server + '/' + result.id + '_' + result.secret + '_z.jpg';
			  flickrPhotos.push(flickrPhoto);
		  });
        callback(null, flickrPhotos);
      }
    });
};