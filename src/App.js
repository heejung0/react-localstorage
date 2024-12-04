import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

const Header = () => (
  <header className="header">
    <div className="navbar">
      <a href="/" className="navbar-brand">
        <span className="logo">😎</span>
        <strong>GDG on CAU</strong>
      </a>
    </div>
  </header>
);

const AddModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, image });
    setTitle("");
    setContent("");
    setImage(null);
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Card</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Content
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </label>
          <label>
            Image
            <input type="file" onChange={handleFileChange} />
          </label>
          <button type="submit" className="btn primary">
            Submit
          </button>
        </form>
        <button className="btn secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

const ContentModal = ({ isOpen, onClose, title, content, image }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <div className="modal-content">
          {image && <img src={image} alt={title} className="modal-image" />}
          <p>{content}</p>
        </div>
        <div className="modal-footer">
          <button className="btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Card = ({ title, content, image, onViewClick }) => {
  const MAX_LENGTH = 130;
  const shortenContent =
    content.length > MAX_LENGTH
      ? content.substring(0, MAX_LENGTH) + "..."
      : content;

  return (
    <div className="card">
      {image ? (
        <img src={image} alt={title} className="card-img-placeholder" />
      ) : (
        <div className="card-img-placeholder card-placeholder-text">
          Nothing
        </div>
      )}
      <div className="card-body">
        <h3>{title}</h3>
        <p>{shortenContent}</p>
        <button className="btn small" onClick={onViewClick}>
          View
        </button>
      </div>
    </div>
  );
};

const EasterEggModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <h2>이 이스터에그는 영국에서 시작되어..🐣</h2>
        <h3>Study Period</h3>
        2024.09.24 ~ 2024.12.05
        <h3>We studied with</h3>
        1. javascript of 코딩앙마<br></br>
        2. react of Nomadcoders
        <h3>다들 고생 많았고 기말고사 화이팅~!💪🏻</h3>
        <button className="btn secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

const Main = ({ isAddModalOpen, setIsAddModalOpen }) => {
  const [cards, setCards] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);

  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem("cards")) || [];
    setCards(savedCards);
  }, []);

  const addCard = (newCard) => {
    const updatedCards = [newCard, ...cards];
    setCards(updatedCards);
    localStorage.setItem("cards", JSON.stringify(updatedCards));
    setIsAddModalOpen(false);
  };

  const openViewModal = (card) => {
    setCurrentCard(card);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setCurrentCard(null);
    setViewModalOpen(false);
  };

  return (
    <main>
      <section className="intro-section">
        <div className="intro-content">
          <h1>React Toy Project</h1>
          <p className="lead">
            This project is using react and local storage.
          </p>
          <div className="intro-buttons">
            <button
              className="btn primary"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New
            </button>
            <button
              className="btn secondary"
              onClick={() => setEasterEggOpen(true)}
            >
              Don't Click
            </button>
          </div>
        </div>
      </section>

      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={addCard}
      />

      <ContentModal
        isOpen={viewModalOpen}
        onClose={closeViewModal}
        title={currentCard?.title}
        content={currentCard?.content}
        image={currentCard?.image}
      />

      <EasterEggModal
        isOpen={easterEggOpen}
        onClose={() => setEasterEggOpen(false)}
      />

      <section className="album-section">
        <div className="album-grid">
          {cards.map((card, index) => (
            <Card
              key={index}
              title={card.title}
              content={card.content}
              image={card.image}
              onViewClick={() => openViewModal(card)}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

const Footer = () => (
  <footer className="footer">
    <p>
      <a href="#">Back to top</a>
    </p>
    <p>
      2024 GDG on CAU FE_LO Study 
    </p>
  </footer>
);

const App = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div>
      <Header />
      <Main
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
      />
      <Footer />
    </div>
  );
};

export default App;
