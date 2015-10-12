$(document).ready(function () {
    var _imageDataGlobal = "";

    $("#scale_image").slider({
        value: 100,
        min: 100,
        max: 200,
        step: 1,
        slide: function (event, ui) {
            $("#containment").css("background-size", ui.value + "%");
        }
    });

    $("#brightness").slider({
        value: 0.5,
        min: 0,
        max: 0.9,
        step: 0.1,
        slide: function (event, ui) {
            $("#brightness_value").css("background-color", "rgba(0,0,0," + ui.value + ")");
        }
    });

    $('.rotator').bxSlider({
        speed: 1500,
        controls: false,
        auto: true,
        easing: 'ease-in-out',
        pager: true
    });

    $("#share").click(function () {
        var name = $("#name"),
            skill = $("#skill"),
            name_value = $("#name_value"),
            skill_value = $("#skill_value");

        if ((name.val() == "" || name.val() == null || name.val() == "(Name)") && (skill.val() == "" || skill.val() == null || skill.val() == "(gift, talent, skill)"))
            alert("Please enter your name and skill");

        else if (name.val() == "" || name.val() == null || name.val() == "(Name)")
            alert("Please enter your name");

        else if (skill.val() == "" || skill.val() == null || skill.val() == "(gift, talent, skill)")
            alert("Please enter your skill");

        else {
            name_value.text(name.val());
            skill_value.text(skill.val());
            $('#myModal').modal('show');
        }

    });

    $("#draggable_text").draggable({
        containment: ".modal-body",
        axis: "y",
        cursor: "move"
    });

    $("#upload_bg").click(function () {
        $("#input_img").click();

        $("#input_img").change(function () {
            setBgImage(this);
        });
    });

    $("#share_with_world").click(function () {

        $("#upload_bg").hide();
        $("#loader").show();
        $(this).hide();
        //$("#social_share").show();
        $("#start_over").show();
        var _name = $("#name").val();
        var _skill = $("#skill").val();
        var _date = new Date();
        html2canvas($("#screenshot"), {
            onrendered: function (canvas) {
                var _imageData = canvas.toDataURL("image/png");
                _imageDataGlobal = _imageData;
                sessionStorage.setItem('data_image', _imageData);
                //$("#fb-share-link").attr("data-fburl", _imageData);

                //Save record to the db
                var userImage = {
                    name: _name,
                    skill: _skill,
                    imageData: _imageData,
                    date: _date
                };
                userImage = JSON.stringify(userImage)
                $.ajax({
                    type: "POST",
                    url: "/saveImageToDb",
                    data: userImage,
                    contentType: 'application/json',
                    success: function (res) {
                        var pinURL = encodeURI("http://ictw.azurewebsites.net/index");
                        var mediaURL = encodeURI("http://ictw.azurewebsites.net/uploads/" + res.imageDetail.imageId + ".png");
                        var pinterestHref = "http://pinterest.com/pin/create/button/?url=" + pinURL + ";&media=" + mediaURL;
                        $("#pinterest-share-link").attr("href", pinterestHref);
                        $("#fb-share-link").attr("data-fburl", "http://ictw.azurewebsites.net/loadImage?imageid=" + res.imageDetail.imageId);
                        $("#twitter-share-link").attr("data-url", "http://ictw.azurewebsites.net/loadImage?imageid=" + res.imageDetail.imageId);
                        $("#terms-chk-container").show();
                        $("#social_share").show();
                        $("#loader").hide();
                        //$("#start_over").show();
                    },
                    error: function (err) {
                        console.log(err);

                    }
                });
            }
        });
    });

    $("#download_image").click(function () {
        if ($("#terms-chk").is(':checked')) {
            $(this).attr("href", sessionStorage.getItem('data_image'));
        } else {
            alert("Please check terms and condtion checkbox");
        }
    });

    function setBgImage(input) {
        if (input.files && input.files[0]) {

            var reader = new FileReader();

            reader.onload = function (e) {
                $('#containment').css('background-image', 'url(' + e.target.result + ')');
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#fb-share-link").click(function () {
        if ($("#terms-chk").is(':checked')) {
            var shareURL = $(this).attr("data-fburl");
            //postCanvasToFacebook(shareURL);
            console.log(shareURL);
            FB.ui({
                method: 'share',
                href: shareURL
            }, function (response) {});
        } else {
            alert("Please check terms and condtion checkbox");
        }
    });

    function postCanvasToFacebook(data) {
        //var data = canvas.toDataURL("image/png");
        var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
        var decodedPng = Base64Binary.decode(encodedPng);
        FB.getLoginStatus(function (response) {
            if (response.status === "connected") {
                postImageToFacebook(response.authResponse.accessToken, "heroesgenerator", "image/png", decodedPng, "www.heroesgenerator.com");
            }
        });
    }

    $("#show_email_modal").click(function () {
        if ($("#terms-chk").is(':checked')) {
            $("#myModal").modal("hide");
            $("#myModal2").modal("show");
        } else {
            alert("Please check terms and condtion checkbox");
        }
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
                $("#myModal").modal("show");
                $("#to_email_address").val("");
                $("#myModal2").modal("hide");
            },
            error: function (err) {
                console.log(err);

            }
        });
    });
});
