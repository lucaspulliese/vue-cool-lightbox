# Vue-cool-lightbox

Vue-cool-lightbox is a pretty Vue.js lightbox component without any dependencies, inspired by [fancybox](http://fancyapps.com/fancybox/3/) with zoom and videos supported

## Installation

Use node package manager to install vue-cool-lightbox.

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

## Examples
You can see the full documentation here: [https://vue-cool-lightbox.lucaspulliese.com/](https://vue-cool-lightbox.lucaspulliese.com/).

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
Or `items` can be just an array:
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
| src | yes | string |media source, it can be an image or a Youtube / Vimeo / Mp4 video |
| title | no | string | the image title |
| description | no | string | the image description |
| thumb | no | string | thumb url used in thumbs block |

### Props Supported

| Attribute | type | Description | Default |
|:------| :------: | :------: |:------|
| items | Array | Array of images/videos|  |
| index | Number | Index of items to open |  |
| loop | Boolean| Enables looping through items | true | 
| slideshow | Boolean | Enables lighbox slideshow | true | 
| slideshowColorBar | String | Color of the slideshow progress bar | #fa4242 | 
| slideshowDuration | Number | Duration of slides when slideshow is running (in ms) | 3000 | 
| srcName | String | Name of the prop to use as image/video url | src | 
| srcThumb | String | Name of the prop to use as image/video thumb | thumb | 
| overlayColor | String | Overlay color | rgba(30, 30, 30, .9) | 
| zIndex | Number | .cool-lightbox z-index | 9999 | 
| gallery | Boolean | Enable/disable gallery | true | 

### Slots Supported

| Name| Description |
|:------ |:------|
| icon-previous | Previous icon |
| icon-next | Next icon |
| close | Close icon |

### Events Supported

| Name | Attributes | Listen to | Description |
|:------ |:------| :------ |:------|
| OnChange | (indexItem) | @on-change | Emitted when the lightbox changes the item index |
| OnOpen | (indexItem) | @on-open | Emitted when the lightbox is opened |
| Close | (indexItem) | @close | Emitted when the lightbox is closed |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)