import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler, TypeAnnotation } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, Increment } from '@sinclair/typebox'

const T = Type.TemplateLiteral('b${0|1}${0|1}${0|1}${0|1}${0|1}${0|1}${0|1}${0|1}')

const A = TypeAnnotation.Code(T)

console.log(A)
