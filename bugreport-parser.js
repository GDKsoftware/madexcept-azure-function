const ParseMode = {
  Key: 0,
  Val: 1,
  Stacktrace: 2,
  Other: 3,
};

class BugreportParser {
  constructor() {
    this.originalReport = '';
    this.details = {};
    this.stacktrace = [];
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
    const dt = Date.parse(this.fixDateTimeString(value) + 'Z');
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

  parseStacktraceLine(line) {
    const reInProject = /([0-9a-f]+)\s(\+[0-9a-f]+)\s([\w\d.-]*)\s+([\w\d.-]+)\s+(\d*)\s+(\+\d*)\s([\w\d.-]*)/i;
    const projmatch = line.match(reInProject);
    if (projmatch) {
      return {
        file: projmatch[4] + '.pas',
        frameAddress: '0x' + projmatch[1],
        inProject: true,
        lineNumber: parseInt(projmatch[5]),
        method: projmatch[7],
      };
    } else {
      // test inside project but without line information
      const reNoLine = /([0-9a-f]+)\s(\+[0-9a-f]+)\s([\w\d.-]*)\s([\w\d.-]+)\s+([\w\d.-]*)/i;
      const nolinematch = line.match(reNoLine);
      if (nolinematch) {
        return {
          file: nolinematch[4],
          frameAddress: '0x' + nolinematch[1],
          inProject: false,
          lineNumber: 0,
          method: nolinematch[5],
        };
      } else {
        // test out of project dll line
        const reDll = /([0-9a-f]+)\s(\+[0-9a-f]+)\s([\w\d.-]*)\s+([\w\d.-]*)/i;
        const dllmatch = line.match(reDll);
        if (dllmatch) {
          return {
            file: dllmatch[3],
            frameAddress: '0x' + dllmatch[1],
            inProject: false,
            lineNumber: 0,
            method: dllmatch[4],
          };
        }
      }
    }

    return null;
  }

  parsefromString(data) {
    let mode = 0;
    let key = '';
    let value = '';
    //let current_thread = '';
    let stacktraceline = '';

    this.originalReport = data;

    for (let i = 0; i < data.length; i++) {
      const curchar = data[i];

      if (mode === ParseMode.Stacktrace) {
        if (curchar === '\n') {
          if (stacktraceline.trim() === '') {
            mode = ParseMode.Other;
          } else {
            const line = this.parseStacktraceLine(stacktraceline); 
            if (line)
              this.stacktrace.push(line);
          }

          stacktraceline = '';
        } else {
          stacktraceline += curchar;
        }

        continue;
      }
      
      if (mode === ParseMode.Other) {
        continue;
      }

      if ((mode === ParseMode.Key) && (curchar === ':')) {
        key = key.trim();
        mode = ParseMode.Val;
        i++;
      } else if (curchar === '\r') {
        // ignore
      } else if (curchar === '\n') {
        if (!key) {
          mode = ParseMode.Stacktrace;
          continue;
        }

        if (mode === ParseMode.Val) {
          this.parseKv(key, value);
        } else {
          // todo
        }

        key = '';
        value = '';
        mode = ParseMode.Key;
      } else {
        if (mode === ParseMode.Key) {
          if (curchar === '/') {
            key += '_';
          } else {
            key += curchar;
          }
        } else if (mode === ParseMode.Val) {
          value += curchar;
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

  getStacktrace() {
    return this.stacktrace;
  }

  getDetailedInfo() {
    return this.details;
  }

  getPhysicalMemory() {
    const re = /(\d*)\/(\d*)\sMB/;
    const match = this.details['physical_memory'].match(re);
    if (match) {
        return {
            freeInBytes: parseInt(match[1]) * 1000000,
            totalInBytes: parseInt(match[2]) * 1000000,
        };
    }

    return {
        freeInBytes: 0,
        totalInBytes: 0,
    };
  }
}

module.exports = {
  BugreportParser,
};
