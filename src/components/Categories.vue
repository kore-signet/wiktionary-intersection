<template>
    <div>
      <Multiselect
        v-model="value"
        :options="options"
        :multiple = true
        :taggable = true
        :internal-search=false
        :loading="is_loading"
        @search-change="find_words"
        @tag="addTag"
        >
      </Multiselect>
      <PButton @click="$emit('submitted', value)">Submit</PButton>
    </div>
  </template>

<script>
// change over to https://vue-multiselect.js.org/#sub-asynchronous-select
import Multiselect from 'vue-multiselect'
import { Trie } from '@kore-signet/rs-patricia-tree'
import { ZstdInit, ZstdStream } from '@oneidentity/zstd-js/decompress'
export default {
    components: { Multiselect },
    data() {
        return {
            is_loading: false,
            options_tree: null,
            value: [],
            options: []
        }
    },
    methods: {
      addTag(newTag) {
        this.options.push(newTag);
        this.value.push(newTag);
      },
      find_words(query) {
        this.is_loading = true;
        this.options = this.options_tree.search(query, 100);
        this.is_loading = false;
      }
    },
    async mounted() {
      this.is_loading = true;
      let res = await fetch("./words.trie.zst");
      await ZstdInit();

      let compressed_data = await res.arrayBuffer();
      
      this.options_tree = Trie.from_bytes(ZstdStream.decompress(new Uint8Array(compressed_data)));
      this.is_loading = false;
      // await import("../assets/minified.json").then(({default: json}) => {
      //   this.options = json;
      // })
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
div {
    width: 100%;
    display: inline-flex;
    flex-wrap: wrap;
    gap: 1em;
}
</style>