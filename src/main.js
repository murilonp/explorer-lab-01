import './css/index.css';
import IMask from 'imask';

const ccBgColorPrimary = document.querySelector(
  '.cc-bg svg > g g:nth-child(1) path'
);
const ccBgColorSecondary = document.querySelector(
  '.cc-bg svg > g g:nth-child(2) path'
);
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');
const ccIcon = document.querySelector('.cc-logo span:nth-child(1) img');
const cardNumber = document.querySelector('#card-number');
const cardName = document.querySelector('#card-holder');
const expirationDate = document.querySelector('#expiration-date');
const securityCode = document.querySelector('#security-code');
const addCardButton = document.querySelector('button');

const cardNumberPattern = {
  mask: [
    {
      mask: '0000 0000 0000 0000',
      regex: /^(?:35\d{0,2})\d{0,12}/,
      cardtype: 'jcb'
    },
    {
      mask: '0000 0000 0000 0000',
      regex: /^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,
      cardtype: 'discover'
    },
    {
      mask: '0000 0000 0000 0000',
      regex: /^606282|^3841(?:[0|4|6]{1})0/,
      cardtype: 'hipercard'
    },
    {
      mask: '0000 0000 0000 0000',
      regex:
        /^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/,
      cardtype: 'elo'
    },
    {
      mask: '0000 0000 0000 0000',
      regex: /^3[47][0-9]{13}$/,
      cardtype: 'amex'
    },
    {
      mask: '0000 0000 0000 0000',
      regex: /^4\d{0,15}/,
      cardtype: 'visa'
    },
    {
      mask: '0000 0000 0000 0000',
      regex: /(^5[1-15]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: 'mastercard'
    },
    {
      mask: '0000 0000 0000 0000',
      cardtype: 'default'
    }
  ],
  dispatch: (appended, dynamicMasked) => {
    const number = (dynamicMasked.value + appended).replace(/\D/g, '');
    const foundMask = dynamicMasked.compiledMasks.find(({ regex }) =>
      number.match(regex)
    );
    setCardType(foundMask.cardtype);
    return foundMask;
  }
};

const expirationDatePattern = {
  mask: 'MM{/}YY',
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    }
  }
};

const securityCodePattern = {
  mask: '000'
};

const setCardType = cardType => {
  const colors = {
    jcb: ['#BBC7C8', '#668698'],
    discover: ['#00F0FF', '#F3DC08'],
    hipercard: ['#FFB800', '#70F308'],
    elo: ['#F600B1', '#00AEEF'],
    amex: ['#6100FF', '#F308DC'],
    visa: ['#2D57F2', '#436D99'],
    mastercard: ['#C69347', '#DF6F29'],
    default: ['#000', '#aaa']
  };

  ccBgColorPrimary.setAttribute('fill', colors[cardType][0]);
  ccBgColorSecondary.setAttribute('fill', colors[cardType][1]);
  ccLogo.setAttribute('src', `cc-${cardType}.svg`);
  /* ccIcon.setAttribute('src', `cc-${cardType}.svg`); */
};

const securityCodeMasked = IMask(securityCode, securityCodePattern);
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

/* EVENTS */

cardNumberMasked.on('accept', event => updateCardNumber(event));
const updateCardNumber = code => {
  const ccCardNumber = document.querySelector('.cc-info .cc-number');
  ccCardNumber.innerText =
    code.target.value.length === 0 ? '1234 5678 9012 3456' : code.target.value;
};

cardName.addEventListener('keyup', event => {
  const ccHolder = document.querySelector('.cc-holder .value');
  ccHolder.innerText =
    event.target.value.length === 0 ? 'FULANO DA SILVA' : event.target.value;

  console.log(typeof event.target.value);
});

expirationDateMasked.on('accept', event => updateExpirationDate(event));
const updateExpirationDate = code => {
  const ccExpirationDate = document.querySelector('.cc-expiration .value');
  ccExpirationDate.innerText =
    code.target.value.length === 0 ? '02/32' : code.target.value;
};

securityCodeMasked.on('accept', event => updateSecurityCode(event));
const updateSecurityCode = code => {
  const ccSecurityCode = document.querySelector('.cc-security .value');
  ccSecurityCode.innerText =
    code.target.value.length === 0 ? '123' : code.target.value;
};

addCardButton.addEventListener('click', event => {
  event.preventDefault();
  alert('Cartão adicionado!');
});
