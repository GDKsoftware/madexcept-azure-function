class BugreportParser {
  constructor() {
    this.details = {};
  }

  fixDateTimeString(value) {
    let fixedVal = '';
    let commas = 0;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === 'm' || value[i] === 's') {
        // ignore
      } else if (value[i] === ',') {
        commas++;
        if (commas === 2) {
          fixedVal += '.';
          i++;
        }
      } else {
        fixedVal += value[i];
      }
    }

    return fixedVal;
  }

  parseDateTime(value) {
    const dt = Date.parse(this.fixDateTimeString(value));
    //return moment(dt).format('YYYY-MM-DDTHH:mm:ss+00:00');
    return dt;
  }

  parseKv(key, value) {
    const fixedKey = key.replaceAll('. ', '_').replaceAll(' ', '_');
    if (fixedKey === 'date_time') {
      const parsedValue = this.parseDateTime(value);
      this.details[fixedKey] = parsedValue;
    } else if (fixedKey === 'exec_date_time') {
      const parsedValue = this.parseDateTime(value);
      this.details[fixedKey] = parsedValue;
    } else {
      this.details[fixedKey] = value;
    }
  }

  parsefromString(data) {
    let mode = 0;
    let key = '';
    let value = '';

    for (let i = 0; i < data.length; i++) {
      if (mode === 2) {
        continue;
      }

      if ((mode === 0) && (data[i] === ':')) {
        key = key.trim();
        mode += 1;
        i++;
      } else if (data[i] === '\r') {
        // ignore
      } else if (data[i] === '\n') {
        if (!key) {
          mode = 2;
          continue;
        }

        if (mode === 1) {
          this.parseKv(key, value);
        } else {
          // todo
        }

        key = '';
        value = '';
        mode = 0;
      } else {
        if (mode === 0) {
          if (data[i] === '/') {
            key += '_';
          } else {
            key += data[i];
          }
        } else if (mode === 1) {
          value += data[i];
        }
      }
    }
  }

  getLokiInfo() {
    return {
      job: 'madexcept',
      message: this.details.exception_message,
      labels: {
        executable: this.details.executable.toLowerCase(),
        exception_class: this.details.exception_class,
      },
    };
  }

  getDetailedInfo() {
    return this.details;
  }
}

module.exports = {
  BugreportParser,
};
