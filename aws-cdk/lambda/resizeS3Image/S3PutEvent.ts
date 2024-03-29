// To parse this data:
//
//   import { Convert, S3PutEvent } from "./file";
//
//   const s3PutEvent = Convert.toS3PutEvent(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface S3PutEvent {
  Records: Record[];
}

export interface Record {
  eventVersion: string;
  eventSource: string;
  awsRegion: string;
  eventTime: Date;
  eventName: string;
  userIdentity: ErIdentity;
  requestParameters: RequestParameters;
  responseElements: ResponseElements;
  s3: S3;
}

export interface RequestParameters {
  sourceIPAddress: string;
}

export interface ResponseElements {
  'x-amz-request-id': string;
  'x-amz-id-2': string;
}

export interface S3 {
  s3SchemaVersion: string;
  configurationId: string;
  bucket: Bucket;
  object: Object;
}

export interface Bucket {
  name: string;
  ownerIdentity: ErIdentity;
  arn: string;
}

export interface ErIdentity {
  principalId: string;
}

export interface Object {
  key: string;
  size: number;
  eTag: string;
  sequencer: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toS3PutEvent(json: string): S3PutEvent {
    return cast(JSON.parse(json), r('S3PutEvent'));
  }

  public static s3PutEventToJson(value: S3PutEvent): string {
    return JSON.stringify(uncast(value, r('S3PutEvent')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ,
      )} but got ${JSON.stringify(val)}`,
    );
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val);
    }
    return d;
  }

  function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  S3PutEvent: o([{ json: 'Records', js: 'Records', typ: a(r('Record')) }], false),
  Record: o(
    [
      { json: 'eventVersion', js: 'eventVersion', typ: '' },
      { json: 'eventSource', js: 'eventSource', typ: '' },
      { json: 'awsRegion', js: 'awsRegion', typ: '' },
      { json: 'eventTime', js: 'eventTime', typ: Date },
      { json: 'eventName', js: 'eventName', typ: '' },
      { json: 'userIdentity', js: 'userIdentity', typ: r('ErIdentity') },
      { json: 'requestParameters', js: 'requestParameters', typ: r('RequestParameters') },
      { json: 'responseElements', js: 'responseElements', typ: r('ResponseElements') },
      { json: 's3', js: 's3', typ: r('S3') },
    ],
    false,
  ),
  RequestParameters: o(
    [{ json: 'sourceIPAddress', js: 'sourceIPAddress', typ: '' }],
    false,
  ),
  ResponseElements: o(
    [
      { json: 'x-amz-request-id', js: 'x-amz-request-id', typ: '' },
      { json: 'x-amz-id-2', js: 'x-amz-id-2', typ: '' },
    ],
    false,
  ),
  S3: o(
    [
      { json: 's3SchemaVersion', js: 's3SchemaVersion', typ: '' },
      { json: 'configurationId', js: 'configurationId', typ: '' },
      { json: 'bucket', js: 'bucket', typ: r('Bucket') },
      { json: 'object', js: 'object', typ: r('Object') },
    ],
    false,
  ),
  Bucket: o(
    [
      { json: 'name', js: 'name', typ: '' },
      { json: 'ownerIdentity', js: 'ownerIdentity', typ: r('ErIdentity') },
      { json: 'arn', js: 'arn', typ: '' },
    ],
    false,
  ),
  ErIdentity: o([{ json: 'principalId', js: 'principalId', typ: '' }], false),
  Object: o(
    [
      { json: 'key', js: 'key', typ: '' },
      { json: 'size', js: 'size', typ: 0 },
      { json: 'eTag', js: 'eTag', typ: '' },
      { json: 'sequencer', js: 'sequencer', typ: '' },
    ],
    false,
  ),
};
