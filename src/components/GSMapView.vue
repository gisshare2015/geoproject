<template>
    <div id="gsMap" class="map-view"></div>
    <div class="map-attr">All maps © <a href="https://www.openstreetmap.org/">OpenStreetMap</a></div>
</template>
 
 <script setup>
 import { defineComponent, onMounted, ref } from 'vue';

 const CONST_SpatialReferenceWebMercator = GISShare.SMap.SpatialReference.SpatialReferenceFactory.GetSpatialReferenceByCode(GISShare.SMap.SpatialReference.ProjectedCoordinateSystemStyle.eWGS_1984_Web_Mercator_Auxiliary_Sphere);
 const CONST_Extent_China_WebMC = [window.GISShare.SMap.Fitting.CHINA.CHINA_EXTENT_LEFT_WebMercator, window.GISShare.SMap.Fitting.CHINA.CHINA_EXTENT_BOTTOM_WebMercator, window.GISShare.SMap.Fitting.CHINA.CHINA_EXTENT_RIGHT_WebMercator, window.GISShare.SMap.Fitting.CHINA.CHINA_EXTENT_TOP_WebMercator];
 
 let pMarkerSymbol;
 let pLineSymbol;
 let pFillSymbol;
 let m_MapControl;
 let m_pGraphicsLayer;

 function InitMap() {
    pMarkerSymbol = new GISShare.SMap.JS.Symbol.MarkerSymbol();
    pMarkerSymbol.setColor('#FF0000');
    pLineSymbol = new GISShare.SMap.JS.Symbol.LineSymbol();
    pLineSymbol.setLineColor('#FF0000');
    pLineSymbol.setLineWidth(2);
    pFillSymbol = new GISShare.SMap.JS.Symbol.FillSymbol();
    pFillSymbol.setFillColor('rgba(255, 255, 0, 0.3)');
    pFillSymbol.setLineColor('#FF0000');
    pFillSymbol.setLineWidth(2);
    //
    m_MapControl = new GISShare.SMap.JS.UI.MapControl(document.getElementById('gsMap'));
    //
    m_MapControl.getMap().SetSpatialReference(CONST_SpatialReferenceWebMercator);
    //
    const pPanTool = new GISShare.SMap.JS.Tool.PanTool();
    pPanTool.OnCreate(m_MapControl.getMap());
    m_MapControl.getMap().setTool(pPanTool);
    //
    m_pGraphicsLayer = new GISShare.SMap.JS.Layer.GraphicsLayer();
    m_pGraphicsLayer.setText('绘制图层');
    m_pGraphicsLayer.setVisible(true);
    m_MapControl.getMap().getGroupLayer().Add(m_pGraphicsLayer);
    const openStreetMapTileLayer = new GISShare.SMap.JS.Layer.OpenStreetMapTileLayer('https://tile-{3}.openstreetmap.fr/hot/{0}/{1}/{2}.png', 0, '', '', 'png');
    openStreetMapTileLayer.setText('OpenStreetMapTileLayer');
    openStreetMapTileLayer.setVisible(true);
    m_MapControl.getMap().getGroupLayer().Add(openStreetMapTileLayer);
    //
    m_MapControl.getMap().Refresh();
 };

 function SetCenter(center) {
    if(Array.isArray(center)){
        const pPoint = new GISShare.SMap.Geometry.Point(center[0], center[1]);
        pPoint.setSpatialReference(CONST_SpatialReferenceWebMercator);
        m_MapControl.getMap().CenterAt(pPoint);
    } else{
        m_MapControl.getMap().CenterAt(center);
    }
 };
 function ZoomToExtent(extent){
    if(Array.isArray(extent)){
        const pExtent = new GISShare.SMap.Geometry.BoundingBox(extent[0], extent[3], extent[2], extent[1]);
        pExtent.setSpatialReference(CONST_SpatialReferenceWebMercator);
        m_MapControl.getMap().SetExtent(pExtent);
    } else{
        m_MapControl.getMap().SetExtent(extent);
    }
 };
 function ShowGSGeometries(pGSGeometryList){
    m_pGraphicsLayer.Clear();
    //
    for(var i = 0, iLen = pGSGeometryList.length, pGSGeometry, pElement; i < iLen; i++){
        pGSGeometry = pGSGeometryList[i];
        switch (pGSGeometry.getDimension()) {
            case 0:
                pElement = new GISShare.SMap.JS.Element.PointElement();
                pElement.setSymbol(pMarkerSymbol);
                break;
            case 1:
                pElement = new GISShare.SMap.JS.Element.LineElement();
                pElement.setSymbol(pLineSymbol);
                break;
            case 2:
            default:
                pElement = new GISShare.SMap.JS.Element.RegionElement();
                pElement.setSymbol(pFillSymbol);
                break;
        }
        pElement.setGeometry(pGSGeometry);
        m_pGraphicsLayer.Add(pElement);
    }
    m_MapControl.getMap().Refresh();
    //
    const pExtent = m_pGraphicsLayer.getExtent();
    if(pExtent && !pExtent.getIsEmpty()){
        const dW = pExtent.getWidth();
        const dH = pExtent.getHeight();
        if(dW <= 0.0000001 && dH <= 0.0000001){
            SetCenter([pExtent.getLeft(), pExtent.getTop()]);
        } else{
            pExtent.Expand(1.2, 1.2);
            ZoomToExtent(pExtent);
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
})

 defineComponent({name: 'GSMapView'});
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
 .map-attr{
    position: absolute;
    left: 0px;
    bottom: 0px;
    padding: 0px 6px;
    background: rgba(227, 242, 242, 0.6);
 }
 </style>
 