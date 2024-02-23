<template>
    <div class="main">
      <GeoProject  ref="m_RefGeoProject" />
      <n-tabs type="line" class='main-view' animated>
        <n-tab-pane display-directive='show' name="GISShare.SMap">
            <GSMapView  ref="m_RefGSMapView" />
        </n-tab-pane>
        <n-tab-pane display-directive='show' name="OpenLayers">
            <OLMapView  ref="m_RefOLMapView" />
        </n-tab-pane>
      </n-tabs>
    </div>
 </template>
 
 <script setup>
 import { defineComponent, onMounted, ref } from 'vue';
 import { NTabs, NTabPane } from "naive-ui";
 import GeoProject from './GeoProject.vue'
 import OLMapView from './OLMapView.vue'
 import GSMapView from './GSMapView.vue'
 
 let m_RefGeoProject = ref();
 let m_RefGSMapView = ref();
 let m_RefOLMapView = ref();
  
 function ShowGSGeometries(pGSGeometryList){
    if(m_RefGSMapView && m_RefGSMapView.value) m_RefGSMapView.value.ShowGSGeometries(pGSGeometryList);
    if(m_RefOLMapView && m_RefOLMapView.value) m_RefOLMapView.value.ShowGSGeometries(pGSGeometryList);
 };
 
 onMounted(()=>{
    const pHook = {
        ShowGSGeometries: ShowGSGeometries
    };
    m_RefGeoProject.value.BindHook(pHook);
    //
    window.AppHook = pHook;
 });
 
 defineComponent({name: 'MainView'});
 </script>
 
 <!-- Add "scoped" attribute to limit CSS to this component only -->
 <style scoped>
 .main{
   width: 100%;
   position: relative;
   padding: 40px 0 20px;
 }
 .main-view {
     width: calc(100% - 18px);
     /* height: 396px; */
     /* background: #ffffff; */
     /* border: 1px solid #ccc; */
     /* box-sizing: border-box; */
     margin: 0 9px;
 }
 .card-tabs .n-tabs-nav--bar-type {
   padding-left: 4px;
 }
 </style>