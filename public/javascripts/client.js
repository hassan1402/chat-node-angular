'use strict';
var app = angular.module('myApp', []);
app.controller('personCtrl', function($scope) {
	$scope.username = "toto";
	$scope.email = "toto@gmail.com";	
	$scope.messages = [];
	$scope.numberMsg = 0;

    $scope.connect = function() {  
		var socket = io.connect('http://localhost:8080',{'forceNew':true });
		$scope.show = "connected"; 
		var user = {name : $scope.username, email: $scope.email};		
		socket.emit('join', user);  	

		$scope.sendmessage = function() {			
			var message = {name : $scope.username, message: $scope.inputmessages};
			socket.emit('message', message);
			console.log( 'SENT TO SERVER : '+JSON.stringify(message) );
			
		}			
	   
		$scope.disconnect = function() {
			$scope.show = "disconnected";
			socket.disconnect();
		}

		socket.on('connect', function(){			
			console.log('Status connection : sent');
		}); 
		
		socket.on('message', function(data){
			$scope.numberMsg++;
			$scope.$apply(function () {			
				$scope.messages.unshift(data);
				console.log('FROM SERVER : '+JSON.stringify(data));
				$scope.show = $scope.numberMsg+' message(s) received';
			 });
		});
		
		socket.on('Ack_connect', function(data){						
			console.log('FROM SERVER : '+JSON.stringify(data));
		});

		socket.on('Ack_message', function(data){						
			console.log('FROM SERVER : '+JSON.stringify(data));
		});		
		
		socket.on("disconnect", function(){
			console.log("client disconnected from server");
		});
}
});
