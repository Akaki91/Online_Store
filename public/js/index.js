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



// sorting querry

// let sortBy = req.query.sort_by;
    // if (sortBy) {
    //     Account.sort({price: 'desc'});
    // }