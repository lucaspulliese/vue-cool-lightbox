<template>
  <div id="app">
    <CoolLightBox 
      :items="items" 
      :index="index"
      loop
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
          src: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Shaqi_jrvej.jpg',
        },
        {
          src: '/video.mp4',
        },
        {
          src: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Shaqi_jrvej.jpg'
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
}
</style>