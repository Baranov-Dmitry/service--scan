export const adaptiveSize = (style: string, pcSize: number, mobSize: number, maxWidth: number = 1440, minWidth: number = 375) => {

  const addSize = pcSize - mobSize
  const addMobSize = addSize + addSize * 0.7;

  return `
    @media (max-width: 767px) {
      ${style}: calc(${mobSize}px + ${addMobSize} * ((100vw - ${minWidth}px) / ${maxWidth}));
    }

    @media (min-width: 767px) {
      ${style}: calc(${mobSize}px + ${addSize} * (100vw / ${maxWidth}));
    }
  `
}

export const checkPhone = (str: string) => {
  var patt = new RegExp(/^\+\d{11}$/g);
  return patt.test(str);
}

export const saveLocalStorage = (id: string, data: string) => {
  localStorage.setItem(id, data);
}

export const getFromLocalStorage = (id: string) => {
  const data = localStorage.getItem(id);
  if (!data) {
    return undefined;
  }

  return JSON.parse(data)
}

export function validateInn(inn: string | number, error: { code: number, message: string }) {
  var result = false;
  if (typeof inn === 'number') {
    inn = inn.toString();
  } else if (typeof inn !== 'string') {
    inn = '';
  }
  if (!inn.length) {
    error.code = 1;
    error.message = 'ИНН пуст';
  } else if (/[^0-9]/.test(inn)) {
    error.code = 2;
    error.message = 'ИНН может состоять только из цифр';
  } else if ([10, 12].indexOf(inn.length) === -1) {
    error.code = 3;
    error.message = 'ИНН может состоять только из 10 или 12 цифр';
  } else {
    const checkDigit = function (inn: string, coefficients: number[]) {
      var n = 0;
      for (var i in coefficients) {
        n += coefficients[i] * parseInt(inn[i]);
      }
      return n % 11 % 10;
    };
    switch (inn.length) {
      case 10:
        var n10 = checkDigit(inn, [2, 4, 10, 3, 5, 9, 4, 6, 8]);
        if (n10 === parseInt(inn[9])) {
          result = true;
        }
        break;
      case 12:
        var n11 = checkDigit(inn, [7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
        var n12 = checkDigit(inn, [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8]);
        if ((n11 === parseInt(inn[10])) && (n12 === parseInt(inn[11]))) {
          result = true;
        }
        break;
    }
    if (!result) {
      error.code = 4;
      error.message = 'Неправильное контрольное число';
    }
  }
  return result;
}

export const compareDates = (d1: string, d2: string): "first" | "second" | "equal" => {
  let date1 = new Date(d1).getTime();
  let date2 = new Date(d2).getTime();

  if (date1 < date2) {
    return "second"
  } else if (date1 > date2) {
    return "first"
  } else {
    return "equal"
  }
};

export const fetchUrl = (url: string, body: {}, accessToken: string) => {
  return fetch(url, {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken,
    },
    body: JSON.stringify(body)
  })
}