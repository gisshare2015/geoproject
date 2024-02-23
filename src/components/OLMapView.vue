<template>
    <div id="olMap" class="map-view"></div>
</template>
 
 <script setup>
 import { defineComponent, onMounted, ref } from 'vue';
 import GeoProject from './GeoProject.vue'
 import { GSGeo_To_OLGeo } from '../utils/GSGeo_To_OLGeo'
 import Map from 'ol/Map';
 import View from 'ol/View';
 import OSM, {ATTRIBUTION} from 'ol/source/OSM';
 import TileLayer from 'ol/layer/Tile';
 import VectorSource from 'ol/source/Vector';
 import VectorLayer from 'ol/layer/Vector';
 import Feature from 'ol/Feature';
 import {Icon, Style, Text, Stroke, Fill, Circle} from 'ol/style';
 
 const CONST_Extent_WebMC = [-20037508.3427892, -20037508.3427892, 20037508.3427892, 20037508.3427892];
 const CONST_Extent_China_WebMC = [window.GISShare.SMap.Fitting.CHINA.CHINA_EXTENT_LEFT_WebMercator, window.GISShare.SMap.Fitting.CHINA.CHINA_EXTENT_BOTTOM_WebMercator, window.GISShare.SMap.Fitting.CHINA.CHINA_EXTENT_RIGHT_WebMercator, window.GISShare.SMap.Fitting.CHINA.CHINA_EXTENT_TOP_WebMercator];
 
 let m_StyleArray;
 let m_TileLayer;
 let m_VectorLayer;
 let m_OLMap;
 
 function InitMap() {
    m_StyleArray = [new Style({
            image: new Circle({
                radius: 5,
                fill: new Fill({
                    color: 'rgba(255, 255, 0, 0.3)'
                }),
                stroke: new Stroke({
                    color: "#FF0000", 
                    width: 2
                })
            })
        }),
        new Style({
            stroke: new Stroke({
                color: "#FFFF00", 
                width: 2
            })
        }),
        new Style({
            fill: new Fill({ 
                color: "rgba(255, 255, 0, 0.3)"
            }),
            stroke: new Stroke({
                color: "#FF0000", 
                width: 2
            })
        })
    ];
     //
     // 创建底图
     //
     m_TileLayer = new TileLayer({
        source: new OSM({
            attributions: [
                'All maps © <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
                ATTRIBUTION,
            ],
            url: 'https://tile-{a-c}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        }),
    });
    m_VectorLayer = new VectorLayer({
        name: '矢量图层',
        source: new VectorSource({})
    });
    m_VectorLayer.setExtent(CONST_Extent_WebMC);
     //
     // 创建地图
     //
     m_OLMap = new Map({
         target: 'olMap',
         layers: [m_TileLayer, m_VectorLayer],
         view: new View({
             center: [0, 0],
             zoom: 3,
             projection: 'EPSG:3857'
         })
     });
 };
  
 function SetCenter(center) {
     m_OLMap.getView().setCenter(center);
 };
 function ZoomToExtent(extent){
     m_OLMap.getView().fit(extent, { constrainResolution: false });
 };
 function ShowGSGeometries(pGSGeometryList){
    const source = m_VectorLayer.getSource();
    source.clear();
    //
    const featureArray = [];
    for(var i = 0, iLen = pGSGeometryList.length, pGSGeometry, olGeometry; i < iLen; i++){
        pGSGeometry = pGSGeometryList[i];
        olGeometry = GSGeo_To_OLGeo(pGSGeometry);
        var feature = new Feature({ 
            geometry: olGeometry
        });
        feature.setStyle(m_StyleArray[pGSGeometry.getDimension()]);
        featureArray.push(feature);
    }
    source.addFeatures(featureArray);
    //
    const extent = source.getExtent();
    if(Array.isArray(extent) && isFinite(extent[0]) && isFinite(extent[1]) && isFinite(extent[2]) && isFinite(extent[3])){
        const dW = Math.abs(extent[2] - extent[0]);
        const dH = Math.abs(extent[3] - extent[1]);
        if(dW <= 0.0000001 && dH <= 0.0000001){
            SetCenter(extent);
        } else{
            const pBoundingBox = new GISShare.SMap.Geometry.BoundingBox(extent[0], extent[3], extent[2], extent[1]);
            pBoundingBox.Expand(1.2, 1.2);
            ZoomToExtent([pBoundingBox.getLeft(), pBoundingBox.getBottom(), pBoundingBox.getRight(), pBoundingBox.getTop()]);
        }
        //
        window.scrollTo(0, document.body.scrollHeight);
    }
 };
 
 onMounted(()=>{
     InitMap();  
     ZoomToExtent(CONST_Extent_China_WebMC);
 });

defineExpose({
    ShowGSGeometries
});
 
 defineComponent({name: 'OLMapView'});
 </script>
 
 <!-- Add "scoped" attribute to limit CSS to this component only -->
 <style scoped>
 .map-view {
     width: 100%;
     /* height: 100%; */
     /* width: calc(100% - 18px); */
     height: 396px;
     background: #ffffff;
     border: 1px solid #ccc;
     box-sizing: border-box;
     /* margin: 0 9px; */
 }
 </style>
 