# GeoProject
**GeoProject**：是一个基于[GISShare](http://www.gisshare.com)能力实现的图形坐标转换工具网站项目，为第三方提供便捷图形数据坐标转换/纠偏及显示服务。

**网页址**：  
http://www.gisshare.com/GeoProject/index.html   
![image](https://github.com/gisshare2015/geoproject/assets/20768620/cc3c0e7d-90d9-466b-aa04-0dc213d5701e)

**项目开发应用**   
如果您的项目也需要用到坐标转换/纠偏也可以调用该组件。   
1.引入GISSHare.SMap前端包；（gisshare-smap：仅含图形数据部分较小；gisshare-smap-all：包含图形和可视化较大。）  
```shell
npm install @gisshare/gisshare-smap  
```  
2.在项目主入口文件引入即可；（引入后GISShare命名空间就会挂在window下，编码时直接调用即可。）
```shell  
import { GISShare } from '@gisshare/gisshare-smap-all'
```  
3.具体的转化&纠偏代码实现，及[API文档](http://www.gisshare.com/APIDoc/index.html)；（加密坐标与非加密坐标之间的拟合转换存在误差，误差范围在±1米左右。）
```shell  
var pPoint;
//
// 【坐标变换】WGS84-WebMercator互转
//
pPoint = new GISShare.SMap.Geometry.Point(117, 31);
//WGS84 转 WebMercator
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984, //当前空间参考
                                        GISShare.SMap.SpatialReference.ProjectedCoordinateSystemStyle.eWGS_1984_Web_Mercator_Auxiliary_Sphere//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//WebMercator 转 WGS84
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.ProjectedCoordinateSystemStyle.eWGS_1984_Web_Mercator_Auxiliary_Sphere, //当前空间参考
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//
// 【坐标加解密】GCJ02（国测局相关）
//
pPoint = new GISShare.SMap.Geometry.Point(117, 31);
//WGS84 转 GCJ02
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984, //当前空间参考
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_GCJ02//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//GCJ02 转 WGS84
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_GCJ02, //当前空间参考
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//
// 【坐标加解密】BD09（百度相关）
//
pPoint = new GISShare.SMap.Geometry.Point(117, 31);
//WGS84 转 BD09LL
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984, //当前空间参考
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_BD09LL//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//BD09LL 转 WGS84
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_BD09LL, //当前空间参考
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//
pPoint = new GISShare.SMap.Geometry.Point(117, 31);
//GCJ02 转 BD09LL
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_GCJ02, //当前空间参考
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_BD09LL//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//BD09LL 转 GCJ02
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_BD09LL, //当前空间参考
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_GCJ02//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//
pPoint = new GISShare.SMap.Geometry.Point(117, 31);
//WGS84 转 BD09MC
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984, //当前空间参考
                                        GISShare.SMap.SpatialReference.ProjectedCoordinateSystemStyle.eWGS_1984_Web_Mercator_Auxiliary_Sphere_BD09MC//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//BD09MC 转 WGS84
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.ProjectedCoordinateSystemStyle.eWGS_1984_Web_Mercator_Auxiliary_Sphere_BD09MC, //当前空间参考
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//
pPoint = new GISShare.SMap.Geometry.Point(117, 31);
//GCJ02 转 BD09MC
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_GCJ02, //当前空间参考
                                        GISShare.SMap.SpatialReference.ProjectedCoordinateSystemStyle.eWGS_1984_Web_Mercator_Auxiliary_Sphere_BD09MC//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//BD09MC 转 GCJ02
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.ProjectedCoordinateSystemStyle.eWGS_1984_Web_Mercator_Auxiliary_Sphere_BD09MC, //当前空间参考
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_GCJ02//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//
pPoint = new GISShare.SMap.Geometry.Point(117, 31);
//BD09LL 转 BD09MC
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_BD09LL, //当前空间参考
                                        GISShare.SMap.SpatialReference.ProjectedCoordinateSystemStyle.eWGS_1984_Web_Mercator_Auxiliary_Sphere_BD09MC//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
//BD09MC 转 BD09LL
GISShare.SMap.Fitting.FittingHelper.Fit(pPoint, //目标点
                                        GISShare.SMap.SpatialReference.ProjectedCoordinateSystemStyle.eWGS_1984_Web_Mercator_Auxiliary_Sphere_BD09MC, //当前空间参考
                                        GISShare.SMap.SpatialReference.GeographicCoordinateSystemStyle.eGCS_WGS_1984_BD09LL//目标空间参考
                                        );
console.log(pPoint.getX() + "," + pPoint.getY());
```
（注：  
     [GISShare.SMap](http://www.gisshare.com/APIDoc/index.html)库包是一个提供GIS能力的多语言SDK（1.DotNet-C#-WinFrom和WPF；2.Java-Android；3.JS）。  
     支持：  
     1.几何数据的定义与计算（如：点、线、面、多点、多线、多面、圆、直线、三阶贝塞尔、圆弧、椭圆弧等）；  
     2.空间参考的定义与转换（支持：Proj4、WKT等）；  
     3.加密坐标的拟合转化（如：火星坐标、百度坐标）；  
     4.图形数据计算（如：线条打断&分割&截取&切线&法线等、长度计算、面积计算、拓扑关系判断等）；  
     5.图形数据的读取转换（如：WKT、WKB、GeoJson、EsriJson、TopoJson、ShapeFile等）；  
     6.地图的可视化展现（如：WMS、WMTS、聚合、热力图等）。  
）；
