# Vue-cool-lightbox

Vue-cool-lightbox is a Vue.js lightbox component without any dependencies, inspired by [fancybox](http://fancyapps.com/fancybox/3/) with zoom and videos supported

## Installation

Use the node package manager to install vue-cool-lightbox.

```bash
npm install --save vue-cool-lightbox
```

and use the lightbox:
```javascript
import CoolLightBox from 'vue-cool-lightbox'

export default {
  components: {
    CoolLightBox,
  },
}
```

## Demo
The live demo is available here: [https://lucaspulliese.github.io/vue-cool-lightbox/](https://lucaspulliese.github.io/vue-cool-lightbox/).

## Usage

```vue
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
import CoolLightBox from 'vue-cool-lightbox'

export default {
  name: "app",
  data: function () {
    return {
      items: [
        {
          src: 'https://cosmos-images2.imgix.net/file/spina/photo/20565/
          191010_nature.jpg?ixlib=rails-2.1.4&auto=format&ch=Width%2CDPR&fit=max&w=835',
        },
        {
          src: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/
          images/nature-quotes-1557340276.jpg?crop=0.666xw:1.00xh;0.168xw,0&resize=640:*',
        },
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
```
Or `items` could be just an array:
```javascript
items: [
  'http://example.com/image.jpg',
  'youtube.com',
  'vimeo.com',
  'mp4',
]
```

### Items Supported attributes 

| Attribute | required | type | Description |
|:------| :------: | :------: |:------|
| src | yes | string |media source, it could be an image or a Youtube / Vimeo / Mp4 video |
| title | no | string | the image title |
| description | no | string | the image description |

### Props Supported

| Attribute | type | Description | Default
|:------| :------: | :------: |:------|
| items| Array | Array of images/videos|  |
| index| Number | Index of items to open |  |
| loop | Boolean| Enables looping through items | false | 

### Slots Supported

| Name| Description 
|:------ |:------|
| icon-previous | Previous icon |
| icon-next | Next icon |
| iclose | Close icon |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)