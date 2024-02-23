<template>
  <div class="context">
    <n-form :model="objModel">
      <n-form-item label="输入：">
        <n-space vertical style="width:100%">
          <n-select :options="objModel.cbInputFormatOptions" v-model:value="objModel.cbInputFormatValue"/>
          <n-input style="width:100%" type="textarea" placeholder="输入待转换数据" v-model:value="objModel.txtInputValue"/>
          <!-- <div style="display: flex;">
            <n-input style="width:calc(100% - 42px)" type="textarea" placeholder="输入待转换数据" v-model:value="objModel.txtInputValue"/>
            <n-button type="primary" size="small" style="height:100%;width:39px;margin-left:3px" @click="btnMapView_OnClick('txtInputValue')">地<br>图<br>显<br>示</n-button>
          </div> -->
        </n-space>
      </n-form-item>
      <n-form-item label="转换（加密坐标与非加密坐标之间的拟合转换存在误差，误差范围在±1米左右。）：">
        <n-select :options="objModel.sridOptions" v-model:value="objModel.cbFromSridValue"/>
        <n-tag type="info" > 转 </n-tag>
        <n-select :options="objModel.sridOptions" v-model:value="objModel.cbToSridValue"/>
      </n-form-item>
      <!-- <n-form-item> -->
      <n-button type="primary" style="width:100%" @click="btnCoordTransform_OnClick"> 转换 </n-button>
      <!-- </n-form-item> -->
      <n-form-item label="输出：" style="margin-top: 20px;">
        <n-input type="textarea" placeholder="输出转换后数据（如果，只想显示图形，可将图形数据填入，选着正确的输入格式及输出参考，点击“地图显示”即可。）" v-model:value="objModel.txtOutputValue"/>
        <n-button type="primary" size="small" style="height:100%;width:39px;margin-left:3px" @click="btnMapView_OnClick('txtOutputValue')">地<br>图<br>显<br>示</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup>
  import { defineComponent, ref } from 'vue';
  import { useMessage, NForm, NFormItem, NButton, NSelect, NInput, NTag, NSpace } from 'naive-ui'

  defineComponent({
    name: 'GeoProject',
  });

  let objModel = ref({
    txtInputValue: '117,31',
    cbInputFormatValue: 'X,Y',
    cbInputFormatOptions:[
      { label: 'X,Y（ 如：117,31 ）', value: 'X,Y' },
      { label: 'WKT（ 如：POINT(117 31) ）', value: 'WKT' },
      { label: 'WKT-EX（ GISShare关于WKT拓展，如：PT(117 31) ）', value: 'WKT-EX' },
      { label: 'WKB（支撑GISShare关于WKB拓展，如：01010000000000000000405d400000000000003f40 ）', value: 'WKB' },
      { label: 'GeoJson/EsriJson中“geometry”节点值（支撑GISShare关于GeoJson拓展，如：{ "type": "Point", "coordinates": [117, 31] } ）', value: 'GeoJson:geometry' },
      { label: '完整GeoJson/EsriJson/TopoJson数据（支撑GISShare关于GeoJson拓展，如：{"type": "FeatureCollection", "features":[{ "type":"Feature", "geometry":{"type": "Point", "coordinates":[117, 31]}, "properties":{"name": "测试"}}]} ）', value: 'GeoJson' }
    ],
    
    cbFromSridValue: 4326,
    cbToSridValue: 3857,
    sridOptions:[
      { label: '【SRID:4326】WGS84', value: 4326 },
      { label: '【SRID:3857】WebMC（Web墨卡托度坐标）', value: 3857 },
      { label: '【SRID:-1014326】加密坐标-GCJ02（火星坐标）', value: -1014326 },
      { label: '【SRID:-2013857】加密坐标-GCJ02MC（基于火星坐标的Web墨卡托投影坐标）', value: -2013857 },
      { label: '【SRID:-1024326】加密坐标-BD09LL（百度经纬度坐标）', value: -1024326 },
      { label: '【SRID:-2023857】加密坐标-BD09MC（百度Web墨卡托度坐标）', value: -2023857 },
    ],
    txtOutputValue: '',
  });

  const message = useMessage();

  let m_pHook;

  function GetGeoInfo(bIsFeatureCollection, strInputFormat, strInputValue){
    let pGeometry;
    let pFeatureCollection;
    if(strInputFormat === 'X,Y'){
      const strWKT = 'MULTIPOINT((' + strInputValue.replace(/,/g, " ").replace(/;/g, "),(") + '))';
      pGeometry = window.GISShare.SMap.Geometry.GeoWKTEnHelper.BuildGeometryFromWKT(strWKT);
    } else if(strInputFormat === 'GeoJson:geometry'){
      const jsonParser = new GISShare.Json.JsonParser(strInputValue);
      pGeometry = GISShare.SMap.Data.GeoJsonHelper.BuildGeometryFromGeoJson(jsonParser);
    } else if(bIsFeatureCollection){
      const jsonParser = new GISShare.Json.JsonParser(strInputValue);
      pFeatureCollection = GISShare.SMap.Data.GeoJsonHelper.BuildFeatureCollection(jsonParser);
    } else if(strInputFormat === 'WKB'){
      pGeometry = window.GISShare.SMap.Geometry.GeoWKBHelper.BuildGeometryFromWKB_HexStr(strInputValue, 0);
    } else{
      pGeometry = window.GISShare.SMap.Geometry.GeoWKTEnHelper.BuildGeometryFromWKT(strInputValue);
    }
    //
    if(bIsFeatureCollection){
      if(!pFeatureCollection || pFeatureCollection.getCount() <= 0){
        return '输入格式不正确（或GeoJson图形数据无效）！';
      }
      return pFeatureCollection;
    } else{
      if(!pGeometry || pGeometry.getIsEmpty()){
        return '输入格式不正确（或图形数据无效）！';
      }
      return pGeometry;
    }
  }
  function btnCoordTransform_OnClick(){
    if(!objModel.value.txtInputValue){
      message.error('请输入！');
      return;
    }
    if(objModel.value.cbFromSridValue === objModel.value.cbToSridValue){
      message.error('转换坐标一致！');
      return;
    }
    //
    const strInputFormat = objModel.value.cbInputFormatValue;
    const strInputValue = objModel.value.txtInputValue;
    const bIsFeatureCollection = strInputFormat === 'GeoJson';
    const objGeoInfo = GetGeoInfo(bIsFeatureCollection, strInputFormat, strInputValue);
    if(typeof objGeoInfo === 'string') {
        message.error(objGeoInfo);
        return;
    }
    //
    let pGeometry;
    let pFeatureCollection;
    if(bIsFeatureCollection){
      pFeatureCollection = objGeoInfo;
      for(var i = pFeatureCollection.getCount() - 1, pFeature; i >= 0; i--){
        pFeature = pFeatureCollection.get(i);
        pGeometry = pFeature.getGeometry();
        if(!pGeometry || pGeometry.getIsEmpty()) continue;
        window.GISShare.SMap.Fitting.FittingHelper.Fit_Geo(pGeometry, objModel.value.cbFromSridValue, objModel.value.cbToSridValue);
      }
    } else{
      pGeometry = objGeoInfo;
      window.GISShare.SMap.Fitting.FittingHelper.Fit_Geo(pGeometry, objModel.value.cbFromSridValue, objModel.value.cbToSridValue);
    }
    //
    if(strInputFormat === 'X,Y'){
      let strWKT = pGeometry.ToWellKnownText(false);
      strWKT = strWKT.replace(/\),\(/g, ";").replace(/ /g, ",");
      objModel.value.txtOutputValue = strWKT.substring(0, strWKT.length - 2).substring(12);
    } else if(strInputFormat === 'GeoJson:geometry'){
      const sb = new GISShare.EX.StringBuilder();
      GISShare.SMap.Data.GeoJsonHelper.BuildGeoJsonGeometry(sb, pGeometry, GISShare.SMap.Geometry.CoordinateType.eXYZ);
      objModel.value.txtOutputValue = sb.toString();
    } else if(bIsFeatureCollection){
      objModel.value.txtOutputValue = GISShare.SMap.Data.GeoJsonHelper.BuildGeoJson(pFeatureCollection, null, -1, -1);
    } else if(strInputFormat === 'WKB'){
      objModel.value.txtOutputValue = GISShare.SMap.Geometry.GeoWKBHelper.BuildWellKnownBinary_HexStr(pGeometry, GISShare.SMap.Utils.ByteOrderStyle.eNDR, false);
    } else{
      objModel.value.txtOutputValue = pGeometry.ToWellKnownText(strInputFormat === 'WKT-EX')
    }
    //
    message.success('完成！');
  }
  function btnMapView_OnClick(strKey){
    const strInputValue = objModel.value[strKey];
    if(!strInputValue){
      message.error('请输入！');
      return;
    }
    //
    const strInputFormat = objModel.value.cbInputFormatValue;
    const bIsFeatureCollection = strInputFormat === 'GeoJson';
    const objGeoInfo = GetGeoInfo(bIsFeatureCollection, strInputFormat, strInputValue);
    if(typeof objGeoInfo === 'string') {
        message.error(objGeoInfo);
        return;
    }
    //
    const pGSGeometryList = [];
    const iSRID = strKey === 'txtInputValue' ? objModel.value.cbFromSridValue : objModel.value.cbToSridValue;
    let pGeometry;
    let pFeatureCollection;
    if(bIsFeatureCollection){
      pFeatureCollection = objGeoInfo;
      for(var i = pFeatureCollection.getCount() - 1, pFeature; i >= 0; i--){
        pFeature = pFeatureCollection.get(i);
        pGeometry = pFeature.getGeometry();
        if(!pGeometry || pGeometry.getIsEmpty()) continue;
        pGeometry = pGeometry.Clone();
        window.GISShare.SMap.Fitting.FittingHelper.Fit_Geo(pGeometry, iSRID, GISShare.SMap.SpatialReference.ProjectedCoordinateSystemStyle.eWGS_1984_Web_Mercator_Auxiliary_Sphere);
        pGSGeometryList.push(pGeometry);
      }
    } else{
      pGeometry = objGeoInfo.Clone();
      window.GISShare.SMap.Fitting.FittingHelper.Fit_Geo(pGeometry, iSRID, GISShare.SMap.SpatialReference.ProjectedCoordinateSystemStyle.eWGS_1984_Web_Mercator_Auxiliary_Sphere);
      pGSGeometryList.push(pGeometry);
    }
    //
    if(pGSGeometryList.length > 0){
      m_pHook.ShowGSGeometries(pGSGeometryList);
    } else{
        message.error("无有效数据！");
    }
  }

function BindHook(pHook) {
    m_pHook = pHook;
}

defineExpose({
    BindHook
})
</script>

<style>
.w-full { 
  width:100%;
}
.context {
  padding: 16px 26px;
}
</style>
