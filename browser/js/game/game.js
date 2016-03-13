app.config(function ($stateProvider) {
    $stateProvider.state('game', {
        url: '/game',
        templateUrl: 'js/game/game.html',
        controller: 'gameCtrl'
    });
});

app.controller('gameCtrl', function ($scope, $state, GameFactory, FunnyGifs, $rootScope, localStorageService) {
	$scope.images = _.shuffle(FunnyGifs);
	
    function userMedia(){
        return navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia || null;
    }
    
    var localstream;

    if( userMedia() ){

        var videoPlaying = false;
        var constraints = {
            video: true,
            audio:false
        };

        var video = document.getElementById('v');

        var media = navigator.getUserMedia(constraints, function(stream){

            var url = window.URL || window.webkitURL;

            video.src = url ? url.createObjectURL(stream) : stream;

            video.play();

            videoPlaying = true;

            localstream = stream;

        var checkMood = function() {

            var canvas = document.getElementById('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            var data = canvas.toDataURL('image/jpeg');
            var requestTime = Date.now();
            GameFactory.sendToVision(data)
            .then(function (response) {
            console.log('here')
                if (response.labelAnnotations) {
                	$scope.labels = response.labelAnnotations;
                	$scope.firstLabel = response.labelAnnotations[0].description;
                	$scope.secondLabel = response.labelAnnotations[1].description;  
                }
                if (response.faceAnnotations) {
                	var faceInfo = response.faceAnnotations[0];
                	$scope.joy = faceInfo.joyLikelihood;
                	console.log($scope.joy)
    		        if ($scope.joy !== 'VERY_UNLIKELY') {
                        // pictures.push(video);
                        // localStorageService.set('pics', pictures);
                        // $rootScope.picures = pictures;
                        // console.log(pictures);
                        $rootScope.video = video;
                        $rootScope.time = requestTime - timer;
                        video.pause();
                        videoPlaying  = false;
                        
                        localstream.getTracks()[0].stop();          

                        // clearInterval(refreshIntervalId);
                        $state.go('replay');
                        return;
                    } else {
    		        	$scope.firstMessage = 'You look sad, but you have a nice ' + $scope.firstLabel;
                    }
                }
                
            }).then(function() {
                
                checkMood();
            })
             // document.getElementById('photo').setAttribute('src', data);
        }

        var timer = Date.now();

        checkMood();

        // var refreshIntervalId = setInterval(checkMood, 4000);

            }, function(error){
                console.log("ERROR");
                console.log(error);
            });

        } 


})


app.factory('GameFactory', function ($http) {
	var GameFactory = {};

	GameFactory.sendToVision = function (imgData) {
		return $http.post('/api/vision/', {imgData: imgData})
		.then(function(data){
			// console.log('here', data.data.responses[0])
			return data.data.responses[0];
        /*called for result & error because 200 status*/
        if (data.result){
        	console.log('success', data)
            //handle success here
        } else if (data.error) {
        	console.log('data error')
            //handle error here
	    }
	})
	}
	

	return GameFactory;
})




//look for funny quotes

//turn on camera when get to state

//show giffs

//graph