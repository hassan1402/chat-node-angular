'use strict';
var app = angular.module('myApp', []);
app.controller('personCtrl', function($scope) {
	$scope.username = "toto";
	$scope.email = "toto@gmail.com";	
	$scope.messages = "";

    $scope.connect = function() {  
		var socket = io.connect('http://localhost:8080',{'forceNew':true });
		$scope.show = "connected"; 
		var user = {from : $scope.username, email: $scope.email};		
		socket.emit('join', user);  	

		$scope.sendmessage = function() {        
			var message = {from : $scope.username, message: $scope.inputmessages};
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
			$scope.user_name = "name";
			$scope.user_message = $scope.messages+ 'From : '+data.from+' Message : '+data.message+' time : '+data.time;
			console.log('FROM SERVER : '+JSON.stringify(data));
			 $scope.chats.unshift({name:data.name, message:data.msg});
			//socket.emit('message', 'received');
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
