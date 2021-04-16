// Functions to assert the format of each data
const isValidName = (name) => name.trim() !== '';
const isValidEmail = (email) => /(.+)@(.+)/.test(email);
const isValidPhone = (phone) => /^\d+$/.test(phone);

isValidPhone('abc'); // ?
// Objects representing each possible failure in the validation
const { union, derivations } = require('folktale/adt/union');

// https://folktale.origamitower.com/api/v2.0.0/en/folktale.adt.union.union.union.html
const ValidationErrors = union('validation-errors', {
  Required(field) {
    return { field };
  },

  InvalidEmail(email) {
    return { email };
  },

  InvalidPhone(phone) {
    return { phone };
  },

  InvalidType(type) {
    return { type };
  },

  Optional(error) {
    return { error };
  }
}).derive(derivations.equality);

const {
  Required,
  InvalidEmail,
  InvalidPhone,
  InvalidType,
  Optional
} = ValidationErrors;


// In JavaScript you're often left with two major ways of dealing with failures: 
// a branching instruction (like if/else), or throwing errors and catching them.

// problem 1: branching stops being a very feasible thing after a couple of cases

const validateBranching = ({ name, type, email, phone }) => {
  if (!isValidName(name)) {
    return Required('name');
  } else if (type === 'email') {
    if (!isValidEmail(email)) {
      return InvalidEmail(email);
    } else if (phone && !isValidPhone(phone)) {
      return Optional(InvalidPhone(phone));
    } else {
      return { type, name, email, phone };
    }
  } else if (type === 'phone') {
    if (!isValidPhone(phone)) {
      return InvalidPhone(phone);
    } else if (email && !isValidEmail(email)) {
      return Optional(InvalidEmail(email));
    } else {
      return { type, name, email, phone };
    }
  } else {
    return InvalidType(type);
  }
};

validateBranching({
  name: 'Max',
  type: 'email',
  phone: 'abc'
}); //?

validateBranching({
  name: 'Alissa',
  type: 'email',
  email: 'alissa@someDomain'
}); //?


// Exceptions (with the throw and try/catch constructs) alleviate this a bit. 
// * they don't solve the cases where you forget to handle a failure —although that often results in crashing the process-  
// * they allow failures to propagate, so fewer places in the code need to really deal with the problem.
// * the error propagation that we have with throw doesn't tell us much about how much of the code has actually been executed, 
// and this is particularly problematic when you have side-effects. How are you supposed to recover from a failure when you don't know in which state your application is?

const id = (a) => a;

const assertEmail = (email, wrapper = id) => {
  if (!isValidEmail(email)) {
    throw wrapper(InvalidEmail(email));
  }
};

const assertPhone = (phone, wrapper = id) => {
  if (!isValidPhone(phone)) {
    throw wrapper(InvalidEmail(email));
  }
};

const validateThrow = ({ name, type, email, phone }) => {
  if (!isValidName(name)) {
    throw Required('name');
  }
  switch (type) {
    case 'email':
      assertEmail(email);
      if (phone) assertPhone(phone, Optional);
      return { type, name, email, phone };

    case 'phone':
      assertPhone(phone);
      if (email) assertEmail(email, Optional);
      return { type, name, email, phone };

    default:
      throw InvalidType(type);
  }
};


try {
  validateThrow({
    name: 'Max',
    type: 'email',
    phone: '11234456'
  });
} catch (e) {
  e; // ==> InvalidEmail(undefined)
}

validateThrow({
  name: 'Alissa',
  type: 'email',
  email: 'alissa@somedomain'
});


// Result helps with both of these cases. 
// * the user is forced to be aware of the failure, since they're not able to use the value at all without unwrapping the value first. 
// * using a Result value will automatically propagate the errors when they're not handled, making error handling easier. 
// * since Result runs one operation at a time when you use the value, and does not do any dynamic stack unwinding (as throw does), it's much easier to understand in which state your application should be.

const Result = require('folktale/result');

const checkName = name => isValidName(name)
  ? Result.Ok(name)
  : Result.Error(Required('name'));

const checkEmail = email => isValidEmail(email)
  ? Result.Ok(email)
  : Result.Error(InvalidEmail('email'));

const checkPhone = phone => isValidPhone(phone)
  ? Result.Ok(phone)
  : Result.Error(InvalidPhone('phone'));

const optional = (check) => (value) => value
  ? check(value).mapError(Optional)
  : Result.Ok(value);

const maybeCheckEmail = optional(checkEmail);
const maybeCheckPhone = optional(checkPhone);

const validateResult = ({ name, type, email, phone }) =>
  checkName(name).chain(() =>
    type === "email"
      ? checkEmail(email).chain(() =>
          maybeCheckPhone(phone).map(() => ({name, type, email, phone })
          )
        )
      : type === "phone"
      ? checkPhone(phone).chain(() =>
          maybeCheckEmail(email).map(() => ({name, type, email, phone })
          )
        )
      : Result.Error(InvalidType(type))
  );

validateResult({
  name: 'Max',
  type: 'email',
  phone: '11234456'
});

validateResult({
  name: 'Alissa',
  type: 'email',
  email: 'alissa@somedomain'
});