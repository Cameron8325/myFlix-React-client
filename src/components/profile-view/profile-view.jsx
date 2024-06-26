import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import "./profile-view.scss";

export const ProfileView = ({ user, onLoggedOut, movies }) => {
  const { username } = useParams();
  const [userData, setUserData] = useState(user);
  const [newUsername, setNewUsername] = useState(user ? user.Username : "");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState(user ? user.Email : "");
  const [newBirthday, setNewBirthday] = useState(user ? user.Birthday : "");
  const [favoriteMovies, setFavoriteMovies] = useState(
    user ? user.FavoriteMovies || [] : []
  );

  useEffect(() => {
    if (user) {
      setUserData(user);
      setNewUsername(user.Username);
      setNewEmail(user.Email);
      setNewBirthday(user.Birthday);
      setFavoriteMovies(user.FavoriteMovies || []);
    }
  }, [user]);

  const handleUpdate = () => {
    const updateData = {};

    // Only include fields with non-empty values in the request
    if (newUsername) updateData.Username = newUsername;
    if (newPassword) updateData.Password = newPassword;
    if (newEmail) updateData.Email = newEmail;
    if (newBirthday) updateData.Birthday = newBirthday;

    fetch(`https://camflixcf-73cf2f8e0ca3.herokuapp.com/users/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(updateData),
    })
      .then((response) => response.json())
      .then((updatedUser) => {
        setUserData(updatedUser);
        setNewUsername(updatedUser.Username);
        setNewEmail(updatedUser.Email);
        setNewBirthday(updatedUser.Birthday);
        window.alert("Your information has been updated!");
      })
      .catch((error) =>
        console.error("Error updating user information", error)
      );
  };

  const handleRemoveFavorite = (movieId) => {
    fetch(
      `https://camflixcf-73cf2f8e0ca3.herokuapp.com/users/${username}/movies/${movieId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((updatedUser) =>
        setFavoriteMovies(updatedUser.FavoriteMovies || [])
      )
      .catch((error) =>
        console.error("Error removing movie from favorites", error)
      );
  };

  const handleDeregister = () => {
    fetch(`https://camflixcf-73cf2f8e0ca3.herokuapp.com/users/${username}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(() => {
        window.alert("Goodbye!");
        onLoggedOut();
        window.location.replace("/");
      })
      .catch((error) => console.error("Error deregistering user", error));
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h2>{`Welcome, ${userData.Username}!`}</h2>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form className="mb-5">
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBirthday">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={
                  newBirthday
                    ? new Date(newBirthday).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => setNewBirthday(e.target.value)}
              />
            </Form.Group>
            <div className="mt-3 d-flex justify-content-around">
              <Button variant="primary" onClick={handleUpdate}>
                Update Profile
              </Button>
            </div>
          </Form>
        </Col>
        <Col md={6} className="favorite-movies-section mb-5">
          <h3>Favorite Movies</h3>
          {favoriteMovies.length === 0 ? (
            <p>No favorite movies selected.</p>
          ) : (
            <ul>
              {favoriteMovies.map((movieId) => {
                const movie = movies.find((m) => m._id === movieId);
                return (
                  <li key={movieId}>
                    {movie ? (
                      <>
                        <Link to={`/movies/${movieId}`}>{movie.Title}</Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveFavorite(movieId)}
                          className="ml-2"
                        >
                          Remove
                        </Button>
                      </>
                    ) : (
                      "Movie not found"
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={6} className="deregister-section">
          {/* Deregister section */}
          <h3>Deregister Account</h3>
          <p>
            Are you sure you want to deregister your account? This action is
            irreversible.
          </p>
          <Button variant="danger" onClick={handleDeregister}>
            Deregister
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
