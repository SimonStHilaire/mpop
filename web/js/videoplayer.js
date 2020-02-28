function Video() {
   this.$item = $(document.createElement('video'));
   //this.$item.css('opacity', 0);
   this.$item.loop = true;
   $('body').append(this.$item);

   this.Play = function(name, loop)
   {
    //console.log('Play request: ' + name);
    this.$item.attr('src', name);
    this.$item.css('opacity', 0);
    this.$item.stop();
    this.$item.loop = loop;

    this.$item.on('canplay', function()
    {
      //console.log('Playing: ' + this.$item[0].src);
        this.$item.css('opacity', 0);
        this.$item[0].loop = this.$item.loop;
        this.$item[0].play();
        this.$item.animate({opacity: 1}, 1000);
        this.$item.off('canplay');
    }.bind(this))
   };

   this.Stop = function()
   {
        if(this.$item.is(':animated') || this.$item[0].readyState < 4)
        {
          //console.log('Stopping: ' + this.$item[0].src);
          this.$item[0].pause();
          this.$item.css('opacity', 0);
          this.$item.off('canplay');
          this.$item[0].src = '';
        }
        else
        {
          //console.log('Stop request: ' + this.$item[0].src);
          this.$item.animate({opacity: 0}, 1000, function() {
            //console.log('Stop completed');
            this.$item[0].pause();
            this.$item.off('canplay');
            this.$item[0].src = '';
          }.bind(this));
        }

   };

   this.Seek = function (seekTime)
   {
       //console.log('Seek request: ' + seekTime);

       if(this.$item != undefined)
       {
           this.$item[0].currentTime = seekTime;
       }
   };

   this.IsPlaying = function ()
   {
       //console.log('Seek request: ' + seekTime);

       if(this.$item != undefined)
       {
           return !!(this.$item[0].currentTime > 0 && !this.$item[0].paused && !this.$item[0].ended && this.$item[0].readyState > 2);
       }
   };
}

var VideoPlayer = 
{
    items: [],
    currentItem: 0,
    Play: function(videoName, loop = false)
    {
        if(this.items.length == 0)
        {
            this.items[0] = new Video();
        }

        this.items[0].Stop();

        this.items[0].Play(videoName, loop);

    },

    Stop: function()
    {
      if(this.items.length == 0)
      {
          this.items[0] = new Video();
      }

      this.items[0].Stop();
    },

    Seek: function (seekTime)
    {
        if (this.items.length == 0)
        {
            this.items[0] = new Video();
        }

        this.items[0].Seek(seekTime);
    },

    IsPlaying: function()
    {
    	if(this.items.length > 0)
    	{
    		 return  this.items[0].IsPlaying();
    	}

    	return false;
    }
};
