<template>
  <v-container fill-height>
    <v-layout row wrap>
      <v-flex xs12>
        <title-card :title="(id?'Edit':'Add')+' Bookmark'"></title-card>
        <v-card class="mt-2">
          <v-card-text>
            <v-form v-model="valid" class="mt-4" ref="form" lazy-validation>
              <v-text-field label="URL" v-model="url" required autofocus @change="onChangeURL" :rules="urlRules"></v-text-field>
              <v-text-field label="Title" v-model="title" required :rules="requiredRules"></v-text-field>
              <v-select label="Tag list" chips tags clearable v-model="tags" ref="tags" :rules="tagsRules" @keypress="updateTagsOnSpace" @change="onChangeTags" @input="normalizeTags">
                <template slot="selection" slot-scope="data">
                  <v-chip close small @input="removeTag(data.item)" color="red" class="white--text">
                    <strong>{{ data.item }}</strong>
                  </v-chip>
                </template>
              </v-select>
              <!-- <v-text-field label="Notes" v-model="notes" multi-line></v-text-field> -->
              <v-btn v-if="$store.state.user" color="primary" :disabled="!valid" @click="onSave">Save</v-btn>
              <v-btn v-else color="primary" :disabled="!valid || !$store.state.user" @click="onSave">
                Save
                <span v-if="!$store.state.user">&nbsp; disabled, login first please</span>
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from '@/plugins/axios'
import TitleCard from '@/components/TitleCard'
import _ from 'lodash'
export default {
  async asyncData ({params, route}) {
    let res = null
    if (params.id > 0) {
      res = await axios.get(`/api/bookmark/${params.id}`)
    }
    return {
      id: params.id || 0,
      valid: true, // form validation
      url: (res ? res.data.url : route.query.url) || '',
      urlRules: [
        v => /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(v) || 'URL must be valid'
      ],
      title: (res ? res.data.title : route.query.title) || '',
      notes: (res ? res.data.notes : route.query.notes) || '',
      tags: res ? res.data.tags : (route.query.tags ? route.query.tags.split('|') : []),
      copyof: route.query.copyof || 0,
      tagsRules: [
        v => !!v.length || 'At least 1 tag required',
        v => v.length < 11 || 'Max 10 tags per bookmark allowed'
      ],
      requiredRules: [
        v => !!v || 'Required field'
      ]
    }
  },
  methods: {
    async onChangeURL () {
      if (this.url && !this.title) {
        let { data } = await axios.get('/api/urltitle', {params: {url: this.url}})
        this.title = this.title || data.title
      }
    },
    onChangeTags () {
      console.dir('onChangeTags, tags=', this.tags)
    },
    updateTagsOnSpace (e) {
      if (e.keyCode === 32 /* space */ || e.keyCode === 44 /* comma */) {
        this.$refs.tags.onEnterDown()
      } else if (e.keyCode !== 13 /* enter */) {
        if (!/[a-z0-9]/.test(e.key)) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
    },
    normalizeTags () {
      this.tags = this.tags.filter((tag) => !!tag)
      this.tags = this.tags.map((tag) => tag.toLowerCase().replace(/[^a-z0-9]/g, ''))
    },
    async onSave () {
      setTimeout(async () => { // give time to add editing tag
        if (this.$refs.form.validate()) {
          if (_.endsWith(this.url, '/')) {
            this.url = this.url.substr(0, this.url.length - 1)
          }
          const bookmark = {
            id: this.id,
            userid: this.$store.state.user.id,
            url: this.url,
            title: this.title,
            notes: this.notes,
            tags: this.tags,
            copyof: this.copyof
          }
          await axios.post('/api/bookmark/add', { bookmark })

          this.$router.replace(`/user/${this.$store.state.user.id}/bookmarks`)
        }
      })
    },
    removeTag (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    }
  },
  components: {
    TitleCard
  },
  mounted () {
    this.$store.commit('setFloatingButtonVisible', false)
  },
  beforeDestroy () {
    this.$store.commit('setFloatingButtonVisible', true)
  }
}
</script>
