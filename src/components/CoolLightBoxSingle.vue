<template>
  <div class="cool-lightbox-item">
    <div class="image-dialog">
      <button class="image-dialog-trigger" type="button" @click="showDialog">
        <img class="image-dialog-thumb" ref="thumb" :src="thumb"/>
      </button>

      <transition name="dialog" @enter="enter" @leave="leave">
        <div class="cool-lightbox cool-lightbox--single" 
          v-bind:style="{ 'padding-bottom': paddingBottom+'px'  }"
          v-show="appearedDialog" ref="dialog">

          <button class="image-dialog-close" type="button" @click="hideDialog" aria-label="Close"></button>

          <div class="cool-lightbox__wrapper">
            <div class="cool-lightbox__slide">
                <div key="image" class="cool-lightbox__slide__img">
                  <img class="image-dialog-animate" ref="animate" :class="{ loading: !loaded }" :src="loaded ? full : thumb" />
                  <img class="image-dialog-full" ref="full" :src="appearedDialog &amp;&amp; full" :width="fullWidth" 
                  :height="fullHeight" @load="onLoadFull" />
                </div>
                <!--/imgs-slide-->
            </div>
            <!--/cool-lightbox__slide-->
          </div>
          <!--/cool-lightbox__wrapper-->

        </div>
        <!--/cool-lightbox-->
      </transition>

      <CoolLightBox 
        :items="items" 
        :index="index"
        :loop="false"
        @opened="opened"
        @close="index = null">
      </CoolLightBox>
    </div>
  </div>
  <!--/cool-lightbox-item-->
</template>

<script>
import CoolLightBox from './CoolLightBox.vue';

export default {
  components: {
    CoolLightBox
  },

  props: {
    thumb: String,
    full: String,
  },
  
  data () {
    return {
      paddingBottom: 81,
      items: [
        {
          title: 'Rocky mountain under blue and white sky',
          description: 'Photo by Guillaume Briard',
          src: this.full,
        },
      ],
      index: null,
      loaded: false,
      appearedDialog: false,
      
      fullWidth: 0,
      fullHeight: 0,
    }
  },

  mounted() {
    const self = this
    const img = new Image()
    img.src = this.full

    img.onload = function() {
      const width = this.width
      const height = this.height

      self.resolveImageSlideSize(width, height)
    }
      
  },
  
  methods: {
    opened() {
      const self = this
      setTimeout(function() {
        const el = document.getElementsByClassName('cool-lightbox-caption');
        if(el.length > 0) {
          self.paddingBottom = el[0].offsetHeight
        }  else {
          self.paddingBottom = 60
        }
      }, 300)
    },

    resolveImageSlideSize: function (imgWidth, imgHeight) {
      var maxWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      var maxHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

      // Sets the default values from the image
      this.fullWidth = imgWidth;
      this.fullHeight = imgHeight;

      if (imgWidth > maxWidth) {
        this.fullWidth = maxWidth;
        this.fullHeight = Math.floor((maxWidth * imgHeight) / imgWidth);
      }

      if (imgHeight > maxHeight) {
        this.fullWidth = Math.floor((maxHeight * imgWidth) / imgHeight);
        this.fullHeight = maxHeight;
      }
    },

    showDialog () {
      this.appearedDialog = true

      this.index = 0
      const coolLightboxWrapper = document.getElementsByClassName('cool-lightbox');
      let computedStyle = getComputedStyle(coolLightboxWrapper[0])
      let heightWrapperImage = coolLightboxWrapper[0].clientHeight;  // height with padding
    },
    
    hideDialog () {
      this.appearedDialog = false
    },
    
    enter () {
      this.animateImage(
        this.$refs.thumb,
        this.$refs.full
      )
    },
    
    leave () {
      this.animateImage(
        this.$refs.full,
        this.$refs.thumb
      )
    },
    
    onLoadFull () {
      this.loaded = true
    },
  
    animateImage (startEl, destEl) {
      const start = this.getBoundForDialog(startEl)
      this.setStart(start)
      
      this.$nextTick(() => {
        const dest = this.getBoundForDialog(destEl)
        this.setDestination(start, {
          top: dest.top - this.paddingBottom,
          left: dest.left,
          width: dest.width || this.fullWidth,
          height: dest.height || this.fullHeight
        })
      })
    },
    
    getBoundForDialog (el) {
      const bound = el.getBoundingClientRect()
      const dialog = this.$refs.dialog
      return {
        top: bound.top + dialog.scrollTop,
        left: bound.left + dialog.scrollLeft,
        width: bound.width,
        height: bound.height
      }
    },
    
    setStart (start) {
      const el = this.$refs.animate
      el.style.left = start.left + 'px'
      el.style.top = start.top + 'px'
      el.style.width = start.width + 'px'
      el.style.height = start.height + 'px'
      el.style.transitionDuration = '0s'
      el.style.transform = ''
    },
    
    setDestination (start, dest) {
      const el = this.$refs.animate
      el.style.transitionDuration = ''
      
      const translate = `translate(${dest.left - start.left}px, ${dest.top - start.top}px)`
      const scale = `scale(${dest.width / start.width}, ${dest.height / start.height})`
      el.style.transform = `${translate} ${scale}`
    }
  }
}
</script>

<style lang="scss">
.cool-lightbox-item {
  display: block;
  height: 300px;
  width: 300px,
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.image-dialog {
  &-trigger {
    margin: 0;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  &-close {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 60px;
    height: 60px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    transition: 300ms ease-out;
    outline: none;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      margin-top: -0.5px;
      margin-left: -20px;
      width: 40px;
      height: 1px;
      background-color: #000;
    }
    
    &::before {
      transform: rotate(45deg);
    }
    
    &::after {
      transform: rotate(135deg);
    }
    
    &:hover {
      transform: rotate(270deg);
    }
  }
  
  &-background {
    overflow: auto;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    text-align: center;
  }
  
  &-animate {
    display: none;
    position: absolute;
    transform-origin: left top;
    
    &.loading {
      display: block;
    }
  }
}

.dialog {
  &-enter-active,
  &-leave-active {
    transition: background-color 300ms ease-out;
  }
  
  &-enter,
  &-leave-to {
    background-color: rgba(255, 255, 255, 0);
  }
  
  &-enter-active .image-dialog-animate,
  &-leave-active .image-dialog-animate {
    display: block;
    transition: transform 300ms cubic-bezier(1, 0, .7 , 1);
  }
  
  &-enter-active .image-dialog-full,
  &-leave-active .image-dialog-full {
    visibility: hidden;
  }
}
</style>