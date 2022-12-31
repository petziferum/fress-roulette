<template>
  <VNavigationDrawer permanent expand-on-hover rail>
    <v-list>
      <v-list-item
        link
        v-for="item in listItems" :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :subtitle="item.subtitle"
        :to="item.to"
      />
    </v-list>
  </VNavigationDrawer>
</template>

<script setup >
import {ref} from "vue";

const listItems = ref([
  {title: "Home", to:"/", icon: "mdi-home", subtitle: "Startseite"},
  {title: "Rezepte", to:"/rezepte", icon: "mdi-food", subtitle: "friss du fette Sau!"},
  {title: "About", to:"/about", icon: "mdi-head", subtitle: "Über mich"},
  {title: "DevTest", to:"/dev/test", icon: "mdi-test-tube", subtitle: "Test"},
  {title: "User Dashboard", to:"/user/dashboard", icon: "mdi-kangaroo", subtitle: "dashboard"},
])
</script>

<style scoped></style>
