/*--------------------------------------------------------------------------

@sinclair/typebox/compiler

The MIT License (MIT)

Copyright (c) 2017-2023 Haydn Paterson (sinclair) <haydn.developer@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---------------------------------------------------------------------------*/

import * as Types from '../typebox'
import { Deref } from '../value/deref'

// prettier-ignore
function AnnotationIntersect(schema: Types.TSchema[], references: Types.TSchema[]): string {
  const [L, ...R] = schema
  return R.length === 0
    ? `${Annotation(L, references)}`
    : `${Annotation(L, references)} & ${AnnotationIntersect(R, references)}`
}
// prettier-ignore
function AnnotationUnion(schema: Types.TSchema[], references: Types.TSchema[]): string {
  const [L, ...R] = schema
  return R.length === 0
    ? `${Annotation(L, references)}`
    : `${Annotation(L, references)} & ${AnnotationUnion(R, references)}`
}
// prettier-ignore
function AnnotationTuple(schema: Types.TSchema[], references: Types.TSchema[]): string {
  const [L, ...R] = schema
  return R.length === 0
    ? `${Annotation(L, references)}`
    : `${Annotation(L, references)}, ${AnnotationUnion(R, references)}`
}
// prettier-ignore
function AnnotationProperty(schema: Types.TProperties, K: string, references: Types.TSchema[]) {
  const TK = schema[K]
  return (
    Types.TypeGuard.TOptional(TK) && Types.TypeGuard.TReadonly(TK) ? `readonly ${K}?: ${Annotation(TK, references)}` :
    Types.TypeGuard.TReadonly(TK) ? `readonly ${K}: ${Annotation(TK, references)}` :
    Types.TypeGuard.TOptional(TK) ? `${K}?: ${Annotation(TK, references)}` :
    `${K}: ${Annotation(TK, references)}`
  )
}
// prettier-ignore
function AnnotationProperties(schema: Types.TProperties, K: string[], references: Types.TSchema[]): string {
  const [L, ...R] = K
  return R.length === 0
    ? `${AnnotationProperty(schema, L, references)}`
    : `${AnnotationProperty(schema, L, references)}; ${AnnotationProperties(schema, R, references)}`
}
// prettier-ignore
function AnnotationParameters(schema: Types.TSchema[], I: number, references: Types.TSchema[]): string {
  const [L, ...R] = schema
  return R.length === 0
    ? `param_${I}: ${Annotation(L, references)}`
    : `param_${I}: ${Annotation(L, references)}, ${AnnotationParameters(R, I+1, references)}`
}
// prettier-ignore
function AnnotationLiteral(schema: Types.TLiteral, references: Types.TSchema[]) {
  return (
    typeof schema.const === 'string' 
      ? `'${schema.const.replace(/'/g, "\\'")}'` 
      : schema.const.toString()
  )
}
// prettier-ignore
function AnnotationRecord(schema: Types.TRecord, references: Types.TSchema[]) {
  return ''
}
/** Generates a TypeScript type annotation for the given schema */
export function Annotation(schema: Types.TSchema, references: Types.TSchema[] = []): string {
  // prettier-ignore
  return (
    Types.TypeGuard.TAny(schema) ? 'any' :
    Types.TypeGuard.TArray(schema) ? `${Annotation(schema.items, references)}[]` :
    Types.TypeGuard.TAsyncIterator(schema) ? `AsyncIterableIterator<${Annotation(schema.items, references)}>` :
    Types.TypeGuard.TBigInt(schema) ? `bigint` :
    Types.TypeGuard.TBoolean(schema) ? `boolean` :
    Types.TypeGuard.TConstructor(schema) ? `new (${AnnotationParameters(schema.parameter, 0, references)}) => ${Annotation(schema.returns, references)}` :
    Types.TypeGuard.TDate(schema) ? 'Date' :
    Types.TypeGuard.TFunction(schema) ? `(${AnnotationParameters(schema.parameters, 0, references)}) => ${Annotation(schema.returns, references)}` :
    Types.TypeGuard.TInteger(schema) ? 'number' :
    Types.TypeGuard.TIntersect(schema) ? `(${AnnotationIntersect(schema.allOf, references)})` :
    Types.TypeGuard.TIterator(schema) ? `IterableIterator<${Annotation(schema.items, references)}>` :
    Types.TypeGuard.TLiteral(schema) ? `${AnnotationLiteral(schema, references)}` :
    Types.TypeGuard.TNever(schema) ? `never` :
    Types.TypeGuard.TNull(schema) ? `null` :
    Types.TypeGuard.TNot(schema) ? 'unknown' :
    Types.TypeGuard.TNumber(schema) ? 'number' :
    Types.TypeGuard.TObject(schema) ? `{ ${AnnotationProperties(schema.properties, Object.getOwnPropertyNames(schema.properties), references)} }` :
    Types.TypeGuard.TPromise(schema) ? `Promise<${Annotation(schema.item, references)}>` :
    Types.TypeGuard.TRecord(schema) ? `${AnnotationRecord(schema, references)}` :
    Types.TypeGuard.TRef(schema) ? `${Annotation(Deref(schema, references))}` :
    Types.TypeGuard.TString(schema) ? 'string' :
    Types.TypeGuard.TSymbol(schema) ? 'symbol' :
    Types.TypeGuard.TThis(schema) ?  'unknown' : // requires named interface
    Types.TypeGuard.TTuple(schema) ? `[${AnnotationTuple(schema.items || [], references)}]` :
    Types.TypeGuard.TUndefined(schema) ? 'undefined' :
    Types.TypeGuard.TUnion(schema) ? `${AnnotationUnion(schema.anyOf, references)}` :
    Types.TypeGuard.TVoid(schema) ? `void` :
    Types.TypeGuard.TUint8Array(schema) ? `Uint8Array` :
    'unknown'
  )
}
