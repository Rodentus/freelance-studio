import {AuthUtils} from "../../utils/auth-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {AuthService} from "../../services/auth-service.js";

export class SignUp {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.nameElement},
            {element: this.lastnameElement},
            {element: this.emailElement, options: {pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
            {element: this.agreeElement, options: {checked: true}},
        ];

        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    }

    findElements() {
        this.nameElement = document.getElementById('name');
        this.lastnameElement = document.getElementById('lastname');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('re-password');
        this.agreeElement = document.getElementById('agree');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async signup() {
        this.commonErrorElement.style.display = 'none';

        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.passwordRepeatElement) {
                this.validations[i].options.compareTo = this.passwordElement.value;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {

            const signUpData = {
                name: this.nameElement.value,
                lastName: this.lastnameElement.value,
                email: this.emailElement.value,
                password: this.passwordElement.value,
            };

            const response = await AuthService.signUp(signUpData);
            if (response.error) {
                console.log(response.error);
                this.commonErrorElement.style.display = 'block';
                return;
            }

            AuthUtils.setAuthInfo(response.response.accessToken, response.response.refreshToken, {
                id: response.response.id,
                name: response.response.name
            });

            this.openNewRoute('/');
        }
    }
}