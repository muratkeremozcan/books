// enum strings are useful for string comparisons

export enum EvidenceTypeEnum {
  UNKNOWN = '',
  PASSPORT_VISA = 'passport_visa',
  PASSPORT = 'passport',
  SIGHTED_STUDENT_CARD = 'sighted_tertiary_edu_id',
  SIGHTED_KEYPASS_CARD = 'sighted_keypass_card',
  SIGHTED_PROOF_OF_AGE_CARD = 'sighted_proof_of_age_card',
}

const someStringFromBackend = 'passport_visa';

const value = someStringFromBackend as EvidenceTypeEnum;
// note The as keyword is a Type Assertion in TypeScript which tells the compiler to consider the object as another type
// than the type the compiler infers the object to be
// you could also use generics
// const value = <EvidenceTypeEnum>someStringFromBackend;

if (value === EvidenceTypeEnum.PASSPORT_VISA) {
  console.log(`you provided a passport : ${value}`);
}



///// 
// const enum

// here, at execution the runtime will need to lookup Tristate and then Tristate.False. 
// To get a performance boost you can mark the enum as a const enum.This is demonstrated below:
const enum Tristate {
  False,
  True,
  Unknown
}

var lie = Tristate.False;



//// 