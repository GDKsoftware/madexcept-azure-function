
class BugSnagConverter {
    /**
     * @param {BugreportParser} bugreport
     */
    convert(bugreport) {
        const bugdetails = bugreport.getDetailedInfo();
        const stacktrace = bugreport.getStacktrace();
        const physMem = bugreport.getPhysicalMemory();
        const errorDatetime = new Date(bugdetails['date_time']);
        return {
            payloadVersion: 5,
            notifier: {
                name: 'madexcept-azure-function',
                version: bugdetails['madExcept_version'],
                url: 'https://github.com/gdksoftware/madexcept-azure-function',
            },
            events: [
                {
                    exceptions: [
                        {
                            errorClass: bugdetails['exception_class'],
                            message: bugdetails['exception_message'],
                            stacktrace: stacktrace,
                            type: 'c',
                        },
                    ],
                    user: {
                        name: bugdetails['user_name'],
                    },
                    app: {
                        id: bugdetails['executable'],
                        version: bugdetails['version'],
                    },
                    device: {
                        hostname: bugdetails['computer_name'],
                        osName: bugdetails['operating_system'],
                        freeMemory: physMem.freeInBytes,
                        totalMemory: physMem.totalInBytes,
                        time: errorDatetime.toISOString(),
                    },
                    metaData: {
                        fullreport: bugreport.originalReport,
                    }
                },
            ],
        };
    }
}

module.exports = {
    BugSnagConverter,
};
