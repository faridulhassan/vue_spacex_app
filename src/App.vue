<template>
    <v-app>
        <nav-bar />
        <v-main>
            <v-container>
                <router-view />
            </v-container>
        </v-main>
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
