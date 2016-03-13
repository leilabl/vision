app.config(function ($stateProvider) {
    $stateProvider.state('gallery', {
        url: '/gallery',
        templateUrl: 'js/gallery/gallery.html',
        controller: 'galleryCtrl'
    });
});

app.controller('galleryCtrl', function ($scope, $rootScope) {
    $scope.allPics = [];
    if ($rootScope.pictures) {
        console.log($rootScope.pictures)
        $rootScope.pictures.forEach(function (picture) {
            $scope.allPics.push(picture);
            // var canvas = document.getElementById('photo'); 
            // var ctx = canvas.getContext('2d'); 
            // ctx.drawImage($rootScope.video, 0, 0, 300, 225);            
        });
    }
    console.log($scope.allPics);
})

