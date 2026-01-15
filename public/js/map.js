console.log("Coordinates from EJS:", coordinates);


document.addEventListener("DOMContentLoaded", () => {

  const map = new maplibregl.Map({
    container: "my-map",
    style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${map_api_access_token}`,
    center: coordinates,
    zoom: 9
  });

  map.addControl(new maplibregl.NavigationControl());

  /* ---------- POPUP ---------- */
  const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
    <div class="listing-popup">
    <h2 style="margin:0;font-size:16px;">${locationName}</h2>
    <p style="margin:6px 0 0;font-size:13px;">
      Exact location will be provided after booking
    </p>
    </div>
  `);

  /* ---------- DEFAULT MARKER ---------- */
  new maplibregl.Marker()
    .setLngLat(coordinates)
    .setPopup(popup) // 👈 click opens popup
    .addTo(map);

});
