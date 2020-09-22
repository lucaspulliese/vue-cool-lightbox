<template>
  <div id="app">
    <CoolLightBox 
      :items="items" 
      :index="index"
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
          mediaType: "iframe",
          src: 'http://www.africau.edu/images/default/sample.pdf'
        },
        {
          mediaType: "image",
          src: 'https://www.cheatsheet.com/wp-content/uploads/2019/04/Planet-Earth.jpg',
        },
        {
          src: 'https://www.youtube.com/watch?v=NvEGPTdNlS0'
        }
      ],
      index: null
    };
  },
  components: {
    CoolLightBox
  },
  methods: {
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