<template>
    <v-card class="pa-2">
        <div :id="`map-container-${uid()}`" class="w-full bg-gray-300 rounded-sm" style="height: 600px" ref="container" />
    </v-card>
</template>

<script>
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

import { uid } from "../utils";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

export default {
    name: "LeafletMap",
    props: {
        data: {
            type: Array,
            default: () => []
        },
        center: {
            type: Object,
            default: () => ({ lat: 33.92151381364131, lng: -118.32687829999999 })
        }
    },
    data: function () {
        return {
            map: null,
            zoom: 8,
            markers: []
        };
    },
    methods: {
        setMarkers: function (data) {
            for (let i = 0; i < data.length; i++) {
                let marker = L.marker([data[i].latitude, data[i].longitude]);
                marker.title = data[i].name;
                this.markers.push(marker);
                marker.addTo(this.map).bindPopup(`<div><b>${data[i].full_name}</b></div> ${data[i].locality}`);
            }
            var group = new L.featureGroup(this.markers);

            this.map.fitBounds(group.getBounds());
        },
        uid
    },
    mounted: function () {
        this.map = L.map(this.$refs.container.id, {
            center: this.center,
            zoom: this.zoom
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        setTimeout(() => {
            this.map.invalidateSize();
            this.setMarkers(this.data);
        }, 100);
    },
    beforeDestroy: function () {
        if (this.map && this.map.remove) {
            this.map.off();
            this.map.remove();
        }
    }
};
</script>
