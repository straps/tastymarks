<template>
  <v-container fluid grid-list-lg align-center>
      <v-layout row wrap>
        <!-- <v-flex> -->
          <nuxt-link :to="`/tag/${tag.tag}`" class="tag-chip mx-2" v-for="tag in tags" :key="tag.tag" :style="{fontSize:fontSize(tag)+'px', lineHeight:maxFontSize+'px'}">{{tag.tag}}</nuxt-link>
        <!-- </v-flex> -->
      </v-layout>
  </v-container>
</template>
<script>
import { maxBy } from 'lodash'
export default {
  props: {
    tags: Array,
    baseFontSize: {
      default: 14
    },
    maxFontSize: {
      default: 34
    }
  },
  methods: {
    fontSize (tag) {
      return this.baseFontSize + (this.maxFontSize - this.baseFontSize) * (tag.count / this.maxCount)
    }
  },
  computed: {
    maxCount () {
      return maxBy(this.tags, (o) => o.count).count
    }
  }
}
</script>

<style scoped>
</style>

