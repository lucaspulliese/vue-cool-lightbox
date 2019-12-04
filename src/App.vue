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
          src: '/ffffff404.png',
          title: 'Que onda señor Bush'
        },
        {
          src: '/ffffff.png',
        },
        {
          src: 'https://www.youtube.com/watch?v=_sI_Ps7JSEk',
          title: 'Que onda señor Bush',
          description: 'Que onda señor Bush'
        },
        {
          src: 'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4',
          title: 'Que onda señor Bush',
          description: 'Que onda señor Bush'
        },
        {
          src: 'https://vimeo.com/191947042',
          title: 'Que onda señor Bush',
          description: 'Que onda señor Bush'
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
      //console.log(index);
      this.index = index
    }
  }
};
</script>

<style lang="scss">
.images-wrapper {
  display: flex;
  align-items: center;
  .image {
    width: 300px;
    height: 200px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat
  }
}
</style>