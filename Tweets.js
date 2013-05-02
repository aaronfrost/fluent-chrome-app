angular.module('app').factory('Tweets', function($resource){
  return $resource('http://search.twitter.com/search.json');
});