import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler, TypeAnnotation } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, Increment } from '@sinclair/typebox'

const T = Type.TemplateLiteral('hello${1|2}${1|2}${1|2}${1|2}${1|2}')

const A = Type.Object({
  x: T,
  y: Type.Tuple([T, T]),
})

const X = TypeAnnotation.Code(A)

console.log(X)
