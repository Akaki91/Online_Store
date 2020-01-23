$('#loginform').on('submit', function(e) {
    e.preventDefault();

    $.post('/login', $(this).serialize())
        .done( (resp) => {
            window.location = '/profile';
        })
        .fail((error) => {
            $('#errorlogin').empty()
            $('#errorlogin').append('<h5>' + error.responseJSON + '</h5>')
        });
})


$('#registerform').on('submit', function (e) {
    e.preventDefault();

    $.post('/register', $(this).serialize())
        .done( (resp) => {
            $('#errorregister').empty()
            $('#successregister').append('<h5>' + resp + '</h5>')
        })
        .fail((error) => {
            $('#successregister').empty()
            $('#errorregister').empty()
            $('#errorregister').append('<h5>' + error.responseJSON + '</h5>')
        });
})


$(".dropdown").hover(function () {
    let dropdownMenu = $(this).children(".dropdown-menu");

    dropdownMenu.toggleClass("show")
});



$('#addToCart').on('submit', function (e) {
    e.preventDefault()

    $.post('/cart/add', $(this).serialize())
        .done((resp) => {
            
            $(".alert").addClass("alert-success").append(resp)
            setTimeout(function () {
                $(".alert").removeClass("alert-success").empty();
            }, 2000)
        })
        .fail((error) => {
            $(".alert").addClass("alert-danger").append(error)
            setTimeout(function () {
                $(".alert").removeClass("alert-success").empty();
            }, 2000)
            
        });

})



$("#updateQty").on('change', function (e) {

    $(this).submit()  
})

// sorting querry

// let sortBy = req.query.sort_by;
    // if (sortBy) {
    //     Account.sort({price: 'desc'});
    // }