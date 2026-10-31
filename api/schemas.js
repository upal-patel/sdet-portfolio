// JSON schemas: a failure names exactly which field broke the contract.
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const booking = {
  type: 'object',
  additionalProperties: false,
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    totalprice: { type: 'integer' },
    depositpaid: { type: 'boolean' },
    additionalneeds: { type: 'string' },
    bookingdates: {
      type: 'object',
      additionalProperties: false,
      required: ['checkin', 'checkout'],
      properties: { checkin: { type: 'string', format: 'date' }, checkout: { type: 'string', format: 'date' } },
    },
  },
};

const createdBooking = {
  type: 'object',
  required: ['bookingid', 'booking'],
  properties: { bookingid: { type: 'integer' }, booking },
};

/** Returns a list of readable errors; empty means valid. */
function validate(schema, data) {
  const check = ajv.compile(schema);
  return check(data) ? [] : check.errors.map((e) => `${e.instancePath || '(root)'} ${e.message}`);
}

module.exports = { schemas: { booking, createdBooking }, validate };
