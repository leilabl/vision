app.config(function ($stateProvider) {
    $stateProvider.state('replay', {
        url: '/replay',
        templateUrl: 'js/replay/replay.html',
        controller: 'replayCtrl'
    });
});

app.controller('replayCtrl', function ($scope, $rootScope, localStorageService, GalleryFactory) {
    var pictures = localStorageService.get('pics') || [];
    if ($rootScope.video) {
        // console.log($rootScope.video)
        var canvas = document.getElementById('photo'); 
        var ctx = canvas.getContext('2d');
        ctx.drawImage($rootScope.video, 0, 0, 300, 225);
        // pictures.push(ctx);
        // localStorageService.set('pics', pictures);
        $scope.seconds = Math.floor($rootScope.time/1000);
        GalleryFactory.savePic($rootScope.data) 
        .then(function (response) {
            return response;
        });

        // createImageBitmap($rootScope.video)
        // .then(function (img) {
        //     return GalleryFactory.savePic(img);
        // })
    }
    // console.log(pictures);
});

