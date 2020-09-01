import _ from 'lodash';

// The same result can be obtained by reducing in reverse with _.reduceRight. 
// This works as expected because addition is a commutative operation, 
[1, 2, 3, 4, 5].reduce(_.add); //?
[1, 2, 3, 4, 5].reduceRight(_.add); //?

[1, 2, 3, 4, 5].reduce(_.multiply); //?
[1, 2, 3, 4, 5].reduceRight(_.multiply); //?

// reduceRight can produce significantly different results for operations that aren’t commutative, like subtraction or division.
[1, 2, 3, 4, 5].reduce(_.subtract); //?
[1, 2, 3, 4, 5].reduceRight(_.subtract); //?

[1, 2, 3, 4, 5].reduce(_.divide); //?
[1, 2, 3, 4, 5].reduceRight(_.divide); //?
