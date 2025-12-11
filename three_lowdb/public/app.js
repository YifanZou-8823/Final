function navigate(id) {
    location.href = "/space.html?space=" + id;
}
// Mapbox code
mapboxgl.accessToken =
    "pk.eyJ1IjoiamluZ3lpMTAxMyIsImEiOiJjbWhpbHJreDAwZTh5MmlvZHZhNm90anc2In0.YO3YGnq8Tl7NGO_XHC6s4w";
const map = new mapboxgl.Map({
    container: "map",
    // make my own style with Mapbox Studio
    style: "mapbox://styles/jingyi1013/cmj1hbw1c008q01r87t2vfj2e",
    center: [-73.985664, 40.748514],
    zoom: 16,
    bearing: 0,
    pitch: 0,
});

const chapters = {
    "New-York-City": {
        center: [-73.985664, 40.748514], // NYC
        zoom: 16,
        pitch: 30,
        bearing: 0
    },
    "Berlin": {
        center: [13.41053, 52.52437], // Berlin
        zoom: 18,
        pitch: 30,
        bearing: 0
    },
    "Shanghai": {
        center: [121.4737, 31.2304], // Shanghai
        zoom: 18,
        pitch: 30,
        bearing: 0
    }
};

// the map flies to the city when the mouse hovers the section
document.querySelectorAll("section").forEach(sec => {
    sec.addEventListener("mouseenter", () => {
        const id = sec.id;
        map.flyTo(chapters[id]);
    });
});