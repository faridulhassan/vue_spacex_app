<template>
    <div>
        <h1 class="text-4xl mb-3">Launchpads</h1>
        <div class="text-center">
            <v-progress-circular v-if="isLoading" size="50" color="blue-grey" indeterminate></v-progress-circular>
        </div>
        <LeafletMap v-if="launchpads && launchpads.length" :center="center" :data="launchpads" />
        <p v-else-if="error" class="mt-64 text-red-500 font-bold text-center text-3xl sm:text-5xl">{{ error }}</p>
    </div>
</template>

<script>
import LeafletMap from "../components/LeafletMap.vue";

import { getData } from "../utils";
export default {
    name: "LaunchpadsView",
    components: {
        LeafletMap
    },
    data: function () {
        return {
            launchpads: [],
            center: { lat: 33.92151381364131, lng: -118.32687829999999 },
            isLoading: false,
            error: null
        };
    },
    methods: {
        setLoading: function (is_loading) {
            this.isLoading = is_loading;
        }
    },
    mounted: function () {
        this.setLoading(true);
        getData({
            path: "/landpads"
        })
            .then((result) => {
                this.setLoading(false);
                this.launchpads = result;
            })
            .catch((err) => {
                this.setLoading(false);
                if (err.status === 404) {
                    this.error = "Sorry, requested data not found! Please try again later.";
                } else if (err.data) {
                    this.error = err.data;
                } else {
                    this.error = "Something went wrong! Please try again later.";
                }
            });
    }
};
</script>
