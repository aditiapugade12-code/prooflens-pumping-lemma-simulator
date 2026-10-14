// Language definitions and membership checking functions

export const languages = {
  evenZeros: {
    id: 'evenZeros',
    name: 'Even number of 0s',
    alphabet: ['0', '1'],
    definition: '{w ∈ {0,1}* | #0(w) is even}',
    description: 'Strings with an even count of 0s. The count of 1s is unrestricted.',
    exampleStrings: ['', '1', '11', '00', '1001', '01010'],
    recommendedTestString: '0011',
    recommendedP: 3,
    why: 'A classic regular language that passes pumping. No contradiction.',
    
    check: (str) => {
      const count = (str.match(/0/g) || []).length;
      return count % 2 === 0;
    }
  },

  endsIn01: {
    id: 'endsIn01',
    name: 'Strings ending in 01',
    alphabet: ['0', '1'],
    definition: '{w ∈ {0,1}* | w ends in 01}',
    description: 'All strings that end with the substring "01".',
    exampleStrings: ['01', '101', '1101', '001'],
    recommendedTestString: '1001',
    recommendedP: 2,
    why: 'Regular language with predictable suffix structure.',
    
    check: (str) => {
      return str.endsWith('01');
    }
  },

  alternating01: {
    id: 'alternating01',
    name: '(01)*',
    alphabet: ['0', '1'],
    definition: '{(01)* | ε ∈ L}',
    description: 'Empty string or strings of repeated "01" pattern.',
    exampleStrings: ['', '01', '0101', '010101'],
    recommendedTestString: '01010101',
    recommendedP: 4,
    why: 'Highly structured regular language with periodic pattern.',
    
    check: (str) => {
      if (str === '') return true;
      if (str.length % 2 !== 0) return false;
      return /^(01)+$/.test(str);
    }
  },

  zeroStarOneStar: {
    id: 'zeroStarOneStar',
    name: '0*1*',
    alphabet: ['0', '1'],
    definition: '{0*1* | ε ∈ L}',
    description: 'All 0s (if any) come before all 1s (if any).',
    exampleStrings: ['', '0', '1', '00011', '01', '001', '011'],
    recommendedTestString: '000111',
    recommendedP: 3,
    why: 'Regular language with two-phase structure.',
    
    check: (str) => {
      return /^0*1*$/.test(str);
    }
  },

  aStarBStar: {
    id: 'aStarBStar',
    name: 'a*b*',
    alphabet: ['a', 'b'],
    definition: '{a*b* | ε ∈ L}',
    description: 'All a\'s (if any) come before all b\'s (if any).',
    exampleStrings: ['', 'a', 'b', 'aaa', 'bbb', 'aaabbb', 'ab'],
    recommendedTestString: 'aaabbb',
    recommendedP: 3,
    why: 'Regular language analogue with alphabet {a,b}.',
    
    check: (str) => {
      return /^a*b*$/.test(str);
    }
  },

  anbn: {
    id: 'anbn',
    name: '{aⁿbⁿ | n ≥ 0}',
    alphabet: ['a', 'b'],
    definition: '{aⁿbⁿ | n ≥ 0}',
    description: 'Equal number of a\'s followed by equal number of b\'s. The canonical non-regular example.',
    exampleStrings: ['', 'ab', 'aabb', 'aaabbb'],
    notInLanguage: ['aab', 'abb', 'abab'],
    recommendedTestString: 'aaabbb',
    recommendedP: 3,
    why: 'THE classic example proving a language is NOT regular. Pumping will always create a contradiction.',
    
    check: (str) => {
      if (str === '') return true;
      const mid = str.length / 2;
      if (mid !== Math.floor(mid)) return false;
      const half = Math.floor(mid);
      const left = str.substring(0, half);
      const right = str.substring(half);
      return /^a+$/.test(left) && /^b+$/.test(right) && left.length === right.length;
    }
  },

  zeroNOneN: {
    id: 'zeroNOneN',
    name: '{0ⁿ1ⁿ | n ≥ 0}',
    alphabet: ['0', '1'],
    definition: '{0ⁿ1ⁿ | n ≥ 0}',
    description: 'n 0\'s followed by exactly n 1\'s. Same idea as aⁿbⁿ, written with 0 and 1.',
    exampleStrings: ['', '01', '0011', '000111'],
    notInLanguage: ['001', '011', '0101'],
    recommendedTestString: '000111',
    recommendedP: 3,
    why: 'Same proof as aⁿbⁿ with 0 in place of a and 1 in place of b. Pumping always breaks the equal-count rule.',

    check: (str) => {
      let n = 0;
      while (str[n] === '0') n++;
      return str.length === 2 * n && str.slice(n) === '1'.repeat(n);
    }
  },

  wcw: {
    id: 'wcw',
    name: '{wcw | w ∈ {0,1}*}',
    alphabet: ['0', '1', 'c'],
    definition: '{wcw | w ∈ {0,1}*, c is separator}',
    description: 'A string followed by separator c, then the same string again. Non-regular context-free language.',
    exampleStrings: ['cc', '0c0', '1c1', '01c01'],
    recommendedTestString: '010c010',
    recommendedP: 4,
    why: 'Cannot be regular because it requires matching arbitrary patterns, like aⁿbⁿ.',
    
    check: (str) => {
      const cIndex = str.indexOf('c');
      if (cIndex === -1) return false;
      const left = str.substring(0, cIndex);
      const right = str.substring(cIndex + 1);
      return left === right;
    }
  },

  anb2n: {
    id: 'anb2n',
    name: '{aⁿb²ⁿ | n ≥ 0}',
    alphabet: ['a', 'b'],
    definition: '{aⁿb²ⁿ | n ≥ 0}',
    description: 'n a\'s followed by 2n b\'s. Another non-regular example with different ratios.',
    exampleStrings: ['', 'abb', 'aabbbb', 'aaabbbbbb'],
    recommendedTestString: 'aaabbbbbb',
    recommendedP: 3,
    why: 'Like aⁿbⁿ, requires counting with fixed ratio, impossible for regular languages.',
    
    check: (str) => {
      if (str === '') return true;
      const aCount = (str.match(/a/g) || []).length;
      const bCount = (str.match(/b/g) || []).length;
      if (aCount === 0 && bCount === 0) return true;
      if (aCount === 0) return false;
      return bCount === 2 * aCount && /^a+b+$/.test(str);
    }
  },

  palindromes: {
    id: 'palindromes',
    name: 'Palindromes over {0,1}',
    alphabet: ['0', '1'],
    definition: '{w ∈ {0,1}* | w = reverse(w)}',
    description: 'Strings that read the same forwards and backwards.',
    exampleStrings: ['', '0', '1', '00', '11', '010', '101', '0110'],
    recommendedTestString: '010',
    recommendedP: 2,
    why: 'Non-regular because it requires matching patterns from both ends.',
    
    check: (str) => {
      return str === str.split('').reverse().join('');
    }
  },

  primes: {
    id: 'primes',
    name: 'Strings of length p (prime)',
    alphabet: ['a'],
    definition: '{aⁿ | n is prime}',
    description: 'Strings where length is a prime number.',
    exampleStrings: ['aa', 'aaa', 'aaaaa', 'aaaaaaa'],
    recommendedTestString: 'aaaaa',
    recommendedP: 2,
    why: 'Non-regular because checking for primes requires computation beyond finite automata.',
    
    check: (str) => {
      const n = str.length;
      if (n < 2) return false;
      if (n === 2) return true;
      if (n % 2 === 0) return false;
      for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return false;
      }
      return true;
    }
  },

  powerOfTwo: {
    id: 'powerOfTwo',
    name: 'Strings of length 2^n',
    alphabet: ['a'],
    definition: '{a^(2^n) | n ≥ 0}',
    description: 'Strings where length is a power of 2 (1, 2, 4, 8, 16, ...).',
    exampleStrings: ['a', 'aa', 'aaaa', 'aaaaaaaa'],
    recommendedTestString: 'aaaaaaaa',
    recommendedP: 4,
    why: 'Non-regular because exponential growth cannot be checked with finite states.',
    
    check: (str) => {
      const n = str.length;
      if (n === 0) return false;
      return (n & (n - 1)) === 0; // Check if n is power of 2
    }
  }
};

export const getLanguageById = (id) => {
  return languages[id];
};

export const validateString = (str, alphabet) => {
  for (let char of str) {
    if (!alphabet.includes(char)) {
      return { valid: false, error: `Symbol '${char}' is not in the alphabet {${alphabet.join(',')}}` };
    }
  }
  return { valid: true, error: null };
};

export const createPumpedString = (x, y, z, i) => {
  if (i === 0) return x + z;
  return x + y.repeat(i) + z;
};

export const explainPumping = (language, x, y, z, i, pumpedString, inLanguage) => {
  if (language.id === 'anbn') {
    // Use the real counts of the pumped string (works for every i, including 0 and 1)
    const aCount = pumpedString.split('a').length - 1;
    const bCount = pumpedString.split('b').length - 1;
    const action = i === 0 ? 'we remove y entirely' : i === 1 ? 'y appears once (the original string)' : `y is repeated ${i} times`;

    if (inLanguage) {
      return `When i = ${i}, ${action}. The string "${pumpedString}" has ${aCount} a's and ${bCount} b's, so it is still in L for this split.`;
    }
    return `When i = ${i}, ${action}. The string "${pumpedString}" has ${aCount} a's and ${bCount} b's. Since they are not equal, it is NOT in L. Pumping failed for this split.`;
  }

  if (inLanguage) {
    return `When i = ${i}, the pumped string "${pumpedString}" is still in L. No contradiction was found for this split.`;
  } else {
    return `When i = ${i}, the pumped string "${pumpedString}" is NOT in L. Pumping failed for this split.`;
  }
};

export const checkAllDecompositionsForNonRegularity = (language, w, p) => {
  // For demonstration, check if ANY decomposition leads to contradiction
  const decompositions = [];
  
  for (let xLen = 0; xLen <= w.length; xLen++) {
    for (let yLen = 1; xLen + yLen <= w.length && xLen + yLen <= p; yLen++) {
      const x = w.substring(0, xLen);
      const y = w.substring(xLen, xLen + yLen);
      const z = w.substring(xLen + yLen);
      
      // Check if conditions 1 and 2 are satisfied
      if (y.length >= 1 && xLen + yLen <= p) {
        // Test a few pumping values
        let foundContradiction = false;
        for (let i = 0; i <= 3; i++) {
          const pumped = createPumpedString(x, y, z, i);
          if (!language.check(pumped)) {
            foundContradiction = true;
            decompositions.push({
              x, y, z,
              contradiction: true,
              contradictionAt: i,
              pumped
            });
            break;
          }
        }
        
        if (!foundContradiction) {
          decompositions.push({
            x, y, z,
            contradiction: false
          });
        }
      }
    }
  }
  
  return decompositions;
};
