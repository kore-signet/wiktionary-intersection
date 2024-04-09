<script setup>
// import { MediaWikiForeignApi } from 'wiki-saikou'
import { ref } from 'vue';
import Categories from './components/Categories.vue'
import Session from 'm3api/browser'

const wikisession = new Session('en.wiktionary.org', {
  formatversion: 2,
  errorformat: 'plaintext',
  origin: '*'
}, {
  userAgent: 'WiktionaryIntersection/0.1 (+https://cat-girl.gay)'
})

let current_label = ref("");

async function get_category(categories) {
  let amt = 0;

  async function get_category(cat) {
    let list = [];
    for await (const response of wikisession.requestAndContinue({
      action: 'query',
      list: 'categorymembers',
      cmtitle: cat,
      cmprop: 'title',
      cmtype: 'page',
      cmlimit: 400
    })) {
      for (const page of response.query.categorymembers) {
        list.push(page.title);
        amt += 1;
        current_label.value = `Loading... (${amt} words found so far)`
      }
    }
    return list;
  }

  // let category = 
  let results = [];

  for (let category of categories) {
    console.log(category);
    results.push(await get_category(category));
  }

  current_label.value = `Loaded! Calculating intersection...`;

  return results.reduce((a, b) => a.filter(c => b.includes(c)));
}


async function nya(categories) {
  let words = await get_category(categories.map((x) => "Category:" + x))
  let element = document.querySelector('[data-download]')
  
  let words_as_csv = words.join("\n")
  element.setAttribute('href', 'data:text/csv;charset=utf8,' + encodeURIComponent(words_as_csv))
  element.setAttribute('download', 'intersection.csv')
  
  current_label.value = `Download! {Intersection contains ${words.length} words}`
}
</script>

<template>
  <p>Add categories to intersect below. You can type them in if they don't appear automagically by searching! Once you're done, press submit and wait for the donwload link to appear.</p>
  <br />
  <Categories @submitted="nya" />
  <br />
  <a data-download>{{  current_label  }}</a>

</template>
