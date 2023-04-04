function dummy() {
      console.log('dummy');
      return [];
    }
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
        if (classmate.properties.city != null) {
          details.innerHTML = `${classmate.properties.city}`;
        } else {
          details.innerHTML = `未知`;
        }
        
        if (classmate.properties.modified_date) {
          details.innerHTML += `<p style="font-size:1px;color:gray">Last updated: ${classmate.properties.modified_date}</p>`;
        }

        link.addEventListener('click', function () {
          for (const feature of classmates.features) {
            if (this.id === `link-${feature.properties.id}` & feature.properties.city != null) {
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
