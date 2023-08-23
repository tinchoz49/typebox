import { TypeSystem } from '@sinclair/typebox/system'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value, ValuePointer } from '@sinclair/typebox/value'
import { Type, TypeGuard, Kind, Static, TSchema, Increment } from '@sinclair/typebox'

import * as Types from '@sinclair/typebox'
import { Deref } from '@sinclair/typebox/value/deref'

const A = TypeCompiler.Code(
  Type.Object({
    number: Type.Number(),
    negNumber: Type.Number(),
    maxNumber: Type.Number(),
    string: Type.String(),
    longString: Type.String(),
    boolean: Type.Boolean(),
    deeplyNested: Type.Object(
      {
        foo: Type.String(),
        num: Type.Number(),
        bool: Type.Boolean(),
      },
      { $id: 'A' },
    ),
  }),
  { language: 'typescript' },
)

console.log(A)
