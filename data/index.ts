enum EducationOptions {
    POST_GRADUATE = 'post_graduate',
    GRADUATE = 'graduate',
    HSC_DIPLOMA = 'hsc_diploma',
    SSC = 'ssc',
}

export default {
    educationOptions: [
        {
            label: 'Post Graduate',
            value: EducationOptions.POST_GRADUATE,
        },
        {
            label: 'Graduate',
            value: EducationOptions.GRADUATE,
        },
        {
            label: 'HSC/Diploma',
            value: EducationOptions.HSC_DIPLOMA,
        },
        {
            label: 'SSC',
            value: EducationOptions.SSC,
        },
    ]
};
