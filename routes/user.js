var express = require("express");
var router = express.Router();
//var productHelper=require('../helpers/product-helpers')
var userHelper = require("../helpers/user-helpers");

var productHelper = require("../helpers/product-helpers");
const adminHelpers = require("../helpers/admin-helpers");
const twilio = require("twilio");
const { response } = require("../app");
// CommonJS

let otp;
let mobno;
let loginErr;
let sitedetails;
/* GET home page. */
const accountSid = "AC05cf34ea495a54a41ced42c748302c04";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyLogin = (req, res, next) => {
  if (req.session.userloggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.get('/check',(req,res)=>{
    productHelper.getProductsBasedonCategory().then((category)=>{
      
        res.json(category)

    })
})

router.get("/", async function (req, res, next) {
  sitedetails = await adminHelpers.getSiteDetails();
  let cakes = null;
  let SeasonName = null;
  let seasonalProducts = null;
  let categoryProducts = null;
  cakes = await productHelper.getProductCake();
  season = await productHelper.getCurrentSeason();
  if (season) {
    SeasonName = season.season;
  }
  if (SeasonName != null) {
    seasonalProducts = await productHelper.getSeasonalProducts(season.season);
  }

  categoryProducts = await productHelper.getProductsBasedonCategory();

  cakes = cakes.slice(0, 8);
  res.render("user/index", {
    cakes,
    sitedetails,
    SeasonName,
    seasonalProducts,
    categoryProducts,
  });
});

router.get("/browse-season-product", async function (req, res, next) {
  sitedetails = await adminHelpers.getSiteDetails();
  let season = req.query.name;
  let seasonalProducts = null;
  productHelper
    .getSeasonalProducts(season)
    .then((response) => {
      seasonalProducts = response;
      res.render("user/browse-season-product", {
        sitedetails,
        seasonalProducts,
        season,
      });
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

//signup codes
router.get("/signup", (req, res) => {
  if (req.session.userloggedIn) {
    res.redirect("/");
  } else {
    res.render("user/signup", { hdr: true, loginErr });
  }
});

///if already have an account with this number we need show that user can login
/////////////
///////

router.post("/mob-num-submission", async (req, res) => {
  req.session.tempUser = req.body.mobnum;
  let mobno = req.body.mobnum;

  loginErr = null;
  mobnum = await userHelper.findUserByMobNum(req.body.mobnum);
  if (mobnum) {
    res.json(false);
  } else {
    otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);

    console.log(process.env.TWILIO_AUTH_TOKEN);

    const client = require("twilio")(accountSid, authToken);

    client.messages
      .create({
        body: "Your cakey login otp " + otp,
        from: "+12067597347",
        to: "+91" + mobno,
      })
      .then((message) => console.log(message.sid));

    res.json(true);
  }
});

router.post("/otp", (req, res) => {
  //checking otp;
  if (req.body.otp == otp) {
    loginErr = null;
    res.render("user/registration-form", { hdr: true });
  } else {
    loginErr = "Wrong Otp.Please retry";
    res.redirect("/login");
  }
});

router.post("/full-details-form", (req, res) => {
  var data = req.body;
  data.mobnum = req.session.tempUser;
  data.status = true;
  req.session.tempUser = null;
  delete data.psw2;
  userHelper
    .registerUser(data)
    .then((response) => {
      req.session.userloggedIn = true;
      req.session.user = response;
      if (req.session.tempProdId) {
        prodId = req.session.tempProdId;
        req.session.tempProdId = null;
        res.redirect("/product-detail-page?id=" + prodId);
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

//login codes

router.get("/login", (req, res) => {
  if (req.session.userloggedIn) {
    res.redirect("/profile");
  } else {
    if (req.query.id) {
      req.session.tempProdId = req.query.id;
    }
    let err = loginErr;
    loginErr = null;
    res.render("user/login", { hdr: true, err });
  }
});

router.get("/error", async (req, res) => {
  sitedetails = await adminHelpers.getSiteDetails();
  res.render("user/errorpage1", { sitedetails });
});

router.post("/login-mob-num-submission", (req, res) => {
  let mobno = req.body.mobnum;
  userHelper.findUserByMobNum(mobno).then((response) => {
    loginErr = null;
    //     if(req.body.pass===false){
    // //otp send to mobile number

    // //otp send to mobile number
    //     }
    otp = Math.floor(1000 + Math.random() * 9000);

    // const client = require("twilio")(accountSid, authToken);

    // client.messages
    //   .create({ body:"Your cakey login otp "+otp, from: "+12067597347", to: "+917356252657"})
    //   .then(message => console.log(message.sid));

    req.session.tempUser = response;
    res.json(response);
  });
});

router.post("/login-otp", (req, res) => {
  //checking otp;
  if (req.body.otp == otp) {
    loginErr = null;
    req.session.user = req.session.tempUser;
    req.session.userloggedIn = true;
    req.session.tempUser = null;

    if (req.session.tempProdId) {
      prodId = req.session.tempProdId;
      req.session.tempProdId = null;
      res.redirect("/product-detail-page?id=" + prodId);
    } else {
      otp = null;
      res.redirect("/");
    }
  } else {
    loginErr = "Wrong Otp.Please retry";
    res.redirect("/login");
  }
});

router.get("/logout", (req, res) => {
  req.session.userloggedIn = false;
  req.session.user = null;
  res.json({ logout: true });
});
//login codes ends..............

//Login with Pass
router.post("/pass-mob-num-submission", (req, res) => {
  userHelper
    .userPassLogin(req.body)
    .then((response) => {
      if (response.status) {
        req.session.user = req.session.tempUser;
        req.session.userloggedIn = true;
        req.session.tempUser = null;
        res.json(response);
      } else {
        res.json(response);
      }
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

//Login pass ends............................

//user profile--------------------------------------------
router.get("/profile", verifyLogin, async (req, res) => {
  sitedetails = await adminHelpers.getSiteDetails();
  user = req.session.user;
  let orders = await userHelper.getPendingOrderProducts(user._id);
  let cnOrders = await userHelper.getCancelledOrderProducts(user._id);
  let dlOrders = await userHelper.getDeliveredOrderProducts(user._id);

  res.render("user/profile-page", {
    user,
    orders,
    sitedetails,
    cnOrders,
    dlOrders,
  });
});

router.get("/edit-user-details", async (req, res) => {
  sitedetails = await adminHelpers.getSiteDetails();
  user = req.session.user;
  res.render("user/edit-address", { user, sitedetails });
});

router.post("/edit-user-details", (req, res) => {
  userHelper
    .editUserDetails(req.body, req.session.user._id)
    .then((user) => {
      req.session.user = user;
      res.redirect("/profile");
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

//cart routes
router.get("/cart", verifyLogin, async (req, res, next) => {
  sitedetails = await adminHelpers.getSiteDetails();
  req.session.tempCart = null;

  user = req.session.user;
  userId = user._id;
  let products = null;
  let total = 0;
  let length;
  let blank = false;
  let producttotal;
  if (user) {
    products = await userHelper.getCartProducts(req.session.user._id);
    length = products.length;

    if (products.length > 0) {
      total = await userHelper.getTotalAmount(req.session.user._id);
    } else {
      blank = true;
    }
  }
  res.render("user/cart", {
    products,
    userId,
    total,
    length,
    sitedetails,
    blank,
  });
});

router.post("/checkPincode", async (req, res) => {
  // var pincodeList=["683556", "683101", "683585","683547"];
  //getpincode from backend
  var response = await adminHelpers.validatePincode(req.body.pincode);

  if (response) {
    res.json({ status: true });
  } else {
    res.json({ status: false });
  }
});

router.get("/addtocart/:id/:weight/:msg", async (req, res) => {
  sitedetails = await adminHelpers.getSiteDetails();
  if (req.session.user) {
    let weight = parseFloat(req.params.weight);
    userHelper
      .addToCart(req.session.user._id, req.params.id, weight, req.params.msg)
      .then(() => {
        res.json(req.params.id);
      })
      .catch((err) => {
        res.redirect("/error");
      });
  } else {
    res.json(false);
  }
});

router.post("/change-product-quantity", (req, res) => {
  userHelper
    .changeProductQuantity(req.body)
    .then(async (response) => {
      if (req.body.quantity == 1 && req.body.count == -1) {
        response.total = 0;
      } else {
        response.total = await userHelper.getTotalAmount(req.body.user);
        // if(response.total>1000){
        //   response.orgTotal=true
        //  response.allTotal=response.total
        // }
        // else{
        //  response.allTotal=response.total+40;
        // }
      }
      res.json(response);
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

router.post("/remove-cart-products", (req, res, next) => {
  userHelper
    .removeCartProducts(req.body)
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

router.get("/checkout", async (req, res) => {
  sitedetails = await adminHelpers.getSiteDetails();
  let coupon = null;
  let delivery = null;
  useraddress = await userHelper.getUserAddress(req.session.user._id);

  deliverydetails = await adminHelpers.getSiteDetails();
  let COD = null,
    ONLINE = null,
    BOTH = null;
  if (deliverydetails[0].deliveryMode === "BOTH") {
    BOTH = true;
  } else if (deliverydetails[0].deliveryMode === "COD") {
    COD = true;
  } else {
    ONLINE = true;
  }

  dlcharge = deliverydetails[0].deliveryCharge;
  dlcharge = parseFloat(dlcharge);
  //delivery charge set from admin side
  total = parseFloat(req.query.fullTotal);
  Ttlamount = total + dlcharge;
  let productTotal = req.query.producttotal;
  coupon = req.query.coupon;
  pincode = req.query.pincode;
  if (req.query.producttotal)
    res.render("user/checkout", {
      useraddress,
      pincode,
      total,
      dlcharge,
      Ttlamount,
      productTotal,
      coupon,
      COD,
      ONLINE,
      BOTH,
      sitedetails,
    });
});

router.post("/checkout", async (req, res) => {
  req.body.userId = req.session.user._id;
  user = req.session.user._id;
  usr = req.session.user;
  price = parseFloat(req.body.price);
  let products = await userHelper.getCartProducts(user);
  userHelper
    .PlaceOrder(req.body, products, price)
    .then((orderId) => {
      if (req.body["payment-method"] == "COD") {
        console.log("orderId" + orderId);
        let response = {
          cod_success: true,
          OrderId: orderId,
        };
        res.json(response);
      } else {
        userHelper
          .generateRazorPay(orderId, price, usr)
          .then((response) => {
            response.razorkey = process.env.RAZORPAY_KEY_ID;
            response.OrderId = orderId;
            console.log(response);
            res.json(response);
          })
          .catch((err) => {
            userHelper.deleteOrder(orderId).then((response) => {
              console.log(err);
              res.json(false);
            });
          });
      }
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

router.post("/verify-payment", (req, res) => {
  let user = req.session.user;
  userHelper
    .verifyPayment(req.body)
    .then((pid) => {
      console.log("piiid" + pid);
      console.log(req.body["order[receipt]"]);
      userHelper
        .changePaymentStatus(req.body["order[receipt]"], pid)
        .then(() => {
          console.log("change success");
          res.json({ status: true });
        })
        .catch(() => {
          res.render("user/paymenterror", { user });
        });
    })
    .catch((err) => {
      userHelper.deleteOrder(req.body["order[receipt]"]).then((response) => {
        res.json({ status: false });
      });
    });
});

router.get("/payment-error", async (req, res) => {
  let user = req.session.user;
  sitedetails = await adminHelpers.getSiteDetails();
  res.render("user/paymenterror", { user });
});

router.get("/ordered-response", async (req, res) => {
  sitedetails = await adminHelpers.getSiteDetails();
  let order = null;
  let user = req.session.user;
  let id = req.query.id;
  let mode = req.query.mode;
  let cod = false;

  userHelper.deleteuserCart(user._id);

  if (mode == "cod") {
    cod = true;
  }

  order = await userHelper.getOrderDetails(id);

  res.render("user/order-response", { user, cod, sitedetails, order, id });
});

router.post("/Validate-discount-coupon", async (req, res) => {
  let couponId = req.body.discountCode;
  let coupon = await userHelper.getCouponDetails(couponId);
  console.log(coupon);
  if (coupon) {
    total = req.body.total - (req.body.total / 100) * coupon.Discount;
    total = parseFloat(total).toFixed(2);
    res.json({ valid: true, total });
  } else {
    res.json({ valid: false });
  }
});

router.get("/viewDetailedOrder", async (req, res) => {
  sitedetails = await adminHelpers.getSiteDetails();
  let paymentmethod = null;
  console.log(req.query.id);
  userHelper
    .getOrderDetails(req.query.id)
    .then((response) => {
      console.log(response);
      if (response.paymentMethod == "ONLINE") {
        paymentmethod = response.paymentMethod;
      }
      res.render("user/viewDetailedOrder", {
        orderdata: response,
        paymentmethod,
        sitedetails,
      });
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

//product listing page
router.get("/products-page", async (req, res) => {
  sitedetails = await adminHelpers.getSiteDetails();
  cakes = await productHelper.getProductCake();
  res.render("user/products-page", { cakes, sitedetails });
});

router.get("/product-detail-page", async (req, res) => {
  sitedetails = await adminHelpers.getSiteDetails();
  console.log(sitedetails);
  let proId = req.query.id;
  console.log("proooid" + proId);
  let product = null;
  productHelper
    .getSingleProduct(proId)
    .then((response) => {
      product = response;
      console.log(product);
      let kgstatus = false;
      let twokgstatus = false;
      if (product.kgstatus === "yes") {
        kgstatus = true;
      } else if (product.kgstatus === "2kg") {
        twokgstatus = true;
      }

      res.render("user/product-detail-page", {
        product,
        sitedetails,
        kgstatus,
        twokgstatus,
      });
    })
    .catch((err) => {
      console.log(err);
      console.log("heheehe");
      res.redirect("/error");
    });
});

router.get("/search", async (req, res) => {
  let search = req.query.search;
  let searchProduct = await productHelper.searchProduct(search);
  res.json(searchProduct);
});

router.post("/verifyCart", async (req, res) => {
  if (req.session.user) {
    userHelper
      .verifyCart(req.body, req.session.user._id)
      .then((response) => {
        res.json(response.status);
      })
      .catch((err) => {
        res.redirect("/error");
      });
  } else {
    res.json({ status: "none" });
  }
});

router.get("/reset-password", (req, res) => {
  res.render("user/reset-password");
});

router.post("/reset-password", async (req, res) => {
  let email = req.body.email;
  let user = await userHelper.getUserByEmail(email);
  if (user) {
    let otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);

    res.json({ res: true });
    //   let subject="Reset Password"
    //   let text=`Your OTP is ${otp}`
    //   userHelper.sendMail(email,subject,text)
    //   res.json({status:true,otp:otp})
    // }else{
    //   res.json({status:false})
  }
});

router.post("/subscription", (req, res) => {
  userHelper
    .addSubscription(req.body)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      res.redirect("/error");
    });
});

module.exports = router;
