import React from "react";

class Api extends React.Component {
  constructor(props) {
    super(props);
    this.baseUrl = props.baseUrl;
    this.headers = props.headers;
  }

  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Error: ${res.status}`);
    }
    return res.json();
  }

  getInitialCards(token) {
    return fetch(`${this.baseUrl}/cards`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => this._getResponseData(res));
  }

  getUserInfo(token) {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => this._getResponseData(res));
  }

  changeLikeCardStatus(cardId, boolean, token) {
    if (boolean) {
      return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => this._getResponseData(res));
    } else {
      return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((res) => this._getResponseData(res));
    }
  }

  removeCard(cardId, token) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => this._getResponseData(res));
  }

  setUserInfo(userName, userAbout, token) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userName,
        about: userAbout,
      }),
    }).then((res) => this._getResponseData(res));
  }

  setAvatarImage(imageUrl, token) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: `${imageUrl}`,
      }),
    }).then((res) => this._getResponseData(res));
  }

  addNewCard(imageName, imageLink, token) {
    console.log(imageName);
    return fetch(`${this.baseUrl}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: imageName,
        link: imageLink,
      }),
    }).then((res) => this._getResponseData(res));
  }

  getAllInfo(token) {
    return Promise.all([this.getUserInfo(token), this.getInitialCards(token)]);
  }
}

const api = new Api({
  baseUrl: "https://api.michaelsapi.students.nomoreparties.site",
});

// const api = new Api({
//   baseUrl: "http://localhost:3000",
// });

// const api = new Api({
//   baseUrl: "https://around.nomoreparties.co/v1/group-12",
//   headers: {
//     authorization: "9d69919a-c5e6-499a-8de5-d578571e9e77",
//     "Content-Type": "application/json",
//   },
// });
export default api;
