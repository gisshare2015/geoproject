import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import LinearRing from 'ol/geom/LinearRing';
import Polygon from 'ol/geom/Polygon';
import MultiPoint from 'ol/geom/MultiPoint';
import MultiLineString from 'ol/geom/MultiLineString';
import MultiPolygon from 'ol/geom/MultiPolygon';

/**
 * GISShare几何对象转OpenLayers几何对象
 * @param {*} pGeometry 
 * @returns 
 */
export function GSGeo_To_OLGeo(pGeometry) {
    var olGeo;
    switch (pGeometry.getGeometryType()) {
        case GISShare.SMap.Geometry.GeometryType.ePoint:
            olGeo = new Point([pGeometry.getX(), pGeometry.getY()]);
            break;
        case GISShare.SMap.Geometry.GeometryType.eBeeline:
        case GISShare.SMap.Geometry.GeometryType.eBezierCurve:
        case GISShare.SMap.Geometry.GeometryType.eCircularArc:
        case GISShare.SMap.Geometry.GeometryType.eEllipticArc:
        case GISShare.SMap.Geometry.GeometryType.ePath:
            var nodes = pGeometry.QueryNodes();
            var coordinates = [];
            for (var i = 0, iLen = nodes.length, one; i < iLen; i++) {
                one = nodes[i];
                coordinates[i] = [one.getX(), one.getY()];
            }
            olGeo = new LineString(coordinates);
            break;
        case GISShare.SMap.Geometry.GeometryType.eBoundingBox:
            olGeo = new Polygon([[
                [pGeometry.getLeft(), pGeometry.getTop()],
                [pGeometry.getRight(), pGeometry.getTop()],
                [pGeometry.getRight(), pGeometry.getBottom()],
                [pGeometry.getLeft(), pGeometry.getBottom()],
                [pGeometry.getLeft(), pGeometry.getTop()]
            ]]);
            break;
        case GISShare.SMap.Geometry.GeometryType.eCircle:
        case GISShare.SMap.Geometry.GeometryType.eRegion:
            var nodes = pGeometry.QueryNodes();
            var coordinates = [];
            for (var i = 0, iLen = nodes.length, one; i < iLen; i++) {
                one = nodes[i];
                coordinates[i] = [one.getX(), one.getY()];
            }
            olGeo = new Polygon([coordinates]);
            break;
        case GISShare.SMap.Geometry.GeometryType.ePolygon:
            var pExteriorRing = pGeometry.getExteriorRing();
            var nodes = pExteriorRing.QueryNodes();
            var coordinates = [];
            for (var i = 0, iLen = nodes.length, one; i < iLen; i++) {
                one = nodes[i];
                coordinates[i] = [one.getX(), one.getY()];
            }
            olGeo = new Polygon([coordinates]);
            var pInteriorRings = pGeometry.getInteriorRings();
            for (var i2 = 0, iLen2 = pInteriorRings.length, pRing; i2 < iLen2; i2++) {
                pRing = pInteriorRings[i2];
                var nodes = pRing.QueryNodes();
                coordinates = [];
                for (var i = 0, iLen = nodes.length, one; i < iLen; i++) {
                    one = nodes[i];
                    coordinates[i] = [one.getX(), one.getY()];
                }
                olGeo.appendLinearRing(new LinearRing(coordinates));
            }
            break;
        case GISShare.SMap.Geometry.GeometryType.eMultiPoint:
            olGeo = new MultiPoint([]);
            for (var i = 0, iLen = pGeometry.getCount(); i < iLen; i++) {
                olGeo.appendPoint(GSGeo_To_OLGeo(pGeometry.get(i)));
            }
            break;
        case GISShare.SMap.Geometry.GeometryType.eMultiPath:
            olGeo = new MultiLineString([]);
            for (var i = 0, iLen = pGeometry.getCount(); i < iLen; i++) {
                olGeo.appendLineString(GSGeo_To_OLGeo(pGeometry.get(i)));
            }
            break;
        case GISShare.SMap.Geometry.GeometryType.eMultiPolygon:
            olGeo = new MultiPolygon([]);
            for (var i = 0, iLen = pGeometry.getCount(); i < iLen; i++) {
                olGeo.appendPolygon(GSGeo_To_OLGeo(pGeometry.get(i)));
            }
            break;
        default:
            break;
    }
    return olGeo;
};