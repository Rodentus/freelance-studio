import {AuthUtils} from "../../utils/auth-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {AuthService} from "../../services/auth-service";

export class Login {

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.passwordElement},
            {element: this.emailElement, options: {pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/}},
        ];

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    findElements() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberElement = document.getElementById('remember');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async login() {
        this.commonErrorElement.style.display = 'none';
        if (ValidationUtils.validateForm(this.validations)) {

            const logInData = {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberElement.checked
            };

            const response = await AuthService.logIn(logInData);
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