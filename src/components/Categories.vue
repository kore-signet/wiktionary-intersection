<template>
    <div>
      <Multiselect
        v-model="value"
        :options="options"
        :multiple = true
        :taggable = true
        @tag="addTag"
        >
      </Multiselect>
      <PButton @click="$emit('submitted', value)">Submit</PButton>
    </div>
  </template>

<script>
import Multiselect from 'vue-multiselect'
import categories from '../assets/all-categories.json'

export default {
    components: { Multiselect },
    data() {
        return {
            value: [],
            options: categories
        }
    },
    methods: {
      addTag(newTag) {
        this.options.push(newTag);
        this.value.push(newTag);
      }
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style>
div {
    width: 100%;
    display: inline-flex;
    /* flex-wrap: wrap; */
    gap: 1em;
}
</style>