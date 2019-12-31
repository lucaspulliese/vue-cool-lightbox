<template>
  <div id="app">
    <CoolLightBox 
      :items="items" 
      :index="index"
      @close="index = null">
    </CoolLightBox>

    <CoolLightBoxSingle
      thumb="https://via.placeholder.com/315x200"
      full="https://via.placeholder.com/945x600"
      :full-width="945"
      :full-height="600"
    />

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
import CoolLightBoxSingle from './components/CoolLightBoxSingle.vue'

export default {
  name: "app",
  data: function () {
    return {
      items: [
        {
          title: 'Rocky mountain under blue and white sky',
          description: 'Photo by Guillaume Briard',
          src: '/obra-1-single.jpg',
        },
        {
          src: 'https://www.youtube.com/watch?v=NvEGPTdNlS0'
        },
        {
          src: '/obra-2.jpg',
        },
        {
          src: 'https://www.youtube.com/watch?v=NvEGPTdNlS0'
        }
      ],
      item: {
        title: 'Rocky mountain under blue and white sky',
        description: 'Photo by Guillaume Briard',
        src: '/obra-1-single.jpg',
      },
      
      index: null,
    };
  },
  components: {
    CoolLightBox,
    CoolLightBoxSingle
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