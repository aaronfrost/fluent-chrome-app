angular.module('app').controller('TweetController', function($scope, Tweets){
	console.log('setting up crap');
	$scope.tweets = [];
	$scope.likeCount = 0,
	$scope.umCount = 0, 
	$scope.soCount = 0, 
	$scope.uhCount = 0;

	var tweetToShow = [];
	var showTweetInterval = setInterval(function(){
		var tweet = tweetToShow.pop();
		if(tweet) tweet.height = 'shrink grow';
		$scope.$apply();
	}, 200);

	localStorage.removeItem('max_id');
	$scope.tweetInterval = setInterval(function(){
		console.log('Here I Am');
		var options = {
			"q":"#openwestconf #gigawatts" 
		};
		var sinceId = localStorage.getItem('max_id') || 0;
		console.log(sinceId);
		if(sinceId) options['since_id'] = sinceId;

		var result = Tweets.get(options, function(){
			console.log('result',result);
			result.results.forEach(function(tweet){
				if(/(\b)(like|so|um|uh)(\b)/g.exec(tweet.text)){
					if(/(\b)(like)(\b)/g.exec(tweet.text)){
						$scope.likeCount +=1;	
					}
					if(/(\b)(um)(\b)/g.exec(tweet.text)){
						$scope.umCount +=1	
					}
					if(/(\b)(so)(\b)/g.exec(tweet.text)){
						$scope.soCount +=1;
					}
					if(/(\b)(uh)(\b)/g.exec(tweet.text)){
						$scope.uhCount +=1;
					}
					tweet.height = 'shrink';
					$scope.tweets.unshift(tweet);
					tweetToShow.unshift(tweet);
					playSound(screamingBuffer);

				}
			});
			localStorage.setItem('max_id', result.max_id_str);
		});
	}, 1500);

});