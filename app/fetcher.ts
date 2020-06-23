import { OpenLocationCode, CodeArea } from "./deps.ts";

export interface ElevationAPIResponse {
  results: ElevationAPIResponseResult[];
}

export interface ElevationAPIResponseResult {
  layerId: number;
  layerName: string;
  displayFieldName: string;
  attributes: Attributes;
}

export interface Attributes {
  "Stretched value": string;
  "Pixel Value": string;
}

export interface AllOriginsResponse {
  contents: string;
  status: Status;
}

export interface Status {
  url: string;
  content_type: string;
  content_length: number;
  http_code: number;
  response_time: number;
}


export interface CorineAPIResponse {
  results: CorineAPIResponseResult[];
}

export interface CorineAPIResponseResult {
  layerId: number;
  layerName: string;
  displayFieldName: string;
  value: string;
  attributes: Attributes;
}

export interface Attributes {
  FID: string;
  Shape: string;
  Code_12: string;
  Remark: string;
  Area_Ha: string;
  ID: string;
  Shape_Length: string;
  Shape_Area: string;
}

interface LayerAPIResponse {
  currentVersion: number;
  id: number;
  name: string;
  type: string;
  description: string;
  geometryType: string;
  sourceSpatialReference: SourceSpatialReference;
  copyrightText: string;
  parentLayer: any;
  subLayers: any[];
  minScale: number;
  maxScale: number;
  drawingInfo: DrawingInfo;
  defaultVisibility: boolean;
  extent: Extent;
  hasAttachments: boolean;
  htmlPopupType: string;
  displayField: string;
  typeIdField: any;
  subtypeFieldName: any;
  subtypeField: any;
  defaultSubtypeCode: any;
  fields: Field[];
  geometryField: GeometryField;
  indexes: Index[];
  subtypes: any[];
  relationships: any[];
  canModifyLayer: boolean;
  canScaleSymbols: boolean;
  hasLabels: boolean;
  capabilities: string;
  maxRecordCount: number;
  supportsStatistics: boolean;
  supportsAdvancedQueries: boolean;
  supportedQueryFormats: string;
  isDataVersioned: boolean;
  ownershipBasedAccessControlForFeatures: OwnershipBasedAccessControlForFeatures;
  useStandardizedQueries: boolean;
  advancedQueryCapabilities: AdvancedQueryCapabilities;
  supportsDatumTransformation: boolean;
  supportsCoordinatesQuantization: boolean;
}

interface SourceSpatialReference {
  wkid: number;
  latestWkid: number;
}

interface DrawingInfo {
  renderer: Renderer;
  transparency: number;
  labelingInfo: any;
}

interface Renderer {
  type: string;
  field1: string;
  field2: any;
  field3: any;
  defaultSymbol: any;
  defaultLabel: any;
  uniqueValueInfos: UniqueValueInfo[];
  fieldDelimiter: string;
}

interface UniqueValueInfo {
  symbol: Symbol;
  value: string;
  label: string;
  description: string;
}

interface Symbol {
  type: string;
  style: string;
  color: number[];
  outline: Outline;
}

interface Outline {
  type: string;
  style: string;
  color: number[];
  width: number;
}

interface Extent {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  spatialReference: SpatialReference;
}

interface SpatialReference {
  wkid: number;
  latestWkid: number;
}

interface Field {
  name: string;
  type: string;
  alias: string;
  domain: any;
  length?: number;
}

interface GeometryField {
  name: string;
  type: string;
  alias: string;
}

interface Index {
  name: string;
  fields: string;
  isAscending: boolean;
  isUnique: boolean;
  description: string;
}

interface OwnershipBasedAccessControlForFeatures {
  allowOthersToQuery: boolean;
}

interface AdvancedQueryCapabilities {
  useStandardizedQueries: boolean;
  supportsStatistics: boolean;
  supportsHavingClause: boolean;
  supportsCountDistinct: boolean;
  supportsOrderBy: boolean;
  supportsDistinct: boolean;
  supportsPagination: boolean;
  supportsTrueCurve: boolean;
  supportsReturningQueryExtent: boolean;
  supportsQueryWithDistance: boolean;
  supportsSqlExpression: boolean;
}

interface EsriGeometryEnvelope {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  spatialReference: number;
}

const layerInfoURL = 'https://thingproxy.freeboard.io/fetch/https://copernicus.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2018_WM/MapServer/0?f=json';
const layerPromise: Promise<LayerAPIResponse> = fetch(layerInfoURL).then(r => r.json());

function fetchIdentifyEnvelope (envelope: EsriGeometryEnvelope): Promise<CorineAPIResponse> {
  const url = new URL('https://copernicus.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2018_WM/MapServer/identify');
  const bbox = [envelope.xmin, envelope.ymin, envelope.xmax, envelope.ymax].join(',');

  url.searchParams.append('geometry', JSON.stringify(envelope));
  url.searchParams.append('geometryType', 'esriGeometryEnvelope');
  url.searchParams.append('tolerance', '1');
  url.searchParams.append('mapExtent', bbox);
  url.searchParams.append('returnGeometry', 'false');
  url.searchParams.append('imageDisplay', '10,10');
  url.searchParams.append('f', 'pjson');

  const finalUrl = `https://api.allorigins.win/get?url=` + encodeURIComponent(url.toString());

  return fetch(finalUrl)
    .then(r => r.json())
    .then((randomWrapper: AllOriginsResponse) => randomWrapper.contents)
    .then(contents => JSON.parse(contents));
}

function fetchElevationData (envelope: EsriGeometryEnvelope): Promise<ElevationAPIResponse> {
  const url = new URL('https://copernicus.discomap.eea.europa.eu/arcgis/rest/services/Elevation/EUElev_DEM_V11/MapServer/identify');
  const bbox = [envelope.xmin, envelope.ymin, envelope.xmax, envelope.ymax].join(',');

  url.searchParams.append('geometry', JSON.stringify(envelope));
  url.searchParams.append('geometryType', 'esriGeometryEnvelope');
  url.searchParams.append('tolerance', '1');
  url.searchParams.append('mapExtent', bbox);
  url.searchParams.append('returnGeometry', 'false');
  url.searchParams.append('imageDisplay', '10,10');
  url.searchParams.append('f', 'pjson');

  const finalUrl = `https://api.allorigins.win/get?url=` + encodeURIComponent(url.toString());

  return fetch(finalUrl)
    .then(r => r.json())
    .then((randomWrapper: AllOriginsResponse) => randomWrapper.contents)
    .then(contents => JSON.parse(contents));
}

/**
 * Converts latitude and longitue degrees to WSG84 meters.
 */
function degressToMeters (longitude: number, latitude: number) {
  const x = longitude * 20037508.34 / 180;
  let y = Math.log(Math.tan((90 + latitude) * Math.PI / 360)) / (Math.PI / 180);

  y = y * 20037508.34 / 180;

  return { x, y };
}

function getBoundsInMeters (decodedOpenLocationCode: CodeArea) {
  const { x: xmin, y: ymin } = degressToMeters(decodedOpenLocationCode.longitudeLo, decodedOpenLocationCode.latitudeLo);
  const { x: xmax, y: ymax } = degressToMeters(decodedOpenLocationCode.longitudeHi, decodedOpenLocationCode.latitudeHi);

  return { xmin, ymin, xmax, ymax };
}

export function getTerrainDataFromPlotCode (plotCode: string) {
  const decodedOCL = OpenLocationCode.decode(plotCode);
  const { xmin, ymin, xmax, ymax } = getBoundsInMeters(decodedOCL);
  const tilePromise = fetchIdentifyEnvelope({ xmin, ymin, xmax, ymax, spatialReference: 102100 });

  return Promise.all([
    tilePromise,
    layerPromise
  ]).then(([tileData, layerData]) => {
    const terrainValues = tileData.results.map(obj => obj.value);

    const terrainTypes = layerData.drawingInfo.renderer.uniqueValueInfos
      .filter(info => terrainValues.indexOf(info.value) !== -1);

    return terrainTypes[0];
  });
}

export async function getElevation (plotCode: string): Promise<number> {
  const decodedOCL = OpenLocationCode.decode(plotCode);
  const { xmin, ymin, xmax, ymax } = getBoundsInMeters(decodedOCL);
  const json = await fetchElevationData({ xmin, ymin, xmax, ymax, spatialReference: 102100 });

  return parseInt(json.results[0].attributes["Pixel Value"], 10);
}
