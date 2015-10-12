$(document).ready(function () {
    var _imageDataGlobal = "";

    var _paramImageID = getParameterByName("imageid");
    setShareButtonAttributes(_paramImageID);
    var postData = {
        ImageId: _paramImageID
    };
    postData = JSON.stringify(postData)
    $.ajax({
        type: "POST",
        url: "/getImageData",
        data: postData,
        contentType: 'application/json',
        success: function (res) {
            _imageDataGlobal = res.imageData;
            var base64_string = res.imageData;
            var img = document.createElement("img");
            img.width = "400";
            img.height = "400";
            img.src = base64_string;
            var preview = document.getElementById("img_preview");
            $("#loader").css("display", "none");
            preview.appendChild(img);
            $("#download-li").show();
            $("#envelope-li").show();
        },
        error: function (err) {
            console.log(err);

        }
    });

    $("#download_image").click(function () {
        $(this).attr("href", _imageDataGlobal);
    });


    function setShareButtonAttributes(imageId) {
        $("#fb-share-link").attr("data-fburl", "http://ictw.azurewebsites.net/loadImage?imageid=" + imageId);
        var pinURL = encodeURI("http://ictw.azurewebsites.net/index");
        var mediaURL = encodeURI("http://ictw.azurewebsites.net/uploads/" + imageId + ".png");
        var pinterestHref = "http://pinterest.com/pin/create/button/?url=" + pinURL + ";&media=" + mediaURL;
        //console.log("setting: " + pinterestHref);
        $("#pinterest-share-link").attr("href", pinterestHref);

    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    $(document).on("click", "#fb-share-link", function () {
        console.log("facebook");
        var shareURL = $(this).attr("data-fburl");
        console.log(shareURL);
        FB.ui({
            method: 'share',
            href: shareURL
        }, function (response) {});
    });

    $("#show_email_modal").click(function () {
        $("#myModal2").modal("show");
    });

    $("#send_email").click(function () {
        var _toAddress = $("#to_email_address").val();
        var postObject = {
            to: _toAddress,
            subject: "IChooseToWin",
            text: "This is a share from IChooseToWin.com",
            imageData: _imageDataGlobal
        };
        postObject = JSON.stringify(postObject);

        $.ajax({
            type: "POST",
            url: "/send",
            data: postObject,
            contentType: 'application/json',
            success: function (res) {
                console.log(res);

                $("#to_email_address").val("");
                $("#myModal2").modal("hide");
            },
            error: function (err) {
                console.log(err);

            }
        });
    });
});
