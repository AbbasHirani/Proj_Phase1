   mapboxgl.accessToken = mapToken;
   
    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: rec.geometry.coordinates,
        zoom: 15,
        // causes pan & zoom handlers not to be applied, similar to
        // .dragging.disable() and other handler .disable() funtions in Leaflet.
        interactive: true
    });

    console.log(rec.geometry.coordinates);
const marker = new mapboxgl.Marker()
    .setLngLat(rec.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset:25}).setHTML(
            `<h4>${rec.location}</h4><p>Exact Location</p>`
        )
    )
    .addTo(map);
