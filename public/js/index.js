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

$("#searchbar").keypress(function (e) {
    if (e.which == 13)
    $(this).submit()
})





//---------sorting-by-price-----------------

$("#desc").click( () => {

    let url = window.location.href    

    if (url.includes('&sort=downsort')) {
        return
    }
    else if (url.includes('&sort=upsort')){
        url = url.slice(0, url.length - 12)
    }

    url += '&sort=downsort'
    window.location = url

})

$("#asce").click( () => {

    let url = window.location.href

    if (url.includes('&sort=upsort')) {
        return
    }
    else if (url.includes('&sort=downsort')) {
        url = url.slice(0, url.length - 14)
    }

    url += '&sort=upsort'
    window.location = url

})

//--------------------------------------------



// sorting querry

// let sortBy = req.query.sort_by;
    // if (sortBy) {
    //     Account.sort({price: 'desc'});
    // }