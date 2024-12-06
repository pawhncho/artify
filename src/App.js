import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.png';

function App() {
	const [prompt, setPrompt] = useState();
	const [images, setImages] = useState([
		{
			'image': 'https://cdn.pixabay.com/photo/2023/03/28/13/28/ai-generated-7883147_1280.jpg',
			'prompt': 'A kitten',
		},
		{
			'image': 'https://images.nightcafe.studio/jobs/czaaLxwVb4dbpTkktTdE/czaaLxwVb4dbpTkktTdE--3--4lgpv.jpg',
			'prompt': 'White dog flying in the sky'
		},
	]);

	const generateStory = async () => {
		const apiUrl = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell';
		const apiToken = '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';

		try {
			const response = await axios.post(
				apiUrl,
				{
					inputs: prompt,
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
			setImages(imageUrl);
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
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                    />
                    <button onClick={generateStory} className="generate-btn" aria-label="Generate image from text">
                        Generate Image
                    </button>
                </section>

                <section className="gallery">
                	<h2 className="visually-hidden">Generated Images</h2>
                	{
                		images.map(image => {
                			return (
                				<>
                					<article className="image-card" aria-label="Generated Image 1">
				                        <img
				                            src={image.image}
				                            alt="Generated visual based on prompt"
				                            className="generated-image"
				                        />
				                        <p>{image.prompt}</p>
				                    </article>
                				</>
                			)
                		})
                	}
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
