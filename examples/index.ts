import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, Increment } from '@sinclair/typebox'

import { Type as TD } from './typedef/index'

const A = TD.Struct({
  x: TD.Float32(),
  y: TD.Boolean(),
})
const B = TD.Struct({
  x: TD.Float32(),
  y: TD.Boolean(),
})

const U = TD.DiscriminatedUnion([A, B], 'type', { timing: 123 })

const T = Type.Transform(B)
  .Decode((value) => 1)
  .Encode((value) => ({ x: 1, y: 'boolean' })) // todo: investigate this

const R = Value.Check(U, { x: 1, y: true, type: '0' })

const Z = Value.Decode(U, { x: 1, y: true, type: '2' })

console.log(Z)
