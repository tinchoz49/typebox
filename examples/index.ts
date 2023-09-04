import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler, Annotation } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, Increment } from '@sinclair/typebox'

const T = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
  z: Type.Number(),
  w: Type.Array(
    Type.Object({
      x: Type.Union([Type.String(), Type.Number()], { $id: 'A' }),
    }),
  ),
})

console.log(TypeCompiler.Code(T, { language: 'typescript' }))
