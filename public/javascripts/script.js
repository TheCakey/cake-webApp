function addToCart(prodId,weight,message){
   
$.ajax({
    url:'/addtocart/'+prodId+'/'+weight+'/'+message,
method:'get',
success:(response)=>{
 
if(response===false){
    swal({
        title: "You are not Loggedin?",
        text: "First you need to login to purchase",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((toLoggin) => {
        if (toLoggin) {
         window.location = '/login?id='+prodId
        } 
      });

}else{
    window.location = '/cart';
}
   
}

})
}


function razorpayPayment (order){
    var options = {
"key": process.env.RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
"amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
"currency": "INR",
"name": "TheCakey",
"description": "Test Transaction",
"image": "img/cakey1.png",
"order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
"handler": function (response){
   // alert(response.razorpay_payment_id);
   // alert(response.razorpay_order_id);
   // alert(response.razorpay_signature)
console.log(response);
    verifyPayment(response,order)
},
"prefill": {
    "name": order.user.fullname ,
    "email":  order.user.emailaddress,
    "contact": order.user.mobnum
},
"notes": {
    "address":  order.user.permanentaddress
},
"theme": {
    "color": "#3399cc"
}
};
var rzp1 = new Razorpay(options);
rzp1.open();

}











(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Fixed Navbar
    $(window).scroll(function () {
        if ($(window).width() < 992) {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow');
            } else {
                $('.fixed-top').removeClass('bg-white shadow');
            }
        } else {
            if ($(this).scrollTop() > 45) {
                $('.fixed-top').addClass('bg-white shadow').css('top', -45);
            } else {
                $('.fixed-top').removeClass('bg-white shadow').css('top', 0);
            }
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        margin: 25,
        loop: true,
        center: true,
        dots: false,
        nav: true,
        navText : [
            '<i class="bi bi-chevron-left"></i>',
            '<i class="bi bi-chevron-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });

    
})(jQuery);


// mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm

mdc.autoInit()

var lists = document.querySelectorAll('.mdc-bottom-navigation__list')
var activatedClass = 'mdc-bottom-navigation__list-item--activated'
for (var i = 0, list; list = lists[i]; i++) {
  list.addEventListener('click', function(event) {
    var el = event.target
    while (!el.classList.contains('mdc-bottom-navigation__list-item') && el) {
      el = el.parentNode
    }
    if (el) {
      var selectRegex = /.*(card-\d).*/;
      var activatedItem = document.querySelector('.' + event.target.parentElement.parentElement.parentElement.className.replace(selectRegex, '$1') + ' .' + activatedClass)
      if (activatedItem) {
        activatedItem.classList.remove(activatedClass)
      }
      event.target.classList.add(activatedClass)
    }
  })
}




