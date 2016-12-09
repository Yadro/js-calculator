
function parse(str: string) {
  str = str.split(' ').join('');
  let items = [];
  let fragment = str;
  let res: RegExpMatchArray;
  while ((res = /(\d+|[+\-*/()])/g.exec(fragment))) {
    if (res.index != 0) {
      throw new SyntaxError('Unexpected character: ' + fragment.substr(0, res.index));
    }
    if (!isNaN(+res[0])) {
      items.push(+res[0]);
    } else {
      items.push(res[0]);
    }
    fragment = fragment.substr(res[0].length);
  }
  if (fragment.length) {
    throw new SyntaxError('Unexpected character: ' + fragment);
  }
  return items;
}

const prior = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};
function toPolNotation(arr: any[]) {
  let res = [];
  let operation = [];
  for (let i = 0; i < arr.length; i++) {
    let token = arr[i];
    if (typeof token == "number") {
      res.push(token)
    } else {
      let opLast = operation[operation.length - 1];

      if (token === '(') {
        operation.push(token);
      }
      else if (token === ')') {
        let buf2;
        while (operation.length && (buf2 = operation.pop()) != '(') {
          res.push(buf2);
        }
        if (buf2 != '(') {
          throw new Error(`Missing '('`);
        }
      }
      else if (typeof opLast === "string" && prior[opLast] >= prior[token]) {
        res.push(operation.pop());
        operation.push(token);
      } else {
        operation.push(token)
      }
    }
  }
  while (operation.length) {
    res.push(operation.pop())
  }
  return res;
}

const operations = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b
};
function cmCalc(arr: number[], op) {
  let b = arr.pop();
  let a = arr.pop();
  if (operations[op]) {
    arr.push(operations[op](a, b));
  } else {
    throw new Error('Wrong input');
  }
  return arr;
}
function calc(polsk: any[]) {
  let res = [];
  while (polsk.length) {
    let el = polsk.shift();
    if (typeof el === "number") {
      res.push(el);
    } else if (res.length > 1) {
      res = cmCalc(res, el)
    } else {
      throw new Error('Wrong input');
    }
  }
  if (res.length != 1) {
    throw new Error('Wrong input');
  }
  return res.pop();
}

(() => {
  const input = document.getElementById('input');
  const result = document.getElementById('res');

  input.addEventListener('input', () => {
    try {
      if (input.value) {
        result.innerText = calc(toPolNotation(parse(input.value)));
      } else {
        result.innerText = '';
      }
    } catch (e) {
      result.innerText = e.message;
    }
  })
})();


