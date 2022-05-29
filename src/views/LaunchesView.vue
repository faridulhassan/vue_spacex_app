<template>
    <div>
        <h1>Launches Page</h1>

        <div>
            <h1 class="text-4xl mb-3">Launches</h1>

            <div class="bg-white p-4 rounded mt-5 mb-7 text-gray-500">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
                    <div class="">
                        <label for="by-rocket-name" class="mb-1 inline-block">Search by Rocket name </label>
                        <input type="text" placeholder="Enter rocket name..." class="block w-full border-2 px-2 py-1 rounded" id="by-rocket-name" @keyup="({ target: { value } }) => debounceSearchInput(value)" />
                    </div>
                    <div class="">
                        <label for="by-launch-date" class="mb-1 inline-block">Launch Date </label>
                        <select class="block w-full border-2 px-2 py-1 rounded" id="by-launch-date" v-model="searchParams.searchByLaunchDate">
                            <option value="" selected>All</option>
                            <option value="week">Last week</option>
                            <option value="month">Last month</option>
                            <option value="years">Last year</option>
                        </select>
                    </div>
                    <div class="">
                        <label for="by-launch-status" class="mb-1 inline-block">Launch Status </label>
                        <select class="block w-full border-2 px-2 py-1 rounded" id="by-launch-status" v-model="searchParams.searchByLaunchStatus">
                            <option value="" selected>All</option>
                            <option value="success">Success</option>
                            <option value="failures">Failure</option>
                        </select>
                    </div>
                    <div class="">
                        <label for="by-is-upcoming" class="mb-1 inline-block">Is upcoming? </label>
                        <input type="checkbox" class="block px-2 py-1 rounded text-indigo-500 w-8 h-8 mr-2 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300" id="by-is-upcoming" v-model="searchParams.searchByIsUpcoming" />
                    </div>
                </div>
            </div>

            <v-progress-circular v-if="isLoading" size="50" color="blue-grey" indeterminate></v-progress-circular>
            <div v-if="filteredLaunches && filteredLaunches.length" class="launches-list grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <launch-card v-for="launch in filteredLaunches" :key="launch.id" :launch="launch" />
            </div>

            <p v-else-if="!filteredLaunches.length && !isLoading" class="text-center text-red-500 font-bold text-3xl sm:text-5xl">No result found!</p>
            <p v-if="error" class="mt-64 text-red-500 font-bold text-center text-3xl sm:text-5xl">{{ error }}</p>
        </div>
    </div>
</template>

<script>
import moment from "moment";

import LaunchCard from "../components/LaunchCard.vue";

import { getData } from "../utils";
export default {
    name: "LaunchesView",
    components: {
        LaunchCard
    },
    data: function () {
        return {
            launches: [],
            filteredLaunches: [],
            isLoading: false,
            error: null,
            timer: null,
            searchParams: {
                searchByLaunchStatus: "",
                searchByRocketName: "",
                searchByLaunchDate: "",
                searchByIsUpcoming: false
            }
        };
    },
    methods: {
        setLoading: function (is_loading) {
            this.isLoading = is_loading;
        },
        debounceSearchInput: function (val) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.searchParams.searchByRocketName = val;
            }, 500);
        },
        searchFilter: function () {
            this.filteredLaunches = this.launches.filter((launch) => {
                let isMatched = true;
                for (let [key, value] of Object.entries(this.searchParams)) {
                    let shouldBreak = false;
                    if (value) {
                        switch (key) {
                            case "searchByRocketName": {
                                if (launch.name.toLowerCase().indexOf(value.trim().toLowerCase()) === -1) {
                                    shouldBreak = true;
                                }
                                break;
                            }
                            case "searchByLaunchStatus": {
                                if ((value === "success" && !launch.success) || (value === "failures" && launch.success)) {
                                    shouldBreak = true;
                                }
                                break;
                            }
                            case "searchByIsUpcoming": {
                                if (value && !launch.upcoming) {
                                    shouldBreak = true;
                                }
                                break;
                            }
                            case "searchByLaunchDate": {
                                let from = moment().startOf("day").subtract(1, value);
                                let to = moment().endOf("day").subtract(1, "day");
                                if (value && !moment(launch.date_local).isBetween(from, to)) {
                                    shouldBreak = true;
                                }
                                break;
                            }
                        }
                    }
                    if (shouldBreak) {
                        isMatched = false;
                        break;
                    }
                }

                return isMatched;
            });
        }
    },
    watch: {
        searchParams: {
            handler() {
                this.searchFilter();
            },
            deep: true
        }
    },
    mounted: function () {
        this.setLoading(true);
        getData({
            path: "/launches"
        })
            .then((result) => {
                this.setLoading(false);
                this.launches = result;
                this.filteredLaunches = [...this.launches];
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
    },
    beforeDestroy: function () {
        this.timer && clearTimeout(this.timer);
    }
};
</script>

<!-- <script>
    import { onMount } from "svelte";
    import moment from "moment";

    import LaunchCard from "../components/LaunchCard.svelte";
    import Loader from "../components/Loader.svelte";

    import { getData } from "../utils";

    let launches = [];
    let filteredLaunches = [];

    let isLoading = false;
    function setLoading(is_loading) {
        isLoading = is_loading;
    }
    let error = null;

    /* search and filter */

    $: searchParams = {
        searchByLaunchStatus: "",
        searchByRocketName: "",
        searchByLaunchDate: "",
        searchByIsUpcoming: false
    };

    let timer;
    const debounce = (val) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            searchParams.searchByRocketName = val;
        }, 500);
    };

    window.moment = moment;
    function searchFilter() {
        filteredLaunches = launches.filter((launch) => {
            let isMatched = true;
            for (let [key, value] of Object.entries(searchParams)) {
                let shouldBreak = false;
                if (value) {
                    switch (key) {
                        case "searchByRocketName": {
                            if (launch.name.toLowerCase().indexOf(value.trim().toLowerCase()) === -1) {
                                shouldBreak = true;
                            }
                            break;
                        }
                        case "searchByLaunchStatus": {
                            if ((value === "success" && !launch.success) || (value === "failures" && launch.success)) {
                                shouldBreak = true;
                            }
                            break;
                        }
                        case "searchByIsUpcoming": {
                            if (value && !launch.upcoming) {
                                shouldBreak = true;
                            }
                            break;
                        }
                        case "searchByLaunchDate": {
                            let from = moment().startOf("day").subtract(1, value);
                            let to = moment().endOf("day").subtract(1, "day");
                            if (value && !moment(launch.date_local).isBetween(from, to)) {
                                shouldBreak = true;
                            }
                            break;
                        }
                    }
                }
                if (shouldBreak) {
                    isMatched = false;
                    break;
                }
            }

            return isMatched;
        });
    }

    $: searchParams, searchFilter();

    onMount(() => {
        setLoading(true);
        getData({
            path: "/launches"
        })
            .then((result) => {
                setLoading(false);
                launches = result;
                filteredLaunches = [...launches];
            })
            .catch((err) => {
                setLoading(false);
                if (err.status === 404) {
                    error = "Sorry, requested data not found! Please try again later.";
                } else if (err.data) {
                    error = err.data;
                } else {
                    error = "Something went wrong! Please try again later.";
                }
            });
    });
</script>

<svelte:head>
    <title>Launches</title>
</svelte:head>
<div>
    <h1 class="text-4xl mb-3">Launches</h1>

    <div class="bg-white p-4 rounded mt-5 mb-7 text-gray-500">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
            <div class="">
                <label for="by-rocket-name" class="mb-1 inline-block">Search by Rocket name </label>
                <input type="text" placeholder="Enter rocket name..." class="block w-full border-2 px-2 py-1 rounded" id="by-rocket-name" on:keyup={({ target: { value } }) => debounce(value)} />
            </div>
            <div class="">
                <label for="by-launch-date" class="mb-1 inline-block">Launch Date </label>
                <select class="block w-full border-2 px-2 py-1 rounded" id="by-launch-date" bind:value={searchParams.searchByLaunchDate}>
                    <option value="" selected>All </option>
                    <option value="week">Last week</option>
                    <option value="month">Last month</option>
                    <option value="years">Last year</option>
                </select>
            </div>
            <div class="">
                <label for="by-launch-status" class="mb-1 inline-block">Launch Status </label>
                <select class="block w-full border-2 px-2 py-1 rounded" id="by-launch-status" bind:value={searchParams.searchByLaunchStatus}>
                    <option value="" selected>All</option>
                    <option value="success">Success</option>
                    <option value="failures">Failure</option>
                </select>
            </div>
            <div class="">
                <label for="by-is-upcoming" class="mb-1 inline-block">Is upcoming? </label>
                <input type="checkbox" class="block px-2 py-1 rounded   text-indigo-500 w-8 h-8 mr-2 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300" id="by-is-upcoming" bind:checked={searchParams.searchByIsUpcoming} />
            </div>
        </div>
    </div>

    {#if isLoading}
        <Loader />
    {/if}
    {#if filteredLaunches && filteredLaunches.length}
        <div class="launches-list grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {#each filteredLaunches as launch (launch.id)}
                <LaunchCard {launch} />
            {/each}
        </div>
    {:else if !filteredLaunches.length && !isLoading}
        <p class="text-center text-red-500 font-bold text-3xl sm:text-5xl">No result found!</p>
    {/if}
    {#if error}
        <p class="mt-64 text-red-500 font-bold text-center text-3xl sm:text-5xl">{error}</p>
    {/if}
</div>
 -->
