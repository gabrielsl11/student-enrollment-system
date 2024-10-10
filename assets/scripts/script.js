document.addEventListener('DOMContentLoaded', () => {
    const url = new URLSearchParams(window.location.search);

    const alerts = {
        'enrollStudentOk': '#enrollStudentOk',
        'enrollStudentError': '#enrollStudentError',
        'updateStudentOk': '#updateStudentOk',
        'updateStudentError': '#updateStudentError',
        'deleteStudentOk': '#deleteStudentOk',
        'deleteStudentError': '#deleteStudentError',
        'createCourseOk': '#createCourseOk',
        'createCourseError': '#createCourseError',
        'updateCourseOk': '#updateCourseOk',
        'updateCourseError': '#updateCourseError',
        'deleteCourseOk': '#deleteCourseOk',
        'deleteCourseError': '#deleteCourseError'
    };

    Object.keys(alerts).forEach(key => {
        if (url.has(key)) {
            let element = document.querySelector(alerts[key]);

            if (element) {
                element.style.display = 'block';

                setTimeout(() => {
                    element.style.display = 'none';
                }, 3000);
            }
        }
    });
});