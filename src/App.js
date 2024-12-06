import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.png';

function App() {
	const [input, setInput] = useState();
	const [image, setImage] = useState();

	const generateStory = async () => {
		const apiUrl = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell';
		const apiToken = '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';

		try {
			const response = await axios.post(
				apiUrl,
				{
					inputs: input,
				},
				{
					headers: {
						Authorization: `Bearer ${apiToken}`,
						"Cache-Control": "no-cache",
					},
					responseType: 'blob',
				},
			);

			const imageUrl = URL.createObjectURL(response.data);
			setImage(imageUrl);
			console.log(response.data);
		} catch (error) {
			// Handle Error
		};
	};

	return (
		<div className="app">
			<header className="hero">
                <h1 className="app-title">Artify-AI</h1>
                <p className="app-description">
                    Turn your ideas into stunning visuals with our AI-powered app.
                </p>
            </header>

            <main>
            	<section className="input-section">
                    <input
                        id="prompt"
                        type="text"
                        placeholder="What are you thinking of..."
                        className="prompt-input"
                    />
                    <button className="generate-btn" aria-label="Generate image from text">
                        Generate Image
                    </button>
                </section>

                <section className="gallery">
                	<h2 className="visually-hidden">Generated Images</h2>
                	<article className="image-card" aria-label="Generated Image 1">
                        <img
                            src="/path/to/image1.jpg"
                            alt="Generated visual based on prompt"
                            className="generated-image"
                        />
                        <p>A serene mountain landscape</p>
                    </article>
                </section>
            </main>

            <footer className="footer">
            	<p>
            		© 2024 Artify-AI. All Rights Reserved. Built by Pawhncho
            	</p>
            </footer>
		</div>
	);
};

export default App;
