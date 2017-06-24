var createdRows=0;
$(document).ready(function(){
  var streamers=getStreamers();
  var rowNum=0;
  newRow(rowNum);
  for(i=0;i<streamers.length;i++){
    if(i&&(i%3==0)){
       newRow(++rowNum);
      createdRows++;
    }
    getStreamData(streamers[i],rowNum,"streams",i);
    console.log(createdRows);
  }
});
function getStreamers(){
  var streamers=["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas","destiny"];
  return streamers;
}
//Function to return stream JSON data
function getStreamData(name,rowNum,content,cardNum){
  $.ajax({
    url:'https://api.twitch.tv/kraken/'+content+'/'+name,
    method:'GET',
    datatype:'json',
    headers:{
      'Client-ID':'puli3850x85t3ndhgn39k0gn4fcbul',
    },
  }).done(function(data){
    $('.preloader-wrapper').css('display','none');
    if(data.stream==null&&content=="streams"){
      getStreamData(name,rowNum,"channels",cardNum);
    }
    else if(data.stream!=null&&content=="streams"){
       isOnline(data,true,rowNum,name,cardNum);
    }
    else{     
      isOnline(data,false,rowNum,name,cardNum);
    }
}).fail(function(){
    displayCardsDNE(name,rowNum);
  })
}
//Displays cards with stream info if the stream is live
function displayCardsOnline(name,preview,game,viewers,status,rowNum,cardNum){
  var card = '<div class="col-12 col-lg-4 card-online" id="card-num-'+cardNum+'" >'+
'          <div class="card">'+
        '<div class="card-image">'+
'              <img src="'+preview+'">'+
'              <span class="card-title">'+name+'<div class="bg-success text-white ml-3 chip">Live! '+viewers+'</div></span>'+
'            </div>'+
'            <div class="card-content">'+
'              <p class="h5">Game: '+game + '</br><p class="pt-1 h6"> Stream title:'+status+'</p></p>'+
'            </div>'+
'            <div class="card-action">'+
'            <a class="waves-effect waves-teal btn-flat btn-block btn-large watch-here">'+
'      <i class="material-icons">live_tv</i>&nbspWatch here</a>'+     
'            <a class="waves-effect waves-teal btn-flat btn-block btn-large" href="https://www.twitch.tv/'+name+'" target="_blank"><i class="fa fa-twitch" aria-hidden="true"></i>&nbspWatch on Twitch.tv</a>'+
'            </div>'+        
'          </div>'+
'        </div>';
  $('#row-'+rowNum).append(card);
  $('#card-num-'+cardNum+'').on('click', '.watch-here', function(){
    watchHere(name);
    $('html,body').animate({
            scrollTop: 0
        }, 700);
});
}
//Displays cards with streamer info if the stream is offline
function displayCardsOffline(name,banner,status,game,rowNum,cardNum){
      var card = '<div class="col-12 col-lg-4 del-card card-offline" id="card-num-'+cardNum+'" >'+
'          <div class="card">'+
        '<div class="card-image">'+
'              <img src="'+banner+'">'+
'              <span class="card-title">'+name+'<div class="bg-danger text-white ml-3 chip">Offline!</div></span>'+
'            </div>'+
'            <div class="card-content">'+
'              <p class="h5">Was playing: '+game+ '</br><p class="pt-1 h6"> Status: '+status+'</p></p>'+
'            </div>'+
'            <div class="card-action">'+
'            <a class="waves-effect waves-teal btn-flat btn-block btn-large watch-vods"><i class="material-icons">play_circle_filled</i>&nbspWatch vods</a>'+     
'            <a class="waves-effect waves-teal btn-flat btn-block btn-large watch-clips"><i class="material-icons" >play_arrow</i>&nbspWatch top clips</a>'+
'            </div>'+        
'          </div>'+
'        </div>';
  $('#row-'+rowNum).append(card);
  $('#card-num-'+cardNum+'').on('click', '.watch-clips', function(){
    $('.preloader-wrapper').css('display','block');
    getClips(name);
    $('html,body').animate({
            scrollTop: 0
        }, 700);
});
  $('#card-num-'+cardNum+'').on('click', '.watch-vods', function(){
    $('.preloader-wrapper').css('display','block');
    getVods(name);
    $('html,body').animate({
            scrollTop: 0
        }, 700);
});
}
//Displays a cards when streamer doesn't have an account 
function displayCardsDNE(name,rowNum){
     var card = '<div class="col-12 col-lg-4 del-card card-offline" >'+
'          <div class="card">'+
        '<div class="card-image">'+
'              <img src="https://i.imgpile.com/nNltxX.jpg">'+
'              <span class="card-title">'+name+'<div class="bg-danger text-white ml-3 chip">Invalid Account</div></span>'+
'            </div>'+       
'          </div>'+
'        </div>';
  $('#row-'+rowNum).append(card);
}
//Creates a new row with a numbered ID
function newRow(num){
  var myVar = '<div class="row" id="row-'+num+'">'+
''+
'</div>';
  $('.row-cont').append(myVar);
}
//Creates a iframe with a twitch livestream
function watchHere(name){
  $('.row-cont').children().hide();

  var stream = '<div class="embed-responsive stream embed-responsive-16by9"><iframe class="embed-responsive-item stream"'+
'    src="https://player.twitch.tv/?channel='+name+'"'+
'    height="1080"'+
'    width="1920"'+
'    frameborder="1"'+
'    scrolling="no"'+
'    allowfullscreen="yes">'+
'</iframe></div>';
	$('.row-cont').append(stream);
} 
//Checks if the stream is online and prints a card. If it isnt then it check if it's a valid channel and prints a offline or DNE card. 
function isOnline(data,online,rowNum,name,cardNum){
  if(online){
  displayCardsOnline(data.stream.channel.display_name,data.stream.preview.large,data.stream.game,data.stream.viewers,data.stream.channel.status,rowNum,cardNum);
    return;
  }
  var image=data.video_banner;
  if(image==null){
    image="https://i.imgpile.com/nNltxX.jpg";
  }
  var status=data.status;
  if(status==null){
    status="Nothing";
  }
  var game=data.game;
  if(game==null){
    game="Nothing";
  }
  displayCardsOffline(data.name,image,status,game,rowNum,cardNum);
}
//OnClick events for the tabs.
$('.tab-all').click(function(){
  console.log("clicked all");
  $('.stream').remove();
  $('.row-cont').children().show();
  $('.card-online').show();
  $('.card-offline').show();
});
$('.tab-online').click(function(){
  console.log("clicked online");
   $('.stream').remove();
  $('.row-cont').children().show();
  $('.card-offline').hide();
  $('.card-online').show();
});
$('.tab-offline').click(function(){
  console.log("clicked offline");
   $('.stream').remove();
  $('.row-cont').children().show();
  $('.card-online').hide();
  $('.card-offline').show();
});
//Get and display most recent vods
function getVods(name){
   $.ajax({
    url:'https://api.twitch.tv/kraken/channels/'+name+'/videos?sort=time&broadcast_type=archive',
    method:'GET',
    datatype:'json',
    headers:{
      'Client-ID':'puli3850x85t3ndhgn39k0gn4fcbul'
    }
  }).done(function(data){
     if(data.videos.length==0){
       $('.preloader-wrapper').css('display','none');
      Materialize.toast('Channel has no clips!', 4000);
    }
    else {
     console.log(data);
     $('.row-cont').children().hide();
     $('.preloader-wrapper').css('display','none');
    for(i=0;i<data.videos.length;i++){
      if(i%3==0){
       newRow(++createdRows);
    }
      displayVods(data.videos[i]._id,createdRows);
    }
    }
  });
    
}
//display Vod elements 
function displayVods(id,rowNum){
  var stream = '<div class="embed-responsive stream embed-responsive-16by9 mt-5 col-12 col-lg-4"><iframe class="embed-responsive-item stream"'+
'    src="https://player.twitch.tv/?video='+id+'&autoplay=false"'+
'    height="1080"'+
'    width="1920"'+
'    frameborder="1"'+
'    scrolling="no"'+
'    allowfullscreen="yes">'+
'</iframe></div>';
  $('#row-'+rowNum+'').append(stream);
}
//Get and display 10 most popular clips
function getClips(name,rowNum){
  $.ajax({
    url:'https://api.twitch.tv/kraken/clips/top?channel='+name+'&period=month&trending=true',
    method:'GET',
    datatype:'json',
    headers:{
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Client-ID':'puli3850x85t3ndhgn39k0gn4fcbul'
    }
  }).done(function(data){
    if(data.clips.length==0){
      $('.preloader-wrapper').css('display','none');
      Materialize.toast('Channel has no clips!', 4000);
    }
    else { console.log(data);
      $('.row-cont').children().hide();
    $('.preloader-wrapper').css('display','none');
    for(i=0;i<data.clips.length;i++){
      if(i%3==0){
       newRow(++createdRows);
    }
      displayClips(data.clips[i].slug,createdRows);
    }
         }
  });
  
}
//Display cilp elements
function displayClips(slug,rowNum){
  var stream = '<div class="embed-responsive stream embed-responsive-16by9 mt-5 col-12 col-lg-4">'+
'    <iframe'+
'    src="https://clips.twitch.tv/embed?clip='+slug+'&autoplay=false"'+
'    height="1920"'+
'    width="1080"'+
'    frameborder="1"'+
'    scrolling="no"'+
'    allowfullscreen="yes">'+
'</iframe></div>';
  $('#row-'+rowNum+'').append(stream);
}