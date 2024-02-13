export class Api {
    constructor(options) {
        this._mode = options.mode;
        this._baseUrl = options.baseUrl;
        this._headers = options.headers;
    }

    async Login(token) {
        const response = await fetch(`${this._baseUrl}/mobiledatag/authenticateG`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${token}`,
            },
        });
        if (response.status === 401) {
            return null;
        }
        return this._handleResponse(response);
    }

    async LoginAD({ username, password }) {
        const response = await fetch(`https://support.pridex.ru/auth?username=${username}&password=${password}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (response.status === 401) {
            return null;
        }
        return this._handleResponse(response);
    }

    async getToken(token) {
        const response = await fetch(`https://support.pridex.ru/api/v1/users/me/`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token}`
            },
        });
        if (response.status === 401) {
            return null;
        }
        return this._handleResponse(response);
    }

    async getIncidents(token, iniciatorUuid) {
        const response = await fetch(`${this._baseUrl}/externalapi/getIncidentsList`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${token}`,
            },
            body: JSON.stringify({
                "initiatorUuid": `${iniciatorUuid}`
            }),
        });
        return this._handleResponse(response);
    }

    async getIncidentsDetails(token, incidentUuid) {
        const response = await fetch(`${this._baseUrl}/externalapi/extGetDetailIncidentInfo`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${token}`,
            },
            body: JSON.stringify({
                "uuid": `${incidentUuid}`
            }),
        });
        return this._handleResponse(response);
    }

    async fetchServiceComponent(token, serviceUuid) {
        const response = await fetch(`${this._baseUrl}/externalapi/getServiceComponents`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${token}`,
            },
            body: JSON.stringify({
                "servCompServiceUuid": `${serviceUuid}`
            }),
        });
        return this._handleResponse(response);
    }

    async addNewIncident(token, body) {
        const response = await fetch(`${this._baseUrl}/externalapi/performCustomActionWithIncident`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${token}`,
            },
            body: JSON.stringify(body)
        });
        return this._handleResponse(response);
    }


    async addNewCommunication(token, incidentUuid, message) {
        const response = await fetch(`${this._baseUrl}/externalapi/performCustomActionWithIncident/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${token}`,
            },
            body: JSON.stringify({
                "Action": "AddNewCommunication",
                "IncUuid": `${incidentUuid}`,
                "Commentary": `${message}`,
            })
        });
        return this._handleResponse(response);
    }

    async addNewFile(token, incidentUuid, files, message) {
        const response = await fetch(`${this._baseUrl}/externalapi/performCustomActionWithIncident/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${token}`,
            },
            body: JSON.stringify({
                "Action": "AddNewCommunicationWithFile",
                "IncUuid": `${incidentUuid}`,
                "Files": files,
                "Commentary": `${message}`,
            })
        });
        return this._handleResponse(response);
    }

    async getFile(token, fileUuid) {
        const response = await fetch(`${this._baseUrl}/externalapi/extGetFileData`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${token}`,
            },
            body: JSON.stringify({
                "idFile": `${fileUuid}`
            }
            )
        });
        return this._handleResponse(response);
    }




    _handleResponse = async (res) => {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(new Error("Произошла ошибка"));
    }
}

const api = new Api({
    baseUrl: 'https://support.pridex.ru/Itilium/hs',
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;