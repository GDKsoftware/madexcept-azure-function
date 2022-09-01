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
                    app: {
                        id: bugdetails['executable'],
                        version: bugdetails['version']
                    },
                    device: {
                        hostname: bugdetails['computer_name'],
                        osName: bugdetails['operating_system'],
                        freeMemory: physMem.freeInBytes,
                        totalMemory: physMem.totalInBytes,
                        time: errorDatetime.toISOString()
                    },
                    notifier: {
                        name: 'madexcept-azure-function',
                        version: bugdetails['madExcept_version'],
                        url: 'https://github.com/gdksoftware/madexcept-azure-function'
                    }
                },
            ],
        };
    }
}

module.exports = {
    BugSnagConverter,
};
