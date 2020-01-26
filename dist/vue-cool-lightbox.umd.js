(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.CoolLightBox = {}));
}(this, (function (exports) { 'use strict';

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
        // styles data
        imgIndex: this.index,
        isVisible: false,
        paddingBottom: false,
        imageLoading: false,
        showThumbs: false,

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
      }
    },

    watch: {
      index: function index(prev, val) {
        var self = this;

        if(prev !== null) {

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

        // add img index
        this.imgIndex = prev;

        this.$nextTick(function () {

          if(prev !== null) {

            // if is an image change imageLoading to true
            if(!this$1.videoUrl) {
              this$1.imageLoading = true;
            }

            // add caption padding to Lightbox wrapper
            this$1.addCaptionPadding();

            // check if user can zoom
            this$1.checkZoom();
          }

          // reset zoom
          this$1.resetZoom();

          if(this$1.videoUrl) {
            this$1.setAspectRatioVideo();
          }
        });
      }, 
    },

    mounted: function mounted() {
    },

    destroyed: function destroyed() {
    },

    methods: {

      // get video url
      itemThumb: function itemThumb(itemUrl, itemIndex) {
        
        var thumb = this.getItemThumb(itemIndex);
        if(thumb !== undefined && thumb !== null) {
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
        if(this.isObject) {
          return item[this.srcName]
        }

        return item
      },
      
      getItemThumb: function getItemThumb(imgIndex) {
        if(imgIndex === null) {
          return false
        }

        var item = this.items[imgIndex];
        if(this.isObject) {
          return item[this.srcThumb]
        }

        return item
      },

      // toggle play slideshow event
      togglePlaySlideshow: function togglePlaySlideshow() {
        if(!this.slideshow) {
          return false
        }

        if(!this.hasNext && !this.loop) {
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
          if(!self.hasNext && !self.loop) {
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
        var elements = '.cool-lightbox-button, .cool-lightbox-button *, .cool-lightbox-toolbar__btn, .cool-lightbox-toolbar__btn *';
        if (!event.target.matches(elements)) {
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
        }
        e.stopPropagation();
      },

      // zoom image event
      zoomImage: function zoomImage() {
        if(window.innerWidth < 700) {
          return false
        }

        if(!this.canZoom) {
          return false
        }

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
          this.scale = 1.6;

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
        this.transition = 'all .3s ease';
        
        if(window.innerWidth >= 700) {
          this.buttonsVisible = true;
        }
      },

      // check if the image is bigger than the viewport
      checkZoom: function checkZoom() {
        var thisContext = this;

        // check if is a video
        if(this.videoUrl) {
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
        var el = document.getElementsByClassName('cool-lightbox__slide');
        if(window.innerWidth < 700) {

          var width = el[0].clientWidth;
          var height = Math.round((width/16)*9);

          this.aspectRatioVideo.height = height+'px';
          this.aspectRatioVideo.width = width+'px';

        } else {
          
          setTimeout(function() {
            var height = el[0].clientHeight;
            var width = (height/9)*16;

            thisContext.aspectRatioVideo.height = height+'px';
            thisContext.aspectRatioVideo.width = width+'px';
          }, 150);

        }
      },

      // close event
      close: function close() {
        this.imgIndex = null;
        this.stopSlideShow();
        this.$emit("close");
      },

      // close event click outside
      closeModal: function closeModal(event) {
        if(window.innerWidth < 700) {
          return false;
        }

        var elements = '.cool-lightbox-thumbs, .cool-lightbox-thumbs *, .cool-lightbox-button, .cool-lightbox-toolbar__btn, .cool-lightbox-toolbar__btn *, .cool-lightbox-button *, .cool-lightbox__slide__img *, .cool-lightbox-video';
        if (!event.target.matches(elements)) {
          this.imgIndex = null;
          this.$emit("close");
        }
      },

      // next slide event
      onNextClick: function onNextClick(isFromSlideshow) {
        if ( isFromSlideshow === void 0 ) isFromSlideshow = false;

        if(!isFromSlideshow) {
          this.stopSlideShow();
        }

        if(this.hasNext) {
          this.onIndexChange(this.imgIndex + 1);
        } else {
          // only if has loop prop
          if(this.loop) {
            this.onIndexChange(0);
          }
        }
      },

      // prev slide event
      onPrevClick: function onPrevClick() {
        this.stopSlideShow();
        if(this.hasPrevious) {
          this.onIndexChange(this.imgIndex - 1);
        } else {
          // only if has loop prop
          if(this.loop) {
            this.onIndexChange(this.items.length - 1);
          }
        }
      },

      // index change
      onIndexChange: function onIndexChange(index) {
        this.imgIndex = index;
        this.$emit('on-change', index);
      },

      // caption size 
      addCaptionPadding: function addCaptionPadding() {
        if(this.isObject && (this.items[this.imgIndex].title || this.items[this.imgIndex].descripcion)) {
          var el = document.getElementsByClassName('cool-lightbox-caption');
          if(el.length > 0) {
            this.paddingBottom = el[0].offsetHeight;
          } 
        } else {
          this.paddingBottom = 60;
        }
      },

      // check if is video
      isVideo: function isVideo(itemSrc) {

        if(this.getYoutubeUrl(itemSrc) || this.getVimeoUrl(itemSrc) || this.checkIsMp4(itemSrc)) {
          return true
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
        var youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        var ytId = (url.match(youtubeRegex)) ? RegExp.$1 : false;

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

      // lightbox styles
      lightboxStyles: function lightboxStyles() {
        return { 
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
        if(this.isObject) {
          return item[this.srcName]
        }

        return item
      },

      // check if the item is an object (maybe has caption)
      isObject: function isObject() {
        var item = this.items[this.imgIndex];
        if(typeof item === 'object' && item !== null) {
          return true
        }
        return false;
      },

      // get video url 
      videoUrl: function videoUrl() {
        if(this.imgIndex === null) {
          return false
        }

        var urlReturn;
        var url = this.itemSrc;

        urlReturn = this.getYoutubeUrl(url); 
        if(urlReturn) {
          return urlReturn
        }
        
        urlReturn = this.getVimeoUrl(url);
        if(urlReturn) {
          return urlReturn
        } 

        if(this.isMp4) {
          return url
        }

        return false
      },

      // check if is mp4, then return the url
      isMp4: function isMp4() {
        if(this.imgIndex === null) {
          return false
        }

        var url = this.itemSrc;
        var str = new String(url);
        if(str.endsWith('.mp4')){
          return url
        }

        return false
      },

      // Lightbox classes
      lightboxClasses: function lightboxClasses() {
        return {
          'cool-lightbox--can-zoom': this.canZoom,
          'cool-lightbox--is-zooming': this.isZooming,
          'cool-lightbox--show-thumbs': this.showThumbs,
        }
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

      // Images wrapper styles to use drag and zoom
      imgWrapperStyle: function imgWrapperStyle() {
        return {
          transform: 'translate3d(calc(-50% + '+this.left+'px), calc(-50% + '+this.top+'px), 0px) scale3d('+this.scale+', '+this.scale+', '+this.scale+')',
          top: "50%",
          left: "50%",
          transition: this.transition,
        }
      }
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

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }
  var HEAD = document.head || document.getElementsByTagName('head')[0];
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) { style.element.setAttribute('media', css.media); }
        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) { style.element.removeChild(nodes[index]); }
        if (nodes.length) { style.element.insertBefore(textNode, nodes[index]); }else { style.element.appendChild(textNode); }
      }
    }
  }

  var browser = createInjector;

  /* script */
  var __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',{attrs:{"name":"cool-lightbox-modal"}},[(_vm.isVisible)?_c('div',{staticClass:"cool-lightbox",class:_vm.lightboxClasses,style:(_vm.lightboxStyles),on:{"click":_vm.closeModal}},[_c('div',{staticClass:"cool-lightbox-thumbs"},[_c('div',{staticClass:"cool-lightbox-thumbs__list"},_vm._l((_vm.items),function(item,itemIndex){return _c('button',{key:itemIndex,staticClass:"cool-lightbox__thumb",class:{ 
              active: itemIndex === _vm.imgIndex,
              'is-video': _vm.isVideo(_vm.getItemSrc(itemIndex)) 
            },on:{"click":function($event){_vm.imgIndex = itemIndex;}}},[(_vm.isVideo(_vm.getItemSrc(itemIndex)))?_c('svg',{staticClass:"cool-lightbox__thumb__icon",attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M6.5 5.4v13.2l11-6.6z"}})]):_vm._e(),_vm._v(" "),_c('img',{attrs:{"src":_vm.itemThumb(_vm.getItemSrc(itemIndex), itemIndex),"alt":""}})])}),0)]),_vm._v(" "),_c('div',{staticClass:"cool-lightbox__inner",style:(_vm.innerStyles)},[_c('div',{staticClass:"cool-lightbox__progressbar",style:(_vm.stylesInterval)}),_vm._v(" "),_c('div',{staticClass:"cool-lightbox__navigation"},[_c('button',{directives:[{name:"show",rawName:"v-show",value:(_vm.hasPrevious || _vm.loop),expression:"hasPrevious || loop"}],staticClass:"cool-lightbox-button cool-lightbox-button--prev",class:_vm.buttonsClasses,on:{"click":_vm.onPrevClick}},[_vm._t("icon-previous",[_c('div',{staticClass:"cool-lightbox-button__icon"},[_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M11.28 15.7l-1.34 1.37L5 12l4.94-5.07 1.34 1.38-2.68 2.72H19v1.94H8.6z"}})])])])],2),_vm._v(" "),_c('button',{directives:[{name:"show",rawName:"v-show",value:(_vm.hasNext || _vm.loop),expression:"hasNext || loop"}],staticClass:"cool-lightbox-button cool-lightbox-button--next",class:_vm.buttonsClasses,on:{"click":function($event){return _vm.onNextClick(false)}}},[_vm._t("icon-next",[_c('div',{staticClass:"cool-lightbox-button__icon"},[_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M15.4 12.97l-2.68 2.72 1.34 1.38L19 12l-4.94-5.07-1.34 1.38 2.68 2.72H5v1.94z"}})])])])],2)]),_vm._v(" "),_c('div',{staticClass:"cool-lightbox__wrapper"},[_c('div',{staticClass:"cool-lightbox__slide"},[_c('transition',{attrs:{"name":"cool-lightbox-slide-change","mode":"out-in"}},[(!_vm.videoUrl)?_c('div',{key:"image",staticClass:"cool-lightbox__slide__img",style:(_vm.imgWrapperStyle)},[_c('transition',{attrs:{"name":"cool-lightbox-slide-change","mode":"out-in"}},[_c('img',{key:_vm.imgIndex,attrs:{"src":_vm.itemSrc,"draggable":"false"},on:{"click":_vm.zoomImage,"load":function($event){_vm.imageLoading = false;},"mousedown":function($event){return _vm.handleMouseDown($event)},"mouseup":function($event){return _vm.handleMouseUp($event)},"mousemove":function($event){return _vm.handleMouseMove($event)}}})]),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.imageLoading),expression:"imageLoading"}],staticClass:"cool-lightbox-loading"})],1):_c('div',{key:"video",staticClass:"cool-lightbox__iframe"},[_c('transition',{attrs:{"name":"cool-lightbox-slide-change","mode":"out-in"}},[(!_vm.isMp4)?_c('iframe',{key:_vm.videoUrl,staticClass:"cool-lightbox-video",style:(_vm.aspectRatioVideo),attrs:{"src":_vm.videoUrl,"frameborder":"0","allow":"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture","allowfullscreen":""}}):_vm._e(),_vm._v(" "),(_vm.isMp4)?_c('video',{key:_vm.videoUrl,staticClass:"cool-lightbox-video",style:(_vm.aspectRatioVideo),attrs:{"controls":"","controlslist":"nodownload","poster":""}},[_c('source',{attrs:{"src":_vm.videoUrl,"type":"video/mp4"}}),_vm._v("\n                  Sorry, your browser doesn't support embedded videos\n                ")]):_vm._e()])],1)])],1)]),_vm._v(" "),_c('transition',{attrs:{"name":"modal"}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.isObject && (_vm.items[_vm.imgIndex].title || _vm.items[_vm.imgIndex].description)),expression:"isObject && (items[imgIndex].title || items[imgIndex].description)"}],key:"caption-block",staticClass:"cool-lightbox-caption"},[_c('transition',{attrs:{"name":"cool-lightbox-slide-change","mode":"out-in"}},[(_vm.isObject && _vm.items[_vm.imgIndex].title)?_c('h6',{key:"title"},[_vm._v(_vm._s(_vm.items[_vm.imgIndex].title))]):_vm._e()]),_vm._v(" "),_c('transition',{attrs:{"name":"cool-lightbox-slide-change","mode":"out-in"}},[(_vm.isObject && _vm.items[_vm.imgIndex].description)?_c('p',{key:"description"},[_vm._v(_vm._s(_vm.items[_vm.imgIndex].description))]):_vm._e()])],1)]),_vm._v(" "),_c('div',{staticClass:"cool-lightbox-toolbar",class:_vm.buttonsClasses},[(this.slideshow)?_c('button',{staticClass:"cool-lightbox-toolbar__btn",on:{"click":_vm.togglePlaySlideshow}},[(!_vm.isPlayingSlideShow)?_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M6.5 5.4v13.2l11-6.6z"}})]):_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M8.33 5.75h2.2v12.5h-2.2V5.75zm5.15 0h2.2v12.5h-2.2V5.75z"}})])]):_vm._e(),_vm._v(" "),_c('button',{staticClass:"cool-lightbox-toolbar__btn",on:{"click":function($event){_vm.showThumbs = !_vm.showThumbs;}}},[_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M14.59 14.59h3.76v3.76h-3.76v-3.76zm-4.47 \n            0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76v-3.76zm-4.47 \n            0h3.76v3.76h-3.76v-3.76zm-4.47 0h3.76v3.76H5.65v-3.76zm8.94-4.47h3.76v3.76h-3.76V5.65zm-4.47 \n            0h3.76v3.76h-3.76V5.65zm-4.47 0h3.76v3.76H5.65V5.65z"}})])]),_vm._v(" "),_c('button',{staticClass:"cool-lightbox-toolbar__btn",on:{"click":_vm.close}},[_vm._t("close",[_c('svg',{attrs:{"xmlns":"http://www.w3.org/2000/svg","viewBox":"0 0 24 24"}},[_c('path',{attrs:{"d":"M12 10.6L6.6 5.2 5.2 6.6l5.4 5.4-5.4 5.4 1.4 1.4 5.4-5.4 5.4 5.4 1.4-1.4-5.4-5.4 5.4-5.4-1.4-1.4-5.4 5.4z"}})])])],2)])],1)]):_vm._e()])};
  var __vue_staticRenderFns__ = [];

    /* style */
    var __vue_inject_styles__ = function (inject) {
      if (!inject) { return }
      inject("data-v-3660260d_0", { source: ".cool-lightbox{position:fixed;left:0;bottom:0;top:0;display:flex;z-index:9999999;align-items:center;justify-content:center;right:0;transition:all .3s ease}.cool-lightbox .cool-lightbox-thumbs{position:absolute;height:100vh;overflow-y:auto;width:102px;right:-102px;top:0;overflow-x:hidden;transition:all .3s ease;background-color:#ddd;scrollbar-width:thin;scrollbar-color:#fa4242 rgba(175,175,175,.9)}.cool-lightbox .cool-lightbox-thumbs::-webkit-scrollbar{width:6px;height:6px}.cool-lightbox .cool-lightbox-thumbs::-webkit-scrollbar-button{width:0;height:0}.cool-lightbox .cool-lightbox-thumbs::-webkit-scrollbar-thumb{background:#fa4242;border:0 none #fff;border-radius:50px}.cool-lightbox .cool-lightbox-thumbs::-webkit-scrollbar-thumb:hover{background:#fff}.cool-lightbox .cool-lightbox-thumbs::-webkit-scrollbar-thumb:active{background:#000}.cool-lightbox .cool-lightbox-thumbs::-webkit-scrollbar-track{background:#e1e1e1;border:0 none #fff;border-radius:8px}.cool-lightbox .cool-lightbox-thumbs::-webkit-scrollbar-track:hover{background:#666}.cool-lightbox .cool-lightbox-thumbs::-webkit-scrollbar-track:active{background:#333}.cool-lightbox .cool-lightbox-thumbs::-webkit-scrollbar-corner{background:0 0}@media (min-width:767px){.cool-lightbox .cool-lightbox-thumbs{width:212px;right:-212px}}.cool-lightbox .cool-lightbox-thumbs .cool-lightbox-thumbs__list{display:flex;flex-wrap:wrap;padding:2px;padding-right:0}.cool-lightbox .cool-lightbox-thumbs .cool-lightbox-thumbs__list .cool-lightbox__thumb{background-color:#000;width:100%;margin-right:2px;margin-bottom:2px;display:block;height:75px;position:relative}@media (min-width:767px){.cool-lightbox .cool-lightbox-thumbs .cool-lightbox-thumbs__list .cool-lightbox__thumb{width:calc(100%/2 - 2px)}}.cool-lightbox .cool-lightbox-thumbs .cool-lightbox-thumbs__list .cool-lightbox__thumb:before{top:0;left:0;right:0;bottom:0;opacity:0;content:'';z-index:150;transition:all .3s ease;position:absolute;visibility:hidden;border:3px solid #fa4242}.cool-lightbox .cool-lightbox-thumbs .cool-lightbox-thumbs__list .cool-lightbox__thumb img{width:100%;height:100%;object-fit:cover}.cool-lightbox .cool-lightbox-thumbs .cool-lightbox-thumbs__list .cool-lightbox__thumb.is-video .cool-lightbox__thumb__icon{position:absolute;z-index:100;top:50%;left:50%;width:25px;height:25px;transform:translate(-50%,-50%)}.cool-lightbox .cool-lightbox-thumbs .cool-lightbox-thumbs__list .cool-lightbox__thumb.is-video .cool-lightbox__thumb__icon path{fill:#fff}.cool-lightbox .cool-lightbox-thumbs .cool-lightbox-thumbs__list .cool-lightbox__thumb.is-video:after{content:'';top:0;left:0;right:0;bottom:0;z-index:50;position:absolute;background:rgba(0,0,0,.6)}.cool-lightbox .cool-lightbox-thumbs .cool-lightbox-thumbs__list .cool-lightbox__thumb.active:before,.cool-lightbox .cool-lightbox-thumbs .cool-lightbox-thumbs__list .cool-lightbox__thumb:hover:before{opacity:1;visibility:visible}.cool-lightbox .cool-lightbox__inner{padding:60px 0;position:absolute;height:100%;top:0;left:0;right:0;overflow:hidden;transition:all .3s ease}.cool-lightbox .cool-lightbox__progressbar{position:absolute;top:0;left:0;right:0;height:2px;z-index:500;transform-origin:0;transform:scaleX(0);transition:transform 3s linear;display:block}.cool-lightbox.cool-lightbox--can-zoom .cool-lightbox__slide img{cursor:zoom-in}.cool-lightbox.cool-lightbox--is-zooming .cool-lightbox__slide img{cursor:move;cursor:grab;cursor:-moz-grab;cursor:-webkit-grab}.cool-lightbox.cool-lightbox--is-zooming .cool-lightbox-caption{opacity:0}.cool-lightbox.cool-lightbox--show-thumbs .cool-lightbox__inner{right:102px}@media (min-width:767px){.cool-lightbox.cool-lightbox--show-thumbs .cool-lightbox__inner{right:212px}}.cool-lightbox.cool-lightbox--show-thumbs .cool-lightbox-thumbs{right:0}.cool-lightbox *{box-sizing:border-box;padding:0;margin:0}.cool-lightbox button{background:0 0;border:none;cursor:pointer;outline:0}.cool-lightbox svg path{fill:currentColor}.cool-lightbox .cool-lightbox-button{padding:21px 16px 21px 4px;height:100px;opacity:1;z-index:800;color:#ccc;transition:all .3s ease;position:absolute;top:calc(50% - 50px);width:54px;transition:all .3s ease;visibility:visible}@media (min-width:767px){.cool-lightbox .cool-lightbox-button{width:70px;padding:31px 26px 31px 6px}}.cool-lightbox .cool-lightbox-button.hidden{opacity:0;visibility:hidden}.cool-lightbox .cool-lightbox-button:hover{color:#fff}.cool-lightbox .cool-lightbox-button>.cool-lightbox-button__icon{padding:7px;display:flex;align-items:center;justify-content:center;background:rgba(30,30,30,.6)}.cool-lightbox .cool-lightbox-button>.cool-lightbox-button__icon>svg{width:100%;height:100%}.cool-lightbox .cool-lightbox-button.cool-lightbox-button--prev{left:0}.cool-lightbox .cool-lightbox-button.cool-lightbox-button--next{right:0;padding:21px 4px 21px 16px}@media (min-width:767px){.cool-lightbox .cool-lightbox-button.cool-lightbox-button--next{padding:31px 6px 31px 26px}}.cool-lightbox .cool-lightbox__iframe{width:100%;display:flex;align-items:center;justify-content:center;position:relative}.cool-lightbox .cool-lightbox__iframe iframe{width:100%;height:100%}@media (min-width:767px){.cool-lightbox .cool-lightbox__iframe iframe{max-width:80vw;max-height:80vh}}.cool-lightbox .cool-lightbox__wrapper{width:100%;height:100%}.cool-lightbox .cool-lightbox__slide{width:100%;height:100%;display:flex;position:relative}.cool-lightbox .cool-lightbox__slide .cool-lightbox__slide__img{position:absolute;height:100%;width:100%;left:50%;top:50%;-webkit-backface-visibility:hidden;backface-visibility:hidden;transform:translate3d(-50%,-50%,0) scale3d(1,1,1);transition:all .3s ease;display:flex}.cool-lightbox .cool-lightbox__slide img{max-width:100%;max-height:100%;margin:auto;z-index:9999;box-shadow:0 0 1.5rem rgba(0,0,0,.45)}.cool-lightbox-toolbar{position:absolute;top:0;right:0;opacity:1;display:flex;transition:all .3s ease;visibility:visible}.cool-lightbox-toolbar.hidden{opacity:0;visibility:hidden}.cool-lightbox-toolbar .cool-lightbox-toolbar__btn{background:rgba(30,30,30,.6);border:0;border-radius:0;box-shadow:none;cursor:pointer;justify-content:center;align-items:center;display:inline-flex;margin:0;padding:9px;position:relative;transition:color .2s;vertical-align:top;visibility:inherit;width:40px;height:40px;color:#ccc}@media (min-width:767px){.cool-lightbox-toolbar .cool-lightbox-toolbar__btn{width:44px;height:44px;padding:10px}}.cool-lightbox-toolbar .cool-lightbox-toolbar__btn>svg{width:100%;height:100%}.cool-lightbox-toolbar .cool-lightbox-toolbar__btn:hover{color:#fff}.cool-lightbox-caption{bottom:0;color:#eee;font-size:14px;font-weight:400;left:0;opacity:1;line-height:1.5;padding:18px 28px 16px 24px;pointer-events:none;right:0;text-align:center;z-index:99996;direction:ltr;position:absolute;transition:opacity .25s ease,visibility 0s ease .25s;z-index:99997;background:linear-gradient(0deg,rgba(0,0,0,.75) 0,rgba(0,0,0,.3) 50%,rgba(0,0,0,.15) 65%,rgba(0,0,0,.075) 75.5%,rgba(0,0,0,.037) 82.85%,rgba(0,0,0,.019) 88%,transparent)}@media (min-width:767px){.cool-lightbox-caption{padding:22px 30px 23px 30px}}.cool-lightbox-caption h6{font-size:14px;margin:0 0 6px 0;line-height:130%}@media (min-width:767px){.cool-lightbox-caption h6{font-size:16px;margin:0 0 6px 0}}.cool-lightbox-caption p{font-size:13px;line-height:130%;color:#ccc}@media (min-width:767px){.cool-lightbox-caption p{font-size:15px}}.cool-lightbox-modal-enter-active,.cool-lightbox-modal-leave-active{transition:opacity .35s}.cool-lightbox-modal-enter,.cool-lightbox-modal-leave-to{opacity:0}.cool-lightbox-slide-change-enter-active,.cool-lightbox-slide-change-leave-active{transition:opacity .27s}.cool-lightbox-slide-change-enter,.cool-lightbox-slide-change-leave-to{opacity:0}.cool-lightbox-loading{animation:cool-lightbox-rotate 1s linear infinite;background:0 0;border:4px solid #888;border-bottom-color:#fff;border-radius:50%;height:50px;left:50%;margin:-25px 0 0 -25px;opacity:.7;padding:0;position:absolute;top:50%;width:50px;z-index:500}@keyframes cool-lightbox-rotate{100%{transform:rotate(360deg)}}", map: undefined, media: undefined });

    };
    /* scoped */
    var __vue_scope_id__ = undefined;
    /* module identifier */
    var __vue_module_identifier__ = undefined;
    /* functional template */
    var __vue_is_functional_template__ = false;
    /* style inject SSR */
    

    
    var CoolLightBox = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      browser,
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

  exports.default = CoolLightBox;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
