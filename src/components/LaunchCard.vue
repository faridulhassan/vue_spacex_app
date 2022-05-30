<template>
    <v-card class="flex-fill">
        <a :href="launchLink" target="_blank" class="text-decoration-none black--text">
            <v-container fluid>
                <v-row dense>
                    <v-col class="d-flex" cols="12" sm="3" md="4">
                        <v-avatar class="grey lighten-4" size="100">
                            <v-img :alt="launch.name" :src="cardImage" contain />
                        </v-avatar>
                    </v-col>

                    <v-col class="p-4">
                        <p class="text-gray-600 font-bold text-2xl mb-1">{{ launch.name }}</p>
                        <v-chip v-if="launch.success" class="ma-2" small color="green" text-color="white"> Success </v-chip>
                        <v-chip v-else-if="!launch.success && !launch.failure" small class="ma-2" color="secondary" text-color="white"> Upcoming </v-chip>
                        <v-chip v-else class="ma-2" small color="red" text-color="white"> Failed </v-chip>
                        <p class="text-sm text-gray-500 mt-1 line-clamp-2"><b>Launch Date</b> : {{ moment(launch.date_local).format("DD/MM/YYYY") }}</p>
                        <p class="text-sm text-gray-500 mt-1 line-clamp-2 max-h-10 overflow-hidden" style="height: 50px">{{ launch.details || "" }}</p>
                    </v-col>
                </v-row>
            </v-container>
        </a>
    </v-card>
</template>

<script>
import moment from "moment";

export default {
    name: "LaunchCard",
    props: {
        launch: {
            type: Object,
            default: () => ({})
        }
    },
    methods: {
        moment
    },
    computed: {
        launchLink: function () {
            return this.launch.links?.article || this.launch.links?.wikipedia;
        },
        cardImage: function () {
            return this.launch.links?.patch?.small || "https://stackdiary.com/140x100.png";
        }
    }
};
</script>
