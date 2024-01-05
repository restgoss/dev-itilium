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
        const response = await fetch(`${this._baseUrl}/mobiledata/addNewIncident/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${token}`,
            },
            body: JSON.stringify(body)
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
    baseUrl: 'http://itilium-web.inex-d.local/Itilium/hs',
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;