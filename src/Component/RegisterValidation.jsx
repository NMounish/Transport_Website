function validation(values) {
    let errors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/; // At least 1 uppercase and 1 special character

    if (!values.fname.trim()) {
        errors.fname = "First name is required";
    } else if (values.fname.length < 3) {
        errors.fname = "First name must be at least 3 characters";
    }

    if (!values.lname.trim()) {
        errors.lname = "Last name is required";
    } else if (values.lname.length < 3) {
        errors.lname = "Last name must be at least 3 characters";
    }

    if (!values.email) {
        errors.email = "Email is required";
    } else if (!email_pattern.test(values.email)) {
        errors.email = "Invalid email format";
    }

    if (!values.password) {
        errors.password = "Password is required";
    } else if (!password_pattern.test(values.password)) {
        errors.password = "Password must be at least 8 characters long, include at least one uppercase letter and one special character";
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
}

export default validation;
