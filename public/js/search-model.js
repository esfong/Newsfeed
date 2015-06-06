(function(window, document, undefined) {
  var SearchModel = {};

  var SEARCH_URL = '/search';
  var STATUS_OK = 200;

  /**
   * Loads API search results for a given query.
   *
   * Calls: callback(error, results)
   *  error -- the error that occurred or NULL if no error occurred
   *  results -- an array of search results
   */
  SearchModel.search = function(query, callback) {
	  var searchParams = encodeURIComponent(query);
	  var searchRequest = new XMLHttpRequest();
      searchRequest.addEventListener("load", function() {
        if (searchRequest.status !== STATUS_OK) {
			callback('Invalid status code: ' + searchRequest.status);
        } else {
			callback(null,JSON.parse(searchRequest.responseText));
        }
      });
      searchRequest.open('GET', "/search?query=" + searchParams);
      searchRequest.send();
  };

  window.SearchModel = SearchModel;
})(this, this.document);
