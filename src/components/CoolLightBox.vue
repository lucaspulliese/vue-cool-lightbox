<template>
  <transition name="cool-lightbox-modal">
    <div class="cool-lightbox" 
      v-bind:class="lightboxClasses" 
      v-if="isVisible" 
      @click="closeModal"
      v-bind:style="{ 'padding-bottom': paddingBottom+'px'  }">

      <div class="cool-lightbox__progressbar" :style="stylesInterval"></div>

      <div class="cool-lightbox__navigation">
        <button class="cool-lightbox-button cool-lightbox-button--prev" :class="buttonsClasses" v-show="hasPrevious || loop" @click="onPrevClick">
          <slot name="icon-previous">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"></path></svg>
            </div>
          </slot>
        </button>

        <button class="cool-lightbox-button cool-lightbox-button--next" :class="buttonsClasses" v-show="hasNext || loop" @click="onNextClick">
          <slot name="icon-next">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"></path></svg>
            </div>
          </slot>
        </button>
      </div>
      <!--/cool-lightbox__navigation-->

      <div class="cool-lightbox__wrapper">
        <div class="cool-lightbox__slide">
          <transition name="cool-lightbox-slide-change" mode="out-in">
            <div v-if="!videoUrl" key="image" :style="imgWrapperStyle" class="cool-lightbox__slide__img">
              <transition name="cool-lightbox-slide-change" mode="out-in">
              <img 
                :src="itemSrc" 
                :key="imgIndex"
                draggable="false"
                
                @click="zoomImage"
                @mousedown="handleMouseDown($event)"
                @mouseup="handleMouseUp($event)"
                @mousemove="handleMouseMove($event)"
                />
              </transition>
            </div>
            <!--/imgs-slide-->
          

            <div v-else key="video" class="cool-lightbox__iframe">
              <transition name="cool-lightbox-slide-change" mode="out-in">
                <iframe class="cool-lightbox-video" :src="videoUrl" v-if="!isMp4" :style="aspectRatioVideo" :key="videoUrl" frameborder="0" 
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
                </iframe>

                <video class="cool-lightbox-video" v-if="isMp4" :style="aspectRatioVideo" :key="videoUrl" controls="" controlslist="nodownload" poster="">
                  <source :src="videoUrl" type="video/mp4">
                  Sorry, your browser doesn't support embedded videos, 
                  <a :href="videoUrl">download</a> 
                  and watch with your favorite video player!
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
        <div v-show="isObject && (items[imgIndex].title || items[imgIndex].description)" key="caption-block" class="cool-lightbox-caption">
          <transition name="cool-lightbox-slide-change" mode="out-in">
            <h6 key="title" v-if="isObject && items[imgIndex].title">{{ items[imgIndex].title }}</h6>
          </transition>

          <transition name="cool-lightbox-slide-change" mode="out-in">
            <p key="description" v-if="isObject && items[imgIndex].description">{{ items[imgIndex].description }}</p>
          </transition>
        </div>
        <!--/cool-lightbox-caption-->
      </transition>
      
      <div class="cool-lightbox-toolbar" :class="buttonsClasses">
        <button v-if="this.slideshow" class="cool-lightbox-toolbar__btn" @click="togglePlaySlideshow">
          <svg xmlns="http://www.w3.org/2000/svg" v-if="!isPlayingSlideShow" viewBox="0 0 24 24">
            <path d="M6.5 5.4v13.2l11-6.6z"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" v-else viewBox="0 0 24 24">
            <path d="M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"></path>
          </svg>
        </button>

        <button class="cool-lightbox-toolbar__btn" @click="close">
          <slot name="close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"></path>
            </svg>
          </slot>
        </button>
      </div>
      <!--/cool-liughtbox--toolbar-->

    </div>
    <!--/cool-lightbox-->
  </transition>
  <!--/transition-->
</template>

<script>
export default {

  data() {
    return {
      // styles data
      imgIndex: this.index,
      isVisible: false,
      paddingBottom: false,

      // aspect ratio in videos
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
    }
  },

  watch: {
    index(prev, val) {
      const self = this

      if(prev !== null) {

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
        document.getElementsByTagName('html')[0].style = 'overflow: hidden';
      } else {

        // hide and stop slideshow
        this.isVisible = false
        this.stopSlideShow()

        // remove events listener
        window.removeEventListener('keydown', this.eventListener)

        // remove styles avoid scroll
        document.getElementsByTagName('body')[0].style.overflow = '';
        document.getElementsByTagName('html')[0].style.overflow = '';

        // remove click event
        window.removeEventListener('click', this.showButtons)
      }

    }, 
    
    imgIndex(prev, val) {
      const thisContext = this

      // add img index
      this.imgIndex = prev;

      this.$nextTick(() => {

        // add caption padding to Lightbox wrapper
        this.addCaptionPadding()

        // check if use can zoom
        this.checkZoom()

        // reset zoom
        this.resetZoom()

        if(this.videoUrl) {
          this.setAspectRatioVideo();
        }
      })
    }, 
  },

  mounted() {
  },

  destroyed() {
  },

  methods: {

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

    stopSlideShow() {
      this.isPlayingSlideShow = false
      clearInterval(this.intervalProgress);
      this.stylesInterval = {
        'transform': 'scaleX(0)',
        'transition': 'none',
      }
    },

    move() {
      const self = this
      this.progressWidth = 100;
      this.intervalProgress = setInterval(frame, this.slideshowDuration);
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
          }, 1)
        }
      }
    }, 

    // show buttons event
    showButtons(event) {
      var elements = '.cool-lightbox-button, .cool-lightbox-button *, .cool-lightbox-toolbar__btn, .cool-lightbox-toolbar__btn *';
      if (!event.target.matches(elements)) {
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

    // Reset zoom data
    resetZoom() {
      this.scale = 1
      this.left = 0
      this.top = 0
      this.buttonsVisible = true
      this.canZoom = false
      this.isZooming = false
      this.transition = 'all .3s ease'
    },

    // check if the image is bigger than the viewport
    checkZoom() {
      const thisContext = this

      // check if is a video
      if(this.videoUrl) {
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
      let el = document.getElementsByClassName('cool-lightbox__slide');
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
      this.imgIndex = null;
      this.$emit("close");
    },

    // close event click outside
    closeModal(event) {
      if(window.innerWidth < 700) {
        return false;
      }

      var elements = '.cool-lightbox-button, .cool-lightbox-toolbar__btn, .cool-lightbox-toolbar__btn *, .cool-lightbox-button *, .cool-lightbox__slide__img *, .cool-lightbox-video';
      if (!event.target.matches(elements)) {
        this.imgIndex = null;
        this.$emit("close");
      }
    },

    // next slide event
    onNextClick(isFromSlideshow = false) {
      if(!isFromSlideshow) {
        this.stopSlideShow()
      }

      if(this.hasNext) {
        this.onIndexChange(this.imgIndex + 1)
      } else {
        // only if has loop prop
        if(this.loop) {
          this.onIndexChange(0)
        }
      }
    },

    // prev slide event
    onPrevClick() {
      this.stopSlideShow();
      if(this.hasPrevious) {
        this.onIndexChange(this.imgIndex - 1)
      } else {
        // only if has loop prop
        if(this.loop) {
          this.onIndexChange(this.items.length - 1)
        }
      }
    },

    // index change
    onIndexChange(index) {
      this.imgIndex = index
      this.$emit('onChange')
    },

    // caption size 
    addCaptionPadding() {
      if(this.isObject && (this.items[this.imgIndex].title || this.items[this.imgIndex].descripcion)) {
        const el = document.getElementsByClassName('cool-lightbox-caption');
        if(el.length > 0) {
          this.paddingBottom = el[0].offsetHeight
        } 
      } else {
        this.paddingBottom = 60
      }
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

    // get item src
    itemSrc() {
      if(this.imgIndex === null) {
        return false
      }

      const item = this.items[this.imgIndex]
      if(this.isObject) {
        return item.src
      }

      return item
    },

    // check if the item is an object (maybe has caption)
    isObject() {
      const item = this.items[this.imgIndex]
      if(typeof item === 'object' && item !== null) {
        return true
      }
      return false;
    },

    // get video url 
    videoUrl() {
      if(this.imgIndex === null) {
        return false
      }

      // youtube data
      const url = this.itemSrc
      const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
      const ytId = (url.match(youtubeRegex)) ? RegExp.$1 : false;

      // if is youtube video
      if(ytId) {
        return 'https://www.youtube.com/embed/'+ytId
      }

      // if is vimeo video
      const result = url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
      if(result !== null) {
        return '//player.vimeo.com/video/'+result[1]+'?hd=1&show_title=1&show_byline=1&show_portrait=0&fullscreen=1'
      }

      if(this.isMp4) {
        return url
      }

      return false
    },

    // check if is mp4, then return the url
    isMp4() {
      if(this.imgIndex === null) {
        return false
      }

      const url = this.itemSrc
      const str = new String(url);
      if(str.endsWith('.mp4')){
        return url
      }

      return false
    },

    // Lightbox classes
    lightboxClasses() {
      return {
        'cool-lightbox--can-zoom': this.canZoom,
        'cool-lightbox--is-zooming': this.isZooming
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
  padding: 60px 0;
  display: flex;
  z-index: 9999999;
  align-items: center;
  justify-content: center;
  right: 0;
  transition: all .3s ease;
  background: rgba(30, 30, 30, .9);
  .cool-lightbox__progressbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    z-index: 500;
    transform-origin: 0;
    background: red;
    transform: scaleX(0);
    transition: transform 3s linear;
    display: block;
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
    div {
      padding: 7px;
      background: rgba(30,30,30,.6);
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
  }
  .cool-lightbox__slide {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
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
    display: inline-block;
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
</style>