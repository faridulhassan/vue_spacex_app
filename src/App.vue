<template>
    <v-app>
        <nav-bar />
        <v-main>
            <v-container fluid>
                <router-view />
            </v-container>
        </v-main>
        <v-footer app style="z-index: 2000">
            <h2 class="text-h3 text-center">Footer</h2>
        </v-footer>
    </v-app>
</template>

<script>
import NavBar from "./components/NavBar.vue";

export default {
    name: "App",
    components: {
        NavBar
    }
};
</script>

<style lang="scss"></style>
