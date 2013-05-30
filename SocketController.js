angular.module('app').controller('SocketCtrl', function($scope){
	
	sock = new SockJS('http://troller.hp.af.cm/echo');
	sock.onopen = function() {
	   // console.log('open');
	   sock.send(JSON.stringify({type:'master'}));
	};
	sock.onmessage = function(e) {
		// console.log(e);
		var m = JSON.parse(e.data);
		var votes = m.data;
		switch(m.type) {
			case 'update_votes' :
				$scope.socketVoteCount+=1;
				$scope.socketVotes = m.data;
				playSound(screamingBuffer);
				break;
			case 'master_init' :
				$scope.socketVotes = m.data;
				$scope.votingOn = m.votingOn;
				break;
			default :
				// console.log('unknown message', e);
				break;
	   	}
	};
	sock.onclose = function() {
	   // console.log('close');
	};



	$scope.votingOn = false;
	$scope.socketVoteCount = 0;
	$scope.toggleVoting = function(){
		sock.send(JSON.stringify({type:'voting_on', data: {on: !$scope.votingOn}}));
		$scope.votingOn = !$scope.votingOn;
	}
	
});

function postUpdate(message){

}