/*$(document).ready(function(){
    $('.ratingbtn').click(function(){
        // Query the necessary fields
        var id = $(this).attr('value');
        var data = {};
        data.newrating = $('#'+id+' .ratingstext').val();
        data.title = $('#'+id+' .title').text();
        data.username = $('#'+id+' .username').text();
        data.ratings = $('#'+id+' .ratings').text();
        data.ratingscount = $('#'+id+' .ratingscount').text();
        console.log("%o",data);

        // Ajax call to update the rating for this photo
        $.ajax({url: "/updaterating", data: data, success: function(result){
            console.log("r = %o", result);
            $('#msg').addClass(result.style);
            $('#msg').html('<strong> '+result.text+' </strong>');
        }});
    });
});*/