export default class Message {
  static fromObject(object) {
    return new Message(object);
  }

  constructor(fields) {
    this.fields = fields;

    this.content = this.fields.content;
    this.type = this.fields.type;
    this.error = this.fields.error;
    this.date = this.fields.date;
  }

  toObject() {
    return { ...this.fields };
  }
}
