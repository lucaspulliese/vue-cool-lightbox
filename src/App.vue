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
          src: 'https://cosmos-images2.imgix.net/file/spina/photo/20565/191010_nature.jpg?ixlib=rails-2.1.4&auto=format&ch=Width%2CDPR&fit=max&w=835',
        },
        {
          src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=640:*',
        },
        {
          src: 'https://images.unsplash.com/photo-1420593248178-d88870618ca0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
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