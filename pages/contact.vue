<template>
    <div class="contact-us-map" id="map">
      <div class="container-old">
        <div class="row-old contact-us">
          <div class="col-6-old info-old">
            <h3>{{$t('MENU.CONTACTUS')}}</h3>
            <ul>
              <li>تهران، پردیس، پارک فناوری پردیس، نوآوری 11، پلاک 114، شرکت فناوری اطلاعات و ارتباطات پاسارگاد آریان (فناپ)</li>
              <li>{{$t('GENERAL.POSTALCODE')}}: 1654120840</li>
              <li>{{$t('GENERAL.PHONE')}}: <span style="display: inline-block; direction: ltr !important;">02176250513-7</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import NavbarType1 from "../components/navbars/NavbarType1"

export default {
  name: "contact",
  components: {NavbarType1},
  layout: 'main',
  auth: false,
  hero: false,
  mounted() {
    setTimeout(()=> {
      let myMap = new L.Map('map', {
        key: '9282916c8343617c6a072362f3f28c70a0866b84',
        maptype: 'standard-day',
        poi: true,
        marker: 'red',
        traffic: false,
        center: [35.728150, 51.82659380],
        zoom: 16
      });

      let marker = L.marker([35.728150, 51.82659380]).addTo(myMap);
      marker.bindPopup('<b>فناپ سافت</b>');
    }, 1000)
  }
}
</script>

<style scoped>
@import "https://static.neshan.org/sdk/leaflet/1.4.0/leaflet.css";

</style>
