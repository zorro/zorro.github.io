  var cc = document.getElementById("channel-list")
  for ([x, y] of Object.entries(channels)) {
    var li = document.createElement("li")
    li.classList.add("selectchannel")
    li.setAttribute("data-channel", y.mediaid)
    //li.appendChild(document.createElement("img")).setAttribute("src", "images/vividh-bharati.jpg")
    var n = document.createElement("div")
    n.classList.add("channel-name")
    n.innerText = y.title
    li.appendChild(n)
    cc.appendChild(li)
  }
  var audio;
  var channel = "1";
  var currentactive = '.channel>ul>li[data-channel=' + channel + ']';
  var volume = 1;
  var voulmedrag = false;
  var WPURLS = "http://allindiaradio.gov.in";
  $(window).on('load', function(e) {
    var filture = channels[channel];
    $('.channel-img').attr('src',filture.thumbnail);
    $('.air-channel-name').html(filture.title);
    $('.loader').fadeOut(function() {
      air_radio_play();
    });
  });
  $(window).on('resize', function(e) {
    // console.log('dada');
    setTimeout(window.resizeTo(400, 650), 5000);
  });
  $(function() {
    // console.log(window.height());
    window.resizeTo(400, 650);

    $(currentactive).addClass('active');

    $('.selectchannel').click(function(e) {
      var _href = $('#view_page').attr("href");
      channel = $(this).attr('data-channel');
      $('.channel>ul>li.active').removeClass('active');
      $(this).addClass('active');
      var filture = channels[channel];
      $('#view_page').attr("href", WPURLS + filture.page);
      $('.channel-img').fadeOut("fast", function() {
        $(this).attr('src', filture.thumbnail);
        $(this).fadeIn("fast")
      });
      $('.channel-img').attr('src',filture.thumbnail);
      $('.air-channel-name').html(filture.title);
      // console.log(channel);
      air_radio_pause();
      air_radio_play();
      // console.log(channel);
    });
    $('.icon-to-start').click(function() {
      var previous = channels[channel];
      channel = previous.previous;
      air_radio_pause();
      air_radio_play();
    });
    $('.icon-to-end').click(function() {
      var next = channels[channel];
      channel = next.next;
      air_radio_pause();
      air_radio_play();
    });
    $('.play-icon').click(function() {
      if ($(this).hasClass('icon-play'))
      {
        air_radio_play();
      }
      else
      {
        air_radio_pause();
      }

    });
    $('.volume-adjust').on('mousedown', function(e) {
      voulmedrag = true;
      audio.muted = false;
      updateVolume(e.pageY);
    });
    $(document).on('mouseup', function(e) {
      if (voulmedrag)
      {
        updateVolume(e.pageY);
      }
    });
    $(document).on('mouseup', function(e) {
      if (voulmedrag)
      {
        voulmedrag = false;
        updateVolume(e.pageY);
      }
    });

    //    var bar = $('.music-bar');
    // //var t1 = new TimelineMax({onUpdate:updateUI, repeat:-1})
    // window.setInterval(function() {
    // 	$(bar).each(function() {
    // 		TweenMax.to(this, 0.2, {height: Math.floor(Math.random()*121) + 30, ease:Power0.easeNone, yoyo: true});
    // 	});
    // }, 200);      
  });

  function air_radio_play()
  {
    // console.log(channel);
    filturestream = channels[channel];
    // console.log(filturestream);
    $('.loading').fadeIn("fast", function() {});
    // console.log(filturestream);
    if (!(load = hlsload(filturestream.link))) {
      $('.sub-exception').text("Error: " + load);
    };
    audio.play().then(() => {
      $('.sub-exception').text("");
    }).catch((error) => {
      $('.sub-exception').text("Error: " + error);
    });
    audio.volume = volume;
    // console.log(volume);
    $('.play-icon').removeClass('icon-play').addClass('icon-spin4 animate-spin');
    audio.oncanplaythrough = function() {
      if ($('.play-icon').hasClass('icon-spin4') || $('.play-icon').hasClass('icon-play'))
      {
        $('.play-icon').removeClass('icon-spin4 animate-spin icon-play').addClass('icon-pause');
      }
      if ($('#audio-animation div').hasClass("pause"))
      {
        $('#audio-animation div').removeClass('pause').addClass('play');
        $('.loading').fadeOut("fast", function() {
          $('.animation div').removeClass('pause').addClass('play');
        });

      }
    }
  }

  function air_radio_pause()
  {
    if (audio)
    {
      if ($('.play-icon').hasClass('animate-spin'))
      {

      }
      else
      {
        audio.pause();
        $('.play-icon').removeClass('icon-pause').addClass('icon-play');
        if ($('#audio-animation div').hasClass("play"))
        {
          $('#audio-animation div').removeClass('play').addClass('pause');
        }
      }
    }
  }

  function hlsload(stream)
  {
    if (Hls.isSupported())
    {
      audio = document.getElementById('air-player-audio');
      var hls = new Hls();
      hls.loadSource(stream);
      hls.attachMedia(audio);
      hls.on(Hls.Events.MANIFEST_PARSED, function() {});
    }
    else
    {
      audio = document.getElementById('air-player-audio');
      audio.src = stream;
    }
  }
  var updateVolume = function(x, vol)
  {
    // console.log(x,vol);
    var vr = $('.volume-adjust');
    var percentage;
    if (vol)
    {
      percentage = vol * 100;
    }
    else {
      var position = x - vr.offset().top;
      percentage = 100 * position / vr.width();
    }
    if (percentage > 100)
    {
      percentage = 100;
    }
    if (percentage < 0)
    {
      percentage = 0;
    }
    percentage = 100 - percentage;
    // percentage = percentage;
    $('.volume-adjust div').css('width', percentage + '%');
    audio.volume = percentage / 100;
    volume = percentage / 100;
    // console.log(volume);
  }

  function window_set()
  {
    window.resize(400, 650);
  }