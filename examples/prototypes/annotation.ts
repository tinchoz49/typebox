/*--------------------------------------------------------------------------

@sinclair/typebox/prototypes

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

import { 
  UnionToTuple,
  Increment,
  IncrementBase10,
  Assert,
  AssertType, 
  AssertRest,
  TSchema, 
  TAny,
  TArray,
  TAsyncIterator,
  TBigInt,
  TBoolean,
  TConstructor,
  TDate,
  TFunction,
  TIterator,
  TInteger,
  TIntersect, 
  TLiteralValue,
  TLiteral,
  TNever,
  TNot,
  TNull,
  TNumber, 
  TObject, 
  TOptional,
  TPromise,
  TProperties,
  TReadonly,
  TRecursive,
  TRecord,
  TRef,
  TString, 
  TSymbol,
  TThis,
  TTuple,
  TUndefined, 
  TUnion, 
  TUint8Array,
  TVoid,
} from '@sinclair/typebox'

// --------------------------------------------------------------------------
// Annotation<T>
// --------------------------------------------------------------------------
// prettier-ignore
export type TAnnotationUnion<T extends TSchema[]> = T extends [infer L, ...infer R]
  ? R extends [] 
    ? `${TAnnotation<AssertType<L>>}`
    : `${TAnnotation<AssertType<L>>} | ${TAnnotationUnion<AssertRest<R>>}`
  : ``
// prettier-ignore
export type TAnnotationIntersect<T extends TSchema[]> = T extends [infer L, ...infer R]
  ? R extends [] 
    ? `${TAnnotation<AssertType<L>>}`
    : `${TAnnotation<AssertType<L>>} & ${TAnnotationIntersect<AssertRest<R>>}`
  : ``
export type TAnnotationProperty<T extends TProperties, K extends string> = 
  T[K] extends TOptional<T[K]> & TReadonly<T[K]>
  ? `readonly ${K}?: ${TAnnotation<AssertType<T[K]>>}` : T[K] extends TOptional<T[K]>
  ? `${K}?: ${TAnnotation<AssertType<T[K]>>}` : T[K] extends TReadonly<T[K]>
  ? `readonly ${K}: ${TAnnotation<AssertType<T[K]>>}` : `${K}: ${TAnnotation<AssertType<T[K]>>}`
// prettier-ignore
export type TAnnotationProperties<T extends TProperties, K extends string[]> = K extends [infer L, ...infer R]
? R extends [] 
  ? `${TAnnotationProperty<T, Assert<L, string>>}`
  : `${TAnnotationProperty<T, Assert<L, string>>}; ${TAnnotationProperties<T, Assert<R, string[]>>}`
 : ``
// prettier-ignore
export type TAnnotationParameters<T extends TSchema[], I extends string> = T extends [infer L, ...infer R]
? R extends [] 
  ? `param_${I}: ${TAnnotation<AssertType<L>>}`
  : `param_${I}: ${TAnnotation<AssertType<L>>}, ${TAnnotationParameters<AssertRest<R>, Increment<I, IncrementBase10>>}`
 : ``
// prettier-ignore
export type TAnnotationTuple<T extends TSchema[]> = T extends [infer L, ...infer R] 
  ? R extends [] 
    ? `${TAnnotation<AssertType<L>>}`
    : `${TAnnotation<AssertType<L>>}, ${TAnnotationTuple<AssertRest<R>>}`
  : ``
export type TAnnotationLiteral<T extends TLiteralValue> = T extends string ? `'${T}'` : `${T}`
// prettier-ignore
export type TAnnotation<T extends TSchema> =
  T extends TAny ? 'any' :
  T extends TArray<infer S> ? `${TAnnotation<S>}[]` :
  T extends TAsyncIterator<infer S> ? `AsyncIterableIterator<${TAnnotation<S>}>` :
  T extends TBigInt ? 'bigint' :  
  T extends TBoolean ? 'boolean' :
  T extends TConstructor<infer P, infer R> ? `new (${TAnnotationParameters<P, '0'>}) => ${TAnnotation<R>}` :
  T extends TDate ? 'Date' :
  T extends TFunction<infer P, infer R> ? `(${TAnnotationParameters<P, '0'>}) => ${TAnnotation<R>}` :
  T extends TInteger ? `number` :
  T extends TIntersect<infer S> ? `(${TAnnotationIntersect<S>})` :
  T extends TIterator<infer S> ? `IterableIterator<${TAnnotation<S>}>` :
  T extends TLiteral<infer S> ? `${TAnnotationLiteral<S>}` :
  T extends TNever ? 'never' :
  T extends TNull ? 'null' :
  T extends TNumber ? 'number' :
  T extends TNot ? 'unknown' :
  T extends TObject<infer S> ? `{ ${TAnnotationProperties<S, Assert<UnionToTuple<keyof S>, string[]>>} }`: 
  T extends TPromise<infer S> ? `Promise<${TAnnotation<S>}>` :
  T extends TRecord<infer P, infer R> ? `Record<${TAnnotation<P>}, ${TAnnotation<R>}>` :
  T extends TRecursive<infer S> ? `${TAnnotation<S>}` :
  T extends TRef<infer S> ? `${TAnnotation<S>}` :
  T extends TString ? 'string' :
  T extends TSymbol ? 'symbol' :
  T extends TThis ? `...` :
  T extends TTuple<infer S> ? `[${TAnnotationTuple<S>}]` :
  T extends TUndefined ? 'undefined' :
  T extends TUnion<infer S> ? `(${TAnnotationUnion<S>})` :
  T extends TVoid ? 'void' :
  T extends TUint8Array ? 'Uint8Array' :
  'unknown' // Unsafe is non-resolvable