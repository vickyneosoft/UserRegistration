import { EducationOptions } from "../types";

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

export const qualificationObj = {
    [EducationOptions.POST_GRADUATE]: 'Post Graduate',
    [EducationOptions.GRADUATE]: 'Graduate',
    [EducationOptions.HSC_DIPLOMA]: 'HSC/Diploma',
    [EducationOptions.SSC]: 'SSC'
}