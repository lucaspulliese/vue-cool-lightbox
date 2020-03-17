<template>
  <transition name="cool-lightbox-modal">
    <div class="cool-lightbox" 
      v-bind:class="lightboxClasses" 
      v-if="isVisible" 
      @click="closeModal"
      v-bind:style="lightboxStyles">

      <div v-if="gallery" class="cool-lightbox-thumbs">
        <div class="cool-lightbox-thumbs__list">
          <button 
            type="button"
            v-for="(item, itemIndex) in items"
            :key="itemIndex"
            :class="{ 
              active: itemIndex === imgIndex,
              'is-video': getVideoUrl(getItemSrc(itemIndex)) 
            }"
            @click="imgIndex = itemIndex"
            class="cool-lightbox__thumb">

            <svg class="cool-lightbox__thumb__icon" xmlns="http://www.w3.org/2000/svg" v-if="getVideoUrl(getItemSrc(itemIndex))" viewBox="0 0 24 24">
              <path d="M6.5 5.4v13.2l11-6.6z"></path>
            </svg>

            <img :src="itemThumb(getItemSrc(itemIndex), itemIndex)" alt="" />
          </button>
        </div>
      </div>
      <!--/cool-lightbox-thumbs-->

      <div 
        class="cool-lightbox__inner" 
        :style="innerStyles"

        @mousedown="startSwipe"
        @mousemove="continueSwipe"
        @mouseup="endSwipe"
        @touchstart="startSwipe"
        @touchmove="continueSwipe"
        @touchend="endSwipe"
        >
        <div class="cool-lightbox__progressbar" :style="stylesInterval"></div>

        <div class="cool-lightbox__navigation">
          <button type="button" class="cool-lightbox-button cool-lightbox-button--prev" title="Previous" :class="buttonsClasses" v-show="(hasPrevious || loop) && items.length > 1" @click="onPrevClick">
            <slot name="icon-previous">
              <div class="cool-lightbox-button__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"></path></svg>
              </div>
            </slot>
          </button>

          <button type="button" class="cool-lightbox-button cool-lightbox-button--next" title="Next" :class="buttonsClasses" v-show="(hasNext || loop) && items.length > 1" @click="onNextClick(false)">
            <slot name="icon-next">
              <div class="cool-lightbox-button__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"></path></svg>
              </div>
            </slot>
          </button>
        </div>
        <!--/cool-lightbox__navigation-->

        <div v-if="effect === 'swipe'" 
          class="cool-lightbox__wrapper cool-lightbox__wrapper--swipe"
          :style="{
            transform: 'translate3d('+xSwipeWrapper+'px, 0, 0)',
            transition: swipeAnimation
          }"
          >
          <div 
            v-for="(item, itemIndex) in items"
            :key="itemIndex"
            class="cool-lightbox__slide"
            :class="{ 'cool-lightbox__slide--current': itemIndex === imgIndex }"
          >
            <div v-if="!getVideoUrl(getItemSrc(itemIndex))" key="image" :style="imgWrapperStyle" class="cool-lightbox__slide__img">
              <img 
                :src="getItemSrc(itemIndex)" 
                :key="itemIndex"
                draggable="false"

                @load="imageLoaded"
                @click="zoomImage"
                @mousedown="handleMouseDown($event)"
                @mouseup="handleMouseUp($event)"
                @mousemove="handleMouseMove($event)"
                />
              
              <div v-show="imageLoading" class="cool-lightbox-loading-wrapper">
                <slot name="loading">
                  <div class="cool-lightbox-loading"></div>
                </slot>
              </div>
              <!--/loading-wrapper-->
            </div>
            <!--/imgs-slide-->
          
            <div v-else key="video" class="cool-lightbox__iframe">
              <iframe
                class="cool-lightbox-video" 
                :src="getVideoUrl(getItemSrc(itemIndex))" 
                v-if="!checkIsMp4(getItemSrc(itemIndex))" 
                :style="aspectRatioVideo" 
                :key="itemIndex" 
                frameborder="0" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>

              <video class="cool-lightbox-video" v-if="checkIsMp4(getItemSrc(itemIndex))" :style="aspectRatioVideo" :key="checkIsMp4(getItemSrc(itemIndex))" controls="" controlslist="nodownload" poster="">
                <source :src="checkIsMp4(getItemSrc(itemIndex))" type="video/mp4">
                Sorry, your browser doesn't support embedded videos
              </video> 
            </div>
            <!--/cool-lightbox__iframe-->
          </div>
          <!--/cool-lightbox__slide-->
        </div>
        <!--/cool-lightbox-wrapper-->
          
        <div v-if="effect === 'fade'" class="cool-lightbox__wrapper">
          <div 
            class="cool-lightbox__slide cool-lightbox__slide--current"
          >
            <transition name="cool-lightbox-slide-change" mode="out-in">
              <div v-if="!getVideoUrl(getItemSrc(imgIndex))" key="image" :style="imgWrapperStyle" class="cool-lightbox__slide__img">
                <transition name="cool-lightbox-slide-change" mode="out-in">
                <img 
                  :src="getItemSrc(imgIndex)" 
                  :key="imgIndex"
                  draggable="false"

                  @load="imageLoaded"
                  @click="zoomImage"
                  @mousedown="handleMouseDown($event)"
                  @mouseup="handleMouseUp($event)"
                  @mousemove="handleMouseMove($event)"
                  />
                </transition>
                
                <div v-show="imageLoading" class="cool-lightbox-loading-wrapper">
                  <slot name="loading">
                    <div class="cool-lightbox-loading"></div>
                  </slot>
                </div>
                <!--/loading-wrapper-->
              </div>
              <!--/imgs-slide-->
            
              <div v-else key="video" class="cool-lightbox__iframe">
                <transition name="cool-lightbox-slide-change" mode="out-in">
                  <iframe
                    class="cool-lightbox-video" 
                    :src="getVideoUrl(getItemSrc(imgIndex))" 
                    v-if="!checkIsMp4(getItemSrc(imgIndex))" 
                    :style="aspectRatioVideo" 
                    :key="getVideoUrl(getItemSrc(imgIndex))" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                  </iframe>

                  <video class="cool-lightbox-video" v-if="checkIsMp4(getItemSrc(imgIndex))" :style="aspectRatioVideo" :key="checkIsMp4(getItemSrc(imgIndex))" controls="" controlslist="nodownload" poster="">
                    <source :src="checkIsMp4(getItemSrc(imgIndex))" type="video/mp4">
                    Sorry, your browser doesn't support embedded videos
                  </video> 
                </transition>
              </div>
              <!--/cool-lightbox__iframe-->

            </transition>
          </div>
          <!--/cool-lightbox__slide-->
        </div>
        <!--/cool-lightbox__wrapper-->

        <transition name="modal">
          <div v-show="checkIfIsObject(imgIndex) && (items[imgIndex].title || items[imgIndex].description)" key="caption-block" class="cool-lightbox-caption">
            <transition name="cool-lightbox-slide-change" mode="out-in">
              <h6 key="title" v-if="checkIfIsObject(imgIndex) && items[imgIndex].title">{{ items[imgIndex].title }}</h6>
            </transition>

            <transition name="cool-lightbox-slide-change" mode="out-in">
              <p key="description" v-if="checkIfIsObject(imgIndex) && items[imgIndex].description">{{ items[imgIndex].description }}</p>
            </transition>
          </div>
          <!--/cool-lightbox-caption-->
        </transition>
        
        <div class="cool-lightbox-toolbar" :class="buttonsClasses">
          <button type="button" v-if="this.slideshow && items.length > 1" title="Play slideshow" class="cool-lightbox-toolbar__btn" @click="togglePlaySlideshow">
            <svg xmlns="http://www.w3.org/2000/svg" v-if="!isPlayingSlideShow" viewBox="0 0 24 24">
              <path d="M6.5 5.4v13.2l11-6.6z"></path>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" v-else viewBox="0 0 24 24">
              <path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"></path>
            </svg>
          </button>

          <button type="button" @click="showThumbs = !showThumbs" title="Show thumbnails" v-if="items.length > 1 && gallery" class="cool-lightbox-toolbar__btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 
              0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 
              0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 
              0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z">
              </path>
            </svg>
          </button>
          
          <button type="button" @click="fullScreenMode" class="cool-lightbox-toolbar__btn" title="Fullscreen">
            <svg width="20px" height="20px" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.5 11H3v4h4v-1.5H4.5V11zM3 7h1.5V4.5H7V3H3v4zm10.5 6.5H11V15h4v-4h-1.5v2.5zM11 3v1.5h2.5V7H15V3h-4z"></path>
            </svg>
          </button>

          <button type="button" class="cool-lightbox-toolbar__btn" title="Close" @click="close">
            <slot name="close">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"></path>
              </svg>
            </slot>
          </button>
        </div>
        <!--/cool-lightbox--toolbar-->
      </div>
      <!--/cool-lightbox-inner-->

    </div>
    <!--/cool-lightbox-->
  </transition>
  <!--/transition-->
</template>

<script>
export default {

  data() {
    return {
      // swipe data
      initialMouseX: 0,
      endMouseX: 0,
      IsSwipping: false,
      isDraggingSwipe: false,

      // swipe effect
      xSwipeWrapper: 0,
      swipeAnimation: null,
      swipeInterval: null,
      lightboxInnerWidth: null,

      // styles data
      imgIndex: this.index,
      isVisible: false,
      paddingBottom: false,
      imageLoading: false,
      showThumbs: false,

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
  },

  watch: {
    showThumbs(prev, val) {
      let widthGalleryBlock = 212;
      if(window.innerWidth < 700) {
        widthGalleryBlock = 102
      }

      const self = this
      this.swipeAnimation = 'all .3s ease'

      if(prev) {
        this.xSwipeWrapper = -this.imgIndex*window.innerWidth + widthGalleryBlock*this.imgIndex
      } else {
        this.xSwipeWrapper = -this.imgIndex*window.innerWidth
      }

      setTimeout(function() {
        self.swipeAnimation = null
      }, 300)
    },

    index(prev, val) {
      const self = this

      if(prev !== null) {

        // swipe effect case remove loop
        if(this.effect === 'swipe') {
          this.loop = false
        }

        // add img index
        this.imgIndex = prev
        this.isVisible = true

        // add events listener
        window.addEventListener('keydown', this.eventListener)
        
        // only in mobile
        if(window.innerWidth < 700) {

          // add click event
          setTimeout(function() {
            window.addEventListener('click', self.showButtons)
          }, 200)
        }

        // remove scroll
        document.getElementsByTagName('body')[0].style = 'overflow: hidden';

      } else {

        // hide and stop slideshow
        this.isVisible = false
        this.stopSlideShow()

        // remove events listener
        window.removeEventListener('keydown', this.eventListener)

        // remove styles avoid scroll
        document.getElementsByTagName('body')[0].style.overflow = '';

        // remove click event
        window.removeEventListener('click', this.showButtons)
      }

    }, 
    
    imgIndex(prev, val) {
      const thisContext = this
      
      // when animation is loaded
      this.$nextTick(() => {

        if(this.effect === 'swipe') {
          this.setLightboxInnerWidth()
          this.setXPosition(prev)
        }
        
        if(prev !== null & val === null) {
          this.$emit("on-open", prev);
        }

        if(prev !== null) {

          // if is an image change imageLoading to true
          if(!this.getVideoUrl(this.getItemSrc(prev))) {
            if(!this.is_cached(this.getItemSrc(prev))) {
              this.imageLoading = true
            }
          }

          // add caption padding to Lightbox wrapper
          this.addCaptionPadding()

          // check if user can zoom
          this.checkZoom()
        }

        // reset zoom
        this.resetZoom()

        // setAspectRatioVideo when is swipe
        if(this.effect === 'swipe') {
          this.setAspectRatioVideo();
        } else {

          if(this.getVideoUrl(this.getItemSrc(prev))) {
            this.setAspectRatioVideo();
          }
        }

      })
    }, 
  },

  methods: {
    fullScreenMode() {
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
    checkIfIsButton(eventEmit) {
      var elements = '.cool-lightbox-button, .cool-lightbox-button *, .cool-lightbox-toolbar__btn, .cool-lightbox-toolbar__btn *';
      if (event.target.matches(elements)) {
        return true
      }

      return false
    },

    // start swipe event
    startSwipe(event) {
      if(this.checkIfIsButton(event)) {
        return false;
      }

      // set starts X to 0
      this.startsX = 0

      // clear interval
      clearInterval(this.swipeInterval)
      this.swipeAnimation = null

      // starts swipe
      this.isDraggingSwipe = true
      this.startsX = this.getMouseXPosFromEvent(event)
      this.initialMouseX = this.getMouseXPosFromEvent(event);
    },

    // continue swipe event
    continueSwipe(event) {
      if(this.isDraggingSwipe) {
        this.IsSwipping = true
        const currentPosX = this.getMouseXPosFromEvent(event)
        const windowWidth = this.lightboxInnerWidth

        // swipe wrapper
        this.xSwipeWrapper = -(windowWidth*this.imgIndex) + currentPosX - this.startsX

        // mobile case
        if(event.type === 'touchmove') {
          this.endMouseX = this.getMouseXPosFromEvent(event);
        }
      }
    },

    // end swipe event
    endSwipe(event) {
      if(this.checkIfIsButton(event) && this.initialMouseX === 0) {
        return false;
      }

      if(this.startsX === 0) {
        return false
      }

      const self = this
      this.isDraggingSwipe = false

      // touch end fixes
      if(event.type !== 'touchend') {
        this.endMouseX = this.getMouseXPosFromEvent(event);
      } else {
        if(this.endMouseX === 0) {
          return;
        }
      }

      if((this.endMouseX - this.initialMouseX === 0) || this.isZooming) {
        return;
      } 
      
      clearInterval(this.swipeInterval)
      this.swipeAnimation = null

      // animation swipe
      this.swipeAnimation = 'all .15s linear';
      this.swipeInterval = setInterval(interval, 150);

      function interval() {
        self.swipeAnimation = null
      }

      // reset swipe data
      setTimeout(function() {
        self.IsSwipping = false
        self.initialMouseX = 0
        self.endMouseX = 0
      }, 10)
      
      // if the swipe is to the right
      if((this.endMouseX - this.initialMouseX) < -80) {
        return this.swipeToRight()
      } 

      // if the swipe is to the left
      if((this.endMouseX - this.initialMouseX) > 80) {
        return this.swipeToLeft();
      }
      
      const windowWidth = this.lightboxInnerWidth
      this.xSwipeWrapper = -this.imgIndex*windowWidth
    },
    
    // swipe to left effect
    swipeToLeft() {
      if(!this.hasPrevious) {
        return this.xSwipeWrapper = -this.imgIndex*this.lightboxInnerWidth
      }

      this.changeIndexToPrev()
    },
    
    // swipe to right effect
    swipeToRight() {
      if(!this.hasNext) {
        return this.xSwipeWrapper = -this.imgIndex*this.lightboxInnerWidth
      }

      this.changeIndexToNext()
    },

    // function that return x position from event
    getMouseXPosFromEvent(event) {
      if(event.type.indexOf('mouse') !== -1){
          return event.clientX;
      }
      return event.touches[0].clientX;
    },

    // check if the image is cached
    is_cached(src) {
      var image = new Image();
      image.src = src;

      return image.complete;
    },

    // image loaded event
    imageLoaded() {
      this.imageLoading = false
    },

    // get video url
    itemThumb(itemUrl, itemIndex) {

      var thumb = this.getItemThumb(itemIndex)
      if(thumb) {
        return thumb
      }

      var youtubeID = this.getYoutubeID(itemUrl)
      if(youtubeID) {
        return 'https://img.youtube.com/vi/'+youtubeID+'/mqdefault.jpg'
      }

      var vimeoID = this.getVimeoID(itemUrl)
      if(vimeoID) {
        return false
      }

      return itemUrl
    },
    
    // get item src
    getItemSrc(imgIndex) {
      if(imgIndex === null) {
        return false
      }

      const item = this.items[imgIndex]
      if(this.checkIfIsObject(imgIndex)) {
        return item[this.srcName]
      }

      return item
    },
    
    getItemThumb(imgIndex) {
      if(imgIndex === null) {
        return false
      }

      const item = this.items[imgIndex]
      if(this.checkIfIsObject(imgIndex)) {
        return item[this.srcThumb]
      } 

      if(this.isVideo(item)) {
        return false
      }

      return item
    },

    // toggle play slideshow event
    togglePlaySlideshow() {
      if(!this.slideshow) {
        return false
      }

      if(!this.hasNext && !this.loop) {
        return false
      }
      this.isPlayingSlideShow = !this.isPlayingSlideShow

      // if is playing move if not stop it
      if(this.isPlayingSlideShow) {
        this.move()
      } else {
        this.stopSlideShow()
      }
    },

    // stop slideshow
    stopSlideShow() {
      this.isPlayingSlideShow = false
      clearInterval(this.intervalProgress);
      this.stylesInterval = {
        'transform': 'scaleX(0)',
        'transition': 'none',
      }
    },

    // move event in zoom
    move() {
      const self = this
      this.progressWidth = 100;
      this.intervalProgress = setInterval(frame, this.slideshowDuration + 90);
      
      self.stylesInterval = {
        'transform': 'scaleX(1)',
        'background': this.slideshowColorBar,
        'transition-duration': this.slideshowDuration+'ms',
      }
      function frame() {
        self.stylesInterval = {
          'transform': 'scaleX(0)',
          'transition': 'none',
        }
        
        self.onNextClick(true)
        if(!self.hasNext && !self.loop) {
          self.stopSlideShow()
        } else {
          setTimeout(function() {
            self.stylesInterval = {
              'transform': 'scaleX(1)',
              'background': self.slideshowColorBar,
              'transition-duration': self.slideshowDuration+'ms',
            }
          }, 50)
        }
      }
    }, 

    // show buttons event
    showButtons(event) {
      if (!this.checkIfIsButton(event)) {
        const self = this
        setTimeout(function() {
          self.buttonsVisible = !self.buttonsVisible
        }, 100)
      }
    },

    // check if is allowed to drag
    checkMouseEventPropButton(button) {
      if (!this.isZooming) return false
      // mouse left btn click
      return button === 0
    },

    // handle mouse down event
    handleMouseDown(e) {
      if (!this.checkMouseEventPropButton(e.button)) return
      this.lastX = e.clientX
      this.lastY = e.clientY
      this.isDraging = true
      e.stopPropagation()
    },

    // handle mouse up event
    handleMouseUp(e) {
      if (!this.checkMouseEventPropButton(e.button)) return
      this.isDraging = false
      this.lastX = this.lastY = 0

      // Fix drag zoom out
      const thisContext = this
      setTimeout(function() {
        thisContext.canZoom = true
      }, 100)
    },

    // handle mouse move event
    handleMouseMove(e) {
      if (!this.checkMouseEventPropButton(e.button)) return
      if (this.isDraging) {
        this.top = this.top - this.lastY + e.clientY
        this.left = this.left - this.lastX + e.clientX
        this.lastX = e.clientX
        this.lastY = e.clientY
        this.canZoom = false
      }
      e.stopPropagation()
    },

    // zoom image event
    zoomImage() {
      if(window.innerWidth < 700) {
        return false
      }

      if(!this.canZoom) {
        return false
      }

      const isZooming = this.isZooming
      const thisContext = this

      // Is zooming check
      if(isZooming) {
        if(!this.isDraging) { 
          this.isZooming = false
        }
      } else {
        this.isZooming = true
      }

      // check if is zooming
      if(this.isZooming) {
        this.stopSlideShow()
        this.scale = 1.6

        // hide buttons
        this.buttonsVisible = false

        // fix drag transition problems
        setTimeout(function() {
          thisContext.transition = 'all .0s ease'
        }, 100)

      } else {

        // show buttons 
        this.buttonsVisible = true
        this.resetZoom()
      }
    },

    // resize window event
    resizeWindow() {

    },

    // Reset zoom data
    resetZoom() {
      this.scale = 1
      this.left = 0
      this.top = 0
      this.canZoom = false
      this.isZooming = false
      this.transition = 'all .3s ease'
      
      this.initialMouseX = 0
      if(window.innerWidth >= 700) {
        this.buttonsVisible = true
      }
    },

    // check if the image is bigger than the viewport
    checkZoom() {
      const thisContext = this

      // check if is a video
      if(this.getVideoUrl(this.getItemSrc(this.imgIndex))) {
        return this.canZoom = false
      }
        
      // image width and height
      const img = new Image()
      img.src = this.itemSrc
      
      const coolLightboxWrapper = document.getElementsByClassName('cool-lightbox');
      let computedStyle = getComputedStyle(coolLightboxWrapper[0])
      let heightWrapperImage = coolLightboxWrapper[0].clientHeight;  // height with padding

      img.onload = function() {
        const width = this.width
        const height = this.height
        
        if(height > heightWrapperImage) {
          thisContext.canZoom = true

          thisContext.imgFullSize = {
            height: height+'px',
            width: width+'px'
          }

        } else { 
          thisContext.canZoom = false
        }
      }
    },

    // Aspect Ratio responsive video
    setAspectRatioVideo() {

      const thisContext = this
      let el = document.getElementsByClassName('cool-lightbox__inner');
      if(window.innerWidth < 700) {

        let width = el[0].clientWidth
        let height = Math.round((width/16)*9);

        this.aspectRatioVideo.height = height+'px'
        this.aspectRatioVideo.width = width+'px'

      } else {
        
        setTimeout(function() {
          let height = el[0].clientHeight
          let width = (height/9)*16;

          thisContext.aspectRatioVideo.height = height+'px'
          thisContext.aspectRatioVideo.width = width+'px'
        }, 150)

      }
    },

    // close event
    close() {
      this.stopSlideShow();
      this.$emit("close", this.imgIndex);
      this.showThumbs = false;
      this.imgIndex = null;
    },

    // close event click outside
    closeModal(event) {
      if(window.innerWidth < 700) {
        return false;
      }

      if(this.IsSwipping) {
        return false;
      }

      var elements = '.cool-lightbox-thumbs, .cool-lightbox-thumbs *, .cool-lightbox-button, .cool-lightbox-toolbar__btn, .cool-lightbox-toolbar__btn *, .cool-lightbox-button *, .cool-lightbox__slide__img *, .cool-lightbox-video';
      if (!event.target.matches(elements)) {
        this.close()
      }
    },

    // next slide event
    onNextClick(isFromSlideshow = false) {
      if(!isFromSlideshow) {
        this.stopSlideShow()
      }
      
      this.changeIndexToNext()
    },

    // prev slide event
    onPrevClick() {
      this.stopSlideShow();
      this.changeIndexToPrev();
    },

    // change to next index
    changeIndexToNext() {
      if(this.hasNext) {
        this.onIndexChange(this.imgIndex + 1)
      } else {
        // only if has loop prop
        if(this.loop) {
          this.onIndexChange(0)
        }
      }
    },

    // change to prev index
    changeIndexToPrev() {
      if(this.hasPrevious) {
        this.onIndexChange(this.imgIndex - 1)
      } else {
        // only if has loop prop
        if(this.loop) {
          this.onIndexChange(this.items.length - 1)
        }
      }
    },

    // set lightbox inner width
    setLightboxInnerWidth() {
      let el = document.getElementsByClassName('cool-lightbox__inner');
      let width = el[0].clientWidth
      this.lightboxInnerWidth = width
    },

    // set x position by img index
    setXPosition(index) {

      // set x position
      this.xSwipeWrapper = -index*this.lightboxInnerWidth
    },

    // index change
    onIndexChange(index) {
      this.imgIndex = index
      this.$emit('on-change', index)
    },

    // caption size 
    addCaptionPadding() {
      if(this.checkIfIsObject(this.imgIndex) && (this.items[this.imgIndex].title || this.items[this.imgIndex].descripcion)) {
        const el = document.getElementsByClassName('cool-lightbox-caption');
        if(el.length > 0) {
          this.paddingBottom = el[0].offsetHeight
        } 
      } else {
        this.paddingBottom = 60
      }
    },

    // check if is video
    getVideoUrl(itemSrc) {

      const youtubeUrl = this.getYoutubeUrl(itemSrc)
      const vimeoUrl = this.getVimeoUrl(itemSrc)
      const mp4Url = this.checkIsMp4(itemSrc)

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
    getYoutubeID(url) {

      // youtube data
      const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      const ytId = (url.match(youtubeRegex)) ? RegExp.$1 : false;

      if(ytId) {
        return ytId
      }

      return false
    },

    // get youtube url
    getYoutubeUrl(url) {

      // youtube data
      const ytId = this.getYoutubeID(url)

      // if is youtube video
      if(ytId) {
        return 'https://www.youtube.com/embed/'+ytId
      }

      return false
    },

    // vimeo ID
    getVimeoID(url) {
      
      // if is vimeo video
      const result = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
      if(result !== null) {
        return result[1]
      }

      return false
    },

    // get vimeo url
    getVimeoUrl(url) {

      // if is vimeo video
      const result = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
      if(result !== null) {
        return '//player.vimeo.com/video/'+result[1]+'?hd=1&show_title=1&show_byline=1&show_portrait=0&fullscreen=1'
      }

      return false
    },

    checkIsMp4(url) {
      if(this.imgIndex === null) {
        return false
      }

      const str = new String(url);
      if(str.endsWith('.mp4')){
        return url
      }

      return false
    },

    // check if item is object
    checkIfIsObject(itemIndex) {
      const item = this.items[itemIndex]
      if(typeof item === 'object' && item !== null) {
        return true
      }
      return false;
    },

    // arrows and escape events
    eventListener(e) {
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
    // lightbox styles
    lightboxStyles() {
      return { 
        'z-index': this.zIndex,
        'background-color': this.overlayColor,
      }
    },

    innerStyles() {
      return {
        'padding-bottom': this.paddingBottom+'px',
      }
    },

    // get item src
    itemSrc() {
      if(this.imgIndex === null) {
        return false
      }

      const item = this.items[this.imgIndex]
      if(this.checkIfIsObject(this.imgIndex)) {
        return item[this.srcName]
      }

      return item
    },

    // Lightbox classes
    lightboxClasses() {
      return {
        'cool-lightbox--can-zoom': this.canZoom,
        'cool-lightbox--is-zooming': this.isZooming,
        'cool-lightbox--show-thumbs': this.showThumbs,
        'cool-lightbox--is-swipping': this.isDraggingSwipe,
      }
    },

    // Buttons classes
    buttonsClasses() {
      return {
        'hidden': !this.buttonsVisible,
      }
    },

    // check if the slide has next element
    hasNext() {
      return (this.imgIndex + 1 < this.items.length)
    },

    // check if the slide has previous element 
    hasPrevious() {
      return (this.imgIndex - 1 >= 0)
    },  

    // Images wrapper styles to use drag and zoom
    imgWrapperStyle() {
      return {
        transform: 'translate3d(calc(-50% + '+this.left+'px), calc(-50% + '+this.top+'px), 0px) scale3d('+this.scale+', '+this.scale+', '+this.scale+')',
        top: `50%`,
        left: `50%`,
        transition: this.transition,
      }
    }
  }
};
</script>

<style lang="scss">
// A map of breakpoints.
$breakpoints: (
  phone-sm: 420px,
  phone: 767px,
  tablet-lg: 1024px,
  desktop: 1202px
);

// Breakpoints SCSS
@mixin breakpoint($breakpoint) {

  // If the breakpoint exists in the map.
	@if map-has-key($breakpoints, $breakpoint) {
	
    // Get the breakpoint value.
    $breakpoint-value: map-get($breakpoints, $breakpoint);
	
	  //Build the media query
		@media (min-width: $breakpoint-value) {
			@content;
		}
	} 
}

.cool-lightbox {
  position: fixed; 
  left: 0;
  bottom: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  transition: all .3s ease;
  .cool-lightbox-thumbs {
    position: absolute;
    height: 100vh;
    overflow-y: auto;
    width: 102px;
    right: -102px;
    top: 0;
    overflow-x: hidden;
    transition: all .3s ease;
    background-color: #ddd;
    scrollbar-width: thin;
    scrollbar-color: #fa4242 rgba(175, 175, 175, 0.9);
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    &::-webkit-scrollbar-button {
      width: 0px;
      height: 0px;
    }
    &::-webkit-scrollbar-thumb {
      background: #fa4242;
      border: 0px none #ffffff;
      border-radius: 50px;
    }
    &::-webkit-scrollbar-thumb:hover {
      background: #ffffff;
    }
    &::-webkit-scrollbar-thumb:active {
      background: #000000;
    }
    &::-webkit-scrollbar-track {
      background: #e1e1e1;
      border: 0px none #ffffff;
      border-radius: 8px;
    }
    &::-webkit-scrollbar-track:hover {
      background: #666666;
    }
    &::-webkit-scrollbar-track:active {
      background: #333333;
    }
    &::-webkit-scrollbar-corner {
      background: transparent;
    }
    @include breakpoint(phone) {
      width: 212px;
      right: -212px;
    }
    .cool-lightbox-thumbs__list {
      display: flex;
      flex-wrap: wrap;
      padding: 2px;
      padding-right: 0;
      .cool-lightbox__thumb {
        background-color: black;
        width: 100%;
        margin-right: 2px;
        margin-bottom: 2px;
        display: block;
        height: 75px;
        position: relative;
        @include breakpoint(phone) {
          width: calc(100%/2 - 2px);
        }
        &:before {
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0;
          content: '';
          z-index: 150;
          transition: all .3s ease;
          position: absolute;
          visibility: hidden;
          border: 3px solid #fa4242;
        }
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        &.is-video {
          .cool-lightbox__thumb__icon {
            position: absolute;
            z-index: 100;
            top: 50%;
            left: 50%;
            width: 25px;
            height: 25px;
            transform: translate(-50%,-50%);
            path {
              fill: #FFF;
            }
          }
          &:after {
            content: '';
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 50;
            position: absolute;
            background: rgba(0,0,0, 0.6);
          }
        }
        &.active, &:hover {
          &:before {
            opacity: 1;
            visibility: visible;
          }
        }
      }
    }
  }
  .cool-lightbox__inner {
    padding: 60px 0;
    position: absolute;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    transition: all .3s ease;
  }
  .cool-lightbox__progressbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    z-index: 500;
    transform-origin: 0;
    transform: scaleX(0);
    transition: transform 3s linear;
    display: block;
  }
  &.cool-lightbox--is-swipping {
    cursor: -webkit-grabbing; 
    cursor: grabbing;
    iframe {
      pointer-events: none;
    }
    .cool-lightbox__slide {
      transition: none;
      &.cool-lightbox__slide--hide, &.cool-lightbox__slide--hide {
        display: flex;
        z-index: 50;
      }
    }
  }
  &.cool-lightbox--can-zoom {
    .cool-lightbox__slide {
      img {
        cursor: zoom-in;
      }
    }
  }
  &.cool-lightbox--is-zooming {
    .cool-lightbox__slide {
      img {
        cursor: move; /* fallback if grab cursor is unsupported */
        cursor: grab;
        cursor: -moz-grab;
        cursor: -webkit-grab; 
      }
    }
    .cool-lightbox-caption {
      opacity: 0;
    }
  }
  &.cool-lightbox--show-thumbs {
    .cool-lightbox__inner {
      right: 102px;
      @include breakpoint(phone) {
        right: 212px;
      }
    }
    .cool-lightbox-thumbs {
      right: 0;
    }
  }
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  button {
    background: none;
    border: none;
    cursor: pointer;
    outline: none;
  }
  svg {
    path {
      fill: currentColor;
    }
  }
  .cool-lightbox-button {
    padding: 21px 16px 21px 4px;
    height: 100px;
    opacity: 1;
    z-index: 800;
    color: #ccc;
    transition: all .3s ease;
    position: absolute;
    top: calc(50% - 50px);
    width: 54px;
    transition: all .3s ease;
    visibility: visible;
    @include breakpoint(phone) {
      width: 70px;
      padding: 31px 26px 31px 6px;
    }
    &.hidden {
      opacity: 0;
      visibility: hidden;
    }
    &:hover {
      color: #fff;
    }
    > .cool-lightbox-button__icon {
      padding: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(30,30,30,.6);
      > svg {
        width: 100%;
        height: 100%;
      }
    }
    &.cool-lightbox-button--prev {
      left: 0;
    }
    &.cool-lightbox-button--next {
      right: 0;
      padding: 21px 4px 21px 16px;
      @include breakpoint(phone) {
        padding: 31px 6px 31px 26px;
      }
    }
  }
  .cool-lightbox__iframe {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    iframe {
      //position: absolute;
      width: 100%;
      height: 100%;
      @include breakpoint(phone) {
        max-width: 80vw;
        max-height: 80vh;
      }
    }
  }
  .cool-lightbox__wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    &.cool-lightbox__wrapper--swipe {
      display: flex;
      align-items: center;
      .cool-lightbox__slide {
        flex-shrink: 0;
        display: flex;
        position: relative;
        height: 100%;
        opacity: 0.4;
        transition: opacity .3s linear;
        &.cool-lightbox__slide--current {
          opacity: 1;
        }
      }
    }
  }
  .cool-lightbox__slide {
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    transition: transform .15s ease;
    display: none;
    position: absolute;
    &.cool-lightbox__slide--current {
      display: flex;
    }
      &.cool-lightbox__slide--prev, &.cool-lightbox__slide--next {
        display: flex;
        z-index: 50;
      }
    .cool-lightbox__slide__img {
      position: absolute;
      height: 100%;
      width: 100%;
      left: 50%;
      top: 50%;
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      transform: translate3d(-50%, -50%, 0px) scale3d(1, 1, 1);
      transition: all .3s ease;
      display: flex;
    }
    img {
      max-width: 100%;
      max-height: 100%;
      margin: auto;
      z-index: 9999;
      box-shadow: 0 0 1.5rem rgba(0,0,0,.45);
    }
  }
}

.cool-lightbox-toolbar {
  position: absolute;
  top: 0;
  right: 0;
  opacity: 1;
  display: flex;
  transition: all .3s ease;
  visibility: visible;
  &.hidden {
    opacity: 0;
    visibility: hidden;
  }
  .cool-lightbox-toolbar__btn {
    background: rgba(30,30,30,.6);
    border: 0;
    border-radius: 0;
    box-shadow: none;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    display: inline-flex;
    margin: 0;
    padding: 9px;
    position: relative;
    transition: color .2s;
    vertical-align: top;
    visibility: inherit;
    width: 40px;
    height: 40px;
    color: #ccc;
    @include breakpoint(phone) {
      width: 44px;
      height: 44px;
      padding: 10px;
    }
    > svg {
      width: 100%;
      height: 100%;
    }
    &:hover {
      color: #FFFFFF;
    }
  }
}

.cool-lightbox-caption {
  bottom: 0;
  color: #eee;
  font-size: 14px;
  font-weight: 400;
  left: 0;
  opacity: 1;
  line-height: 1.5;
  padding: 18px 28px 16px 24px;
  pointer-events: none;
  right: 0;
  text-align: center;
  z-index: 99996;
  direction: ltr;
  position: absolute;
  transition: opacity .25s ease,visibility 0s ease .25s;
  z-index: 99997;
  background: linear-gradient(0deg,rgba(0,0,0,.75) 0,rgba(0,0,0,.3) 50%,rgba(0,0,0,.15) 65%,rgba(0,0,0,.075) 75.5%,rgba(0,0,0,.037) 82.85%,rgba(0,0,0,.019) 88%,transparent);
  @include breakpoint(phone) {
    padding: 22px 30px 23px 30px;
  }
  h6 {
    font-size: 14px;
    margin: 0 0 6px 0;
    line-height: 130%;
    @include breakpoint(phone) {
      font-size: 16px;
      margin: 0 0 6px 0;
    }
  }
  p {
    font-size: 13px;
    line-height: 130%;
    color: #ccc;
    @include breakpoint(phone) {
      font-size: 15px;
    }
  }
}

.cool-lightbox-modal-enter-active, .cool-lightbox-modal-leave-active {
  transition: opacity .35s
}
.cool-lightbox-modal-enter, .cool-lightbox-modal-leave-to {
  opacity: 0
}

.cool-lightbox-slide-change-enter-active, .cool-lightbox-slide-change-leave-active {
  transition: opacity 0.27s;
}

.cool-lightbox-slide-change-enter, .cool-lightbox-slide-change-leave-to  {
  opacity: 0;
}

.cool-lightbox-loading-wrapper {
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  .cool-lightbox-loading {
    animation: cool-lightbox-rotate 1s linear infinite;
    background: transparent;
    border: 4px solid #888;
    border-bottom-color: #fff;
    border-radius: 50%;
    height: 50px;
    opacity: .7;
    padding: 0;
    width: 50px;
    z-index: 500;
  }
}

@keyframes cool-lightbox-rotate {
    100% {
        transform: rotate(360deg);
    }
}
</style>