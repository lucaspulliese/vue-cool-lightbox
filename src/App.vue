<template>
  <div id="app">
    <CoolLightBox
      effect="fade"
      :items="items" 
      :index="index"
      @on-change-end="plyr"
      @close="index = null">
    </CoolLightBox>

    <div class="images-wrapper">
      <div
        class="image"
        v-for="(image, imageIndex) in items"
        :key="imageIndex"
        @click="setIndex(imageIndex)"
        :style="{ backgroundImage: 'url(' + image.src + ')' }"
      ></div>
    </div>
  </div>
</template>

<script>
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import CoolLightBox from './components/CoolLightBox.vue'

export default {
  name: "app",
  data: function () {
    return {
      items: [
        {
          title: 'Rocky mountain under blue and white sky',
          description: 'Photo by Guillaume Briard',
          src: 'https://www.cheatsheet.com/wp-content/uploads/2019/04/Planet-Earth.jpg',
        },
        {
          src: 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Rote_Ruhrarmee_1920.jpg'
        },
        {
          src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=1200:*',
          srcset: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=640:* 640w, https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=900:* 900w, https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=1400:* 1400w',
          sizes: '50vw'
        },
        {
          src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=1200:*',
          srcset: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=640:* 640w, https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=900:* 900w, https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=1400:* 1400w',
          sizes: '50vw',
          picture: {
            sources: [
              {
                srcset: 'https://www.planetware.com/wpimages/2020/02/france-in-pictures-beautiful-places-to-photograph-eiffel-tower.jpg',
                media: '(min-width: 1920px)'
              }
            ]
          }
        },
          {
          src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=1200:*',
          srcset: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=640:* 640w, https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=900:* 900w, https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=1400:* 1400w',
          sizes: '50vw',
          picture: {
            sources: [
              {
                srcset: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=640:* 640w, https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=900:* 900w, https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=1400:* 1400w',
              }
            ]
          }
        },
        {
          mediaType: "iframe",
          src: 'http://www.africau.edu/images/default/sample.pdf'
        },
        {
          mediaType: "image",
          src: 'https://www.cheatsheet.com/wp-content/uploads/2019/04/Planet-Earth.jpg',
        },
        {
          src: 'https://file-examples-com.github.io/uploads/2017/04/file_example_MP4_480_1_5MG.mp4'
        }
      ],
      index: null
    };
  },
  components: {
    CoolLightBox
  },
  methods: {
    plyr() {
      return Plyr.setup('.cool-lightbox-video')
    },
    setIndex(index) {
      this.index = index
    }
  }
};
</script>

<style>
.images-wrapper {
  display: flex;
}

.image {
  height: 300px;
  width: 300px;
  display: block;
  background-color: red;
}

body,
html {
}
</style>