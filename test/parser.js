const { assert } = require('chai');
const fs = require('fs-extra');
const { describe, it } = require('mocha');

const { BugreportParser } = require('../bugreport-parser');
const { BugSnagConverter } = require('../bugsnag-converter');
const { isAllowed } = require('../filtering');
// const { BugSnagSender } = require('../bugsnag-sender');

describe('Parser test', () => {
  it('can parse datetime', () => {
    const parser = new BugreportParser();

    assert.equal('2021-10-20 07:57:39.195',
      parser.fixDateTimeString('2021-10-20, 07:57:39, 195ms'));

    assert.equal('2021-07-22 09:01',
      parser.fixDateTimeString('2021-07-22 09:01'));
  });

  it('can parse bugreport', async () => {
    const parser = new BugreportParser();

    const buffer = await fs.readFile('resources/bugreport.txt');
    parser.parsefromString(buffer.toString('utf-8'));

    const info = parser.getLokiInfo();

    assert.deepEqual(info,
      {
        job: 'madexcept',
        message: 'Hello, World.',
        labels: {
          executable: 'project2.exe',
          exception_class: 'CustomException',
        },
      });
  });

  it('can convert to bugsnag', async () => {
    const parser = new BugreportParser();

    const buffer = await fs.readFile('resources/bugreport.txt');
    parser.parsefromString(buffer.toString('utf-8'));

    const bugsnag = new BugSnagConverter();
    const log = bugsnag.convert(parser);
    delete log.events[0].metaData;

    const expected = {
      payloadVersion: 5,
      notifier: {
        name: 'madexcept-azure-function',
        version: '5.1.1',
        url: 'https://github.com/gdksoftware/madexcept-azure-function',
      },
      events: [{
        exceptions: [{
          errorClass: 'CustomException',
          message: 'Hello, World.', stacktrace:
            [{ file: 'Unit1.pas', frameAddress: '0x007f2d31', inProject: true, lineNumber: 35, method: 'TForm1.Button1Click' },
            { file: 'Vcl.Controls.pas', frameAddress: '0x005e57e7', inProject: true, lineNumber: 7596, method: 'TControl.Click' },
            { file: 'Vcl.StdCtrls.pas', frameAddress: '0x005fe542', inProject: true, lineNumber: 5609, method: 'TCustomButton.Click' },
            { file: 'Vcl.StdCtrls.pas', frameAddress: '0x005ff6cc', inProject: true, lineNumber: 6244, method: 'TCustomButton.CNCommand' }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005e528e', inProject: true, lineNumber: 7480, method: 'TControl.WndProc',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005ea1e3', inProject: true, lineNumber: 10424, method: 'TWinControl.WndProc',
            }, {
              file: 'Vcl.StdCtrls.pas', frameAddress: '0x005fe19c', inProject: true, lineNumber: 5439, method: 'TButtonControl.WndProc',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005e4ec8', inProject: true, lineNumber: 7258, method: 'TControl.Perform',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005ea343', inProject: true, lineNumber: 10493, method: 'DoControlMsg',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005eaf53', inProject: true, lineNumber: 10770, method: 'TWinControl.WMCommand',
            }, {
              file: 'Vcl.Forms.pas', frameAddress: '0x006948bd', inProject: true, lineNumber: 6693, method: 'TCustomForm.WMCommand',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005e528e', inProject: true, lineNumber: 7480, method: 'TControl.WndProc',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005ea1e3', inProject: true, lineNumber: 10424, method: 'TWinControl.WndProc',
            }, {
              file: 'Vcl.Forms.pas', frameAddress: '0x0069123b', inProject: true, lineNumber: 4787, method: 'TCustomForm.WndProc',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005e9730', inProject: true, lineNumber: 10113, method: 'TWinControl.MainWndProc',
            }, {
              file: 'System.Classes.pas', frameAddress: '0x004fcd7c', inProject: true, lineNumber: 18175, method: 'StdWndProc',
            }, {
              file: 'ntdll.dll', frameAddress: '0x77cc4e9b', inProject: false, lineNumber: 0, method: 'KiUserCallbackDispatcher',
            }, {
              file: 'USER32.dll', frameAddress: '0x77aa78ba', inProject: false, lineNumber: 0, method: 'SendMessageW',
            }, {
              file: 'USER32.dll', frameAddress: '0x77aa7716', inProject: false, lineNumber: 0, method: 'CallWindowProcW',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005ea2ee', inProject: true, lineNumber: 10465, method: 'TWinControl.DefaultHandler',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005e5c34', inProject: true, lineNumber: 7729, method: 'TControl.WMLButtonUp',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005e528e', inProject: true, lineNumber: 7480, method: 'TControl.WndProc',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005ea1e3', inProject: true, lineNumber: 10424, method: 'TWinControl.WndProc',
            }, {
              file: 'Vcl.StdCtrls.pas', frameAddress: '0x005fe19c', inProject: true, lineNumber: 5439, method: 'TButtonControl.WndProc',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005e9730', inProject: true, lineNumber: 10113, method: 'TWinControl.MainWndProc',
            }, {
              file: 'Vcl.Controls.pas', frameAddress: '0x005e974b', inProject: true, lineNumber: 10116, method: 'TWinControl.MainWndProc',
            }, {
              file: 'System.Classes.pas', frameAddress: '0x004fcd7c', inProject: true, lineNumber: 18175, method: 'StdWndProc',
            }, {
              file: 'USER32.dll', frameAddress: '0x77aa79cb', inProject: false, lineNumber: 0, method: 'DispatchMessageW',
            }, {
              file: 'Vcl.Forms.pas', frameAddress: '0x0069b0c3', inProject: true, lineNumber: 11028, method: 'TApplication.ProcessMessage',
            }, {
              file: 'Vcl.Forms.pas', frameAddress: '0x0069b106', inProject: true, lineNumber: 11058, method: 'TApplication.HandleMessage',
            }, {
              file: 'Vcl.Forms.pas', frameAddress: '0x0069b43d', inProject: true, lineNumber: 11196, method: 'TApplication.Run',
            }, {
              file: 'Project2.pas', frameAddress: '0x007fe559', inProject: true, lineNumber: 18, method: 'initialization',
            }, {
              file: 'KERNEL32.DLL', frameAddress: '0x76f8fa27', inProject: false, lineNumber: 0, method: 'BaseThreadInitThunk',
            }],
          type: 'c',
        }],
        app: {
          id: 'Project2.exe',
          version: '1.0.0.0',
        },
        device: {
          hostname: 'MYCOMPUTER',
          osName: 'Windows 10 x64 build 19043',
          freeMemory: 10043000000,
          totalMemory: 16314000000,
          time: '2022-02-21T00:07:27.226Z',
        },
        user: {
          name: 'MyUsername',
        },
      }],
    };
    assert.deepEqual(log, expected);
  });

  it('can parse in regular traceline', async () => {
    const line = '034593c8 +040 JJMainProgram.exe FEmployeeBaseOverview                   2239   +7 TfrmEmployeeBaseOverview.edZipcodeOrHouseNumberPropertiesChange';

    const parser = new BugreportParser();
    const trace = parser.parseStacktraceLine(line);

    assert.deepEqual(trace, {
        file: 'FEmployeeBaseOverview.pas',
        frameAddress: '0x034593c8',
        inProject: true,
        lineNumber: 2239,
        method: 'TfrmEmployeeBaseOverview.edZipcodeOrHouseNumberPropertiesChange',
    });
  });

  it('can parse in devexpress code', async () => {
    const line = '00b4f83f +00f JJMainProgram.exe dxCore                                            dxCallNotify';

    const parser = new BugreportParser();
    const trace = parser.parseStacktraceLine(line);

    assert.deepEqual(trace, {
        file: 'dxCore',
        frameAddress: '0x00b4f83f',
        inProject: false,
        lineNumber: 0,
        method: 'dxCallNotify',
    });
  });

  it('can parse in dll line', async () => {
    const line = '75ba5abb +00b USER32.dll                                                          DispatchMessageW';

    const parser = new BugreportParser();
    const trace = parser.parseStacktraceLine(line);

    assert.deepEqual(trace, {
        file: 'USER32.dll',
        frameAddress: '0x75ba5abb',
        inProject: false,
        lineNumber: 0,
        method: 'DispatchMessageW',
    });
  });
});

describe('other things', async () => {
    it('should apply filters properly', async () => {
        process.env.BUGSNAG_FILTERS = 'single:numbered';
        process.env['SINGLE_RE'] = 'single\\.exe';
        process.env['SINGLE_API_KEY'] = '123';

        process.env['NUMBERED_RE'] = 'numbered_[\\d\\.]*\\.exe';
        process.env['NUMBERED_API_KEY'] = '456';

        assert.isTrue(isAllowed('SinglE.exe'), 'single.exe test');
        assert.isFalse(isAllowed('doesntexist.exe'), 'doesntexist.exe test');
        assert.isTrue(isAllowed('numbered_5.1.2.exe'), 'numbered_5.1.2.exe test');
    });
});

// describe('sendtest', async () => {
//   it('should send something', async () => {
//     const parser = new BugreportParser();

//     const buffer = await fs.readFile('resources/bugreport.txt');
//     parser.parsefromString(buffer.toString('utf-8'));

//     const bugsnag = new BugSnagConverter();
//     const log = bugsnag.convert(parser);

//     const sender = new BugSnagSender();
//     await sender.send(log);
//   });
// });
