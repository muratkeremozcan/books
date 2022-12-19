// https://www.youtube.com/watch?v=L6BE-U3oy80

import {z} from 'zod'

// Zod is like spok, but for schema definition and validation

const UserSchema = z.object({
  username: z.string().min(3), // has many chainers like .min(), similar to spok
  age: z.number().gt(0), // z.bigint() is possible too
  birthday: z.date().optional(), // use optional() for ?
  isProgrammer: z.boolean().default(true), // default values are possible
  test: z.undefined(), // z.null(), z.void(), z.any(), z.unknown(), z.never(), z.nullable(), z.nullish() are possible too
  hobby: z.enum(['coding', 'gaming', 'sleeping']), // z.nativeEnum(Hobbies) if we had a Hobbies enum already defined
  friends: z.array(z.string()).nonempty(), // z.array for arrays
  coords: z
    .tuple([z.number(), z.number().gt(4).int(), z.string()])
    .rest(z.number()), // z.tuple for tuples
  id: z.union([z.string(), z.number()]), // z.union for unions
  'id-alt': z.string().or(z.number()),
  status: z.discriminatedUnion('status', [
    z.object({status: z.literal('success'), data: z.string()}), // if status is success, data must be a string
    z.object({status: z.literal('failed'), error: z.instanceof(Error)}), // if status is failed, error must be an Error
  ]),
  userRecord: z.record(z.string(), z.string().or(z.number())),
  userMap: z.map(z.string(), z.number()),
  userSet: z.set(z.string()),
  userPromise: z.promise(z.string()),
  brandEmail: z // custom validation
    .string()
    .email()
    .refine(val => val.endsWith('@extend.com'), {
      message: 'Must be an extend email address',
    }),
})
// .partial()  // just like Partial type in TS, every key is optional
// .deepPartial() // deep version of partial
// .pick({username: true, age: true}) // pick only these keys, like TS Pick
// .omit({username: true, age: true}) // omit these keys, like TS Omit
// .extend({ lastname: z.string() }) // can extend it
// .merge(z.object({ lastname: z.string() })) // can merge schemas
// .passthrough() // by default extra keys are omitted when parsed, with passthrough they are kept
// .strict() // by default extra keys are omitted when parsed, with strict an error is thrown

// original: no need to define the full type it with zod
// type User = {
//   username: string
// }
// instead define the type with zod based on the schema
// KEY: as the schema changes, the type updates automatically
type User = z.infer<typeof UserSchema>

const user: User = {
  username: 'abc',
  age: 20,
  birthday: new Date(),
  isProgrammer: true,
  hobby: 'coding',
  friends: ['a', 'b', 'c'],
  coords: [1, 5, '3', 4, 5, 6, 7, 8, 9, 10],
  id: 7,
  'id-alt': '7',
  status: {status: 'success', data: 'abc'},
  userRecord: {a: 'b', b: 2},
  userMap: new Map([
    ['a', 1],
    ['b', 2],
  ]),
  userSet: new Set(['a', 'b', 'c']),
  userPromise: Promise.resolve('abc'),
  brandEmail: 'murat@extend.com',
} // make it into a number and see the error, or change number of chars

UserSchema.parse(user) //?
// use safeParse for true false validation
UserSchema.safeParse(user) //?

// access the schemas for a key
UserSchema.shape.age //?
UserSchema.shape.friends.element //?

// refer to https://zod.dev/ for more examples
// string validators
// z.string().max(5);
// z.string().min(5);
// z.string().length(5);
// z.string().email();
// z.string().url();
// z.string().uuid();
// z.string().cuid();
// z.string().regex(regex);
// z.string().startsWith(string);
// z.string().endsWith(string);
// z.string().trim(); // trim whitespace
// z.string().datetime(); // defaults to UTC, see below for options

// number validators
// z.number().gt(5);
// z.number().gte(5); // alias .min(5)
// z.number().lt(5);
// z.number().lte(5); // alias .max(5)
// z.number().int(); // value must be an integer
// z.number().positive(); //     > 0
// z.number().nonnegative(); //  >= 0
// z.number().negative(); //     < 0
// z.number().nonpositive(); //  <= 0
// z.number().multipleOf(5); // Evenly divisible by 5. Alias .step(5)
// z.number().finite(); // value must be finite, not Infinity or -Infinity
