const express = require('express')
const app = express()

var router = express.Router();
bodyParser = require('body-parser');
path = require('path');
var assert = require('assert');
//var Schema = mongoose.Schema;
//var autoincrement = require('mongoose-auto-increment');
var MongoClient = require('mongodb').MongoClient;
var autoIncrementmongo = require("mongodb-autoincrement");
const fs = require('fs');
var url = "mongodb://localhost:27017/myDB";
//var url = "mongodb://User:User1105@localhost:27017/omdehchi";
const utf8 = require('utf8');

const hostname = 'localhost';
const port = 8002;
var https = require('https');
var microtime = require('microtime');
var request = require('request');
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static('public'))
//get json post data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
//--------

var moment = require('jalali-moment');
var dateFormat = require('dateformat');
//------------------
//sms kavenegar
var Kavenegar = require('kavenegar');
var api = Kavenegar.KavenegarApi({apikey: ''});

//JWT token
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
app.set('superSecret', config.secret); // secret variable
let verifytokenflag = false;
let verifytokenres = false;
var passwordHash = require('password-hash');

setInterval(function(str1, str2) {
  //io.emit("tenderexpired" , autoIndex);

  var myquery = {expiredtime: { $lt: Date.now() }};
    MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
     if (err) throw err;
      var dbo = db.db("myDB");

  dbo.collection("temprequest").deleteMany(myquery, function(err, obj) {
  if (err) throw err;
  console.log("expired advs deleted");

   db.close();
});
});

}, 86400000, "Hello.", "one tender expired");
 //end check expired advs-86400000
//create new tender suggestion --------------------------------------------------------------
app.post('/api/newrequest', (req, res, next) => {

  verifytoken(req.body.token);

   if (verifytokenres || verifytokenflag){
  var datenow = dateFormat(new Date(Date.now()), "yyyy-mm-dd HH:MM:ss");
  var dateCreate = moment(datenow,'YYYY-MM-DD-HH:mm:ss').locale('fa').format('YYYY/MM/DD-HH:mm:ss');
   let timecreat = dateCreate;
 if(!req.body.typeoperator || !req.body.numberline || !req.body.typeline || !req.body.stateline || !req.body.mobile || !req.body.typeround || !req.body.province)
{
  res.json({'result': 'Error','message': 'fields are not complete'});
  //console.log("req.body");
}else {

  //--------------

MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
 if (err) throw err;
 //remove extra tender for user

var query = { idcustomer:req.body.idcustomer};
var dbo = db.db("myDB");
var state = "در انتظار تایید ناظر";
var stateeng = "waiting";
var message = "درخواست آگهی شما ثبت شد و پس از تایید ناظر منتشر خواهد شد";
var resultt = "OK";
var amount = "";
dbo.collection("setting").findOne({},function(err, setting) {
     if (err) throw err;
   var cost = setting.cost;
   if (cost != "" ){

     if( Number(req.body.price.replace(",","")) >= Number(cost)){


     state =  "در انتظار پرداخت";
     stateeng = "waitingpay";
     message = "در انتظار پرداخت";
     resultt = "waitingpay";
     amount = (Number(setting.percent)/100)*Number(cost)

   }
}
});


//});
//MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
 //if (err) throw err;
 //var dbo = db.db("omdehchi");
  autoIncrementmongo.getNextSequence(db, "temprequest", function (err, autoIndex) {

  //var myobj = { name: req.body.name, describe: req.body.describe, price: req.body.price, cat: req.body.cat,brand: req.body.brand,state: "1", exist: "yes", datetime: Date.now(), mobileseller: req.body.mobileseller, images: images ,shipping: req.body.shipping,specification:req.body.specification};
  var myobj = { _id: autoIndex,typeoperator: decodeURIComponent(req.body.typeoperator).replace("+"," "), numberline: decodeURIComponent(req.body.numberline).replace("+"," "),digit1:req.body.numberline[0],digit2:req.body.numberline[1],digit3:req.body.numberline[2],digit4:req.body.numberline[4],digit5:req.body.numberline[5],digit6:req.body.numberline[6],digit7:req.body.numberline[7],prenumber: req.body.prenum,price: req.body.price,priceint: Number(req.body.price.replace(",","")), typeline: req.body.typeline,stateline:req.body.stateline,typepayment:req.body.typepayment,typeround:decodeURIComponent(req.body.typeround).replace("+"," "),province:decodeURIComponent(req.body.province).replace("+"," "),city:decodeURIComponent(req.body.city).replace("+"," "),
    mobileuser: req.body.mobile,description: req.body.description,state:state ,stateeng:stateeng,instant:"no",rise:"no",datetime: timecreat,microtimecreate:Date.now(),microtimeupdate:Date.now(),expiretime:Date.now() + 2629746000};
 if (req.body.item == "newadv"){
  dbo.collection("temprequest").insertOne(myobj, function(err, mongoResponse) {
  console.log("1 document inserted");


  res.json({result: resultt,message: message,amount:amount,id:autoIndex});
//res.json({'result': 'OK','message': 'سفارش استعلام محصول جدید شما ثبت شد. پس از تایید کارشناس شروع استعلام انجام می پذیرد'});

   db.close();

 });
}else{
  var myquery1 = { _id: parseInt(req.body.id) };
//console.log("dddd" + req.body.id);
  var newvalues1 = { $set: {typeoperator: decodeURIComponent(req.body.typeoperator).replace("+"," "), numberline: decodeURIComponent(req.body.numberline).replace("+"," "),digit1:req.body.numberline[0],digit2:req.body.numberline[1],digit3:req.body.numberline[2],digit4:req.body.numberline[4],digit5:req.body.numberline[5],digit6:req.body.numberline[6],digit7:req.body.numberline[7],prenumber: req.body.prenum,price: req.body.price,priceint: Number(req.body.price.replace(",","")), typeline: req.body.typeline,stateline:req.body.stateline,typepayment:req.body.typepayment,typeround:decodeURIComponent(req.body.typeround).replace("+"," "),province:decodeURIComponent(req.body.province).replace("+"," "),city:decodeURIComponent(req.body.city).replace("+"," "),
    description: req.body.description,state:"در انتظار تایید ناظر" ,stateeng:"waiting"}};

  dbo.collection("temprequest").updateOne(myquery1, newvalues1, function(err, res) {
    if (err) throw err;
    //console.log(myquery1);



    });
    res.json({result: resultt,message: message,amount:amount});
db.close();
}
});


 });
}
}else{
       resultfinal = {
       result: 'Error',
       message: "توکن نامعتبر است",
      status : "unsuccessfull",
    };
    res.json(resultfinal);
     }
});


app.get("/api/listadvs",(req,res) => {
//  console.log("result:");
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
 //var query = {stateeng: "waiting" };
 //var query = {mobileuser: "09120287232" };
 var totalpage = 0;
 let pagecount = 10;
    var dbo = db.db("myDB");
    dbo.collection("temprequest").count({})
       .then((count) => {
        if (count > 0) {
           totalpage = parseInt(count/pagecount);
           if (count/pagecount > parseInt(count/pagecount) )
              totalpage = totalpage + 1;
        }

       });
     //dbo.collection("products").find({}).toArray(function(err, result) {
     let skip = (parseInt(req.query.page)-1) * pagecount;
     var mysort = { _id: -1 };
 dbo.collection("temprequest").find({}).sort(mysort).skip(skip).limit(pagecount).toArray(function(err, result) {

//res.send({result});
//res.render('management/index' , { result: result,item:"newadv",totalpage:totalpage,page:req.query.page});
res.json({result,totalpage:totalpage,page:req.query.page});

 db.close();
});

});
});


//show user advs
app.get("/api/advsofuser",(req,res) => {
  //console.log("result:");
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
    var dbo = db.db("myDB");
        var mysort = { microtimeupdate: -1 };
var query = {mobileuser: req.query.mobile };
dbo.collection("temprequest").find(query).sort(mysort).toArray(function(err, result) {

//res.send({result});
//res.render('management/index' , { result: result,item:"newadv",totalpage:totalpage,page:req.query.page});
dbo.collection("setting").findOne({},function(err, setting) {
    if (err) throw err;
  var setting1 = setting;

res.json({result,nowmicrotime:Date.now(),setting:setting1,totalpage:1,page:1});

db.close();
});
});
//});
});
});
//end of user advs
//--------
app.get("/api/publishedadvs",(req,res) => {
//  console.log("result:");
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
 var query = {stateeng: "published" };
 //var query = {mobileuser: "09120287232" };
 var totalpage = 0;
 let pagecount = 10;
    var dbo = db.db("myDB");
    dbo.collection("temprequest").count(query)
       .then((count) => {
        if (count > 0) {
           totalpage = parseInt(count/pagecount);
           if (count/pagecount > parseInt(count/pagecount) )
              totalpage = totalpage + 1;
        }

       });
     //dbo.collection("products").find({}).toArray(function(err, result) {
     let skip = (parseInt(req.query.page)-1) * pagecount;
     var mysort = { microtimeupdate: -1 };
 dbo.collection("temprequest").find(query).sort(mysort).skip(skip).limit(pagecount).toArray(function(err, result) {

//res.send({result});
//res.render('management/index' , { result: result,item:"newadv",totalpage:totalpage,page:req.query.page});
dbo.collection("setting").findOne({},function(err, setting) {
     if (err) throw err;
   var setting1 = setting;

res.json({result,nowmicrotime:Date.now(),setting:setting1,totalpage:totalpage,page:req.query.page});

 db.close();
});
});
});
});
//------------
//--------
app.get("/api/newadvs",(req,res) => {
//  console.log("result:");
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
 var query = {stateeng: "waiting"};
 //var query = {mobileuser: "09120287232" };
 var totalpage = 0;
 let pagecount = 10;
    var dbo = db.db("myDB");
    dbo.collection("temprequest").count(query)
       .then((count) => {
        if (count > 0) {
           totalpage = parseInt(count/pagecount);
           if (count/pagecount > parseInt(count/pagecount) )
              totalpage = totalpage + 1;
        }

       });
     //dbo.collection("products").find({}).toArray(function(err, result) {
     let skip = (parseInt(req.query.page)-1) * pagecount;
     var mysort = { _id: -1 };
 dbo.collection("temprequest").find(query).sort(mysort).skip(skip).limit(pagecount).toArray(function(err, result) {

//res.send({result});
//res.render('management/index' , { result: result,item:"newadv",totalpage:totalpage,page:req.query.page});
res.json({result,totalpage:totalpage,page:req.query.page});

 db.close();
});

});
});
//------------
/*app.get("/api/newadvs",(req,res) => {
console.log("result:");

    //res.render('website/index');
  });*/

app.get("/",(req,res) => {

    if (!req.query.item ){
       res.render('/myDB/website/index');

   }else{
   if(req.query.item == "advinfo"){

     MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
      if (err) throw err;

       var dbo = db.db("myDB");
    var query = { _id:parseInt(req.query.id) };

      dbo.collection("temprequest").findOne(query, function(err, result) {

  //res.send({result});
  res.render('myDB/website/index' , { result: result,item:"advinfo",nowmicrotime:Date.now()});
    db.close();
   });

 });

     //res.render('website/advinfo');
   }

   if(req.query.item == "myadvsinfo"){

     MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
      if (err) throw err;

       var dbo = db.db("myDB");
    var query = { _id:parseInt(req.query.id) };

      dbo.collection("temprequest").findOne(query, function(err, result) {

   res.render('myDB/website/index' , { result: result,item:"myadvsinfo",nowmicrotime:Date.now()});
    db.close();

   });
   });

     //res.render('website/advinfo');
   }

   if(req.query.item == "addnewline"){
     //console.log("result:");
        res.render('myDB/website/index',{item:"addnewline",type:"addnewline"});
   }


   if(req.query.item == "editadv"){
     //console.log("result:");
     MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
      if (err) throw err;

       var dbo = db.db("myDB");
    var query = { _id:parseInt(req.query.id) };

      dbo.collection("temprequest").findOne(query, function(err, result) {

   res.render('myDB/website/index' , { result: result,item:"editadv",type:"edit"});
    db.close();

   });
   });
        //res.render('website/index',{item:"addnewline",type:"edit"});
   }

   if(req.query.item == "mymyDB"){
     //console.log("result:");
        res.render('myDB/website/index',{item:"mymyDB"});
   }

   if(req.query.item == "contact"){
     //console.log("result:");
        res.render('myDB/website/index',{item:"contact"});
   }

   if (req.query.item == "apps"){

       res.render('myDB/website/index' , {item:"apps" });
   }


   if(req.query.item == "aboutus"){
     //console.log("result:");
        res.render('myDB/website/index',{item:"aboutus"});
   }

   if(req.query.item == "rules"){
     //console.log("result:");
        res.render('myDB/website/index',{item:"rules"});
   }

   if(req.query.item == "promotion"){
     //console.log("result:"+req.query.id);
     MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
      if (err) throw err;

       var dbo = db.db("myDB");
     dbo.collection("setting").findOne({},function(err, setting) {
          if (err) throw err;
        var setting1 = setting;

//res.send({result});
        res.render('myDB/website/index',{item:"promotion",id:req.query.id,number:req.query.number,setting:setting1});
        db.close();
          });
            });
   }
 }
  });



  //-------
  app.post("/api/loginadmin",(req,res) => {
//console.log("resultwwww:" +req.body.username);
    resultfinal = {
      result: 'Error',
      describe: "خطا رخ داد",
      status : "unsuccess"

    };

        if (req.body.username != "" || req.body.username != "undefined" ||req.body.pass != "" || req.body.pass != "undefined"){

   //        var resultfinal = {result: 'Error',
     //      describe: "خطا",
       //    status : "unsuccess"

        MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
         if (err) throw err;

         console.log();
         //var query = {username: passwordHash.verify(req.body.username, hashedPassword),pass: passwordHash.verify(req.body.pass, hashedPassword)};
           var dbo = db.db("myDB");
           dbo.collection("admin").findOne({}, function(err, result) {
         if (err) throw err;
         if (passwordHash.verify(req.body.username, result.username)&&passwordHash.verify(req.body.pass, result.pass)){
           //console.log("win!!!!!");
           const payload = {
           admin: result.pass     };
             var token = jwt.sign(payload, app.get('superSecret'));


           resultfinal = {
             result: 'OK',
             describe: "ادمین معتبر است",
             token: token,
             status : "success"

           };
             res.json(resultfinal);
             db.close();
         }else{
           resultfinal = {
             result: 'ٍError',
             describe: "نام کاربری یا رمز عبور صحیح نمیباشد",
             status : "unsuccess"

           };
           res.json(resultfinal);
           db.close();
           //console.log("failed!!!!!");
         }
      //  res.render('management/index' , { result: result,item:"setting" });

    });

          db.close();

           //assert.equal(null, err);

            });


          }

    });
//--------

app.get("/management",(req,res) => {

   if (!req.query.item ){

    res.render('myDB/management/index');
  }



  if (req.query.item == "newadv"){
  res.render('myDB/management/index',{item:"newadv"});

}



if (req.query.item == "listadvs"){


   res.render('myDB/management/index' , { item:"listadvs"});

}

if (req.query.item == "login"){


   res.render('myDB/management/login');

}


if (req.query.item == "setting"){

    MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
     if (err) throw err;

      var dbo = db.db("myDB");
      //dbo.collection("lifetimetender").find({}).toArray(function(err, result) {
       dbo.collection("setting").findOne({}, function(err, result) {
     if (err) throw err;
     //var obj = JSON.stringify(result)
     //console.log("new price  rrrrsuggest" + result.lifetimetender);

    res.render('myDB/management/index' , { result: result,item:"setting" });

      db.close();
});


});

}



if (req.query.item == "support"){

    MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
     if (err) throw err;

      var dbo = db.db("myDB");
      //dbo.collection("lifetimetender").find({}).toArray(function(err, result) {
       //dbo.collection("support").find({}, function(err, result) {
         dbo.collection("support").find({},{ sort: { _id: -1 }}).toArray(function(err, result) {
     if (err) throw err;
     //var obj = JSON.stringify(result)
     //console.log("new price  rrrrsuggest" + result.length);

   res.render('myDB/management/index' , { result: result,item:"support" });
   //res.json({result: result});
      db.close();
});


});

}

if (req.query.item == "report"){

    MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
     if (err) throw err;

      var dbo = db.db("myDB");
      //dbo.collection("lifetimetender").find({}).toArray(function(err, result) {
       //dbo.collection("support").find({}, function(err, result) {
         dbo.collection("report").find({},{ sort: { _id: -1 }}).toArray(function(err, result) {
     if (err) throw err;
     //var obj = JSON.stringify(result)
     //console.log("new price  rrrrsuggest" + result.length);

   res.render('myDB/management/index' , { result: result,item:"report" });
   //res.json({result: result});
      db.close();
});


});

}

});


//get count of Unread requested nes tenders
app.post("/changestatesupportmessage",(req,res) => {
//console.log("req.body.parent" + req.query.id);
verifytoken(req.body.token);
//console.log("1 tender startedffff - "+req.body.advid+"dd"+ req.body.operation);
if (verifytokenres || verifytokenflag){

  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
    var dbo = db.db("myDB");
    var query = { _id:req.body.id };

    db.collection("support").updateOne(
            { _id:parseInt(req.body.id)  },
            //{  "$push": { "pricesuggests": { "$each": [ { wk: 5, score: 8 }] } } },
            {  "$set": { "response": "رسیدگی شد" }},
            { "upsert": true },
            function(err, result) {
                if (err) {
                   console.log('err:  ' + err);
                }
                else {

                    resultfinal = {
                      result: 'OK',
                      describe: "بروزرسانی انجام شد",
                      status : "success"

                    };
                      res.json(resultfinal);
                      db.close();
                }
            }
        );


//});
});
}else{
  resultfinal = {
    result: 'Error',
    describe: "توکن نامعتبر است",
    status : "unsuccess"

  };


  res.json(resultfinal);
db.close();
}
});
//---------------
//get count of Unread requested nes tenders
app.post("/changestatereport",(req,res) => {
console.log("req.body.parent" + req.body.token);
verifytoken(req.body.token);
//console.log("1 tender startedffff - "+req.body.advid+"dd"+ req.body.operation);
if (verifytokenres || verifytokenflag){

  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
    var dbo = db.db("myDB");
    var query = { _id:req.body.id };

    db.collection("report").updateOne(
            { _id:parseInt(req.body.id)  },
            //{  "$push": { "pricesuggests": { "$each": [ { wk: 5, score: 8 }] } } },
            {  "$set": { "response": "رسیدگی شد" }},
            { "upsert": true },
            function(err, result) {
                if (err) {
                   console.log('err:  ' + err);
                }
                else {

                    resultfinal = {
                      result: 'OK',
                      describe: "بروزرسانی انجام شد",
                      status : "success"

                    };
                      res.json(resultfinal);
                      db.close();
                }
            }
        );


//});
});
}else{
  resultfinal = {
    result: 'Error',
    describe: "توکن نامعتبر است",
    status : "unsuccess"

  };


  res.json(resultfinal);
db.close();
}
});
//---------------

app.post("/api/advsinfo", (req, res, next) => {

var arr = JSON.parse(req.body.idadvs);
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
     if (err) throw err;
      var dbo = db.db("myDB");
      var aa= [];
      var query2 = { $or: aa };
      var flag = 0;
      for(var j=0; j<arr.length; j++){
 //console.log("sss"+arr.length);
     aa.push({_id: parseInt(arr[j])})
       flag = 1;
      }
      if (flag == 1){
      console.log("1 cat=" + query2);
      var mysort = { _id: -1 };
     dbo.collection("temprequest").find(query2).sort(mysort).toArray(function(err, result) {
     res.json({result,nowmicrotime:Date.now()});
     db.close();


     });
      }
  });
});


//--------------
app.post("/api/submitadv",(req,res) => {
//console.log(req.query.id);
verifytoken(req.body.token);
//console.log("1 tender startedffff - "+req.body.advid+"dd"+ req.body.operation);
if (verifytokenres || verifytokenflag){
MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
 if (err) throw err;
 var dbo = db.db("myDB");
 var resultunit = null;

var query = { _id: parseInt(req.body.id) };
var newvalues1 = { $set: {state: "منتشر گردید",stateeng:"published"} };
dbo.collection("temprequest").updateOne(query, newvalues1, function(err, res) {
  if (err) throw err;
  //console.log(myquery1);

  });
  resultfinal = {
    result: 'OK',
    describe: "آگهی منتشر گردید",
    status : "success"

  };


  res.json(resultfinal);
db.close();

});
}else{
  resultfinal = {
    result: 'Error',
    describe: "توکن نامعتبر است",
    status : "unsuccess"

  };


  res.json(resultfinal);
db.close();
}
});
// count products
app.get("/api/countnewadv",(req,res) => {
//console.log("result:" + allcount);
  var allcount = 0;
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
   var totalpage = 0;
   let pagecount = 10;
    var dbo = db.db("myDB");
    var query = {stateeng: "waiting" };
    dbo.collection("temprequest").count(query)
    .then((count) => {
        if (count > 0) {
       allcount = count;

     }
     res.json({allcount:allcount});


     db.close();
    });

});
});
//end of count products
// count products
app.get("/api/countUnreadsupport",(req,res) => {
//console.log("result:" + allcount);
  var allcount = 0;
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
   var totalpage = 0;
   let pagecount = 10;
    var dbo = db.db("myDB");
    var query = {response: "در انتظار پاسخ" };
    dbo.collection("support").count(query)
    .then((count) => {
        if (count > 0) {
       allcount = count;

     }
     res.json({allcount:allcount});


     db.close();
    });

});
});
//end of count products

// count products
app.get("/api/countUnreadreport",(req,res) => {
//
  var allcount = 0;

  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
   var totalpage = 0;
   let pagecount = 10;
    var dbo = db.db("myDB");
    var query = {response: "در انتظار بررسی" };
    dbo.collection("report").count(query)
    .then((count) => {
        if (count > 0) {
       allcount = count;

     }
     res.json({allcount:allcount});


     db.close();
    });

});
});
//end of count products

   //-----------------
   app.get("/updatesetting",(req,res) => {
console.log("req.body.parent" + req.query.cost);
  /*if (req.query.cost != "" && req.query.cost != "undefined" && req.query.percent != "" && req.query.percent != "undefined"){

     var resultfinal = {result: 'Error',
     describe: "خطا",
     status : "unsuccess"
  };*/
     //console.log("req.body.parent" + req.body.name);
     MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
      if (err) throw err;
      var dbo = db.db("myDB");


      let cost = req.query.cost;
      let percent = req.query.percent;
      db.collection("setting").updateOne(

              //{  "$push": { "pricesuggests": { "$each": [ { wk: 5, score: 8 }] } } },
              {},
            {  "$set": { "cost":cost , "percent":percent,"promotion":req.query.checkboxpromotion,"instantfee":req.query.inpinstant,"risefee":req.query.inprise,"instantrisefee":req.query.inpinstantrise,"renewfee":req.query.inprenew,"renewrisefee":req.query.inprenewrise,"androidversion":req.query.androidversion,"iosversion":req.query.iosversion,"forceandroid":req.query.forceandroid,"forceios":req.query.forceios}},
              { "upsert": true },
              function(err, result) {
                  if (err) {
                     console.log('err:  ' + err);
                  }
                  else {

                      resultfinal = {
                        result: 'OK',
                        describe: "بروزرسانی انجام شد",
                        status : "success"

                      };
                        res.json(resultfinal);
                        db.close();
                  }
              }
          );

        //assert.equal(null, err);

         });

     //res.redirect('management?item=category');
   //}
   });




//-----------------


//---------
app.post("/api/removeadv",(req,res) => {
  //console.log("req.body.parent" + req.query.id);
  verifytoken(req.body.token);
//console.log("1 tender startedffff - "+req.body.advid+"dd"+ req.body.operation);
if (verifytokenres || verifytokenflag){

  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
   var dbo = db.db("myDB");
   //remove cat
   let query = { _id:parseInt(req.body.id) };

      // console.log("../" + result[0].images.length);
    //var ss = result[0].images.length;
    dbo.collection("temprequest").deleteOne(query, function(err, obj) {
      if (err) throw err;


   resultfinal = {
     result: 'OK',
     describe: "محصول با موفقیت حذف شد",
     status : "success"

   };
     res.json(resultfinal);
db.close();
   });

      });
    }else{
      resultfinal = {
        result: 'Error',
        describe: "توکن نامعتبر است",
        status : "unsuccess"

      };


      res.json(resultfinal);
    db.close();
    }
   });

      //---------

  app.post("/api/editproduct", (req, res, next) => {

        console.log("req.body.parent");
        if(!req.body.name || !req.body.comment || !req.body.cat|| !req.body.unitpdc)
       {
         res.json({'result': 'Error','message': 'fields are not complete'});
         //console.log("req.body");
       }else {

         var images = [];
         var ss = req.files;
         //console.log(ss.length);
        // if (ss.length < 7) {
        if (req.files[0]){
           for(var j=0; j<ss.length; j++){

             var originalName = ss[j].originalname;
             var filename = ss[j].filename;
             images.push("/images/" + filename);
    //add watermarker on images
             let imgRaw = "public/images/" + ss[j].filename; //a 1024px x 1024px backgroound image
             let imgLogo = 'public/imagesite/logo150.png';

             Jimp.read(imgRaw)
             var p1 = Jimp.read(imgRaw);
              var p2 = Jimp.read(imgLogo);


          Promise.all([p1, p2]).then(images => {
            let image = images[1].opacity( 0.35 )
             images[0].composite(image, 450, 470).write(imgRaw);
          })
 }

          //create thumbnail images

/*          Jimp.read('public/images/' + ss[0].filename)
          .then(lenna => {
            return lenna
              .resize(200, 200) // resize
              .quality(60) // set JPEG quality

              .write('public/images/small-' + ss[0].filename); // save
          })
          .catch(err => {
            console.error(err);
          });*/
    //create thumbnail images
          var logo = new Jimp('public/imagesite/logo70.png', function (err, img) {
                 err ? console.log('logo err' + err) : console.log('logo created and ready for use');
                 return img.opacity(0.35);
             });
           //var p3 = Jimp.read(imgLogo);
          Jimp.read('public/images/' + req.files[0].filename) // where filename comes from the api call i.e.: '/api/watermark/:filename'
                 .then((image)=>{
                     //image.clone()
                     return image
                     .resize(200, 200) // resize
                     .quality(60) // set JPEG quality
                      .composite(logo, 130, 140)
                     .write('public/images/small-' + req.files[0].filename, (err, success)=>{ err ? console.log(err) : console.log('image resized and saved successfully\n'+success)}); // save

                         //.write(__dirname + '/public/tmp/slider-01.jpg', (err, success)=>{ err ? console.log(err) : console.log('image resized and saved successfully\n'+success)});
                 });



          var newvalues1 = { $set: {name: req.body.name,nameetc:req.body.nameetc,describe:req.body.comment,cat:parseInt(req.body.cat),brand: req.body.brand,unit: req.body.unitpdc,images:images} };
              //add watermark on thumbnail image
        /*    let imgRaw2 = 'public/images/small-' + req.files[0].filename; //a 1024px x 1024px backgroound image
            Jimp.read(imgRaw2)
             let imgLogo = 'public/imagesite/logo70.png';
             var p1 = Jimp.read(imgRaw2);
             var p2 = Jimp.read(imgLogo);
            Promise.all([p1, p2]).then(images => {
              let image = images[1].opacity( 0.40 )
               images[0].composite(image, 130, 140).write(imgRaw2);
            });*/
     }else{
       var newvalues1 = { $set: {name: req.body.name,nameetc:req.body.nameetc,describe:req.body.comment,cat:parseInt(req.body.cat),brand: req.body.brand,unit: req.body.unitpdc} };

     }


        MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
         if (err) throw err;
         var dbo = db.db("omdehchi");

         var myquery1 = { _id: parseInt(req.body.idpdc) };
       dbo.collection("products").updateOne(myquery1, newvalues1, function(err, res) {
           if (err) throw err;
           //console.log(myquery1);


           });
           resultfinal = {
             result: 'OK',
             describe: "تصاویر با موفقیت حذف شدند",
             status : "success"

           };
             res.json(resultfinal);
               db.close();
         });


         }
         });

         //---------

//send sms
/*app.get("/api/sms",(req,res) => {

  console.log("sms sent successful" + req.query.mobile);

var smscode = Math.floor(100000 + Math.random() * 900000);


//kavenegar Panel
api.VerifyLookup({
    receptor: req.query.mobile,
    token: smscode,
    template: "Verify"
}, function(response, status) {
    console.log(response);
    console.log(status);
    if (status == 200){
 result = {
        result: 'OK',
        describe: "پیامک ارسال شد",
        mobile: req.query.mobile,

      };
      savetodb();
    }else{
      result = {
        result: 'Error',
        describe: "ارسال پیامک با مشکل مواجه شد",
        mobile: req.query.mobile

      }
    }
    res.json(result);
});

//console.log("sms sent successful" + req.query.mobile)


//request(options, function (error, response, body) {
  //if (!error && response.statusCode == 200) {
    //console.log("sms sent successful")
  // Print the shortened url.
   //res.send("fffffff");
//save sms info in db
function savetodb(){
MongoClient.connect(url, (err, db) => {

if (err) throw err;
var dbo = db.db("omdehchi");


autoIncrementmongo.getNextSequence(db, "smsinfo", function (err, autoIndex) {

   var myobj = {_id: autoIndex,mobile:req.query.mobile,smscode:smscode};

    dbo.collection("smsinfo").insertOne(myobj, function(err, mongoResponse) {
  result = {
        result: 'OK',
        describe: "پیامک ارسال شد",
        mobile: req.query.mobile,

      };
   });

   setTimeout(function(str1, str2) {
     //io.emit("tenderexpired" , autoIndex);
     var myquery = {_id: autoIndex};
     dbo.collection("smsinfo").deleteOne(myquery, function(err, obj) {
     if (err) throw err;
     console.log("1 document deleted");
     db.close();
 });

      console.log(str1 + " " + str2);
    }, 1000000, "Hello.", "one smscode expired");

});
});
}
});
*/

//end of sms user verification
//read province&Cities
app.get("/api/province",(req,res) => {
let rawdata = fs.readFileSync('province.json');
let student = JSON.parse(rawdata);
res.send(student)
});

//products info by their Id
//search products
app.get("/api/searchweb",(req,res) => {
  var totalpage = 0;
  let pagecount = 10;
//console.log("dddd" + req.query.param);
  var query = {$text: {$search: req.query.param} };
   MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
    if (err) throw err;

  var totalpage = 0;
  let pagecount = 10;
     var dbo = db.db("myDB");
     dbo.collection("temprequest").count(query)
        .then((count) => {
          console.log("req.query.param:" + count);
         if (count > 0) {
            totalpage = parseInt(count/pagecount);
            if (count/pagecount > parseInt(count/pagecount) )
               totalpage = totalpage + 1;
         }

        });
      //dbo.collection("products").find({}).toArray(function(err, result) {
      let skip = (parseInt(req.query.page)-1) * pagecount;
      var mysort = { _id: -1 };
  //dbo.collection("temprequest").find(query).sort(mysort).skip(skip).limit(pagecount).toArray(function(err, result) {
dbo.collection("temprequest").find(query).toArray(function(err, result) {
 //res.send({result});
 //res.render('management/index' , { result: result,item:"newadv",totalpage:totalpage,page:req.query.page});
 res.json({result,totalpage:totalpage,page:req.query.page});

  db.close();
 });

 });
});

//register new seller --------------------------------------------------------------
app.get('/api/registeruser',(req, res, next) => {
 //console.log("req.body.mobile" + req.query.mobile);
 //verify if the user is regeistered or no
 MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {

 if (err) throw err;
 var dbo = db.db("myDB");
 var query2 = { mobile:req.query.mobile};

 dbo.collection("user").count(query2, { limit: 1 })
  .then((count) => {
    if (count == 0) {




 //console.log('Username exists.' + req.body.mobile);
 if(!req.query.mobile || !req.query.email)
{
  res.json({'result': 'Error','message': 'fields are not complete'});
}else {

autoIncrementmongo.getNextSequence(db, "user", function (err, autoIndex) {

 var myobj = {_id: autoIndex,mobile: req.query.mobile,email:req.query.email,favorites:[], datetime: Date.now(),lat: "", long: "" ,
    score: "0",level: "",numrequestfee:"",numorder:"",report:0,state:""};

  dbo.collection("user").insertOne(myobj, function(err, mongoResponse) {

  console.log("1 user regestered");
   //create token
   const payload = {
   admin: req.query.mobile     };
     var token = jwt.sign(payload, app.get('superSecret'));


    //console.log('token:' + token);
  res.json({'result': 'OK','message': 'register successfully','id':autoIndex,'token':token});
   db.close();
 });
});
   assert.equal(null, err);


}
}else{

 var resultfinal = {result: 'Error',
 message: "خطا",
 status : "unsuccess"
};

}
});
});

});


//add favorites of user --------------------------------------------------------------
app.post('/api/addtofavorites',(req, res, next) => {
  //if(!req.body.mobile || !req.body.advid|| !req.body.token){
  verifytoken(req.body.token);
  //console.log("1 tender startedffff - "+req.body.advid+"dd"+ req.body.operation);
  if (verifytokenres || verifytokenflag){


  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {

  if (err) throw err;
  var dbo = db.db("myDB");
if(req.body.operation == "insert"){
  db.collection("user").update(
          { mobile:req.body.mobile},
          //{  "$push": { "pricesuggests": { "$each": [ { wk: 5, score: 8 }] } } },
         // {  "$push": { "sellers": { "$each": [{"province":req.body.province,"city":req.body.city}] } } },
          {  "$push": { "favorites": { "$each": [req.body.advid] } } },
           { "upsert": true },
          function(err, result) {
              if (err) {
                 console.log('err:  ' + err);
                     res.json({'result': 'Error','message': 'با خطا مواجه شد'});
                    db.close();
              }
              else {

                  console.log('update brand:  ' + result);
                  res.json({'result': 'OK','message': 'نشان گذاری با موفقیت انجام شد.برای دیدن نشان شده های خود به خط یاب من مراجعه نمایید'});
                     db.close();
              }
          }
      );
    }else{

      db.collection("user").update(
              { mobile:req.body.mobile  },
              //{  "$push": { "pricesuggests": { "$each": [ { wk: 5, score: 8 }] } } },
              //{  "$pull":  {favorites: req.body.advid} },
              {$pull: {favorites: req.body.advid}},
               {multi: true},
              //{ "upsert": true },
              function(err, result) {
                  if (err) {
                     console.log('err:  ' + err);
                     res.json({'result': 'Error','message': 'با خطا مواجه شد'});
                    db.close();
                  }
                  else {

                      resultfinal = {
                        result: 'OK',
                        message: "نشان گذاری حذف شد",
                        status : "success"

                      };
                        res.json(resultfinal);
                        db.close();
                  }
              }
          );
    }
});

}else{
       resultfinal = {
       result: 'Error',
       message: "توکن نامعتبر است",
      status : "unsuccessfull",
    };
res.json(resultfinal);
}
/*}else{

 var resultfinal = {result: 'Error',
 message: "خطا",
 status : "unsuccess"
};
res.json(resultfinal);
}*/
});
//-----------------
app.get("/api/checkfavorite",(req,res) => {
   //console.log("1 cat=" + req.query.mobile + req.query.advid);
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;

  var totalpage = 0;
  let pagecount = 10;
    var dbo = db.db("myDB");
     var query = { mobile:req.query.mobile};
     var flag = 0;
     dbo.collection("user").find(query).limit(1).toArray(function(err, result) {
     if (err) throw err;
     for(var j=0; j<result[0].favorites.length; j++){

       if (result[0].favorites[j] == req.query.advid){

           flag = 1;
         break;

       }
     }
     if (flag == 1){
       resultfinal = {
         result: 'OK',
         message: "موجود است",
         status : "success"

       };

     }else{
     resultfinal = {
     result: 'Error',
     message: "موجود نیست",
     status : "unsuccessfull",
     };
   }
     res.json(resultfinal);
      db.close();

   });
    });
});

//---------------
app.get('/api/favoritesofuser',(req, res, next) => {
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;

    var dbo = db.db("myDB");
     var query = { mobile:req.query.mobile};

     var aa= [];
     var query2 = { $or: aa };

     var flag = 0;
     dbo.collection("user").find(query).limit(1).toArray(function(err, result) {
     if (err) throw err;

     for(var j=0; j<result[0].favorites.length; j++){

    aa.push({_id: parseInt(result[0].favorites[j])})

      flag = 1;
     }
     if (flag == 1){
     console.log("1 cat=" + query2);
     var mysort = { _id: -1 };

    dbo.collection("temprequest").find(query2).sort(mysort).toArray(function(err, result) {


    res.json({result,nowmicrotime:Date.now()});

    db.close();
  //}

    });
    }


   });
    });
});


//--------------------

//--------------------
app.get("/api/search",(req,res) => {
  var totalpage = 0;
  let pagecount = 10;
//console.log("dddd" +req.query.digit1);
  var query =  {stateeng:"published"};
if (req.query.typeoperator){
  Object.assign(query, { typeoperator:req.query.typeoperator});
}
  if (req.query.province && !req.query.province == ""){
    Object.assign(query, {province: req.query.province,city:req.query.city});
  }
  if (req.query.prenum && !req.query.prenum == ""){
    Object.assign(query, {prenumber: req.query.prenum});
  }

  if (req.query.typeline && !req.query.typeline == ""){
    Object.assign(query, {typeline: req.query.typeline});
  }
  if (req.query.stateline && !req.query.stateline == ""){
    Object.assign(query, {stateline: req.query.stateline});
  }
  if (req.query.typeround && !req.query.typeround == ""){

    if (req.query.typeround == "رند" || req.query.typeround == "نیمه رند" || req.query.typeround == "معمولی"){
      Object.assign(query, {typeround: req.query.typeround});
    }
    if (req.query.typeround == "رند نیمه رند"){
      Object.assign(query,  { $or: [{typeround: "رند"},{typeround: "نیمه رند"}] });

    }
    if (req.query.typeround == "رند معمولی"){
      Object.assign(query,  { $or: [{typeround: "رند"},{typeround: "معمولی"}] });

    }
    if (req.query.typeround == "نیمه رند معمولی"){
      Object.assign(query,  { $or: [{typeround: "نیمه رند"},{typeround: "معمولی"}] });

    }
  }

  if (req.query.typepayment && !req.query.typepayment == ""){
    Object.assign(query, {typepayment: req.query.typepayment});
  }

  if ((req.query.pricefrom && !req.query.pricefrom == "") && (!req.query.priceto || req.query.priceto == "")){

    Object.assign(query, {priceint:{ $gte: Number(req.query.pricefrom.replace(  ",", "")) }});
  //Object.assign(query, {priceint:{ $gte: 206777777777 }});
  }
  if ((req.query.priceto && !req.query.priceto == "") && (!req.query.pricefrom || req.query.pricefrom == "")){
    Object.assign(query, {priceint:{ $lte: Number(req.query.priceto.replace(  ",", "")) }});
  }
  if (req.query.priceto && !req.query.priceto == "" && !req.query.pricefrom == "" && req.query.pricefrom){
    Object.assign(query, {priceint:{ $gte: Number(req.query.pricefrom.replace(  ",", "")), },priceint:{ $lte: Number(req.query.priceto.replace(  ",", "")) }});
  }

if (req.query.digit1 && !req.query.digit1 == ""){
Object.assign(query, { digit1:req.query.digit1});

}
if (req.query.digit2 && !req.query.digit2 == ""){
Object.assign(query, { digit2:req.query.digit2});

}
if (req.query.digit3 && !req.query.digit3 == ""){
Object.assign(query, { digit3:req.query.digit3});

}
if (req.query.digit4 && !req.query.digit4 == ""){
Object.assign(query, { digit4:req.query.digit4});

}
if (req.query.digit5 && !req.query.digit5 == ""){
Object.assign(query, { digit5:req.query.digit5});

}
if (req.query.digit6 && !req.query.digit6 == ""){
Object.assign(query, { digit6:req.query.digit6});

}
if (req.query.digit7 && !req.query.digit7 == ""){
Object.assign(query, { digit7:req.query.digit7});

}

   MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
    if (err) throw err;

  var totalpage = 0;
  let pagecount = 10;
     var dbo = db.db("myDB");
     dbo.collection("temprequest").count(query)
        .then((count) => {
          //console.log("req.query.param:" + count);
         if (count > 0) {
            totalpage = parseInt(count/pagecount);
            if (count/pagecount > parseInt(count/pagecount) )
               totalpage = totalpage + 1;
         }

        });
      //dbo.collection("products").find({}).toArray(function(err, result) {
      let skip = (parseInt(req.query.page)-1) * pagecount;
      var mysort = { _id: -1 };
  //dbo.collection("temprequest").find(query).sort(mysort).skip(skip).limit(pagecount).toArray(function(err, result) {
dbo.collection("temprequest").find(query).sort(mysort).skip(skip).limit(pagecount).toArray(function(err, result) {
 //res.send({result});
 dbo.collection("setting").findOne({},function(err, setting) {
      if (err) throw err;
    var setting1 = setting;
 res.json({result,nowmicrotime:Date.now(),setting:setting1,totalpage:totalpage,page:req.query.page});

 //res.render('management/index' , { result: result,item:"newadv",totalpage:totalpage,page:req.query.page});
 //res.json({result,totalpage:totalpage,page:req.query.page});

  db.close();
});
});

 });
});

app.post("/api/deleteadv", (req, res, next) => {
  resultfinal = {
    result: 'Error',
    describe: "خطا رخ داد",
    status : "unsuccess"

  };
  verifytoken(req.body.token);
  //console.log("1 tender startedffff - " + verifytokenn);
  if (verifytokenres || verifytokenflag){

  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
      var dbo = db.db("myDB");
      var myquery = { "_id": parseInt(req.body.id) };
  /*dbo.collection("temprequest").deleteOne(myquery, function(err, obj) {
  if (err) throw err;
  resultfinal = {
    result: 'OK',
    describe: "عملیات با موفقیت انجام شد",
   status : "successfull",
 };*/
  //var query = { _id: parseInt(req.query.id) };
  var newvalues1 = { $set: {state: "حذف شده",stateeng:"deleted"} };
  dbo.collection("temprequest").updateOne(myquery, newvalues1, function(err, res) {
    if (err) throw err;
    //console.log(myquery1);

    });
    resultfinal = {
      result: 'OK',
      describe: "آگهی حذف شد",
      status : "success"

    };
res.json(resultfinal);
   db.close();
//});
});
}else{
       resultfinal = {
       result: 'Error',
       describe: "توکن نامعتبر است",
      status : "unsuccessfull",
    };
res.json(resultfinal);
     }

});
app.post("/api/pdcsinfo", (req, res, next) => {
  //console.log(req.body.province);
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
     if (err) throw err;
      var dbo = db.db("myDB");

    var queryy = [];
      for (i=0;i<req.body.idpdc.length;i++){
           queryy.push({_id: parseInt(req.body.idpdc[i])});
           //console.log(req.body.idpdc[i]);
      }
query = { $or: queryy };
      dbo.collection("temprequest").find(query).toArray(function(err, result) {

     //res.send({result});
     //res.render('management/index' , { result: result,item:"newadv",totalpage:totalpage,page:req.query.page});
     dbo.collection("setting").findOne({},function(err, setting) {
          if (err) throw err;
        var setting1 = setting;

     res.json({result,nowmicrotime:Date.now(),setting:setting1,totalpage:1,page:1});

      db.close();
     });
     });
  });
});


//promotion
app.post("/api/payment",(req,res) => {
  verifytoken(req.body.token);
    // console.log("1 tender startedffff - " + req.body.token);
   if (verifytokenres || verifytokenflag){

/*  var result = {
    result: 'Error',
    describe: "با مشکل مواجه شد",
    mobile: req.body.id

  };*/
  var result = {
    result: 'OK',
    describe: "ارتقا با موفقیت انجام شد",
    mobile: req.body.id

  };
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
    var dbo = db.db("myDB");

var query = {_id: parseInt(req.body.id) };

if (req.body.item == "instant"){
  console.log("result:" + req.body.id );
var newvalues = { $set: {instant: "yes",microtimecreate:Date.now()} };

      dbo.collection("temprequest").updateOne(query, newvalues, function(err, res) {
        if (err) throw err;
});
//res.json(result);
db.close();
}
if (req.body.item == "rise"){
var newvalues = { $set: {rise:"yes",microtimeupdate: Date.now(),microtimecreate:Date.now()} };

      dbo.collection("temprequest").updateOne(query, newvalues, function(err, res) {
        result = {
          result: 'OK',
          describe: "ارتقا با موفقیت انجام شد",
          mobile: req.body.id

        };

          db.close();
});
}
if (req.body.item == "instantrise"){
var newvalues = { $set: {rise:"yes",instant: "yes",microtimeupdate: Date.now(),microtimecreate:Date.now()} };

      dbo.collection("temprequest").updateOne(query, newvalues, function(err, res) {
        result = {
          result: 'OK',
          describe: "ارتقا با موفقیت انجام شد",
          mobile: req.body.id

        };

          db.close();
});
}
if (req.body.item == "renew"){
var newvalues = { $set: {rise:"no",instant: "no",microtimecreate:Date.now(),expiretime: Date.now() + 2629746000} };

      dbo.collection("temprequest").updateOne(query, newvalues, function(err, res) {
        result = {
          result: 'OK',
          describe: "ارتقا با موفقیت انجام شد",
          mobile: req.body.id

        };

          db.close();
});
}
if (req.body.item == "renewrise"){
var newvalues = { $set: {rise:"yes",instant: "no",microtimeupdate: Date.now(),microtimecreate:Date.now(),expiretime: Date.now() + 2629746000} };

      dbo.collection("temprequest").updateOne(query, newvalues, function(err, res) {
        result = {
          result: 'OK',
          describe: "ارتقا با موفقیت انجام شد",
          mobile: req.body.id

        };

          db.close();
});
}
if (req.body.item == "instantrenewrise"){
var newvalues = { $set: {rise:"yes",instant: "yes",microtimeupdate: Date.now(),microtimecreate:Date.now(),expiretime: Date.now() + 2629746000} };

      dbo.collection("temprequest").updateOne(query, newvalues, function(err, res) {
        result = {
          result: 'OK',
          describe: "ارتقا با موفقیت انجام شد",
          mobile: req.body.id

        };

          db.close();
});
}
if (req.body.item == "instantrenew"){
var newvalues = { $set: {rise:"no",instant: "yes",microtimecreate:Date.now(),expiretime: Date.now() + 2629746000} };

      dbo.collection("temprequest").updateOne(query, newvalues, function(err, res) {
        result = {
          result: 'OK',
          describe: "ارتقا با موفقیت انجام شد",
          mobile: req.body.id

        };

          db.close();
});
}
res.json(result);
//db.close();
//});
});
}else{
  resultfinal = {
  result: 'Error',
  describe: "توکن نامعتبر است",
 status : "unsuccessfull",
};
res.json(resultfinal);
}
});
//end of promotion

//------check tokens
function verifytoken(token){
  // decode token
  //console.log("1 tokentokentoken - " + token);

   jwt.verify(token, app.get('superSecret'), function(err, decoded) {       if (err) {
      // return false;
       verifytokenres = false;
    // console.log("1 token is fake - ");
        } else {
       // if everything is good, save to request for use in other routes
       //console.log("1 token is true - ");
       verifytokenres = true;
       //return true;

     }
   });


}
//-------
app.post("/api/report",(req,res) => {

  resultfinal = {
    result: 'Error',
    describe: "خطا رخ داد",
    status : "unsuccess"

  };
  verifytoken(req.body.token);
  if (verifytokenres || verifytokenflag){

      if (req.body.advid != "" || req.body.advid != "undefined" ||req.body.token != "" || req.body.token != "undefined"){

 //        var resultfinal = {result: 'Error',
   //      describe: "خطا",
     //    status : "unsuccess"
     // };
      MongoClient.connect(url, (err, db) => {
      var dbo = db.db("myDB");
      autoIncrementmongo.getNextSequence(db, "report", function (err, autoIndex) {
       if (err) throw err;

      MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
       if (err) throw err;


       var datenow = dateFormat(new Date(Date.now()), "yyyy-mm-dd HH:MM:ss");
       var dateCreate = moment(datenow,'YYYY-MM-DD-HH:mm:ss').locale('fa').format('YYYY/MM/DD-HH:mm:ss');
        let timecreat = dateCreate;

       var myobj = {_id:autoIndex,numberline: req.body.numberline,mobileseller: req.body.mobileseller,mobileuser: req.body.mobileuser,timecreat:timecreat,response:"در انتظار بررسی"}

       dbo.collection("report").insertOne(myobj, function(err, mongoResponse) {

         //remove extra message
         dbo.collection("report").count({})
        .then((count) => {
          if (count > 50) {

            dbo.collection("report").deleteOne({}, function(err, obj) {
            if (err) throw err;
            //console.log("1 document deleted");
            db.close();
            //res.json(result);
            });
          }

        });


       console.log("1 message");

       resultfinal = {result: 'OK',
       describe: "گزارش با موفقیت ثبت شد و در اسرع وقت پیگیری خواهد شد. باتشکر از شما",
       status : "success"
       };
res.json(resultfinal);
        db.close();
       });

         //assert.equal(null, err);

          });
          });
          });
        }
      }else{
        resultfinal = {
        result: 'Error',
        describe: "توکن نامعتبر است",
       status : "unsuccessfull",
     };
      }
  });

  //-----------
app.post("/api/support",(req,res) => {
  resultfinal = {
    result: 'Error',
    describe: "خطا رخ داد",
    status : "unsuccess"

  };
  verifytoken(req.body.token);
  if (verifytokenres || verifytokenflag){

      if (req.body.mobile != "" && req.body.mobile != "undefined" && req.body.message != "" && req.body.message != "undefined"){

 //        var resultfinal = {result: 'Error',
   //      describe: "خطا",
     //    status : "unsuccess"
     // };
      MongoClient.connect(url, (err, db) => {
      var dbo = db.db("myDB");
      autoIncrementmongo.getNextSequence(db, "support", function (err, autoIndex) {
       if (err) throw err;

      MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
       if (err) throw err;


       var datenow = dateFormat(new Date(Date.now()), "yyyy-mm-dd HH:MM:ss");
       var dateCreate = moment(datenow,'YYYY-MM-DD-HH:mm:ss').locale('fa').format('YYYY/MM/DD-HH:mm:ss');
        let timecreat = dateCreate;

       var myobj = {_id:autoIndex,message: req.body.message,mobile: req.body.mobile,timecreat:timecreat,response:"در انتظار پاسخ"}

       dbo.collection("support").insertOne(myobj, function(err, mongoResponse) {

         //remove extra message
         dbo.collection("support").count({})
        .then((count) => {
          if (count > 200) {

            dbo.collection("support").deleteOne({}, function(err, obj) {
            if (err) throw err;
            //console.log("1 document deleted");
            db.close();
            //res.json(result);
            });
          }

        });


       console.log("1 message");

       resultfinal = {result: 'OK',
       describe: "پیام با موفقیت ثبت گردید",
       status : "success"
       };
res.json(resultfinal);
        db.close();
       });

         //assert.equal(null, err);

          });
          });
          });
        }
      }else{
        resultfinal = {
        result: 'Error',
        describe: "توکن نامعتبر است",
       status : "unsuccessfull",
     };
      }
  });
app.get("/api/sms",(req,res) => {

  //console.log("sms sent successful" + req.query.mobile);
  console.log("sms sent successful");
  var result = {
    result: 'Error',
    describe: "ارسال پیامک با مشکل مواجه شد",
    mobile: req.query.mobile

  };
var smscode = Math.floor(100000 + Math.random() * 900000);
  //savetodb();

//kavenegar Panel
api.VerifyLookup({
    receptor: req.query.mobile,
    token: smscode,
    template: "VerifymyDB"
}, function(response, status) {
    console.log(response);
    console.log(status);
    if (status == 200){
      result = {
        result: 'OK',
        describe: "پیامک ارسال شد",
        mobile: req.query.mobile,

      };
      savetodb();
//res.json(result);
    }else{
      result = {
        result: 'Error',
        describe: "ارسال پیامک با مشکل مواجه شد",
        mobile: req.query.mobile

      }
//res.json(result);
    }
    res.json(result);
});

function savetodb(){
//  console.log("sms sent successful + req.query.mobile");
MongoClient.connect(url, (err, db) => {

if (err) throw err;
var dbo = db.db("myDB");


//autoIncrementmongo.getNextSequence(db, "smsinfo", function (err, autoIndex) {

   var myobj = {mobile:req.query.mobile,smscode:smscode};

    dbo.collection("smsinfo").insertOne(myobj, function(err, mongoResponse) {
//     res.json(result);
   });

   setTimeout(function(str1, str2) {
     //io.emit("tenderexpired" , autoIndex);
     var myquery = {mobile:req.query.mobile};
     dbo.collection("smsinfo").deleteOne(myquery, function(err, obj) {
     if (err) throw err;
     console.log("1 document deleted");
     db.close();
 });

      console.log(str1 + " " + str2);
    }, 180000, "Hello.", "one smscode expired");

//});
});

}
});
//end of send sms
//sms verification
app.get("/api/smsverifyuser",(req,res) => {
  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
     if (err) throw err;
      var dbo = db.db("myDB");
      var resultfinal = {};

         //var status = "not registered";
      //verify if the user is regeistered or no
  //console.log('Username does not existrrrr.' + req.query.mobile+"::"+);
    var userinfo = {};
    var flag = 0;
    var query2 = { mobile:req.query.mobile};

    dbo.collection("user").find(query2).limit(1).toArray(function(err, result) {
    //dbo.collection("seller").findOne(query2, function(err, result) {
      if (err) throw err;
       if (result.length) {

        flag = 1;
      userinfo = {

        lat: result[0].lat,
        long: result[0].long,
        mobile: result[0].mobile

      };
    }
       });

       //--------------
      var query = { mobile:req.query.mobile,smscode:parseInt(req.query.smscode)  };

    dbo.collection("smsinfo").count(query, { limit: 1 })
     .then((count) => {
       if (count > 0) {
         //create token
         const payload = {
         admin: req.query.mobile     };
           var token = jwt.sign(payload, app.get('superSecret'));


           if (flag == 1){
             //console.log("sms:" + req.query.token);
             resultfinal = {
               result: 'OK',
               describe: "کد پیامک مورد تایید است",
               token: token,
               status : "registered",
               userinfo: userinfo

             };
           }else{

         resultfinal = {
           result: 'OK',
           describe: "کد پیامک مورد تایید است",
           status: "not registered",
           mobile: req.query.mobile,

         };

       }
         //res.json(result);
       } else {
         //console.log('Username does not exist.');
         resultfinal = {
           result: 'Error',
           describe: "کد پیامک اشتباه است",
           mobile: req.query.mobile,

         };

       }
       res.json(resultfinal);
     });

     if (err) throw err;

       db.close();
     });

});

//----------------
//sockets
SOCKET_LIST = {};
io.sockets.on("connection",function(socket){

console.log('Client connected...');
socket.username = ""

/*suggest.find({},function(err,docs){
 if(err) throw err;
 console.log("sending old suggestions");
 socket.emit('load old suggestions' , docs)
});*/

socket.on('disconnect', function(){
console.log('user disconnected');

for (const property in SOCKET_LIST) {
if (SOCKET_LIST[property] == socket.id){
socket.broadcast.emit("leftuser",property);
delete SOCKET_LIST[property];
break;

//console.log(`${property}: ${SOCKET_LIST[property]}`);
}
}

});

//chat

socket.on('subscribealert',function(data){
var ff = 0;
for (const property in SOCKET_LIST) {
if (property == data.mobile){
ff=1;
break;

}
}

//if(ff==0){
SOCKET_LIST[data.mobile] = socket.id;
//console.log('someone joned!'+data.mobile);
socket.emit('ListOnlineUsers', SOCKET_LIST);
socket.broadcast.emit("loginuser",data.mobile);

//}
});

socket.on('subscribe',function(data){

var ff = 0;
for (const property in SOCKET_LIST) {
if (property == data.mobile){
ff=1;
break;

}
}

//if(ff==0){
//addusertokentodb
MongoClient.connect(url, (err, db) => {
var dbo = db.db("myDB");
autoIncrementmongo.getNextSequence(db, "usertokens", function (err, autoIndex) {
if (err) throw err;

MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
if (err) throw err;
var myobj = {_id:autoIndex,mobileuser: data.mobile,tokenfirebase: "",tokensocket: socket.id}


var newvalues1 = { $set: {tokensocket: socket.id}};

let query = {mobileuser:data.mobile};
dbo.collection("usertokens").count(query, { limit: 1 })
.then((count) => {
if (count > 0) {

dbo.collection("usertokens").updateOne(query, newvalues1, function(err, res) {
if (err) throw err;
//console.log(myquery1);
console.log("1 usertokens updated");
});
res.json({result: resultt,message: message,amount:amount});
db.close();

}else{
dbo.collection("usertokens").insertOne(myobj, function(err, mongoResponse) {

console.log("1 usertokens inserted");
db.close();
});
}

});


});
});
});
//----------------

SOCKET_LIST[data.mobile] = socket.id;
//console.log('someone jonedff!'+data.mobile);
socket.emit('ListOnlineUsers', SOCKET_LIST);
socket.broadcast.emit("loginuser",data.mobile);

//}
});
socket.on('typing',function(data){
//console.log('someone!'+data.numberline+data.mobilesender+data.mobilereciver);
//socket.broadcast.emit("typing",{mobile:data});
io.to(SOCKET_LIST[data.mobilereciver]).emit('typing',{mobile:data.mobilesender,numberline:data.numberline});

//console.log('someone!'+data);
});

socket.on('typingfinish',function(data){
//socket.broadcast.emit("typingfinish",{mobile:data});
io.to(SOCKET_LIST[data.mobilereciver]).emit('typingfinish',{mobile:data.mobilesender,numberline:data.numberline});
//console.log('someone!'+data);
});

socket.on('sendmessage',function(data){
console.log('someone sent a message!'+data.mobilereciever);
verifytoken(data.token);
if (verifytokenres || verifytokenflag){
 //  console.log('someone sent a message!'+data.id);
 //  for(var i in SOCKET_LIST){
   //SOCKET_LIST[i].emit('addToChat', data);
   var flag =0;
   var datenow = dateFormat(new Date(Date.now()), "yyyy-mm-dd HH:MM:ss");
   var dateCreate = moment(datenow,'YYYY-MM-DD | HH:mm').locale('fa').format('YYYY/MM/DD | HH:mm');
     var timeCreate2 = moment(datenow,' | HH:mm').locale('fa').format(' | HH:mm');
     timeCreate2 = "امروز"+timeCreate2;
    let timecreat = dateCreate;
    let day = "امروز";


    MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
     if (err) throw err;

      var dbo = db.db("myDB");

       var query2 = { mobileuser:data.mobilereciever,mobileblock: data.mobilesender};

       dbo.collection("blacklist").count(query2)
       .then((count) => {
           if (count > 0) {

             socket.emit('addToChat', {mobilereciever:data.mobilereciever,mobilesender:data.mobilesender,message:"banned",numberline:data.numberline,time:timeCreate2});

               flag=1;
               db.close();

        }else{
          //-----------
           //console.log('someone addToChat!'+data.mobilereciever);
         /*  var query = { mobileuser:data.mobilereciever};

            MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
              var dbo = db.db("myDB");
             if (err) throw err;
           dbo.collection("usertokens").findOne({query},function(err, result) {
                if (err) throw err;
                io.to(result.tokensocket).emit('recivemessage',{mobilereciever:data.mobilereciever,mobilesender:data.mobilesender,nameuser:data.namesender,message:data.message,numberline:data.numberline,time:timeCreate2,id:data.id})
                 socket.emit('addToChat', {mobilereciever:data.mobilereciever,mobilesender:data.mobilesender,message:data.message,numberline:data.numberline,time:timeCreate2});
                 io.to(SOCKET_LIST[result.tokensocket]).emit('recivemessagealert',{mobilereciever:data.mobilereciever,mobilesender:data.mobilesender,nameuser:data.namesender,message:data.message,numberline:data.numberline,time:timeCreate2,id:data.id})

                 senndnotification(data.mobilereciver);

           });
         });*/
         io.to(SOCKET_LIST[data.mobilereciever]).emit('recivemessage',{mobilereciever:data.mobilereciever,mobilesender:data.mobilesender,nameuser:data.namesender,message:data.message,numberline:data.numberline,time:timeCreate2,id:data.id})
          socket.emit('addToChat', {mobilereciever:data.mobilereciever,mobilesender:data.mobilesender,message:data.message,numberline:data.numberline,time:timeCreate2});
          io.to(SOCKET_LIST[data.mobilereciever]).emit('recivemessagealert',{mobilereciever:data.mobilereciever,mobilesender:data.mobilesender,nameuser:data.namesender,message:data.message,numberline:data.numberline,time:timeCreate2,id:data.id})

          senndnotification(data.mobilereciever);
         //add in database
         MongoClient.connect(url, (err, db) => {
         var dbo = db.db("myDB");
     autoIncrementmongo.getNextSequence(db, "chat", function (err, autoIndex) {
       if (err) throw err;
         MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
          if (err) throw err;


          var myobj = {_id:autoIndex,mobilereciever:data.mobilereciever,mobilesender:data.mobilesender,namesender:data.namesender,namereciver:data.namereciver,message:data.message,numberline:data.numberline,time:dateCreate,viewed:"false",microtime:Date.now(),idadv:data.id}

          dbo.collection("chat").insertOne(myobj, function(err, mongoResponse) {


        console.log("new chat doucument inserted!!");
           db.close();
          });

            //assert.equal(null, err);

             });
});
             });

              //--------------
             //end add to database
        }
      });


});

}
});



socket.on('viewed',function(data){
console.log('someone viewed a meerreerereererreressage!'+data.room);
verifytoken(data.token);
if (verifytokenres || verifytokenflag){


//save to database
MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
if (err) throw err;
var dbo = db.db("myDB");

console.log("new chat viewed!!"+data.mobileuser+data.mobilepartner+data.numberline+"::"+data.room );
var query = { mobilereciever: data.mobileuser,mobilesender:data.mobilepartner,numberline:data.numberline};
if(data.mobilepartner =="myDB"){
query = { mobilereciever: data.mobileuser,mobilesender:"myDB"};
}
var newvalues1 = { $set: {"viewed": "true"} };
dbo.collection("chat").updateMany(query, newvalues1, function(err, res) {
if (err) throw err;
//console.log(myquery1);
io.to(SOCKET_LIST[data.mobilepartner]).emit('viewed',{room:data.room});
console.log("new chat viewed!!");
db.close();
});



});
//end save to database
}
});

function senndnotification(mobile){
//var registrationToken = "eg-DBKTcjsc:APA91bG5mnW8U2GrTvt19dQppXYTHbmolX9dFG0Qcij5Vn7dUJQkGofuLj-gtIw5fpOyPYJmre2lX7U8FC6dyhy6vy1ogunsQw033ehZflP_eh8mdFGpx_a4K25ASK57lNUkYL7VRBU0";
//var registrationToken = "dwkB-jvMLBc:APA91bExVQDk5K4o-D2QdcembP_OvrJzWIiMHvWHb-wNQg4pC8Z8Gx8yxOCUaPr_riRjq1ZrcD7DgBQ5P2GLDjCVCfpoQDhr64MoI-86TSFXABP76kcgP0JrKTLkJcAy2opYOADhr3Np";
//var registrationToken = "dwkB-jvMLBc:APA91bEHlVXyOdxtSTlzz0eznOmZqZCnD5KkLCbnKOhuTS9Hks6HM7KGFBC00-AyekrgGcU6h-B529UD9T8nqxVima9hMlauzYLBNEjfH2Ixdsi_8sE9kZlcReyeBIX9BqKiEa_4uquT";
console.log("senndnotification:"+mobile);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
//if (err) throw err;
var dbo = db.db("myDB");
var query = { mobileuser:mobile};
if (err) throw err;
dbo.collection("usertokens").count(query, { limit: 1 })

.then((count) => {
if (count > 0) {

dbo.collection("usertokens").findOne(query,function(err, result) {
 if (err) throw err;

registrationToken = result.tokenfirebase;

request({
        url: '',
        strictSSL: false
    }, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            //res.json(JSON.parse(body));
            console.log("senndnotificationregistrationToken:"+registrationToken);
        } else {
           //res.json(response.statusCode, {'error': 'error'})
        }
});

});
}

});
});




}
//end of chat
socket.on("newmessagesupport" , function(data){
console.log('newmessagesupport newmessagesupport...');
verifytoken(data.token);
console.log("1 tender startedffff - " + data.token);
var resultfinal = {result: 'Error',
describe: "خطا",
status : "unsuccess"
};
if (verifytokenres || verifytokenflag){
console.log("1 newmessagesupport" + data.mobile);
if (data.mobile != "" && data.mobile != "undefined" && data.messegae != "" && data.messegae != "undefined"){

//        var resultfinal = {result: 'Error',
//      describe: "خطا",
//    status : "unsuccess"
// };
MongoClient.connect(url, (err, db) => {
var dbo = db.db("myDB");
autoIncrementmongo.getNextSequence(db, "support", function (err, autoIndex) {
if (err) throw err;

MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
if (err) throw err;


var datenow = dateFormat(new Date(Date.now()), "yyyy-mm-dd HH:MM:ss");
var dateCreate = moment(datenow,'YYYY-MM-DD-HH:mm:ss').locale('fa').format('YYYY/MM/DD-HH:mm:ss');
let timecreat = dateCreate;

var myobj = {_id:autoIndex,message: data.messegae,mobile: data.mobile,timecreat:timecreat,response:"در انتظار پاسخ"}

dbo.collection("support").insertOne(myobj, function(err, mongoResponse) {

//remove extra message
dbo.collection("support").count({})
.then((count) => {
if (count > 200) {

  dbo.collection("support").deleteOne({}, function(err, obj) {
  if (err) throw err;
  //console.log("1 document deleted");
  db.close();
  //res.json(result);
  });
}

});


console.log("1 message");

resultfinal = {result: 'OK',
describe: "پیام با موفقیت ثبت گردید",
status : "success"
};
//res.json({'result': 'OK','message': 'insert successfully'});
//io.emit("messagesuccess" + data.mobile,{resultfinal});
io.emit("alerttomanagement",{});
socket.emit("respondesupport" + data.mobile  , resultfinal );
db.close();
});

//assert.equal(null, err);

});
});
});
}
}else{
resultfinal = {
result: 'Error',
describe: "توکن نامعتبر است",
status : "unsuccessfull",
};socket.emit("respondesupport" + data.mobile  , resultfinal );
}
});


})
//get lifetimetender
app.get("/lifetimetender",(req,res) => {
//var datenow = new Date(Date.now()).toLocaleString();

  MongoClient.connect(url,{ useNewUrlParser: true }, (err, db) => {
   if (err) throw err;
    var dbo = db.db("myDB");


    if (err) throw err;

    var images = [{"specificlbl":"تعداد سیمکارت","specific":"دو سیمکارته"},{"specificlbl":"پردازنده","specific":"هشت هسته ای"},{"specificlbl":"صفحه نمایش","specific":"۶ اینچی"}]
var myquery = { "_id": 42}

    //  dbo.collection("temprequest").updateOne(myquery, newvalues, function(err, res) {
    //dbo.collection("admin").updateMany({}, newvalues, function(err, res) {
      dbo.collection("admin").insertOne(newvalues, function(err, mongoResponse) {
    db.close();
  });
  });

});
//---------------------------
server.listen(port, function(){
  console.log('listening on *:' + port);

});

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))
