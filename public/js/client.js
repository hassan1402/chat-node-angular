'use strict';
var app = angular.module('myApp', []);
app.controller('personCtrl', function($scope) {
	$scope.username = "toto";
	$scope.email = "toto@gmail.com";	
	$scope.messages = [];
	$scope.numberMsg = 0;
	$scope.btn_disconnect_status = true;
	$scope.bnt_nbMsg = "false";
	var message_received = [];

    $scope.connect = function() {  
		var socket = io.connect('http://localhost:8080/',{'forceNew':true });
		$scope.show = "connected"; 
		var user = {name : $scope.username, email: $scope.email};		
		socket.emit('join', user); 
		$scope.btn_connect_status = true;
		$scope.btn_disconnect_status = false;
		$scope.src_connect = "img/on.png";
		$scope.bnt_nbMsg = "true";

		$scope.sendmessage = function() {			
			var message = {name : $scope.username, message: $scope.inputmessages};
			socket.emit('message', message);
			$scope.inputmessages = '';
			console.log( 'SENT TO SERVER : '+JSON.stringify(message) );
			
		}			
	   
		$scope.disconnect = function() {
			$scope.show = "disconnected";
			socket.disconnect();
			$scope.numberMsg = 0;
			$scope.inputmessages = '';
			$scope.messages = '';
			$scope.btn_connect_status = false;
			$scope.btn_disconnect_status = true;
			$scope.src_connect = "img/off.png";
		}

		$scope.nbrMessages = function() {
			$scope.receivedMsg = "true";
			//$scope.$apply(function () {				
				$scope.messages.unshift.apply($scope.messages ,message_received);
				//$scope.messages.length=0;
				$scope.statusMsg = "0 message";
				message_received.length=0;
				$scope.numberMsg = 0;
				console.log('MESSAGES DISPLAYED ');				
			//});			
		}

		socket.on('connect', function(){			
			console.log('Status connection : sent');
		}); 
		
		socket.on('message', function(data){
			$scope.$apply(function () {		
				$scope.numberMsg++;
				$scope.statusMsg = $scope.numberMsg+" message(s)";
	//			$scope.receivedMsg = "true";
				message_received.unshift(data);				
				console.log('FROM SERVER : '+JSON.stringify(data));
			});
		});
		
		socket.on('Ack_connect', function(data){						
			console.log('FROM SERVER Ack_connect : '+JSON.stringify(data));
		});

		socket.on('Ack_message', function(data){						
			console.log('FROM SERVER Ack_message : '+JSON.stringify(data));
		});		
		
		socket.on("disconnect", function(){
			console.log("client disconnected from server");
		});
}
});
