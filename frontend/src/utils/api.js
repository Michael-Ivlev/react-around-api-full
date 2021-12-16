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

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      headers: this.headers,
    }).then((res) => this._getResponseData(res));
  }

  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me`, {
      headers: this.headers,
    }).then((res) => this._getResponseData(res));
  }

  changeLikeCardStatus(cardId, boolean) {
    if (boolean) {
      return fetch(`${this.baseUrl}/cards/likes/${cardId}`, {
        method: "PUT",
        headers: this.headers,
      }).then((res) => this._getResponseData(res));
    } else {
      return fetch(`${this.baseUrl}/cards/likes/${cardId}`, {
        method: "DELETE",
        headers: this.headers,
      }).then((res) => this._getResponseData(res));
    }
  }

  removeCard(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this.headers,
    }).then((res) => this._getResponseData(res));
  }

  setUserInfo(userName, userAbout) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({
        name: userName,
        about: userAbout,
      }),
    }).then((res) => this._getResponseData(res));
  }

  setAvatarImage(imageUrl) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify({
        avatar: `${imageUrl}`,
      }),
    }).then((res) => this._getResponseData(res));
  }

  addNewCard(imageName, imageLink) {
    return fetch(`${this.baseUrl}/cards`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({
        name: imageName,
        link: imageLink,
      }),
    }).then((res) => this._getResponseData(res));
  }
}

const api = new Api({
  baseUrl: "http://localhost:3000",
  headers: {
    authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWI5ZGM4MTdlMDg2NzNhYjg0ODRjMTciLCJpYXQiOjE2Mzk2NjM0MjIsImV4cCI6MTY0MDI2ODIyMn0.9SQ1ksIPovBuWnGwpggq3dd2nJUdR8mfEUA6FJ-okTQ",
  },
});

// const api = new Api({
//   baseUrl: "https://around.nomoreparties.co/v1/group-12",
//   headers: {
//     authorization: "9d69919a-c5e6-499a-8de5-d578571e9e77",
//     "Content-Type": "application/json",
//   },
// });
export default api;
