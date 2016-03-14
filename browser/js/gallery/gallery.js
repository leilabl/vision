app.config(function ($stateProvider) {
    $stateProvider.state('gallery', {
        url: '/gallery',
        templateUrl: 'js/gallery/gallery.html',
        controller: 'galleryCtrl'
    });
});

app.controller('galleryCtrl', function ($scope, $rootScope, GalleryFactory) {

    GalleryFactory.getPics()
    .then(function (picsData) {
        for (var i=0; i < picsData.length; i++) {
            console.log(i)
            var col = document.createElement("div");
            col.setAttribute("class", "image-column col-xs-6 col-sm-4 col-lg-3");
            col.setAttribute('id', i.toString())
            var myImg = document.createElement("img");
            myImg.src = picsData[i].imageData;
            myImg.setAttribute("class", "image-gallery");
            document.getElementById("pictures").appendChild(col);
            document.getElementById(col.id).appendChild(myImg);

        }

    });

});

app.factory('GalleryFactory', function ($http) {
    var GalleryFactory = {};

    GalleryFactory.savePic = function (img) {
        return $http.post('/api/vision/gallery/', { img: img })
        .then(function(data){
            return data;
        });
    }

    GalleryFactory.getPics = function () {
        return $http.get('/api/vision/gallery/')
        .then(function(res){
            return res.data;
        });
    }

    return GalleryFactory;
});


