<!DOCTYPE html>
<html>

<head>
  <meta charset='utf-8' />
  <title>19 ET MT</title>

  <meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no' />
  <script src='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js'></script>
  <script
    src='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.min.js'></script>
  <link rel='stylesheet'
    href='https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v4.7.0/mapbox-gl-geocoder.css'
    type='text/css' />
  <script src="./pinyin_dict_firstletter.js"></script>
  <script src="./pinyin_dict_notone.js"></script>
  <script src="./pinyinUtil.js"></script>
  <link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
  <script src='./data.js'></script>
  <style>
    body {
      margin: 0;
      padding: 0;
    }

    .mapboxgl-popup-close-button {
      display: none;
    }

    table {
      border-collapse: collapse;
      margin: 0;
      font-size: 15px;
    }

    td {
      padding: 8px;
      text-align: center;
    }

    #map {
      position: absolute;
      position: absolute;
      left: 25%;
      width: 75%;
      top: 0;
      bottom: 0;
    }

    * {
      box-sizing: border-box;
    }

    body {
      color: #404040;
      font: 400 15px/22px 'Source Sans Pro', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }

    h1 {
      font-size: 22px;
      margin: 0;
      font-weight: 800;
      line-height: 20px;
      padding: 20px 2px;
    }

    a {
      color: #404040;
      text-decoration: none;
    }

    a:hover {
      color: #101010;
    }

    .sidebar {
      position: absolute;
      width: 25%;
      height: 100%;
      top: 0;
      left: 0;
      overflow: hidden;
      border-right: 1px solid rgba(0, 0, 0, 0.25);
    }

    .heading {
      background: #fff;
      border-bottom: 1px solid #eee;
      height: 60px;
      line-height: 60px;
      padding: 0 10px;
    }

    .listings {
      height: 100%;
      overflow: auto;
      padding-bottom: 60px;
      font-size: 14px;
    }

    .listings .item {
      border-bottom: 1px solid #eee;
      padding: 10px;
      text-decoration: none;
    }

    .listings .item:last-child {
      border-bottom: none;
    }

    .listings .item .title {
      display: block;
      color: #101010;
      font-weight: 700;
      font-size: 15px;
    }

    .listings .item .title small {
      font-weight: 400;
    }

    .listings .item.active .title,
    .listings .item .title:hover {
      color: #101010;
    }

    .listings .item.active {
      background-color: #f8f8f8;
    }

    ::-webkit-scrollbar {
      width: 3px;
      height: 3px;
      border-left: 0;
      background: rgba(0, 0, 0, 0.1);
    }

    ::-webkit-scrollbar-track {
      background: none;
    }

    ::-webkit-scrollbar-thumb {
      background: #101010;
      border-radius: 0;
    }
  </style>
</head>

<body>
  <div class='sidebar'>
    <div class='heading'>
      <h1>Our locations</h1>
    </div>
    <div id='listings' class='listings'></div>
  </div>
  <div id='map'></div>

  <script>
    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RvLW5leSIsImEiOiJja25tZG5jNXYwcXBrMnFtcHFjaDlrMjZ4In0.JO5JsnrxhONEUjuIQxTldg';

    var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [115, 35],
      zoom: 4
    });


    map.on('load', function () {
      map.addSource('my-geojson', {
        type: 'geojson',
        data: name_data
      });

      name_data.features.forEach(function (name_datai, i) {
        name_datai.properties.id = i;
      });
      buildLocationList(name_data);
      map.addLayer({
        id: 'circle-layer',
        type: 'circle',
        source: 'my-geojson',
        paint: {
          'circle-color': '#ffa661',
          'circle-stroke-width': 0,
          'circle-radius': [
            'interpolate', // use "interpolate" to create a gradient
            ['linear'], // use "linear" interpolation for a smooth gradient
            ['get', 'n'], // the data property to use for size values
            1, 15, // the min value and size
            5, 30 // the max value and size
          ],
        }
      });


      map.addLayer({
        id: 'circle-city-labels',
        type: 'symbol',
        source: 'my-geojson',
        layout: {
          'text-field': '{city}',
          'text-size': 14,
          'text-offset': [0, 0],
        },
        paint: {
          'text-color': '#000'
        }
      });

    });



    map.on('click', 'circle-layer', (e) => {
      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      var exact_city = e.features[0].properties.city;
      var useful_city = name_data.features.filter(function (e) { return e.properties.city == exact_city; });

      var output_str = '<h1>' + useful_city[0].properties.name + "<\h1>";


      var base_test = '<table>';

      base_test += '<tr>';
      for (i = 0; i < useful_city.length; i++) {
        base_test += '<td>' + '<img src="pic1.png" alt="Local Image" width="70" height="70" /> ' + '</td>';
      }
      base_test += '</tr>' + '<tr>';

      for (i = 0; i < useful_city.length; i++) {
        base_test += '<th>' + useful_city[i].properties.name + '</th>';
      }
      base_test += '</tr>' + '<tr>';
      for (i = 0; i < useful_city.length; i++) {
        base_test += '<td>' + useful_city[i].properties.city + '</td>';
      }
      base_test += '</tr>' + '<tr>';
      for (i = 0; i < useful_city.length; i++) {
        base_test += '<td font-size:1px>' + useful_city[i].properties.modified_date + '</td>';
      }
      base_test += '</tr>' + '<tr>';
      for (i = 0; i < useful_city.length; i++) {
        base_test += '<td>' + useful_city[i].properties.n + '</td>';
      }
      base_test += '</tr>';
      base_test += '</table>';


      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(base_test)
        .setMaxWidth("1000px")
        .addTo(map);
    });

    map.on('mouseenter', 'circle-layer', () => {
      map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'circle-layer', () => {
      map.getCanvas().style.cursor = '';
    });
    function localgeocoder(query) {
      var matchingFeatures = [];


      name_data.features.forEach(
        feature => {
          if (pinyinUtil.getPinyin(feature.properties.name, splitter = "", withtone = false).toLowerCase().
            search(pinyinUtil.getPinyin(query, splitter = "", withtone = false).toLowerCase()) !== -1) {
            feature['place_name'] = feature.properties.name;
            feature['center'] = feature.geometry.coordinates;
            matchingFeatures.push(feature);
          }
          if (pinyinUtil.getFirstLetter(feature.properties.name, splitter = "", withtone = false).toLowerCase().
            search(pinyinUtil.getFirstLetter(query, splitter = "", withtone = false).toLowerCase()) !== -1) {
            feature['place_name'] = feature.properties.name;
            feature['center'] = feature.geometry.coordinates;
            matchingFeatures.push(feature);
          }
        }
      )

      return Promise.resolve(matchingFeatures);
    };


    function dummy() {
      console.log('dummy');
      return [];
    }
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: dummy,
        localGeocoderOnly: true,
        externalGeocoder: localgeocoder,
        setAutocomplete: true,
        setFuzzyMatch: true,
        zoom: 5,
        placeholder: '试试人名搜索?',
        mapboxgl: mapboxgl
      })
    );


    function buildLocationList(classmates) {
      for (const classmate of classmates.features) {
        /* Add a new listing section to the sidebar. */
        const listings = document.getElementById('listings');
        const listing = listings.appendChild(document.createElement('div'));
        /* Assign a unique `id` to the listing. */
        listing.id = `listing-${classmate.properties.id}`;
        /* Assign the `item` class to each listing for styling. */
        listing.className = 'item';

        /* Add the link to the individual listing created above. */
        const link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.id = `link-${classmate.properties.id}`;
        link.innerHTML = `${classmate.properties.name}`;

        /* Add details to the individual listing. */
        const details = listing.appendChild(document.createElement('div'));
        details.innerHTML = `${classmate.properties.city}`;
        if (classmate.properties.modified_date) {
          details.innerHTML += `<p style="font-size:1px;color:gray">Last updated: ${classmate.properties.modified_date}</p>`;
        }

        link.addEventListener('click', function () {
          for (const feature of classmates.features) {
            if (this.id === `link-${feature.properties.id}`) {
              flyToCity(feature);
            }
          }
          const activeItem = document.getElementsByClassName('active');
          if (activeItem[0]) {
            activeItem[0].classList.remove('active');
          }
          this.parentNode.classList.add('active');
        });
      }
    }
    function flyToCity(currentFeature) {
      map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 5
      });
    }
  </script>
</body>

</html>
