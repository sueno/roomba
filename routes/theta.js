var express = require('express');
var router = express.Router();
var Theta = require('ricoh-theta');
var fs = require('fs');

var cronJob = require('cron').CronJob;
 
// 毎秒実行
var cronTime = "*/30 * * * * *";
 
// 一度だけ実行したい場合、Dateオブジェクトで指定も可能
// var cronTime = new Date();
 
var job = new cronJob({
  //実行したい日時 or crontab書式
  cronTime: cronTime
 
  //指定時に実行したい関数
  , onTick: function() {
    console.log('onTick!');
 
//ジョブ開始

try{
var theta = new Theta();

theta.connect('192.168.1.1');

// capture
theta.on('connect', function(){
  theta.capture(function(err){
    if(err) return console.error(err);
    console.log('capture success');
  });
});

// get picture
theta.on('objectAdded', function(object_id){
  theta.getPicture(object_id, function(err, picture){
    fs.writeFile('public/images/theta/current.jpg', picture, function(err){
      console.log('picture saved => .jpg');
      theta.disconnect();
    });
  });
});

}catch( e ){
  console.log( e );

}


  }
 
  //ジョブの完了または停止時に実行する関数 
  , onComplete: function() {
    console.log('onComplete!')
  }
 
  // コンストラクタを終する前にジョブを開始するかどうか
  , start: false
   
  //タイムゾーン
  , timeZone: "Japan/Tokyo"
})

job.start();

//}

module.exports = router;
