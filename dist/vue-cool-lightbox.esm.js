//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var script = {

  data: function data() {
    return {
      // swipe data
      initialMouseX: 0,
      initialMouseY: 0,
      endMouseX: 0,
      endMouseY: 0,
      swipeType: null,
      IsSwipping: false,
      isDraggingSwipe: false,

      // swipe effect
      xSwipeWrapper: 0,
      ySwipeWrapper: 0,
      swipeAnimation: null,
      swipeInterval: null,
      lightboxInnerWidth: null,

      // styles data
      imgIndex: this.index,
      isVisible: false,
      paddingBottom: false,
      imageLoading: false,
      showThumbs: false,
      isFullScreenMode: false,

      // aspect ratio videos
      aspectRatioVideo: {
        width: 'auto',
        height: 'auto',
      },

      // props to bind styles
      buttonsVisible: true,
      scale: 1,
      top: 0,
      left: 0,
      lastX: 0,
      lastY: 0,
      isDraging: false,
      canZoom: false,
      isZooming: false,
      transition: 'all .3s ease',

      // slideshow playing data
      isPlayingSlideShow: false,
      intervalProgress: null,
      loopData: false,
      stylesInterval: {
        'display': 'block'
      }
    };
  },

  props: {
    index: {
      required: true
    },

    effect: {
      type: String,
      default: 'swipe'
    },

    items: {
      type: Array,
      required: true,
    },

    loop: {
      type: Boolean,
      default: true,
    },

    slideshow: {
      type: Boolean,
      default: true,
    },

    slideshowColorBar: {
      type: String,
      default: '#fa4242',
    },

    slideshowDuration: {
      type: Number,
      default: 3000,
    },
    
    srcName: {
      type: String,
      default: 'src',
    },
    
    srcThumb: {
      type: String,
      default: 'thumb',
    },

    overlayColor: {
      type: String,
      default: 'rgba(30, 30, 30, .9)'
    },

    zIndex: {
      type: Number,
      default: 9999,
    },

    gallery: {
      type: Boolean,
      default: true,
    },

    fullScreen: {
      type: Boolean,
      default: false,
    },

    thumbsPosition: {
      type: String,
      default: 'right',
    }
  },

  watch: {
    showThumbs: function showThumbs(prev, val) {
      var widthGalleryBlock = 212;
      var swipeAnimation = 'all .3s ease';
      if(window.innerWidth < 767) {
        widthGalleryBlock = 102;
        swipeAnimation = null;
      }

      var self = this;
      this.swipeAnimation = swipeAnimation;

      if(prev) {
        this.xSwipeWrapper = -this.imgIndex*(window.innerWidth - widthGalleryBlock) - 30*this.imgIndex;
      } else {
        this.xSwipeWrapper = -this.imgIndex*window.innerWidth - 30*this.imgIndex;
      }

      setTimeout(function() {
        self.swipeAnimation = null;
      }, 300);
    },

    index: function index(prev, val) {
      var self = this;

      if(prev !== null) {
        
        // swipe type
        this.swipeType = null;
        this.initialMouseY = 0;
        this.ySwipeWrapper = 0;
        
        // set loop from data
        this.loopData = this.loop;

        // swipe effect case remove loop
        if(this.effect === 'swipe') {
          this.loopData = false;
        }

        // add img index
        this.imgIndex = prev;
        this.isVisible = true;

        // add events listener
        window.addEventListener('keydown', this.eventListener);
        
        // only in mobile
        if(window.innerWidth < 700) {

          // add click event
          setTimeout(function() {
            window.addEventListener('click', self.showButtons);
          }, 200);
        }

        // remove scroll
        document.getElementsByTagName('body')[0].style = 'overflow: hidden';

      } else {

        // hide and stop slideshow
        this.isVisible = false;
        this.stopSlideShow();

        // set starts X to 0
        this.startsX = 0;
        this.initialMouseY = 0;
        this.swipeType = null;

        // clear interval
        clearInterval(this.swipeInterval);
        this.swipeAnimation = null;

        // finish swipe
        this.isDraggingSwipe = false;
        this.isZooming = true;

        // remove events listener
        window.removeEventListener('keydown', this.eventListener);

        // remove styles avoid scroll
        document.getElementsByTagName('body')[0].style.overflow = '';

        // remove click event
        window.removeEventListener('click', this.showButtons);
      }

    }, 
    
    imgIndex: function imgIndex(prev, val) {
      var this$1 = this;
      
      // when animation is loaded
      this.$nextTick(function () {

        if(this$1.effect === 'swipe') {
          this$1.setLightboxInnerWidth();
          this$1.setXPosition(prev);
        }
        
        if(prev !== null & val === null) {
          this$1.$emit("on-open", prev);
        }

        if(prev !== null) {

          // if is an image change imageLoading to true
          if(!this$1.getVideoUrl(this$1.getItemSrc(prev))) {
            if(!this$1.is_cached(this$1.getItemSrc(prev))) {
              this$1.imageLoading = true;
            }
          }

          // add caption padding to Lightbox wrapper
          this$1.addCaptionPadding();

          // check if user can zoom
          this$1.checkZoom();
          
          // setAspectRatioVideo when is swipe
          if(this$1.effect === 'swipe') {
            this$1.setAspectRatioVideo();
          } else {

            if(this$1.getVideoUrl(this$1.getItemSrc(prev))) {
              this$1.setAspectRatioVideo();
            }
          }
        }

        // reset zoom
        this$1.resetZoom();

        // reset swipe type
        this$1.swipeType = null;
        this$1.ySwipeWrapper = 0;

      });
    }, 
  },

  methods: {
    toggleFullScreenMode: function toggleFullScreenMode() {
      if(this.isFullScreenMode) {
        this.closeFullscreen();
      } else {
        this.fullScreenMode();
      }

      this.isFullScreenMode = !this.isFullScreenMode;
    },

    closeFullscreen: function closeFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
      }
    },

    fullScreenMode: function fullScreenMode() {
      /* Get the documentElement (<html>) to display the page in fullscreen */
      var elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
    },

    // check if event is arrow button or toolbar button
    checkIfIsButton: function checkIfIsButton(eventEmit) {
      var elements = '.cool-lightbox-button, .cool-lightbox-button *, .cool-lightbox-toolbar__btn, .cool-lightbox-toolbar__btn *';
      if (event.target.matches(elements)) {
        return true
      }

      return false
    },

    // start swipe event
    startSwipe: function startSwipe(event) {
      if(this.isZooming) {
        return false;
      }

      // check if is some button
      if(this.checkIfIsButton(event)) {
        return false;
      }

      // clear interval
      clearInterval(this.swipeInterval);
      this.swipeAnimation = null;

      // starts swipe
      this.isDraggingSwipe = true;
      this.initialMouseX = this.getMouseXPosFromEvent(event);
      this.initialMouseY = this.getMouseYPosFromEvent(event);
    },

    // continue swipe event
    continueSwipe: function continueSwipe(event) {
      if(this.isDraggingSwipe) {
        this.IsSwipping = true;
        var currentPosX = this.getMouseXPosFromEvent(event);
        var currentPosY = this.getMouseYPosFromEvent(event);
        var windowWidth = this.lightboxInnerWidth;

        // diffs
        var diffX = Math.abs(currentPosX - this.initialMouseX);
        var diffY = Math.abs(currentPosY - this.initialMouseY);

        // swipe type
        if(this.swipeType == null) {
          if(diffY > 5 || diffX > 5) {
            if(diffY > diffX) {
              this.swipeType = 'v';
            } else {
              this.swipeType = 'h';
            }
          }
        }

        // swipe
        if(this.swipeType == 'h') {
          // swipe wrapper
          this.xSwipeWrapper = -(windowWidth*this.imgIndex) + currentPosX - this.initialMouseX - 30*this.imgIndex; 
        } else {
          this.ySwipeWrapper = currentPosY - this.initialMouseY;
        }

        // mobile caseS
        if(event.type === 'touchmove') {
          this.endMouseX = this.getMouseXPosFromEvent(event);
          this.endMouseY = this.getMouseYPosFromEvent(event);
        }
      }
    },

    // end swipe event
    endSwipe: function endSwipe(event) {
      if(this.checkIfIsButton(event) && this.initialMouseX === 0) {
        return false;
      }

      // event check is dragging and swipe
      var self = this;
      var swipeType = this.swipeType;
      this.isDraggingSwipe = false;
      
      // horizontal swipe type
      if(this.initialMouseX === 0 && swipeType == 'h') {
        return false
      }

      // touch end fixes
      if(event.type !== 'touchend') {
        this.endMouseX = this.getMouseXPosFromEvent(event);
        this.endMouseY = this.getMouseYPosFromEvent(event);
      } else {
        if(this.endMouseX === 0) {
          return;
        }
      }

      // check if is dragged 
      if(
        ((this.endMouseX - this.initialMouseX === 0) && swipeType == 'h') || 
        this.isZooming ||
        ((this.endMouseY - this.initialMouseY === 0) && swipeType == 'v')
      ) {
        return;
      } 
      
      // set swipe animation
      this.setSwipeAnimation();

      // reset swipe data
      setTimeout(function() {
        self.IsSwipping = false;
        self.initialMouseX = 0;
        self.endMouseX = 0;
      }, 10);

      // type of swipe
      if(this.swipeType === 'h') {

        // if the swipe is to the right
        if((this.endMouseX - this.initialMouseX) < -40) {
          return this.swipeToRight()
        } 

        // if the swipe is to the left
        if((this.endMouseX - this.initialMouseX) > 40) {
          return this.swipeToLeft();
        }
      }


      if(this.swipeType === 'v') {
        var diffY = Math.abs(this.endMouseY - this.initialMouseY);

        // diff Y
        if(diffY >= 90) {
          this.close();
        } else {
          this.ySwipeWrapper = 0;
        }
      } 
      
      this.swipeType = null;
      var windowWidth = this.lightboxInnerWidth;
      this.xSwipeWrapper = -this.imgIndex*windowWidth - 30*this.imgIndex;
    },
    
    // swipe to left effect
    swipeToLeft: function swipeToLeft() {
      if(!this.hasPrevious && this.effect === 'swipe') {
        return this.xSwipeWrapper = -this.imgIndex*this.lightboxInnerWidth - 30*this.imgIndex
      }

      this.changeIndexToPrev();
    },
    
    // swipe to right effect
    swipeToRight: function swipeToRight() {
      if(!this.hasNext && this.effect === 'swipe') {
        return this.xSwipeWrapper = -this.imgIndex*this.lightboxInnerWidth - 30*this.imgIndex
      }

      this.changeIndexToNext();
    },

    // function that return x position from event
    getMouseXPosFromEvent: function getMouseXPosFromEvent(event) {
      if(event.type.indexOf('mouse') !== -1){
          return event.clientX;
      }
      return event.touches[0].clientX;
    },
    
    // function that return Y position from event
    getMouseYPosFromEvent: function getMouseYPosFromEvent(event) {
      if(event.type.indexOf('mouse') !== -1){
          return event.clientY;
      }
      return event.touches[0].clientY;
    },

    // check if the image is cached
    is_cached: function is_cached(src) {
      var image = new Image();
      image.src = src;

      return image.complete;
    },

    // image loaded event
    imageLoaded: function imageLoaded() {
      this.imageLoading = false;
    },

    // get video url
    itemThumb: function itemThumb(itemUrl, itemIndex) {

      var thumb = this.getItemThumb(itemIndex);
      if(thumb) {
        return thumb
      }

      var youtubeID = this.getYoutubeID(itemUrl);
      if(youtubeID) {
        return 'https://img.youtube.com/vi/'+youtubeID+'/mqdefault.jpg'
      }

      var vimeoID = this.getVimeoID(itemUrl);
      if(vimeoID) {
        return false
      }

      return itemUrl
    },
    
    // get item src
    getItemSrc: function getItemSrc(imgIndex) {
      if(imgIndex === null) {
        return false
      }

      var item = this.items[imgIndex];
      if(this.checkIfIsObject(imgIndex)) {
        return item[this.srcName]
      }

      return item
    },
    
    getItemThumb: function getItemThumb(imgIndex) {
      if(imgIndex === null) {
        return false
      }

      var item = this.items[imgIndex];
      if(this.checkIfIsObject(imgIndex)) {
        return item[this.srcThumb]
      } 

      if(this.getVideoUrl(item)) {
        return false
      }

      return item
    },

    // toggle play slideshow event
    togglePlaySlideshow: function togglePlaySlideshow() {
      if(!this.slideshow) {
        return false
      }

      if(!this.hasNext && !this.loopData) {
        return false
      }
      this.isPlayingSlideShow = !this.isPlayingSlideShow;

      // if is playing move if not stop it
      if(this.isPlayingSlideShow) {
        this.move();
      } else {
        this.stopSlideShow();
      }
    },

    // stop slideshow
    stopSlideShow: function stopSlideShow() {
      this.isPlayingSlideShow = false;
      clearInterval(this.intervalProgress);
      this.stylesInterval = {
        'transform': 'scaleX(0)',
        'transition': 'none',
      };
    },

    // move event in zoom
    move: function move() {
      var self = this;
      this.progressWidth = 100;
      this.intervalProgress = setInterval(frame, this.slideshowDuration + 90);
      
      self.stylesInterval = {
        'transform': 'scaleX(1)',
        'background': this.slideshowColorBar,
        'transition-duration': this.slideshowDuration+'ms',
      };
      function frame() {
        self.stylesInterval = {
          'transform': 'scaleX(0)',
          'transition': 'none',
        };
        
        self.onNextClick(true);
        if(!self.hasNext && !self.loopData) {
          self.stopSlideShow();
        } else {
          setTimeout(function() {
            self.stylesInterval = {
              'transform': 'scaleX(1)',
              'background': self.slideshowColorBar,
              'transition-duration': self.slideshowDuration+'ms',
            };
          }, 50);
        }
      }
    }, 

    // show buttons event
    showButtons: function showButtons(event) {
      if (!this.checkIfIsButton(event)) {
        var self = this;
        setTimeout(function() {
          self.buttonsVisible = !self.buttonsVisible;
        }, 100);
      }
    },

    // check if is allowed to drag
    checkMouseEventPropButton: function checkMouseEventPropButton(button) {
      if (!this.isZooming) { return false }
      // mouse left btn click
      return button === 0
    },

    // handle mouse down event
    handleMouseDown: function handleMouseDown(e) {
      if (!this.checkMouseEventPropButton(e.button)) { return }
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.isDraging = true;
      e.stopPropagation();
    },

    // handle mouse up event
    handleMouseUp: function handleMouseUp(e) {
      if (!this.checkMouseEventPropButton(e.button)) { return }
      this.isDraging = false;
      this.lastX = this.lastY = 0;

      // Fix drag zoom out
      var thisContext = this;
      setTimeout(function() {
        thisContext.canZoom = true;
      }, 100);
    },

    // handle mouse move event
    handleMouseMove: function handleMouseMove(e) {
      if (!this.checkMouseEventPropButton(e.button)) { return }
      if (this.isDraging) {
        this.top = this.top - this.lastY + e.clientY;
        this.left = this.left - this.lastX + e.clientX;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.canZoom = false;
        
        var item = e.target.parentNode;
        item.style.transform  = 'translate3d(calc(-50% + '+this.left+'px), calc(-50% + '+this.top+'px), 0px) scale3d(1.6, 1.6, 1.6)';
      }
      e.stopPropagation();
    },

    // zoom image event
    zoomImage: function zoomImage(indexImage) {
      if(window.innerWidth < 700) {
        return false
      }

      if(!this.canZoom) {
        return false
      }

      if(this.IsSwipping) {
        return false
      }

      // item zoom
      var item;
      if(this.effect == 'swipe') {
        item = this.$refs.items[this.imgIndex].childNodes[0];
      } else {
        item = this.$refs.items.childNodes[0];
      }
      
      // zoom variables
      var isZooming = this.isZooming;
      var thisContext = this;

      // Is zooming check
      if(isZooming) {
        if(!this.isDraging) { 
          this.isZooming = false;
        }
      } else {
        this.isZooming = true;
      }

      // check if is zooming
      if(this.isZooming) {
        this.stopSlideShow();

        // add scale
        item.style.transform  = 'translate3d(calc(-50%), calc(-50%), 0px) scale3d(1.6, 1.6, 1.6)';

        // hide buttons
        this.buttonsVisible = false;

        // fix drag transition problems
        setTimeout(function() {
          thisContext.transition = 'all .0s ease';
        }, 100);

      } else {

        // show buttons 
        this.buttonsVisible = true;
        this.resetZoom();
      }
    },

    // Reset zoom data
    resetZoom: function resetZoom() {
      this.scale = 1;
      this.left = 0;
      this.top = 0;
      this.canZoom = false;
      this.isZooming = false;
      this.swipeType = null;
      this.transition = 'all .3s ease';

      // only if index is not null
      if(this.imgIndex != null) {
        
        var item;
        if(this.effect == 'swipe') {
          item = this.$refs.items[this.imgIndex].childNodes[0];
        } else {
          item = this.$refs.items.childNodes[0];
        }
        // reset styles
        item.style.transform  = 'translate3d(calc(-50% + '+this.left+'px), calc(-50% + '+this.top+'px), 0px) scale3d(1, 1, 1)';

        this.initialMouseX = 0;
        if(window.innerWidth >= 700) {
          this.buttonsVisible = true;
        }
      }
    },

    // check if the image is bigger than the viewport
    checkZoom: function checkZoom() {
      var thisContext = this;

      // check if is a video
      if(this.getVideoUrl(this.getItemSrc(this.imgIndex))) {
        return this.canZoom = false
      }
        
      // image width and height
      var img = new Image();
      img.src = this.itemSrc;
      
      var coolLightboxWrapper = document.getElementsByClassName('cool-lightbox');
      var computedStyle = getComputedStyle(coolLightboxWrapper[0]);
      var heightWrapperImage = coolLightboxWrapper[0].clientHeight;  // height with padding

      img.onload = function() {
        var width = this.width;
        var height = this.height;
        
        if(height > heightWrapperImage) {
          thisContext.canZoom = true;

          thisContext.imgFullSize = {
            height: height+'px',
            width: width+'px'
          };

        } else { 
          thisContext.canZoom = false;
        }
      };
    },

    // Aspect Ratio responsive video
    setAspectRatioVideo: function setAspectRatioVideo() {

      var thisContext = this;
      var el = document.getElementsByClassName('cool-lightbox__inner');
      el = el[0];

      var computedStyle = getComputedStyle(el);
      if(window.innerWidth < 700) {

        var width = el.clientWidth;
        var height = Math.round((width/16)*9);

        this.aspectRatioVideo.height = height+'px';
        this.aspectRatioVideo.width = width+'px';

      } else {
        
        setTimeout(function() {
          var height = el.clientHeight;
          height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);

          var width = (height/9)*16;

          thisContext.aspectRatioVideo.height = height+'px';
          thisContext.aspectRatioVideo.width = width+'px';
        }, 150);

      }
    },

    // close event
    close: function close() {
      this.stopSlideShow();
      this.swipeType = null;
      this.$emit("close", this.imgIndex);
      this.showThumbs = false;
      this.imgIndex = null;
    },

    // close event click outside
    closeModal: function closeModal(event) {
      if(window.innerWidth < 700) {
        return false;
      }

      if(this.IsSwipping) {
        return false;
      }

      var elements = '.cool-lightbox-thumbs, svg, path, rect, .cool-lightbox-thumbs *, .cool-lightbox-button, .cool-lightbox-toolbar__btn, .cool-lightbox-toolbar__btn *, .cool-lightbox-button *, .cool-lightbox__slide__img *, .cool-lightbox-video';
      if (!event.target.matches(elements)) {
        this.close();
      }
    },

    // set swipe animation
    setSwipeAnimation: function setSwipeAnimation() {
      var self = this;
      clearInterval(this.swipeInterval);
      this.swipeAnimation = null;

      // animation swipe
      this.swipeAnimation = 'all .3s ease';
      this.swipeInterval = setInterval(interval, 330);

      function interval() {
        self.swipeAnimation = null;
      }
    },

    // next slide event
    onNextClick: function onNextClick(isFromSlideshow) {
      if ( isFromSlideshow === void 0 ) isFromSlideshow = false;

      if(this.isZooming) {
        return false;
      }

      if(!isFromSlideshow) {
        this.stopSlideShow();
      }

      this.setSwipeAnimation();
      this.changeIndexToNext();
    },

    // prev slide event
    onPrevClick: function onPrevClick() {
      if(this.isZooming) {
        return false;
      }
      
      this.stopSlideShow();
      this.setSwipeAnimation();
      this.changeIndexToPrev();
    },

    // change to next index
    changeIndexToNext: function changeIndexToNext() {
      if(this.hasNext) {
        this.onIndexChange(this.imgIndex + 1);
      } else {
        // only if has loop prop
        if(this.loopData) {
          this.onIndexChange(0);
        }
      }
    },

    // change to prev index
    changeIndexToPrev: function changeIndexToPrev() {
      if(this.hasPrevious) {
        this.onIndexChange(this.imgIndex - 1);
      } else {
        // only if has loop prop
        if(this.loopData) {
          this.onIndexChange(this.items.length - 1);
        }
      }
    },

    // set lightbox inner width
    setLightboxInnerWidth: function setLightboxInnerWidth() {
      var el = document.getElementsByClassName('cool-lightbox__inner');
      var width = el[0].clientWidth;
      this.lightboxInnerWidth = width;
    },

    // set x position by img index
    setXPosition: function setXPosition(index) {

      // set x position
      this.xSwipeWrapper = -index*this.lightboxInnerWidth-30*index;
    },

    // index change
    onIndexChange: function onIndexChange(index) {
      this.imgIndex = index;
      this.$emit('on-change', index);
    },

    // caption size 
    addCaptionPadding: function addCaptionPadding() {
      if(this.checkIfIsObject(this.imgIndex) && (this.items[this.imgIndex].title || this.items[this.imgIndex].descripcion)) {
        var el = document.getElementsByClassName('cool-lightbox-caption');
        if(el.length > 0) {
          this.paddingBottom = el[0].offsetHeight;
        } 
      } else {
        this.paddingBottom = 60;
      }
    },

    // check if is video
    getVideoUrl: function getVideoUrl(itemSrc) {

      var youtubeUrl = this.getYoutubeUrl(itemSrc);
      var vimeoUrl = this.getVimeoUrl(itemSrc);
      var mp4Url = this.checkIsMp4(itemSrc);

      if(youtubeUrl) {
        return youtubeUrl
      }

      if(vimeoUrl) {
        return vimeoUrl
      }

      if(mp4Url) {
        return mp4Url
      }

      return false
    },
    
    // getYoutube ID
    getYoutubeID: function getYoutubeID(url) {

      // youtube data
      var youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      var ytId = (url.match(youtubeRegex)) ? RegExp.$1 : false;

      if(ytId) {
        return ytId
      }

      return false
    },

    // get youtube url
    getYoutubeUrl: function getYoutubeUrl(url) {

      // youtube data
      var ytId = this.getYoutubeID(url);

      // if is youtube video
      if(ytId) {
        return 'https://www.youtube.com/embed/'+ytId
      }

      return false
    },

    // vimeo ID
    getVimeoID: function getVimeoID(url) {
      
      // if is vimeo video
      var result = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
      if(result !== null) {
        return result[1]
      }

      return false
    },

    // get vimeo url
    getVimeoUrl: function getVimeoUrl(url) {

      // if is vimeo video
      var result = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
      if(result !== null) {
        return '//player.vimeo.com/video/'+result[1]+'?hd=1&show_title=1&show_byline=1&show_portrait=0&fullscreen=1'
      }

      return false
    },

    checkIsMp4: function checkIsMp4(url) {
      if(this.imgIndex === null) {
        return false
      }

      var str = new String(url);
      if(str.endsWith('.mp4')){
        return url
      }

      return false
    },

    // check if item is object
    checkIfIsObject: function checkIfIsObject(itemIndex) {
      var item = this.items[itemIndex];
      if(typeof item === 'object' && item !== null) {
        return true
      }
      return false;
    },

    // arrows and escape events
    eventListener: function eventListener(e) {
      switch (e.keyCode) {
        case 39:
          return this.onNextClick()
        case 37:
          return this.onPrevClick()
        case 38:
        case 40:
        case ' ':
          return e.preventDefault()
        case 27:
          return this.close()
      }
    },
  },

  computed: {
    
    // Images wrapper styles to use drag and zoom
    imgWrapperStyle: function imgWrapperStyle() {
      return {
        top: "50%",
        left: "50%",
        transition: this.transition,
      }
    },

    // lightbox styles
    lightboxStyles: function lightboxStyles() {
      return { 
        'z-index': this.zIndex,
        'background-color': this.overlayColor,
      }
    },

    innerStyles: function innerStyles() {
      return {
        'padding-bottom': this.paddingBottom+'px',
      }
    },

    // get item src
    itemSrc: function itemSrc() {
      if(this.imgIndex === null) {
        return false
      }

      var item = this.items[this.imgIndex];
      if(this.checkIfIsObject(this.imgIndex)) {
        return item[this.srcName]
      }

      return item
    },

    // Lightbox classes
    lightboxClasses: function lightboxClasses() {
      var classesReturn = [
        { 'cool-lightbox--can-zoom': this.canZoom },
        { 'cool-lightbox--is-zooming': this.isZooming },
        { 'cool-lightbox--show-thumbs': this.showThumbs },
        { 'cool-lightbox--is-swipping': this.isDraggingSwipe }
      ];

      var classString = 'cool-lightbox--thumbs-'+this.thumbsPosition;
      classesReturn.push(classString);

      return classesReturn
    },

    // Buttons classes
    buttonsClasses: function buttonsClasses() {
      return {
        'hidden': !this.buttonsVisible,
      }
    },

    // check if the slide has next element
    hasNext: function hasNext() {
      return (this.imgIndex + 1 < this.items.length)
    },

    // check if the slide has previous element 
    hasPrevious: function hasPrevious() {
      return (this.imgIndex - 1 >= 0)
    },
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
var __vue_script__ = script;
/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"cool-lightbox-modal"}},[(_vm.isVisible)?_c('div',{staticClass:"cool-lightbox",class:_vm.lightboxClasses,style:(_vm.lightboxStyles),on:{"click":_vm.closeModal}},[(_vm.gallery)?_c('div',{staticClass:"cool-lightbox-thumbs"},[_c('div',{staticClass:"cool-lightbox-thumbs__list"},_vm._l((_vm.items),function(item,itemIndex){return _c('button',{key:itemIndex,staticClass:"cool-lightbox__thumb",class:{ 
            active: itemIndex === _vm.imgIndex,
            'is-video': _vm.getVideoUrl(_vm.getItemSrc(itemIndex)) 
          },attrs:{"type":"button"},on:{"click":function($event){_vm.imgIndex = itemIndex;}}},[(_vm.getVideoUrl(_vm.getItemSrc(itemIndex)))?_c('svg',{staticClass:"cool-lightbox__thumb__icon",attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M6.5 5.4v13.2l11-6.6z"}})]):_vm._e(),_vm._v(" "),_c('img',{attrs:{"src":_vm.itemThumb(_vm.getItemSrc(itemIndex), itemIndex),"alt":""}})])}),0)]):_vm._e(),_vm._v(" "),_c('div',{staticClass:"cool-lightbox__inner",style:(_vm.innerStyles),on:{"mousedown":_vm.startSwipe,"mousemove":_vm.continueSwipe,"mouseup":_vm.endSwipe,"touchstart":_vm.startSwipe,"touchmove":_vm.continueSwipe,"touchend":_vm.endSwipe}},[_c('div',{staticClass:"cool-lightbox__progressbar",style:(_vm.stylesInterval)}),_vm._v(" "),_c('div',{staticClass:"cool-lightbox__navigation"},[_c('button',{directives:[{name:"show",rawName:"v-show",value:((_vm.hasPrevious || _vm.loopData) && _vm.items.length > 1),expression:"(hasPrevious || loopData) && items.length > 1"}],staticClass:"cool-lightbox-button cool-lightbox-button--prev",class:_vm.buttonsClasses,attrs:{"type":"button","title":"Previous"},on:{"click":_vm.onPrevClick}},[_vm._t("icon-previous",[_c('div',{staticClass:"cool-lightbox-button__icon"},[_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"}})])])])],2),_vm._v(" "),_c('button',{directives:[{name:"show",rawName:"v-show",value:((_vm.hasNext || _vm.loopData) && _vm.items.length > 1),expression:"(hasNext || loopData) && items.length > 1"}],staticClass:"cool-lightbox-button cool-lightbox-button--next",class:_vm.buttonsClasses,attrs:{"type":"button","title":"Next"},on:{"click":function($event){return _vm.onNextClick(false)}}},[_vm._t("icon-next",[_c('div',{staticClass:"cool-lightbox-button__icon"},[_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"}})])])])],2)]),_vm._v(" "),(_vm.effect === 'swipe')?_c('div',{staticClass:"cool-lightbox__wrapper cool-lightbox__wrapper--swipe",style:({
          transform: 'translate3d('+_vm.xSwipeWrapper+'px, '+_vm.ySwipeWrapper+'px, 0)',
          transition: _vm.swipeAnimation
        })},_vm._l((_vm.items),function(item,itemIndex){return _c('div',{key:itemIndex,ref:"items",refInFor:true,staticClass:"cool-lightbox__slide",class:{ 'cool-lightbox__slide--current': itemIndex === _vm.imgIndex }},[(!_vm.getVideoUrl(_vm.getItemSrc(itemIndex)))?_c('div',{key:"image",staticClass:"cool-lightbox__slide__img",style:(_vm.imgWrapperStyle)},[_c('img',{key:itemIndex,attrs:{"src":_vm.getItemSrc(itemIndex),"draggable":"false"},on:{"load":_vm.imageLoaded,"click":function($event){return _vm.zoomImage(itemIndex)},"mousedown":function($event){return _vm.handleMouseDown($event)},"mouseup":function($event){return _vm.handleMouseUp($event)},"mousemove":function($event){return _vm.handleMouseMove($event)},"touchstart":function($event){return _vm.handleMouseDown($event)},"touchmove":function($event){return _vm.handleMouseMove($event)},"touchend":function($event){return _vm.handleMouseUp($event)}}}),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.imageLoading),expression:"imageLoading"}],staticClass:"cool-lightbox-loading-wrapper"},[_vm._t("loading",[_c('div',{staticClass:"cool-lightbox-loading"})])],2)]):_c('div',{key:"video",staticClass:"cool-lightbox__iframe"},[(!_vm.checkIsMp4(_vm.getItemSrc(itemIndex)))?_c('iframe',{key:itemIndex,staticClass:"cool-lightbox-video",style:(_vm.aspectRatioVideo),attrs:{"src":_vm.getVideoUrl(_vm.getItemSrc(itemIndex)),"frameborder":"0","allow":"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture","allowfullscreen":""}}):_vm._e(),_vm._v(" "),(_vm.checkIsMp4(_vm.getItemSrc(itemIndex)))?_c('video',{key:_vm.checkIsMp4(_vm.getItemSrc(itemIndex)),staticClass:"cool-lightbox-video",style:(_vm.aspectRatioVideo),attrs:{"controls":"","controlslist":"nodownload","poster":""}},[_c('source',{attrs:{"src":_vm.checkIsMp4(_vm.getItemSrc(itemIndex)),"type":"video/mp4"}}),_vm._v("\n              Sorry, your browser doesn't support embedded videos\n            ")]):_vm._e()])])}),0):_vm._e(),_vm._v(" "),(_vm.effect === 'fade')?_c('div',{staticClass:"cool-lightbox__wrapper"},[_c('div',{ref:"items",staticClass:"cool-lightbox__slide cool-lightbox__slide--current"},[_c('transition',{attrs:{"name":"cool-lightbox-slide-change","mode":"out-in"}},[(!_vm.getVideoUrl(_vm.getItemSrc(_vm.imgIndex)))?_c('div',{key:"image",staticClass:"cool-lightbox__slide__img",style:(_vm.imgWrapperStyle)},[_c('transition',{attrs:{"name":"cool-lightbox-slide-change","mode":"out-in"}},[_c('img',{key:_vm.imgIndex,attrs:{"src":_vm.getItemSrc(_vm.imgIndex),"draggable":"false"},on:{"load":_vm.imageLoaded,"click":_vm.zoomImage,"mousedown":function($event){return _vm.handleMouseDown($event)},"mouseup":function($event){return _vm.handleMouseUp($event)},"mousemove":function($event){return _vm.handleMouseMove($event)}}})]),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.imageLoading),expression:"imageLoading"}],staticClass:"cool-lightbox-loading-wrapper"},[_vm._t("loading",[_c('div',{staticClass:"cool-lightbox-loading"})])],2)],1):_c('div',{key:"video",staticClass:"cool-lightbox__iframe"},[_c('transition',{attrs:{"name":"cool-lightbox-slide-change","mode":"out-in"}},[(!_vm.checkIsMp4(_vm.getItemSrc(_vm.imgIndex)))?_c('iframe',{key:_vm.getVideoUrl(_vm.getItemSrc(_vm.imgIndex)),staticClass:"cool-lightbox-video",style:(_vm.aspectRatioVideo),attrs:{"src":_vm.getVideoUrl(_vm.getItemSrc(_vm.imgIndex)),"frameborder":"0","allow":"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture","allowfullscreen":""}}):_vm._e(),_vm._v(" "),(_vm.checkIsMp4(_vm.getItemSrc(_vm.imgIndex)))?_c('video',{key:_vm.checkIsMp4(_vm.getItemSrc(_vm.imgIndex)),staticClass:"cool-lightbox-video",style:(_vm.aspectRatioVideo),attrs:{"controls":"","controlslist":"nodownload","poster":""}},[_c('source',{attrs:{"src":_vm.checkIsMp4(_vm.getItemSrc(_vm.imgIndex)),"type":"video/mp4"}}),_vm._v("\n                  Sorry, your browser doesn't support embedded videos\n                ")]):_vm._e()])],1)])],1)]):_vm._e(),_vm._v(" "),_c('transition',{attrs:{"name":"modal"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.checkIfIsObject(_vm.imgIndex) && (_vm.items[_vm.imgIndex].title || _vm.items[_vm.imgIndex].description)),expression:"checkIfIsObject(imgIndex) && (items[imgIndex].title || items[imgIndex].description)"}],key:"caption-block",staticClass:"cool-lightbox-caption"},[_c('transition',{attrs:{"name":"cool-lightbox-slide-change","mode":"out-in"}},[(_vm.checkIfIsObject(_vm.imgIndex) && _vm.items[_vm.imgIndex].title)?_c('h6',{key:"title"},[_vm._v(_vm._s(_vm.items[_vm.imgIndex].title))]):_vm._e()]),_vm._v(" "),_c('transition',{attrs:{"name":"cool-lightbox-slide-change","mode":"out-in"}},[(_vm.checkIfIsObject(_vm.imgIndex) && _vm.items[_vm.imgIndex].description)?_c('p',{key:"description"},[_vm._v(_vm._s(_vm.items[_vm.imgIndex].description))]):_vm._e()])],1)]),_vm._v(" "),_c('div',{staticClass:"cool-lightbox-toolbar",class:_vm.buttonsClasses},[(this.slideshow && _vm.items.length > 1)?_c('button',{staticClass:"cool-lightbox-toolbar__btn",attrs:{"type":"button","title":"Play slideshow"},on:{"click":_vm.togglePlaySlideshow}},[(!_vm.isPlayingSlideShow)?_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M6.5 5.4v13.2l11-6.6z"}})]):_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg"}},[_c('g',[_c('rect',{attrs:{"id":"svg_4","height":"11.97529","width":"11.728392","y":"6.030873","x":"6.259265","stroke-width":"1.5","stroke":"#000","fill":"#000000"}})])])]):_vm._e(),_vm._v(" "),(_vm.items.length > 1 && _vm.gallery)?_c('button',{staticClass:"cool-lightbox-toolbar__btn",attrs:{"type":"button","title":"Show thumbnails"},on:{"click":function($event){_vm.showThumbs = !_vm.showThumbs;}}},[_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 \n            0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 \n            0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 \n            0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"}})])]):_vm._e(),_vm._v(" "),(_vm.fullScreen)?_c('button',{staticClass:"cool-lightbox-toolbar__btn",attrs:{"type":"button","title":"Fullscreen"},on:{"click":_vm.toggleFullScreenMode}},[_c('svg',{attrs:{"width":"20px","height":"20px","viewBox":"0 0 18 18","xmlns":"http://www.w3.org/2000/svg"}},[_c('path',{attrs:{"d":"M4.5 11H3v4h4v-1.5H4.5V11zM3 7h1.5V4.5H7V3H3v4zm10.5 6.5H11V15h4v-4h-1.5v2.5zM11 3v1.5h2.5V7H15V3h-4z"}})])]):_vm._e(),_vm._v(" "),_c('button',{staticClass:"cool-lightbox-toolbar__btn",attrs:{"type":"button","title":"Close"},on:{"click":_vm.close}},[_vm._t("close",[_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"}})])])],2)])],1)]):_vm._e()])};
var __vue_staticRenderFns__ = [];

  /* style */
  var __vue_inject_styles__ = undefined;
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var CoolLightBox = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

function install(Vue) {
  if (install.installed) { return; }
  install.installed = true;
  Vue.component("CoolLightBox", CoolLightBox);
}

var plugin = {
  install: install
};

var GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

CoolLightBox.install = install;

export default CoolLightBox;
