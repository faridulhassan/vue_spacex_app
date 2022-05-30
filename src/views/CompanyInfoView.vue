<template>
    <div>
        <h1 class="text-4xl mb-3">About the company</h1>
        <div class="text-center">
            <v-progress-circular v-if="isLoading" size="50" color="blue-grey" indeterminate></v-progress-circular>
        </div>

        <div v-if="company_info">
            <v-row justify="center">
                <v-col cols="12" sm="6" md="4" class="d-sm-flex">
                    <v-card class="flex-fill">
                        <h2 class="text-4xl px-4 py-3 blue-grey lighten-5">{{ company_info.name }}</h2>
                        <div class="bg-white pa-3">
                            <p class="mb-0">{{ company_info.summary }}</p>
                        </div>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="4" class="d-sm-flex">
                    <v-card class="flex-fill">
                        <h2 class="text-4xl px-4 py-3 blue-grey lighten-5">Core Persons</h2>
                        <v-list class="py-0">
                            <v-divider />
                            <v-list-item>
                                <v-list-content><b class="mr-3">CEO :</b> {{ company_info.ceo }}</v-list-content>
                            </v-list-item>
                            <v-divider />
                            <v-list-item>
                                <v-list-content><b class="mr-3">CTO :</b> {{ company_info.cto }}</v-list-content>
                            </v-list-item>
                            <v-divider />
                            <v-list-item>
                                <v-list-content><b class="mr-3">COO :</b> {{ company_info.coo }}</v-list-content>
                            </v-list-item>
                            <v-divider />
                            <v-list-item>
                                <v-list-content><b class="mr-3">CTO Propulsion :</b> {{ company_info.cto_propulsion }}</v-list-content>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="4" class="d-sm-flex">
                    <v-card class="flex-fill">
                        <h2 class="text-4xl px-4 py-3 blue-grey lighten-5">Company Stats</h2>
                        <v-list class="py-0">
                            <v-divider />
                            <v-list-item>
                                <v-list-content><b class="mr-3">Founded</b> {{ company_info.founded }}</v-list-content>
                            </v-list-item>
                            <v-divider />
                            <v-list-item>
                                <v-list-content><b class="mr-3">Employees</b> {{ company_info.employees }}</v-list-content>
                            </v-list-item>
                            <v-divider />
                            <v-list-item>
                                <v-list-content><b class="mr-3">Vehicles</b> {{ company_info.vehicles }}</v-list-content>
                            </v-list-item>
                            <v-divider />
                            <v-list-item>
                                <v-list-content><b class="mr-3">valuation </b> ${{ valuation }} </v-list-content>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
            </v-row>
            <v-footer app style="z-index: 2000">
                <v-container class="d-flex py-1">
                    <p class="mb-0 font-weight-medium">{{ `${company_info.headquarters.address}, ${company_info.headquarters.city}, ${company_info.headquarters.state}` }}</p>
                    <v-spacer></v-spacer>
                    <v-item-group multiple class="d-inline-flex">
                        <v-item class="mr-3" v-for="[title, link] in Object.entries(company_info.links)" :key="title" style="width: 24px; height: 24px; line-height: 1">
                            <a :href="link" target="_blank" class="w-6 h-6 inline-block" v-html="social_icons[title] || social_icons.website"></a>
                        </v-item>
                    </v-item-group>
                </v-container>
            </v-footer>
        </div>
        <p v-else-if="error" class="mt-64 text-red-500 font-bold text-center text-3xl sm:text-5xl">{{ error }}</p>
    </div>
</template>

<script>
import { getData, convertToInternationalCurrencySystem } from "../utils";
export default {
    name: "CompanyInfoView",
    props: [],
    data: function () {
        return {
            company_info: null,
            error: null,
            isLoading: null,
            social_icons: {
                twitter: `<svg fill="#1da1f2" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`,
                elon_twitter: `<svg fill="#1da1f2" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Twitter</title><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`,
                flickr: `<svg fill="#ff0084" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Flickr</title><path d="M5.334 6.666C2.3884 6.666 0 9.055 0 12c0 2.9456 2.3884 5.334 5.334 5.334 2.9456 0 5.332-2.3884 5.332-5.334 0-2.945-2.3864-5.334-5.332-5.334zm13.332 0c-2.9456 0-5.332 2.389-5.332 5.334 0 2.9456 2.3864 5.334 5.332 5.334C21.6116 17.334 24 14.9456 24 12c0-2.945-2.3884-5.334-5.334-5.334Z"/></svg>`,
                website: `<svg fill="#1877f2" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 92 92" enable-background="new 0 0 92 92" xml:space="preserve"> <path id="XMLID_1666_" d="M46,0C20.6,0,0,20.6,0,46s20.6,46,46,46s46-20.6,46-46S71.4,0,46,0z M49.7,83.8c-0.2,0-0.4,0-0.7,0.1V62.2 c5.2-0.1,9.9-0.2,14.2-0.5C59.4,73.4,52.3,81.2,49.7,83.8z M42.3,83.8c-2.7-2.7-9.7-10.5-13.5-22.1c4.2,0.3,9,0.5,14.2,0.5v21.7 C42.8,83.9,42.6,83.8,42.3,83.8z M8,46c0-2.5,0.3-5,0.7-7.4c2.2-0.4,6.4-1,12.3-1.6c-0.5,2.9-0.8,5.9-0.8,9.1c0,3.2,0.3,6.2,0.7,9 c-5.8-0.6-10.1-1.2-12.3-1.6C8.3,51,8,48.5,8,46z M26.3,46c0-3.4,0.4-6.6,1-9.6c4.6-0.3,9.8-0.6,15.7-0.6v20.4 c-5.8-0.1-11.1-0.3-15.8-0.7C26.7,52.6,26.3,49.4,26.3,46z M49.6,8.2c2.7,2.7,9.6,10.7,13.5,22.1c-4.2-0.3-8.9-0.5-14.1-0.5V8.1 C49.2,8.1,49.4,8.2,49.6,8.2z M43,8.1v21.7c-5.2,0.1-9.9,0.2-14.1,0.5c3.8-11.4,10.8-19.4,13.4-22.1C42.6,8.2,42.8,8.1,43,8.1z M49,56.2V35.8c5.8,0.1,11.1,0.3,15.7,0.6c0.6,3,1,6.2,1,9.6c0,3.4-0.3,6.6-0.9,9.6C60.2,55.9,54.9,56.1,49,56.2z M70.9,37 c5.9,0.6,10.1,1.2,12.3,1.6C83.7,41,84,43.5,84,46c0,2.5-0.3,5-0.7,7.4c-2.2,0.4-6.4,1-12.3,1.6c0.5-2.9,0.7-5.9,0.7-9.1 C71.7,42.9,71.4,39.8,70.9,37z M81.4,32.2c-2.8-0.4-6.8-0.9-11.9-1.4c-2.4-8.6-6.6-15.5-10.1-20.4C69.5,14.2,77.5,22.2,81.4,32.2z M32.6,10.4c-3.6,4.8-7.7,11.7-10.1,20.3c-5,0.4-9,1-11.9,1.4C14.5,22.2,22.6,14.2,32.6,10.4z M10.6,59.8c2.8,0.4,6.8,0.9,11.8,1.4 c2.4,8.6,6.4,15.5,10,20.3C22.4,77.6,14.5,69.7,10.6,59.8z M59.6,81.5c3.6-4.8,7.6-11.6,10-20.2c5-0.4,9-1,11.8-1.4 C77.5,69.7,69.6,77.6,59.6,81.5z"/> </svg>`
            }
        };
    },
    methods: {
        setLoading: function (is_loading) {
            this.isLoading = is_loading;
        }
    },
    computed: {
        valuation: function () {
            return this.company_info?.valuation ? convertToInternationalCurrencySystem(this.company_info.valuation) : "";
        }
    },
    /* Lifecycle methods */
    mounted: function () {
        this.setLoading(true);
        getData({
            path: `/company`
        })
            .then((result) => {
                this.setLoading(false);
                this.company_info = result;
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
