exports.validation = (required_fields, data) => {
    const error = {};

    for (let i of required_fields) {
        if (!data[i]) {
            error[i] = `${i} is required`;
        }
    }

    return error;
};

exports.validEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // console.log(regex.test(email));
    return regex.test(email);
};
