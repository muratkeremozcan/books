module.exports = function (w) {

  return {
    files: [
      './**/listing1.1.src.ts',
      './**/contact.ts',
      './**/contacts.component.ts'
    ],

    tests: [
      './**/listing1.3.spec.ts',
      './**/listing2.3.spec.ts',
      // './**/contacts.component.spec.ts'
    ],

    env: {
      type: 'node'
    },

    testFramework: 'jasmine'
  };
};
