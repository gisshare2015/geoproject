<template>
  <div class="context">
    <n-form :model="objModel">
      <n-form-item label="输入：">
        <n-space vertical style="width:100%">
          <n-select :options="objModel.cbInputFormatOptions" v-model:value="objModel.cbInputFormatValue"/>
          <n-input style="width:100%" type="textarea" placeholder="输入待转换数据" @dblclick='ImportDataForm_btnOK_OnClick' v-model:value="objModel.txtInputValue"/>
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
        <n-button type="primary" size="small" style="height:100%;width:39px;margin-left:3px" @click="btnExport_OnClick('txtOutputValue')">导<br>出</n-button>
        <n-button type="primary" size="small" style="height:100%;width:39px;margin-left:3px" @click="btnMapView_OnClick('txtOutputValue')">地<br>图<br>显<br>示</n-button>
      </n-form-item>
    </n-form>
    <n-modal v-model:show="m_ExportDataForm_Visible" preset="dialog" title="导出图形数据" size="huge" style="width: 666px" positive-text="导出数据" @positive-click="ExportDataForm_btnOK_OnClick">
        <n-ellipsis style="color: black; font-size: small; width:636px;">格式：</n-ellipsis>
        <n-select size="small" v-model:value="m_ExportDataForm_FileType" :options="CONST_Select_FileType_Options" style="width: 600px;"></n-select>
        <n-ellipsis v-if="m_ExportDataForm_FileType==='Shape'" style="color: black; font-size: small; width:636px;">几何数据类型：</n-ellipsis>
        <n-select v-if="m_ExportDataForm_FileType==='Shape'" size="small" v-model:value="m_ExportDataForm_ShapeType" :options="m_ExportDataForm_ShapeType_Options" style="width: 600px;"></n-select>
        <n-ellipsis v-if="m_ExportDataForm_FileType==='Shape'" style="color: black; font-size: small; width:636px;">字符集编码：（ShapeFile文件可能需要自行设置，以避免属性乱码，如未出现可忽略，默认：utf-8）</n-ellipsis>
        <n-input v-if="m_ExportDataForm_FileType==='Shape'" style="font-size: tiny; width:636px;" v-model:value="m_ExportDataForm_Encoding" placeholder="字符集编码：（ShapeFile文件可能需要自行设置，以避免属性乱码，如未出现可忽略，默认：utf-8）" />
        <n-ellipsis style="color: black; font-size: small; width:636px;">文件名：</n-ellipsis>
        <n-input style="font-size: tiny; width:636px;" v-model:value="m_ExportDataForm_FileName" placeholder="文件名" />
        <!-- <n-ellipsis size="tiny" style="color: black; font-size: small; width:636px">注：1.导出数据的坐标为火星坐标（GCJ02），采用的空间参考是WGS1984（即：EPSG:4326）；</n-ellipsis> -->
        <!-- <n-ellipsis size="tiny" style="color: black; font-size: small; width:636px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.导出数据的坐标为百度经纬度（BD09LL），采用的空间参考WGS1984（即：EPSG:4326）；</n-ellipsis> -->
        <!-- <n-ellipsis size="tiny" style="color: black; font-size: small; width:636px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.导出数据的坐标为百度墨卡托（BD09MC），采用的空间参考是Web墨卡托（即：EPSG:3857）。</n-ellipsis> -->
    </n-modal>
    <n-modal v-model:show="m_ImportDataForm_Visible" preset="dialog" title="导入图形数据" size="huge" style="width: 666px" positive-text="选择文件并导入" @positive-click="ImportDataForm_btnOK_OnClick">
        <n-ellipsis style="color: black; font-size: small; width:636px;">支持格式：</n-ellipsis>
        <n-ellipsis style="color: black; font-size: small; width:636px;">1.GSJson（GISShare内置格式，支撑内置标绘等定制图形）；</n-ellipsis>
        <n-ellipsis style="color: black; font-size: small; width:636px;">2.GeoJson（GIS通用交换格式）；</n-ellipsis>
        <n-ellipsis style="color: black; font-size: small; width:636px;">3.TopoJson（GIS通用交换格式）；</n-ellipsis>
        <n-ellipsis style="color: black; font-size: small; width:636px;">4.CSV（数据表单，支持Excel查看）；</n-ellipsis>
        <n-ellipsis style="color: black; font-size: small; width:636px;">5.ShapeFile（GIS通用交换格式，必选文件：.shx、.shp、.dbf，可选文件：.prj）。</n-ellipsis>
        <n-ellipsis style="color: black; font-size: small; width:636px;">字符集编码：（ShapeFile文件可能需要自行设置，以避免属性乱码，如未出现可忽略，默认：utf-8）</n-ellipsis>
        <n-input style="font-size: tiny; width:636px;" v-model:value="m_ImportDataForm_Encoding" placeholder="字符集编码：（ShapeFile文件可能需要自行设置，以避免属性乱码，如未出现可忽略，默认：utf-8）" />
        <n-ellipsis size="tiny" style="color: black; font-size: small; width:636px">注：1.多种类型数据可以混合输入；</n-ellipsis>
        <!-- <n-ellipsis size="tiny" style="color: black; font-size: small; width:636px">&emsp;&emsp;2.默认空间参考是百度墨卡托。</n-ellipsis> -->
    </n-modal>
  </div>
</template>

<script setup>
  import { defineComponent, ref } from 'vue';
  import { useMessage, NEllipsis, NForm, NFormItem, NButton, NSelect, NInput, NModal, NTag, NSpace } from 'naive-ui';

  defineComponent({
    name: 'GeoProject',
  });

const CONST_Select_FileType_Options = [
  { 
      label: "GSJson（GISShare内置格式，支撑内置标绘等定制图形）", 
      value: "GSJson"
  },
  {
      label: "GeoJson（GIS通用交换格式）", 
      value: "GeoJson"
  },
  { 
      label: "CSV（数据表单，支持Excel查看）", 
      value: "CSV"
  },
  { 
      label: "ShapeFile（GIS通用交换格式，输出文件：.shx、.shp、.dbf、.prj）", 
      value: "Shape"
  }
];
let m_ExportDataForm_Visible = ref(false);
let m_ExportDataForm_FileName = ref('');
let m_ExportDataForm_FileType = ref('GSJson');
let m_ExportDataForm_ShapeType_Options = [];
let m_ExportDataForm_ShapeType = ref(0);
let m_ExportDataForm_Encoding = ref('utf-8');
let m_ExportDataForm_FeatureCollection;
//
  let m_ImportDataForm_Visible = ref(false);
  let m_ImportDataForm_Encoding = ref('utf-8');
  //
  const m_inputFile = GISShare.EX.InputGeoFileHelper.NewInputGeoFile();
  m_inputFile.onGeoLoad = function(pFeatureCollection, sender){
    if(pFeatureCollection){
      objModel.value.txtInputValue = m_ImportDataForm_Encoding.value === 'CSV' ? GISShare.SMap.Data.CSVHelper.BuildCSV(pFeatureCollection, undefined, -1, -1, true) : GISShare.SMap.Data.GeoJsonHelper.BuildGeoJson(pFeatureCollection, null, -1, -1, false, false, false);
    }
  }
  function ImportDataForm_btnOK_OnClick(){
    if(IsFeatureCollection()){
      m_inputFile.encoding = m_ImportDataForm_Encoding.value;
      m_inputFile.click();
    }
  }

  let objModel = ref({
    txtInputValue: '117,31',
    cbInputFormatValue: 'X,Y',
    cbInputFormatOptions:[
      { label: 'X,Y（如：117,31）', value: 'X,Y' },
      { label: 'WKT（如：POINT(117 31)）', value: 'WKT' },
      { label: 'WKT-EX（GISShare关于WKT拓展，如：PT(117 31)）', value: 'WKT-EX' },
      { label: 'WKB（支撑GISShare关于WKB拓展，如：01010000000000000000405d400000000000003f40）', value: 'WKB' },
      { label: 'GeoJson/EsriJson中“geometry”节点值（支撑GISShare关于GeoJson拓展，如：{ "type": "Point", "coordinates": [117, 31] }）', value: 'GeoJson:geometry' },
      { label: '【双击输入框打开文件】完整GeoJson/EsriJson/TopoJson数据文件（支撑GISShare关于GeoJson拓展，如：{"type": "FeatureCollection", "features":[{ "type":"Feature", "geometry":{"type": "Point", "coordinates":[117, 31]}, "properties":{"name": "测试"}}]}）', value: 'GeoJson' },
      { label: '【双击输入框打开文件】CSV数据文件（支撑GISShare关于CSV拓展，图形字段：SHAPE，空间参考字段：SRID，SHAPE值WKT或WKT-EX，SRID值ID或WKT）', value: 'CSV'},
      { label: '【双击输入框打开文件】ShapeFile文件（GIS通用交换格式，包含文件：.shx、.shp、.dbf、.prj，其中.prj可缺省，注：打开后的文件内容将以GeoJson格式在文本框显示，但是导出数据依然是ShapeFile文件）', value: 'ShapeFile' }
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

  function IsFeatureCollection(){    
    const strInputFormat = objModel.value.cbInputFormatValue;
    return strInputFormat === 'GeoJson' || strInputFormat === 'CSV' || strInputFormat === 'ShapeFile';
  }

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
      if(strInputFormat === 'CSV'){
        const csvParser = new GISShare.CSV.CSVParser(strInputValue);
        pFeatureCollection = GISShare.SMap.Data.CSVHelper.BuildFeatureCollection(csvParser, null);
      } else {
        const jsonParser = new GISShare.Json.JsonParser(strInputValue);
        pFeatureCollection = GISShare.SMap.Data.GeoJsonHelper.BuildFeatureCollection(jsonParser);
      }
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
    const bIsFeatureCollection = IsFeatureCollection();
    const objGeoInfo = GetGeoInfo(bIsFeatureCollection, strInputFormat, strInputValue);
    if(typeof objGeoInfo === 'string') {
        message.error(objGeoInfo);
        return;
    }
    //
    var pSpatialReference;
    switch(objModel.value.cbToSridValue){
      case 4326:
      case -1014326:
      case -1024326:
        pSpatialReference = GISShare.SMap.SpatialReference.SpatialReferenceFactory.GetSpatialReferenceByCode(4326);
        break;
      case 3857:
      case -2013857:
      case -2023857:
        pSpatialReference = GISShare.SMap.SpatialReference.SpatialReferenceFactory.GetSpatialReferenceByCode(3857);
        break;
      default:
        pSpatialReference = null;
        break;
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
        pGeometry.setSpatialReference(pSpatialReference);
      }
    } else{
      pGeometry = objGeoInfo;
      window.GISShare.SMap.Fitting.FittingHelper.Fit_Geo(pGeometry, objModel.value.cbFromSridValue, objModel.value.cbToSridValue);
      pGeometry.setSpatialReference(pSpatialReference);
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
      if(strInputFormat === 'CSV'){
        objModel.value.txtOutputValue = GISShare.SMap.Data.CSVHelper.BuildCSV(pFeatureCollection, null, -1, -1, true);
      } else{
        objModel.value.txtOutputValue = GISShare.SMap.Data.GeoJsonHelper.BuildGeoJson(pFeatureCollection, null, -1, -1);
      }
    } else if(strInputFormat === 'WKB'){
      objModel.value.txtOutputValue = GISShare.SMap.Geometry.GeoWKBHelper.BuildWellKnownBinary_HexStr(pGeometry, GISShare.SMap.Utils.ByteOrderStyle.eNDR, false);
    } else{
      objModel.value.txtOutputValue = pGeometry.ToWellKnownText(strInputFormat === 'WKT-EX')
    }
    //
    message.success('完成！');
  }
  function btnExport_OnClick(strKey){
    const strInputValue = objModel.value[strKey];
    if(!strInputValue){
      message.error('请输入！');
      return;
    }
    //
    const strInputFormat = objModel.value.cbInputFormatValue;
    const bIsFeatureCollection = IsFeatureCollection();
    const objGeoInfo = GetGeoInfo(bIsFeatureCollection, strInputFormat, strInputValue);
    if(typeof objGeoInfo === 'string') {
        message.error(objGeoInfo);
        return;
    }
    //
    const pFeatureCollection = bIsFeatureCollection ? objGeoInfo : new GISShare.SMap.Data.FeatureCollection();
    if(bIsFeatureCollection){
      pFeatureCollection.RepairFields(50, false);
    }else{
      pFeatureCollection.Add(objGeoInfo);
    }
    //
    let ePoint = -1;
    let eMultiPoint = -1;
    let ePolyLine = -1;
    let ePolygon = -1;
    for(let i = 0, iLen = pFeatureCollection.getCount(), pFeature, pGeometry; i < iLen; i++){
      pFeature = pFeatureCollection.get(i);
        pGeometry = pFeature.getGeometry();
        switch (pGeometry.getGeometryType()){
            case GISShare.SMap.Geometry.GeometryType.ePoint:
                ePoint = GISShare.SMap.Data.ShapeType.ePoint;
                break;
            case GISShare.SMap.Geometry.GeometryType.eMultiPoint:
                eMultiPoint = GISShare.SMap.Data.ShapeType.eMultiPoint;
                break;
            case GISShare.SMap.Geometry.GeometryType.eBeeline:
            case GISShare.SMap.Geometry.GeometryType.eBezierCurve:
            case GISShare.SMap.Geometry.GeometryType.eCircularArc:
            case GISShare.SMap.Geometry.GeometryType.eEllipticArc:
            case GISShare.SMap.Geometry.GeometryType.ePath:
            case GISShare.SMap.Geometry.GeometryType.eMultiPath:
                ePolyLine = GISShare.SMap.Data.ShapeType.ePolyLine;
                break;
            case GISShare.SMap.Geometry.GeometryType.eBoundingBox:
            case GISShare.SMap.Geometry.GeometryType.eCircle:
            case GISShare.SMap.Geometry.GeometryType.eRegion:
            case GISShare.SMap.Geometry.GeometryType.ePolygon:
            case GISShare.SMap.Geometry.GeometryType.eMultiPolygon:
                ePolygon = GISShare.SMap.Data.ShapeType.ePolygon;
                break;
            default:
                break;
        }
    }
    m_ExportDataForm_ShapeType_Options = [];
    if(ePoint > 0){
        m_ExportDataForm_ShapeType_Options.push({ 
            label: "Point（点）", 
            value: ePoint,
            tag: 'Point'
        });
    }
    if(eMultiPoint > 0){
        m_ExportDataForm_ShapeType_Options.push({ 
            label: "MultiPoint（多点）", 
            value: eMultiPoint,
            tag: 'MultiPoint'
        });
    }
    if(ePolyLine > 0){
        m_ExportDataForm_ShapeType_Options.push({ 
            label: "PolyLine（线）", 
            value: ePolyLine,
            tag: 'PolyLine'
        });
    }
    if(ePolygon > 0){
        m_ExportDataForm_ShapeType_Options.push({ 
            label: "Polygon（面）", 
            value: ePolygon,
            tag: 'Polygon'
        });
    }
    if(m_ExportDataForm_ShapeType_Options.length > 1){
        const item = {
            label: "全量分类导出，即：", 
            value: 0,
            values: [],
            tags: []
        };
        for(let i = 0, iLen = m_ExportDataForm_ShapeType_Options.length, one; i < iLen; i++){
            one = m_ExportDataForm_ShapeType_Options[i];
            if(i !== 0) item.label += '、';
            item.label += one.label;
            item.values.push(one.value);
            item.tags.push(one.tag);
        }
        m_ExportDataForm_ShapeType_Options.push(item);
        m_ExportDataForm_ShapeType.value = 0;
    } else if(m_ExportDataForm_ShapeType_Options.length === 1){
        m_ExportDataForm_ShapeType.value = m_ExportDataForm_ShapeType_Options[0].value;
    } else {
        m_ExportDataForm_ShapeType.value = -1;
    }
    //
    m_ExportDataForm_FileName.value = "图形数据" + GISShare.EX.DateTimeHelper.StrFormat(new Date(), 'yyyyMMddhhmmss');
    m_ExportDataForm_Visible.value = true;
    m_ExportDataForm_FeatureCollection = pFeatureCollection;
  }
  function ExportDataForm_btnOK_OnClick(){
      switch(m_ExportDataForm_FileType.value){
          case 'Shape':
              ExportDataForm_btnOK_OnClick_shp(m_ExportDataForm_FeatureCollection, m_ExportDataForm_FileName.value);
              break;
          case 'CSV':
              ExportDataForm_btnOK_OnClick_csv(m_ExportDataForm_FeatureCollection, m_ExportDataForm_FileName.value, true);
              break;
          case 'GeoJson':
              ExportDataForm_btnOK_OnClick_json(m_ExportDataForm_FeatureCollection, m_ExportDataForm_FileName.value, false);
              break;
          case 'GSJson':
          default:
              ExportDataForm_btnOK_OnClick_json(m_ExportDataForm_FeatureCollection, m_ExportDataForm_FileName.value, true);
              break;
      }
  }
function ExportDataForm_btnOK_OnClick_json(pFeatureCollection, strFileName, bGS){
    const strGeoJson = GISShare.SMap.Data.GeoJsonHelper.BuildGeoJson(pFeatureCollection, null, -1, -1, bGS, false, bGS);
    // console.log(strGeoJson);
    const blob = new Blob([strGeoJson], { type: "application/json;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const alink = document.createElement("a");
    alink.style.display = "none";
    alink.download = strFileName + (bGS ? ".gsjson" : ".geojson");
    alink.href = href;
    document.body.appendChild(alink);
    alink.click();
    document.body.removeChild(alink);
    URL.revokeObjectURL(href);
}
function ExportDataForm_btnOK_OnClick_csv(pFeatureCollection, strFileName, bGS){
    const strCSV = GISShare.SMap.Data.CSVHelper.BuildCSV(pFeatureCollection, null, -1, -1, true);
    // console.log(strCSV);
    const blob = new Blob(["\uFEFF" + strCSV], { type: "text/csv;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const alink = document.createElement("a");
    alink.style.display = "none";
    alink.download = strFileName + ".csv";
    alink.href = href;
    document.body.appendChild(alink);
    alink.click();
    document.body.removeChild(alink);
    URL.revokeObjectURL(href);
}
function ExportDataForm_btnOK_OnClick_shp(pFeatureCollection, strFileName){
    if(m_ExportDataForm_ShapeType.value < 0){
        message.error('无有效的Shape数据！');
        return;
    }
    //
    const fieldList = new Array();
    for(let j = 0, iLen = pFeatureCollection.getFieldCount(); j < iLen; j++){
        fieldList.push(pFeatureCollection.GetField(j));
    }
    //
    let item;
    for(let i = 0, iLen = m_ExportDataForm_ShapeType_Options.length, one; i < iLen; i++){
        one = m_ExportDataForm_ShapeType_Options[i];
        if(one.value === m_ExportDataForm_ShapeType.value){
            item = one;
            break;
        }
    }
    if(item.values){
        for(let i = 0, iLen = item.values.length, one; i < iLen; i++){
            ExportDataForm_btnOK_OnClick_shp_shapetype(pFeatureCollection, strFileName + '_' + item.tags[i], item.values[i], fieldList);
        }
    } else {
        ExportDataForm_btnOK_OnClick_shp_shapetype(pFeatureCollection, strFileName, item.value, fieldList);
    }
}
function ExportDataForm_btnOK_OnClick_shp_shapetype(pFeatureCollection, strFileName, eShapeType, fieldList){
  debugger;
    var shapeFile = GISShare.SMap.Data.ShapeFile.CreateShapeFile(eShapeType, fieldList, pFeatureCollection.getSpatialReference());
    if(m_ExportDataForm_Encoding.value.toLowerCase() !== "utf-8"){
        shapeFile.setEncoding(new GISShare.EX.TextEncoding(m_ExportDataForm_Encoding.value));
    }
    shapeFile.OpenWrite();
    for(let i = 0, iLen = pFeatureCollection.getCount(), pFeature, pGeometry, eGeometryType, pAttributes; i < iLen; i++){
        pFeature = pFeatureCollection.get(i);
        pGeometry = pFeature.getGeometry();
        eGeometryType = pGeometry.getGeometryType();
        if((eShapeType === GISShare.SMap.Data.ShapeType.ePoint || eShapeType === GISShare.SMap.Data.ShapeType.ePointM || eShapeType === GISShare.SMap.Data.ShapeType.ePointZ) && 
           (eGeometryType !== GISShare.SMap.Geometry.GeometryType.ePoint)) {
            continue;
        } else if((eShapeType === GISShare.SMap.Data.ShapeType.eMultiPoint || eShapeType === GISShare.SMap.Data.ShapeType.eMultiPointM || eShapeType === GISShare.SMap.Data.ShapeType.eMultiPointZ) && 
           (eGeometryType !== GISShare.SMap.Geometry.GeometryType.eMultiPoint)) {
            continue;
        } else if((eShapeType === GISShare.SMap.Data.ShapeType.ePolyLine || eShapeType === GISShare.SMap.Data.ShapeType.ePolyLineM || eShapeType === GISShare.SMap.Data.ShapeType.ePolyLineZ) && 
           (eGeometryType !== GISShare.SMap.Geometry.GeometryType.ePath && eGeometryType !== GISShare.SMap.Geometry.GeometryType.eMultiPath && eGeometryType !== GISShare.SMap.Geometry.GeometryType.eBeeline && eGeometryType !== GISShare.SMap.Geometry.GeometryType.eBezierCurve && eGeometryType !== GISShare.SMap.Geometry.GeometryType.eCircularArc && eGeometryType !== GISShare.SMap.Geometry.GeometryType.eEllipticArc)) {
            continue;
        } else if((eShapeType === GISShare.SMap.Data.ShapeType.ePolygon || eShapeType === GISShare.SMap.Data.ShapeType.ePolygonM || eShapeType === GISShare.SMap.Data.ShapeType.ePolygonZ) && 
           (eGeometryType !== GISShare.SMap.Geometry.GeometryType.eRegion && eGeometryType !== GISShare.SMap.Geometry.GeometryType.ePolygon && eGeometryType !== GISShare.SMap.Geometry.GeometryType.eMultiPolygon && eGeometryType !== GISShare.SMap.Geometry.GeometryType.eBoundingBox && eGeometryType !== GISShare.SMap.Geometry.GeometryType.eCircle)) {
            continue;
        }
        shapeFile.WriteFeature(pGeometry, pFeature.getAttributes());
    }
    const shp_shx_dbf_prj = shapeFile.CloseWrite();
    for(let i = 0, iLen = shp_shx_dbf_prj.length, one; i < iLen; i++){
        one = shp_shx_dbf_prj[i];
        if(one){
            const href = URL.createObjectURL(one);
            const alink = document.createElement("a");
            alink.style.display = "none";
            if(i === 0){
                alink.download = strFileName + ".shp";
            } else if(i === 1){
                alink.download = strFileName + ".shx";
            } else if(i === 2){
                alink.download = strFileName + ".dbf";
            } else if(i === 3){
                alink.download = strFileName + ".prj";
            }
            alink.href = href;
            document.body.appendChild(alink);
            alink.click();
            document.body.removeChild(alink);
            URL.revokeObjectURL(href);
        }
    }
}
  function btnMapView_OnClick(strKey){
    const strInputValue = objModel.value[strKey];
    if(!strInputValue){
      message.error('请输入！');
      return;
    }
    //
    const strInputFormat = objModel.value.cbInputFormatValue;
    const bIsFeatureCollection = IsFeatureCollection();
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
