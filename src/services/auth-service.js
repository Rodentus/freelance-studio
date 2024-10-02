import {HttpUtils} from "../utils/http-utils";

export class AuthService {
    static async signUp(data) {
        const returnObject = {
            error: false,
            response: null
        };
        const result = await HttpUtils.request('/signup', 'POST', false, data);
        if (result.error || !result.response || (result.response && (!result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name))) {
            returnObject.error = 'Возникла ошибка при регистрации.';
            return returnObject;
        }
        returnObject.response = result.response;
        return returnObject;
    }

    static async logIn(data) {
        const returnObject = {
            error: false,
            response: null
        };
        const result = await HttpUtils.request('/login', 'POST', false, data);
        if (result.error || !result.response || (result.response && (!result.response.accessToken || !result.response.refreshToken || !result.response.id || !result.response.name))) {
            returnObject.error = 'Возникла ошибка при авторизации.';
            return returnObject;
        }
        returnObject.response = result.response;
        return returnObject;
    }

    static async logOut(data) {
        await HttpUtils.request('/logout', 'POST', false, data);
    }
}