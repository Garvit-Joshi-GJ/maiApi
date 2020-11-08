module.exports = {

    emailValidation: function(email) {

        if (email) {
            let re = /^[a-z0-9](\.?[a-z0-9_-]){0,}@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/;
            let trimmedEmail = email.trim();

            if (!re.test(trimmedEmail) || trimmedEmail.length === 0) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    },
    creditCardvalidation: function(card_num, next) {

        var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
        var amexpRegEx = /^(?:3[47][0-9]{13})$/;
        var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
        var isValid = false;

        if (visaRegEx.test(card_num) || mastercardRegEx.test(card_num) || amexpRegEx.test(card_num) || discovRegEx.test(card_num)) {
            isValid = true;
        }
        if (isValid) {
            return true;
        } else {
            return false;
        }

    }


}