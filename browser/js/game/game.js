app.config(function ($stateProvider) {
    $stateProvider.state('game', {
        url: '/game',
        templateUrl: 'js/game/game.html',
        controller: 'gameCtrl'
    });
});

app.controller('gameCtrl', function ($scope, GameFactory, FunnyGifs) {
	// $scope.imgData = '';
	// $scope.cameraOn = function () {
        function userMedia(){
            return navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia || null;
        }

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

                // Start the video
                video.play();
                videoPlaying  = true;
      

            }, function(error){
                console.log("ERROR");
                console.log(error);
            });

        } else {
            console.log("KO");
        }

        var checkMood = function() {
        	var canvas = document.getElementById('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                var data = canvas.toDataURL('image/jpeg');
                console.dir(data)
                GameFactory.sendToVision(data)
                // console.log(data)
                .then(function (response) {
                	$scope.labels = response.labelAnnotations;
                	$scope.firstLabel = response.labelAnnotations[0].description;
                	$scope.secondLabel = response.labelAnnotations[1].description;
                	var faceInfo = response.faceAnnotations[0];
                	$scope.anger = faceInfo.angerLikelihood;
                	$scope.joy = faceInfo.joyLikelihood;
                	$scope.sorrow = faceInfo.sorrowLikelihood;
                	$scope.surprise = faceInfo.surpriseLikelihood;
			        if ($scope.joy === 'VERY_UNLIKELY') {
			        	$scope.firstMessage = 'You look sad, but you have a nice ' + $scope.firstLabel;
			        }
			        if ($scope.joy === 'UNLIKELY') {
			        	$scope.secondMessage = 'Looks like you are not too sad... Great ' + $scope.secondLabel + ' by the way!';
			        }
			        if ($scope.joy === 'LIKELY') {
			        	$scope.thirdMessage = 'I think you are getting happier';
			        }
			        if ($scope.joy === 'POSSIBLE') {
			        	$scope.thirdMessage = 'Smile, please?';
			        }
			        if ($scope.joy === 'VERY_LIKELY') {
			        	$scope.fourthMessage = 'Awww... beautiful smile';
			        	video.pause();
                		videoPlaying  = false;
                		clearInterval(refreshIntervalId);
			        }
                })
             // document.getElementById('photo').setAttribute('src', data);
        }

        var refreshIntervalId = setInterval(checkMood, 3000);

	// }

	$scope.images = _.shuffle(FunnyGifs);

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